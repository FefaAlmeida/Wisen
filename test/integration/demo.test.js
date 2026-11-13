import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { generationWorker } from "../../ai/src/generation.js";
import { scheduleWork } from "../../ai/src/scheduler.js";
import { buildApp } from "../../backend/src/app.js";
import { seedDemo } from "../../backend/src/database/demo.js";
import { createPool } from "../../backend/src/database/index.js";
import { taskService } from "../../backend/src/modules/generation/tasks.js";
import { platformRead } from "../../backend/src/modules/platform/read.js";
import { createQueue } from "../../backend/src/queue/index.js";
import { configuration } from "../../backend/src/shared.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
const config = configuration({
  DATABASE_URL: process.env.TEST_DATABASE_URL,
  NODE_ENV: "test",
  AI_PROVIDER: "mock",
  AI_MONTHLY_LIMIT_BRL: "0",
  OPERATIONS_TOKEN: process.env.TEST_OPERATIONS_TOKEN,
});
let boss, app, user, cookie;
before(async () => {
  boss = await createQueue(config.DATABASE_URL);
  user = await seedDemo(pool, config);
  app = await buildApp({ pool, boss, config, logger: false });
  await app.ready();
  const response = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: user.email, password: "ClienteWisen@123" },
    remoteAddress: "10.82.0.1",
  });
  assert.equal(response.statusCode, 200, response.body);
  cookie = response.headers["set-cookie"].split(";")[0];
});
after(async () => {
  await app?.close();
  await boss?.stop();
  await pool.end();
});
const call = (url, method = "GET", payload) =>
  app.inject({ url, method, payload, headers: { cookie }, remoteAddress: "10.82.0.2" });

test("demonstração preenche feed, filtros, conceitos, revisões e salvos e preserva progresso", async () => {
  const again = await seedDemo(pool, config);
  assert.equal(again.id, user.id);
  const read = platformRead(pool);
  const feed = await read.feed(user.id, { q: "Demonstração" });
  assert.equal(feed.filter((e) => e.title.startsWith("[Demonstração]")).length, 6);
  assert.ok((await read.feed(user.id, { topic: "Inflação" })).length);
  assert.equal((await read.reviews(user.id)).length, 6);
  assert.equal((await read.saved(user.id)).length, 2);
  assert.equal(new Set((await read.knowledge(user.id)).map((c) => c.status)).size, 3);
  const review = (await read.reviews(user.id))[0];
  await pool.query("UPDATE reviews SET completed_at=now() WHERE id=$1", [review.id]);
  await seedDemo(pool, config);
  assert.equal((await read.reviews(user.id)).length, 5);
});

test("cliente sem e-mail confirmado gera explicação, trecho, questões e correção sem cobranças", async () => {
  const read = platformRead(pool);
  const event = (await read.feed(user.id, { q: "Demonstração" }))[0];
  const context = await read.event(user.id, event.id);
  const article = await read.article(context.articles[0].id);
  const review = (await read.reviews(user.id))[0];
  const worker = generationWorker(pool, config);
  for (const payload of [
    { operation: "explanation", eventId: event.id },
    { operation: "deepen", eventId: event.id },
    { operation: "concept", conceptId: context.concepts[0].id },
    { operation: "passage", articleId: article.id, passage: article.content.slice(0, 60) },
    {
      operation: "grade",
      reviewId: review.id,
      answer: "Exemplo de resposta",
      requestId: randomUUID(),
    },
  ]) {
    const response = await call("/api/generations", "POST", payload);
    assert.equal(response.statusCode, 202, response.body);
    await worker(response.json().id);
    const completed = await call(`/api/generations/${response.json().id}`);
    assert.equal(completed.json().status, "completed", completed.body);
    assert.equal(completed.json().result.mock, true);
  }
  const tasks = taskService(pool, boss, config);
  const questions = await tasks.create(null, {
    operation: "questions",
    conceptId: context.concepts[0].id,
  });
  await worker(questions.id);
  assert.equal(
    (await pool.query("SELECT status FROM generation_tasks WHERE id=$1", [questions.id])).rows[0]
      .status,
    "completed",
  );
  assert.equal(
    Number(
      (await pool.query("SELECT count(*) FROM generation_charges WHERE user_id=$1", [user.id]))
        .rows[0].count,
    ),
    0,
  );
  assert.equal((await call("/api/account/status")).json().aiProvider, "mock");
  // Changing providers must not reuse a completed mock response.
  const live = taskService(pool, boss, {
    ...config,
    AI_PROVIDER: "openai",
    OPENAI_API_KEY: "not-sent",
  });
  const next = await live.create(user.id, { operation: "explanation", eventId: event.id });
  assert.equal(next.status, "pending");
});

test("seed não roda em produção e não cria mock no modo OpenAI", async () => {
  await assert.rejects(seedDemo(null, { ...config, NODE_ENV: "production" }), /exclusivo/);
  assert.equal(await seedDemo(null, { ...config, AI_PROVIDER: "openai" }), null);
});

test("ao ativar OpenAI, o agendador reprocessa análise mock e ignora artigos fictícios", async () => {
  const source = (
    await pool.query(
      "INSERT INTO sources(slug,name,feed_url,enabled,internal_reading) VALUES($1,'Fonte de teste',$2,false,true) RETURNING id",
      [`demo-switch-${randomUUID()}`, `https://example.test/${randomUUID()}`],
    )
  ).rows[0];
  const article = (
    await pool.query(
      "INSERT INTO articles(source_id,url,title,content,processing_status,created_at) VALUES($1,$2,'Inflação no teste','Texto de teste sobre inflação.','processed','2000-01-01') RETURNING id",
      [source.id, `https://example.test/${randomUUID()}`],
    )
  ).rows[0];
  const tasks = taskService(pool, boss, config);
  const analysis = await tasks.create(null, { operation: "analysis", articleId: article.id });
  await generationWorker(pool, config)(analysis.id);
  assert.equal(
    (await pool.query("SELECT status FROM generation_tasks WHERE id=$1", [analysis.id])).rows[0]
      .status,
    "completed",
  );
  const scheduled = [];
  await scheduleWork(
    pool,
    boss,
    { ...config, AI_PROVIDER: "openai", OPENAI_API_KEY: "not-sent" },
    { create: async (_user, input) => scheduled.push(input) },
  );
  assert.ok(scheduled.some((t) => t.articleId === article.id));
  const demoArticles = (
    await pool.query(
      "SELECT a.id FROM articles a JOIN sources s ON s.id=a.source_id WHERE s.slug='wisen-demo'",
    )
  ).rows;
  assert.ok(!scheduled.some((t) => demoArticles.some((a) => a.id === t.articleId)));
});
