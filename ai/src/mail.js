import { transaction } from "../../backend/src/database/index.js";
import { decryptMail } from "../../backend/src/modules/accounts/mail-crypto.js";
export function mailWorker(pool, config, fetcher = fetch) {
  return async (id) => {
    if (!config.RESEND_API_KEY || !config.EMAIL_FROM) return;
    const mail = await transaction(pool, async (c) => {
      await c.query("SELECT pg_advisory_xact_lock(893762)");
      const current = (
        await c.query(
          "SELECT * FROM mail_outbox WHERE id=$1 AND status IN ('pending','failed','sending') FOR UPDATE",
          [id],
        )
      ).rows[0];
      if (!current || current.attempts >= 5) return null;
      const count = Number(
        (
          await c.query(
            "SELECT count(*) FROM mail_outbox WHERE (sent_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') OR (status='sending' AND created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')",
          )
        ).rows[0].count,
      );
      if (count >= config.EMAIL_DAILY_LIMIT) return null;
      await c.query("UPDATE mail_outbox SET status='sending',attempts=attempts+1 WHERE id=$1", [
        id,
      ]);
      return current;
    });
    if (!mail) return;
    try {
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: {
          Authorization: `Bearer ${config.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": mail.id,
        },
        body: JSON.stringify({
          from: config.EMAIL_FROM,
          to: [mail.recipient],
          subject: mail.subject,
          text: decryptMail(mail.body, config),
        }),
      });
      if (!response.ok) throw new Error(`E-mail indisponível (${response.status})`);
      const data = await response.json();
      await pool.query(
        "UPDATE mail_outbox SET status='sent',sent_at=now(),provider_id=$2,body='',last_error=NULL WHERE id=$1",
        [id, data.id],
      );
    } catch {
      await pool.query(
        "UPDATE mail_outbox SET status='failed',last_error='Não foi possível enviar o e-mail' WHERE id=$1",
        [id],
      );
    }
  };
}
