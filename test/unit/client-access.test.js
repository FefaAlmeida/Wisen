import assert from "node:assert/strict";
import test from "node:test";
import { buildApp } from "../../backend/src/app.js";

const id = "11111111-1111-4111-8111-111111111111";
const clientRequests = [
  { url: "/api/feed" },
  { url: `/api/events/${id}` },
  { url: `/api/reading/${id}` },
  { url: "/api/concepts" },
  { url: `/api/concepts/${id}` },
  { url: "/api/discover?q=economia" },
  { url: "/api/knowledge" },
  { url: "/api/reviews" },
  { url: "/api/preferences/familiarity" },
  { url: "/api/saved" },
  { method: "DELETE", url: `/api/saved/${id}` },
  { method: "POST", url: "/api/saved", payload: { type: "concept", id } },
  {
    method: "PUT",
    url: "/api/preferences/familiarity",
    payload: { familiarity: "basic" },
  },
  {
    method: "POST",
    url: "/api/reviews/answer",
    payload: { reviewId: id, answer: 0, requestId: id },
  },
  {
    method: "POST",
    url: "/api/interactions",
    payload: { conceptId: id, type: "gap", requestId: id },
  },
  { method: "POST", url: "/api/generations", payload: { operation: "concept", conceptId: id } },
  { url: `/api/generations/${id}` },
  {
    method: "POST",
    url: `/api/generations/${id}/feedback`,
    payload: { useful: true, clear: true, unnecessary: false },
  },
];

test("área de cliente rejeita admin e visitantes antes de executar operações", async () => {
  const app = await buildApp({
    pool: {
      query: async () => {
        throw new Error("Não deveria consultar o banco");
      },
    },
    boss: {},
    config: { NODE_ENV: "test", FRONTEND_URL: "http://localhost:3000" },
    logger: false,
  });
  let currentUser = null;
  app.loadUser = async () => currentUser;
  try {
    for (const role of [null, "admin"]) {
      currentUser = role ? { id, role, name: "Admin", email: "admin@example.test" } : null;
      for (const request of clientRequests) {
        const response = await app.inject(request);
        assert.equal(response.statusCode, role ? 403 : 401, `${request.url}: ${response.body}`);
      }
    }
    // A sessão e o logout continuam disponíveis para o administrador.
    assert.equal((await app.inject({ url: "/api/auth/session" })).statusCode, 200);
    currentUser = { id, role: "user" };
    assert.equal((await app.inject({ url: "/api/admin/overview" })).statusCode, 403);
  } finally {
    await app.close();
  }
});

test("cliente autenticado mantém acesso ao feed", async () => {
  const app = await buildApp({
    pool: { query: async () => ({ rows: [] }) },
    boss: {},
    config: { NODE_ENV: "test", FRONTEND_URL: "http://localhost:3000" },
    logger: false,
  });
  app.loadUser = async () => ({ id, role: "user" });
  try {
    const response = await app.inject({ url: "/api/feed" });
    assert.equal(response.statusCode, 200, response.body);
    assert.deepEqual(response.json(), { items: [] });
  } finally {
    await app.close();
  }
});
