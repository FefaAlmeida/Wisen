import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { buildApp } from "../../backend/src/app.js";
import { createPool } from "../../backend/src/database/index.js";
import { createQueue } from "../../backend/src/queue/index.js";

const operationsToken = process.env.TEST_OPERATIONS_TOKEN;
const pool = createPool(process.env.TEST_DATABASE_URL);
const config = {
  NODE_ENV: "test",
  FRONTEND_URL: "http://localhost:3000",
  PORT: 8080,
  MODEL_CACHE_DIR: "/tmp/wisen-test-models",
  OPERATIONS_TOKEN: operationsToken,
};
let boss;
let app;
let nextRegistrationIp = 40;

function remoteIp(id) {
  return `10.20.0.${id}`;
}

function headersFor(_id, extra = {}) {
  return { ...extra };
}

function cookieFrom(response) {
  const header = response.headers["set-cookie"];
  const value = Array.isArray(header) ? header[0] : header;
  assert.ok(value, "resposta deveria definir o cookie de sessão");
  return value.split(";", 1)[0];
}

async function register({ email = `user-${randomUUID()}@example.test`, name = "Pessoa" } = {}) {
  const response = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: remoteIp(nextRegistrationIp++),
    payload: { name, email, password: "senha-de-teste-segura" },
  });
  assert.equal(response.statusCode, 201, response.body);
  return { response, body: response.json(), cookie: cookieFrom(response) };
}

before(async () => {
  boss = await createQueue(process.env.TEST_DATABASE_URL);
  app = await buildApp({ pool, boss, config, logger: false });
  await app.ready();
});

after(async () => {
  await app?.close();
  await boss?.stop();
  await pool.end();
});

test("health, validação e proteção da sessão respondem corretamente", async () => {
  const health = await app.inject({ method: "GET", url: "/api/health" });
  assert.equal(health.statusCode, 200);
  assert.deepEqual(health.json(), { status: "ok", database: "ok" });

  const invalid = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: remoteIp(2),
    headers: headersFor(2),
    payload: { name: "A", email: "not-an-email", password: "short" },
  });
  assert.equal(invalid.statusCode, 400);

  const anonymous = await app.inject({ method: "GET", url: "/api/auth/session" });
  assert.equal(anonymous.statusCode, 401);
});

test("cadastro cria usuário, preferência, hash e sessão httpOnly no PostgreSQL", async () => {
  const email = `account-${randomUUID()}@example.test`;
  const { response, body, cookie } = await register({ email, name: "Ana Teste" });

  assert.equal(body.user.email, email);
  assert.equal(body.user.name, "Ana Teste");
  assert.match(response.headers["set-cookie"], /HttpOnly/i);
  assert.match(response.headers["set-cookie"], /SameSite=Lax/i);

  const {
    rows: [stored],
  } = await pool.query(
    `SELECT users.id, users.password_hash, user_preferences.user_id
       FROM users JOIN user_preferences ON user_preferences.user_id = users.id
      WHERE users.email = $1`,
    [email],
  );
  assert.ok(stored);
  assert.notEqual(stored.password_hash, "senha-de-teste-segura");
  assert.equal(stored.user_id, stored.id);

  const rawToken = cookie.slice("wisen_session=".length);
  const { rows: sessions } = await pool.query(
    "SELECT token_hash FROM auth_sessions WHERE user_id = $1",
    [stored.id],
  );
  assert.equal(sessions.length, 1);
  assert.notEqual(sessions[0].token_hash, rawToken);

  const currentSession = await app.inject({
    method: "GET",
    url: "/api/auth/session",
    remoteAddress: remoteIp(3),
    headers: headersFor(3, { cookie }),
  });
  assert.equal(currentSession.statusCode, 200);
  assert.equal(currentSession.json().user.id, stored.id);

  const duplicate = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: remoteIp(4),
    headers: headersFor(4),
    payload: { name: "Outra pessoa", email, password: "senha-de-teste-segura" },
  });
  assert.equal(duplicate.statusCode, 409);

  const logout = await app.inject({
    method: "POST",
    url: "/api/auth/logout",
    remoteAddress: remoteIp(5),
    headers: headersFor(5, { cookie }),
  });
  assert.equal(logout.statusCode, 204);
  const expiredSession = await app.inject({
    method: "GET",
    url: "/api/auth/session",
    remoteAddress: remoteIp(6),
    headers: headersFor(6, { cookie }),
  });
  assert.equal(expiredSession.statusCode, 401);
});

