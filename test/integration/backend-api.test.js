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

function headersFor(id, extra = {}) {
  return { "x-real-ip": remoteIp(id), ...extra };
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
    headers: headersFor(nextRegistrationIp++),
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
    headers: headersFor(3, { cookie }),
  });
  assert.equal(currentSession.statusCode, 200);
  assert.equal(currentSession.json().user.id, stored.id);

  const duplicate = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    headers: headersFor(4),
    payload: { name: "Outra pessoa", email, password: "senha-de-teste-segura" },
  });
  assert.equal(duplicate.statusCode, 409);

  const logout = await app.inject({
    method: "POST",
    url: "/api/auth/logout",
    headers: headersFor(5, { cookie }),
  });
  assert.equal(logout.statusCode, 204);
  const expiredSession = await app.inject({
    method: "GET",
    url: "/api/auth/session",
    headers: headersFor(6, { cookie }),
  });
  assert.equal(expiredSession.statusCode, 401);
});

test("login valida credenciais e persiste a duração de lembrar-me", async () => {
  const email = `login-${randomUUID()}@example.test`;
  await register({ email });

  const invalid = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    headers: headersFor(7),
    payload: { email, password: "senha-incorreta" },
  });
  assert.equal(invalid.statusCode, 401);
  assert.equal(invalid.json().message, "E-mail ou senha inválidos");

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
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
    headers: headersFor(9),
    payload: { query: "inflação e taxa de juros" },
  });
  assert.equal(anonymous.statusCode, 401);

  const created = await app.inject({
    method: "POST",
    url: "/api/search",
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
    headers: headersFor(11, { cookie: first.cookie }),
  });
  assert.equal(ownSearch.statusCode, 200);
  assert.equal(ownSearch.json().status, "pending");

  const otherSearch = await app.inject({
    method: "GET",
    url: `/api/search/${searchId}`,
    headers: headersFor(12, { cookie: second.cookie }),
  });
  assert.equal(otherSearch.statusCode, 404);

  const operationsSearch = await app.inject({
    method: "GET",
    url: `/api/search/${searchId}`,
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
