import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { transaction } from "../../database/index.js";
import { enqueue } from "../../queue/index.js";
import { QUEUES } from "../../shared.js";
import { hashPassword } from "../auth/auth.service.js";
import { encryptMail } from "./mail-crypto.js";

const digest = (token) => createHash("sha256").update(token).digest("hex");
export function accountService(pool, boss, config) {
  return {
    async request(userId, purpose) {
      return transaction(pool, async (c) => {
        const user = (
          await c.query("SELECT * FROM users WHERE id=$1 AND active FOR UPDATE", [userId])
        ).rows[0];
        if (!user || (purpose === "verify" && user.email_verified_at)) return;
        if (
          (
            await c.query(
              "SELECT 1 FROM account_tokens WHERE user_id=$1 AND purpose=$2 AND email=$3 AND created_at>now()-interval '1 minute'",
              [userId, purpose, user.email],
            )
          ).rowCount
        )
          return;
        const token = randomBytes(32).toString("base64url");
        await c.query(
          "UPDATE account_tokens SET used_at=now() WHERE user_id=$1 AND purpose=$2 AND used_at IS NULL",
          [userId, purpose],
        );
        await c.query(
          "INSERT INTO account_tokens(user_id,token_hash,purpose,email,expires_at) VALUES($1,$2,$3,$4,now()+($5 * interval '1 minute'))",
          [userId, digest(token), purpose, user.email, purpose === "verify" ? 1440 : 30],
        );
        const link = new URL("/conta", config.FRONTEND_URL);
        link.searchParams.set("action", purpose);
        link.searchParams.set("token", token);
        const mail = (
          await c.query(
            "INSERT INTO mail_outbox(user_id,recipient,subject,body) VALUES($1,$2,$3,$4) RETURNING id",
            [
              userId,
              user.email,
              purpose === "verify" ? "Confirme seu e-mail no Wisen" : "Redefina sua senha do Wisen",
              encryptMail(
                `Use este link para continuar: ${link.href}\nSe não solicitou, ignore este e-mail.`,
                config,
              ),
            ],
          )
        ).rows[0];
        await enqueue(boss, c, QUEUES.mail, { id: mail.id });
      });
    },
    async consume(token, purpose, password) {
      const hash = purpose === "reset" ? await hashPassword(password) : null;
      return transaction(pool, async (c) => {
        const entry = (
          await c.query(
            "SELECT t.* FROM account_tokens t JOIN users u ON u.id=t.user_id WHERE t.token_hash=$1 AND t.purpose=$2 AND t.used_at IS NULL AND t.expires_at>now() AND t.email=u.email AND u.active FOR UPDATE OF t,u",
            [digest(token), purpose],
          )
        ).rows[0];
        if (!entry)
          throw Object.assign(new Error("Link inválido ou expirado"), { statusCode: 400 });
        await c.query(
          "UPDATE account_tokens SET used_at=now() WHERE user_id=$1 AND purpose=$2 AND used_at IS NULL",
          [entry.user_id, purpose],
        );
        if (purpose === "verify")
          await c.query("UPDATE users SET email_verified_at=now() WHERE id=$1", [entry.user_id]);
        else {
          await c.query("UPDATE users SET password_hash=$2,updated_at=now() WHERE id=$1", [
            entry.user_id,
            hash,
          ]);
          await c.query("DELETE FROM auth_sessions WHERE user_id=$1", [entry.user_id]);
        }
        await c.query("DELETE FROM mail_outbox WHERE user_id=$1 AND status<>'sent'", [
          entry.user_id,
        ]);
        return {
          message:
            purpose === "verify" ? "E-mail confirmado" : "Senha redefinida. Faça login novamente.",
        };
      });
    },
  };
}
export function accountController(app, pool, accounts) {
  const email = z.object({ email: z.string().trim().toLowerCase().pipe(z.email()) });
  const token = z.object({ token: z.string().min(32).max(100) });
  const limited = { rateLimit: { max: 3, timeWindow: "1 minute" } };
  app.post(
    "/api/account/verification",
    { preHandler: app.authenticate, config: limited },
    async (req) => {
      await accounts.request(req.user.id, "verify");
      return { message: "Se necessário, enviaremos um link de confirmação." };
    },
  );
  app.post("/api/account/verify", { config: limited, schema: { body: token } }, (req) =>
    accounts.consume(req.body.token, "verify"),
  );
  app.post("/api/account/forgot", { config: limited, schema: { body: email } }, async (req) => {
    const user = (
      await pool.query("SELECT id FROM users WHERE lower(email)=lower($1) AND active", [
        req.body.email,
      ])
    ).rows[0];
    if (user) await accounts.request(user.id, "reset");
    return { message: "Se a conta existir, enviaremos um link para redefinir a senha." };
  });
  app.post(
    "/api/account/reset",
    { config: limited, schema: { body: token.extend({ password: z.string().min(8).max(128) }) } },
    (req) => accounts.consume(req.body.token, "reset", req.body.password),
  );
  app.get("/api/account/status", { preHandler: app.authenticate }, async (req) => ({
    user: (
      await pool.query("SELECT email_verified_at,generation_limit FROM users WHERE id=$1", [
        req.user.id,
      ])
    ).rows[0],
  }));
  app.delete(
    "/api/account",
    {
      preHandler: app.authenticate,
      schema: { body: z.object({ confirmation: z.literal("EXCLUIR") }) },
    },
    async (req) => {
      await transaction(pool, async (c) => {
        await c.query(
          "DELETE FROM pgboss.job WHERE (name=$1 AND data->>'id' IN (SELECT id::text FROM mail_outbox WHERE user_id=$2)) OR (name=$3 AND data->>'id' IN (SELECT id::text FROM generation_tasks WHERE user_id=$2))",
          [QUEUES.mail, req.user.id, QUEUES.generate],
        );
        await c.query("DELETE FROM users WHERE id=$1", [req.user.id]);
      });
      return { message: "Conta excluída" };
    },
  );
}
