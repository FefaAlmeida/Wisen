import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { authService } from "../../backend/src/modules/auth/auth.service.js";

function createAuthHarness() {
  const users = new Map();
  const sessions = new Map();
  const repository = {
    async createAccount({ name, email, passwordHash, tokenHash, expiresAt }) {
      if (users.has(email)) throw Object.assign(new Error("duplicate"), { code: "23505" });
      const user = { id: randomUUID(), email, name, role: "user" };
      users.set(email, { ...user, active: true, password_hash: passwordHash });
      sessions.set(tokenHash, { userId: user.id, expiresAt });
      return user;
    },
    async findByEmail(email) {
      return users.get(email) ?? null;
    },
    async createSession(userId, tokenHash, expiresAt) {
      sessions.set(tokenHash, { userId, expiresAt });
    },
    async findSession(tokenHash) {
      const session = sessions.get(tokenHash);
      const user = session ? [...users.values()].find(({ id }) => id === session.userId) : null;
      if (!user) return null;
      const { id, email, name, role } = user;
      return { id, email, name, role };
    },
    async deleteSession(tokenHash) {
      sessions.delete(tokenHash);
    },
  };
  return { service: authService(repository), users, sessions };
}

test("cadastro guarda hash scrypt e cria uma sessão que pode ser revogada", async () => {
  const { service, users, sessions } = createAuthHarness();
  const account = await service.register({
    name: "Ana",
    email: "ana@example.test",
    password: "senha-segura-123",
  });
  const storedUser = users.get(account.user.email);

  assert.notEqual(storedUser.password_hash, "senha-segura-123");
  assert.match(storedUser.password_hash, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  assert.equal(sessions.size, 1);
  assert.deepEqual(await service.findSession(account.token), account.user);

  await service.logout(account.token);
  assert.equal(await service.findSession(account.token), null);
  assert.equal(sessions.size, 0);
});

test("login verifica a senha e aplica as durações de sessão escolhidas", async () => {
  const { service, users, sessions } = createAuthHarness();
  await service.register({
    name: "Bia",
    email: "bia@example.test",
    password: "senha-segura-456",
  });
  const user = users.get("bia@example.test");

  const shortSession = await service.login({
    email: user.email,
    password: "senha-segura-456",
  });
  const shortExpiry = sessions.get([...sessions.keys()][1]).expiresAt;
  assert.ok(shortExpiry.getTime() - Date.now() <= 24 * 60 * 60 * 1000);
  assert.equal(shortSession.maxAge, 24 * 60 * 60);

  const rememberedSession = await service.login({
    email: user.email,
    password: "senha-segura-456",
    remember: true,
  });
  assert.equal(rememberedSession.maxAge, 30 * 24 * 60 * 60);
});

test("login rejeita senha incorreta, usuário ausente e conta desativada", async () => {
  const { service, users } = createAuthHarness();
  await service.register({
    name: "Caio",
    email: "caio@example.test",
    password: "senha-segura-789",
  });

  await assert.rejects(service.login({ email: "caio@example.test", password: "senha-errada" }), {
    statusCode: 401,
    message: "E-mail ou senha inválidos",
  });
  await assert.rejects(
    service.login({ email: "inexistente@example.test", password: "senha-errada" }),
    { statusCode: 401, message: "E-mail ou senha inválidos" },
  );

  users.get("caio@example.test").active = false;
  await assert.rejects(
    service.login({ email: "caio@example.test", password: "senha-segura-789" }),
    { statusCode: 401 },
  );
});

test("cadastro transforma violação de e-mail único em conflito legível", async () => {
  const { service } = createAuthHarness();
  const input = {
    name: "Duda",
    email: "duda@example.test",
    password: "senha-segura-000",
  };
  await service.register(input);
  await assert.rejects(service.register(input), {
    statusCode: 409,
    message: "Este e-mail já está cadastrado",
  });
});
