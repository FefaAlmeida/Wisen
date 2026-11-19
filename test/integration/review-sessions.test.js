import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { buildApp } from "../../backend/src/app.js";
import { bootstrapProduction } from "../../backend/src/database/bootstrap-production.js";
import { createPool } from "../../backend/src/database/index.js";
import { createQueue } from "../../backend/src/queue/index.js";
import { configuration } from "../../backend/src/shared.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
let app, boss, cookie, other, userId, conceptId;
before(async () => {
  const config = configuration({
    DATABASE_URL: process.env.TEST_DATABASE_URL,
    NODE_ENV: "test",
    OPERATIONS_TOKEN: process.env.TEST_OPERATIONS_TOKEN,
    AI_PROVIDER: "openai",
  });
  boss = await createQueue(config.DATABASE_URL);
  app = await buildApp({ pool, boss, config, logger: false });
  await app.ready();
  for (let i = 0; i < 2; i++) {
    const r = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      remoteAddress: `10.76.0.${i + 1}`,
      payload: {
        name: "Revisão",
        email: `reviews-${randomUUID()}@example.test`,
        password: "senha-teste-123",
      },
    });
    assert.equal(r.statusCode, 201, r.body);
    if (!i) {
      cookie = r.headers["set-cookie"].split(";")[0];
      userId = r.json().user.id;
    } else other = r.headers["set-cookie"].split(";")[0];
  }
  conceptId = (
    await pool.query("INSERT INTO concepts(name,description) VALUES($1,'Definição') RETURNING id", [
      `Sessões ${randomUUID()}`,
    ])
  ).rows[0].id;
  await pool.query(
    "INSERT INTO question_bank(concept_id,prompt,options,correct_index,explanation,rubric) VALUES($1,'Qual alternativa?','[\"Certa\",\"Outra\",\"Terceira\",\"Quarta\"]',0,'Explicação privada','Rubrica')",
    [conceptId],
  );
});
after(async () => {
  await app?.close();
  await boss?.stop();
  await pool.end();
});
const call = (url, method = "GET", payload, sessionCookie = cookie) =>
  app.inject({
    url,
    method,
    payload,
    headers: { cookie: sessionCookie },
    remoteAddress: "10.76.0.3",
  });
test("sessões privadas persistem, ocultam gabaritos e não duplicam evidências", async () => {
  const requestId = randomUUID();
  const input = { conceptIds: [conceptId], format: "quiz", requestId };
  const created = await call("/api/reviews/sessions", "POST", input);
  assert.equal(created.statusCode, 200, created.body);
  const s = created.json();
  assert.equal(s.items[0].correta, undefined);
  assert.equal(s.items[0].explicacao, undefined);
  assert.equal((await call("/api/reviews/sessions", "POST", input)).json().id, s.id);
  assert.equal(
    (await call(`/api/reviews/sessions/${s.id}`, "GET", undefined, other)).statusCode,
    404,
  );
  assert.equal((await call(`/api/reviews/sessions/${s.id}/complete`, "POST", {})).statusCode, 409);
  const url = `/api/reviews/sessions/${s.id}/items/${s.items[0].id}`;
  const replies = await Promise.all([
    call(url, "POST", { answer: 0 }),
    call(url, "POST", { answer: 1 }),
  ]);
  for (const r of replies) {
    assert.equal(r.statusCode, 200, r.body);
    assert.equal(r.json().items[0].correct, true);
  }
  assert.equal(
    (
      await pool.query(
        "SELECT count(*) FROM user_interactions WHERE user_id=$1 AND concept_id=$2 AND type='correct'",
        [userId, conceptId],
      )
    ).rows[0].count,
    "1",
  );
  assert.equal((await call(`/api/reviews/sessions/${s.id}`)).json().items[0].correta, 0);
  assert.ok(
    (await call(`/api/reviews/sessions/${s.id}/complete`, "POST", { difficulty: "Médio" })).json()
      .completed_at,
  );
  const second = (
    await call("/api/reviews/sessions", "POST", { ...input, requestId: randomUUID() })
  ).json();
  await call(`/api/reviews/sessions/${second.id}/items/${second.items[0].id}`, "POST", {
    answer: 0,
  });
  assert.equal(
    Number(
      (
        await pool.query(
          "SELECT mastery_score FROM user_concepts WHERE user_id=$1 AND concept_id=$2",
          [userId, conceptId],
        )
      ).rows[0].mastery_score,
    ),
    0.25,
  );
  const summary = await call("/api/reviews/summary");
  assert.equal(summary.statusCode, 200, summary.body);
  assert.equal(summary.json().week.length, 7);
  assert.ok(summary.json().history.length >= 2);
});
test("flashcards registram estudo sem pontuar domínio e bootstrap preserva contas e curadoria", async () => {
  const s = (
    await call("/api/reviews/sessions", "POST", {
      conceptIds: [conceptId],
      format: "flashcards",
      requestId: randomUUID(),
    })
  ).json();
  const before = (
    await pool.query("SELECT mastery_score FROM user_concepts WHERE user_id=$1 AND concept_id=$2", [
      userId,
      conceptId,
    ])
  ).rows[0].mastery_score;
  const r = await call(`/api/reviews/sessions/${s.id}/items/${s.items[0].id}`, "POST", {});
  assert.equal(r.json().items[0].correct, null);
  assert.equal(r.json().items[0].explicacao, "Explicação privada");
  assert.equal(
    (
      await pool.query(
        "SELECT mastery_score FROM user_concepts WHERE user_id=$1 AND concept_id=$2",
        [userId, conceptId],
      )
    ).rows[0].mastery_score,
    before,
  );
  const env = {
    WISEN_ADMIN_EMAIL: `admin-${randomUUID()}@example.test`,
    WISEN_ADMIN_PASSWORD: "senha-admin-teste",
  };
  const first = await bootstrapProduction(pool, env);
  assert.equal(first.events, 6);
  assert.equal(first.concepts, 12);
  const again = await bootstrapProduction(pool, {
    ...env,
    WISEN_ADMIN_PASSWORD: "nao-deve-substituir",
  });
  assert.equal(again.editorial, "preservado");
  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    remoteAddress: "10.76.0.9",
    payload: { email: env.WISEN_ADMIN_EMAIL, password: env.WISEN_ADMIN_PASSWORD },
  });
  assert.equal(login.statusCode, 200, login.body);
});