test("perfil lê e salva dados pessoais, interesses e notificações", async () => {
  const { body, cookie } = await register({ name: "Perfil Original" });
  const headers = headersFor(14, { cookie });
  const initialProfile = await app.inject({
    method: "GET",
    url: "/api/auth/profile",
    headers,
  });

  assert.equal(initialProfile.statusCode, 200, initialProfile.body);
  assert.deepEqual(initialProfile.json().preferences, {
    interests: [],
    onboardingCompleted: false,
    notifications: { reviewReminders: true, weeklySummary: false },
  });

  const skipOnboarding = await app.inject({
    method: "PUT",
    url: "/api/auth/profile",
    headers,
    payload: {
      name: body.user.name,
      email: body.user.email,
      interests: [],
      notifications: { reviewReminders: true, weeklySummary: false },
    },
  });
  assert.equal(skipOnboarding.statusCode, 200, skipOnboarding.body);
  const skippedProfile = await app.inject({
    method: "GET",
    url: "/api/auth/profile",
    headers,
  });
  assert.equal(skippedProfile.json().preferences.onboardingCompleted, true);

  const update = await app.inject({
    method: "PUT",
    url: "/api/auth/profile",
    headers,
    payload: {
      name: "Perfil Atualizado",
      email: body.user.email,
      interests: ["Tecnologia", "Saúde"],
      notifications: { reviewReminders: false, weeklySummary: true },
    },
  });
  assert.equal(update.statusCode, 200, update.body);
  assert.equal(update.json().user.name, "Perfil Atualizado");

  const savedProfile = await app.inject({
    method: "GET",
    url: "/api/auth/profile",
    headers,
  });
  assert.equal(savedProfile.statusCode, 200, savedProfile.body);
  assert.deepEqual(savedProfile.json(), {
    user: { ...body.user, name: "Perfil Atualizado" },
    avatarDataUrl: null,
    preferences: {
      interests: ["Tecnologia", "Saúde"],
      onboardingCompleted: true,
      notifications: { reviewReminders: false, weeklySummary: true },
    },
  });

  const avatarDataUrl = "data:image/webp;base64,aGVsbG8=";
  const avatarUpdate = await app.inject({
    method: "PUT",
    url: "/api/auth/avatar",
    headers,
    payload: { avatarDataUrl },
  });
  assert.equal(avatarUpdate.statusCode, 200, avatarUpdate.body);
  assert.equal(avatarUpdate.json().avatarDataUrl, avatarDataUrl);

  const profileWithAvatar = await app.inject({
    method: "GET",
    url: "/api/auth/profile",
    headers,
  });
  assert.equal(profileWithAvatar.json().avatarDataUrl, avatarDataUrl);
});

test("login valida credenciais e persiste a duração de lembrar-me", async () => {
  const email = `login-${randomUUID()}@example.test`;
  await register({ email });

  const invalid = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    remoteAddress: remoteIp(7),
    headers: headersFor(7),
    payload: { email, password: "senha-incorreta" },
  });
  assert.equal(invalid.statusCode, 401);
  assert.equal(invalid.json().message, "E-mail ou senha inválidos");

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    remoteAddress: remoteIp(8),
    headers: headersFor(8),
    payload: { email, password: "senha-de-teste-segura", remember: true },
  });
  assert.equal(login.statusCode, 200);
  const cookie = cookieFrom(login);
  assert.match(login.headers["set-cookie"], /Max-Age=2592000/i);

  const { rows } = await pool.query(
    "SELECT expires_at FROM auth_sessions JOIN users ON users.id = auth_sessions.user_id WHERE users.email = $1 ORDER BY auth_sessions.created_at DESC LIMIT 1",
    [email],
  );
  assert.ok(rows[0].expires_at.getTime() > Date.now() + 29 * 24 * 60 * 60 * 1000);
  assert.equal(cookie.startsWith("wisen_session="), true);
});

test("busca é privada e cada pessoa só consulta os próprios pedidos", async () => {
  const first = await register({ email: `first-${randomUUID()}@example.test` });
  const second = await register({ email: `second-${randomUUID()}@example.test` });

  const anonymous = await app.inject({
    method: "POST",
    url: "/api/search",
    remoteAddress: remoteIp(9),
    headers: headersFor(9),
    payload: { query: "inflação e taxa de juros" },
  });
  assert.equal(anonymous.statusCode, 401);

  const created = await app.inject({
    method: "POST",
    url: "/api/search",
    remoteAddress: remoteIp(10),
    headers: headersFor(10, { cookie: first.cookie }),
    payload: { query: "inflação e taxa de juros" },
  });
  assert.equal(created.statusCode, 202, created.body);
  const searchId = created.json().id;

  const { rows } = await pool.query("SELECT user_id FROM search_requests WHERE id = $1", [
    searchId,
  ]);
  assert.equal(rows[0].user_id, first.body.user.id);

  const ownSearch = await app.inject({
    method: "GET",
    url: `/api/search/${searchId}`,
    remoteAddress: remoteIp(11),
    headers: headersFor(11, { cookie: first.cookie }),
  });
  assert.equal(ownSearch.statusCode, 200);
  assert.equal(ownSearch.json().status, "pending");

  const otherSearch = await app.inject({
    method: "GET",
    url: `/api/search/${searchId}`,
    remoteAddress: remoteIp(12),
    headers: headersFor(12, { cookie: second.cookie }),
  });
  assert.equal(otherSearch.statusCode, 404);

  const operationsSearch = await app.inject({
    method: "GET",
    url: `/api/search/${searchId}`,
    remoteAddress: remoteIp(13),
    headers: headersFor(13, { authorization: `Bearer ${operationsToken}` }),
  });
  assert.equal(operationsSearch.statusCode, 200);
});

