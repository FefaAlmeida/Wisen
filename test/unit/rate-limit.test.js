import assert from "node:assert/strict";
import test from "node:test";
import { buildApp } from "../../backend/src/app.js";

const config = { NODE_ENV: "test", FRONTEND_URL: "http://localhost:3000" };
const pool = { query: async () => ({ rows: [] }) };

test("cliente direto não contorna limite falsificando cabeçalhos de IP", async () => {
  const app = await buildApp({ pool, boss: {}, config, logger: false });
  try {
    for (let i = 0; i < 6; i++) {
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        remoteAddress: "203.0.113.10",
        headers: { "x-real-ip": `10.0.0.${i}`, "x-forwarded-for": `10.0.0.${i}` },
        payload: { email: "missing@example.test", password: "senha-incorreta" },
      });
      assert.equal(response.statusCode, i < 5 ? 401 : 429);
    }
  } finally {
    await app.close();
  }
});

test("proxy explicitamente confiável preserva limites individuais dos clientes", async () => {
  const app = await buildApp({
    pool,
    boss: {},
    config: { ...config, TRUST_PROXY: ["loopback"] },
    logger: false,
  });
  try {
    for (let i = 0; i < 7; i++) {
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        remoteAddress: "127.0.0.1",
        headers: { "x-forwarded-for": `203.0.113.${i}` },
        payload: { email: "missing@example.test", password: "senha-incorreta" },
      });
      assert.equal(response.statusCode, 401);
    }
  } finally {
    await app.close();
  }
});