test("login limita tentativas por endereço de origem", async () => {
  const results = [];
  for (let attempt = 0; attempt < 6; attempt++) {
    results.push(
      await app.inject({
        method: "POST",
        url: "/api/auth/login",
        remoteAddress: remoteIp(99),
        headers: headersFor(99),
        payload: { email: "limite@example.test", password: "senha-incorreta" },
      }),
    );
  }
  assert.deepEqual(
    results.slice(0, 5).map(({ statusCode }) => statusCode),
    [401, 401, 401, 401, 401],
  );
  assert.equal(results[5].statusCode, 429);
});

test("perfil salva blocos independentes, valida entradas e não conclui onboarding por outros campos", async () => {
  const { body, cookie } = await register();
  const request = (payload) =>
    app.inject({
      method: "PUT",
      url: "/api/auth/profile",
      remoteAddress: remoteIp(110),
      headers: { cookie },
      payload,
    });
  const read = async () =>
    (
      await app.inject({
        method: "GET",
        url: "/api/auth/profile",
        remoteAddress: remoteIp(110),
        headers: { cookie },
      })
    ).json();
  assert.equal(
    (await request({ name: "Novo Nome", email: `  ${body.user.email.toUpperCase()}  ` }))
      .statusCode,
    200,
  );
  assert.equal((await read()).preferences.onboardingCompleted, false);
  assert.equal(
    (await request({ notifications: { reviewReminders: false, weeklySummary: true } })).statusCode,
    200,
  );
  assert.equal((await read()).preferences.onboardingCompleted, false);
  assert.equal((await request({ interests: ["Tecnologia"] })).statusCode, 200);
  const profile = await read();
  assert.equal(profile.user.name, "Novo Nome");
  assert.equal(profile.user.email, body.user.email);
  assert.deepEqual(profile.preferences, {
    interests: ["Tecnologia"],
    onboardingCompleted: true,
    notifications: { reviewReminders: false, weeklySummary: true },
  });
  for (const payload of [
    {},
    { name: "Só nome" },
    { email: body.user.email },
    { interests: null },
    { interests: [""] },
    { interests: Array(51).fill("Tema") },
    { notifications: { weeklySummary: true } },
    { role: "admin" },
  ]) {
    assert.equal((await request(payload)).statusCode, 400, JSON.stringify(payload));
  }
  const [first, second] = await Promise.all([
    request({ interests: ["Ciência"] }),
    request({ notifications: { reviewReminders: true, weeklySummary: false } }),
  ]);
  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 200);
  assert.deepEqual((await read()).preferences, {
    interests: ["Ciência"],
    onboardingCompleted: true,
    notifications: { reviewReminders: true, weeklySummary: false },
  });
});

test("avatar aceita imagem acima de 16 KiB e mantém limites por rota", async () => {
  const { cookie } = await register();
  const request = (payload, url = "/api/auth/avatar") =>
    app.inject({ method: "PUT", url, remoteAddress: remoteIp(111), headers: { cookie }, payload });
  const avatarDataUrl = `data:image/webp;base64,${Buffer.alloc(40000).toString("base64")}`;
  const response = await request({ avatarDataUrl });
  assert.equal(response.statusCode, 200, response.body);
  assert.equal(response.json().avatarDataUrl, avatarDataUrl);
  const profile = await app.inject({
    method: "GET",
    url: "/api/auth/profile",
    remoteAddress: remoteIp(111),
    headers: { cookie },
  });
  assert.equal(profile.json().avatarDataUrl, avatarDataUrl);
  assert.equal(
    (await request({ avatarDataUrl: `data:image/png;base64,${"a".repeat(800000)}` })).statusCode,
    400,
  );
  assert.equal((await request({ avatarDataUrl: "a".repeat(1100000) })).statusCode, 413);
  assert.equal(
    (await request({ interests: ["a".repeat(20000)] }, "/api/auth/profile")).statusCode,
    413,
  );
  assert.equal(
    (await request({ avatarDataUrl: "data:text/html;base64,aGVsbG8=" })).statusCode,
    400,
  );
  assert.equal((await request({ avatarDataUrl: null })).statusCode, 200);
});

test("disputa concorrente pelo mesmo e-mail retorna sucesso e conflito", async () => {
  const accounts = await Promise.all([register(), register()]);
  const email = `race-${randomUUID()}@example.test`;
  const results = await Promise.all(
    accounts.map(({ cookie }, index) =>
      app.inject({
        method: "PUT",
        url: "/api/auth/profile",
        remoteAddress: remoteIp(112 + index),
        headers: { cookie },
        payload: { name: "Mesmo destino", email },
      }),
    ),
  );
  assert.deepEqual(results.map((response) => response.statusCode).sort(), [200, 409]);
  const { rows } = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  assert.equal(rows.length, 1);
});
