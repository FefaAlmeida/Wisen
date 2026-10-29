import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { createPool, transaction } from "@wisen/database";
import { migrate } from "@wisen/database/migrate";
import { createQueue, enqueue } from "@wisen/queue";
import { MODEL_VERSION, QUEUES, SOURCE } from "@wisen/shared";
import { workerRepository } from "../../apps/ai/src/repository.js";
import { processingService } from "../../apps/ai/src/service.js";
import { buildApp } from "../../apps/backend/src/app.js";

const database = `wisen_test_${randomBytes(6).toString("hex")}`;
let admin;
let pool;
let boss;
let app;
let repository;
let service;
let sourceId;
const vector = Array(384).fill(0);
vector[0] = 1;

async function until(fn) {
  for (let i = 0; i < 100; i++) {
    const result = await fn();
    if (result) return result;
    await delay(200);
  }
  throw new Error("Tempo excedido aguardando processamento");
}

before(async () => {
  const url = new URL(
    process.env.TEST_DATABASE_URL || "postgres://wisen:wisen_local@localhost:5432/postgres",
  );
  if (!["localhost", "127.0.0.1", "database"].includes(url.hostname))
    throw new Error("Testes exigem PostgreSQL local ou do Compose");
  url.pathname = "/postgres";
  admin = createPool(url.href);
  await admin.query(`CREATE DATABASE ${database}`);
  url.pathname = `/${database}`;
  pool = createPool(url.href);
  await Promise.all([migrate(pool), migrate(pool)]);
  boss = await createQueue(url.href);
  repository = workerRepository(pool, boss);
  const html = await readFile(new URL("../fixtures/article.html", import.meta.url), "utf8");
  const xml = await readFile(new URL("../fixtures/feed.xml", import.meta.url), "utf8");
  service = processingService(
    repository,
    {
      chunks: (text) => [{ content: text, tokenCount: 100 }],
      embed: async () => vector,
    },
    async (_, options) => (options?.feed ? xml : html),
  );
  const { rows } = await pool.query(
    "INSERT INTO sources(slug,name,feed_url) VALUES($1,$2,$3) RETURNING id",
    [SOURCE.slug, SOURCE.name, SOURCE.feed],
  );
  sourceId = rows[0].id;
  app = await buildApp({
    pool,
    boss,
    config: { NODE_ENV: "test", FRONTEND_URL: "http://localhost:3000" },
    logger: false,
  });
});

after(async () => {
  await app?.close();
  await boss?.stop();
  await pool?.end();
  if (admin) {
    await admin.query(`DROP DATABASE IF EXISTS ${database} WITH (FORCE)`);
    await admin.end();
  }
});

test("migrations são repetíveis, serializadas e detectam alteração de histórico", async () => {
  assert.deepEqual(await migrate(pool), []);
  assert.equal(
    (await pool.query("SELECT count(*)::int AS count FROM schema_migrations")).rows[0].count,
    3,
  );
  const dir = await mkdtemp(join(tmpdir(), "wisen-migration-"));
  try {
    await writeFile(join(dir, "0001_core.sql"), "SELECT 2;");
    await assert.rejects(migrate(pool, pathToFileURL(`${dir}/`)), /foi alterada/);
    await writeFile(
      join(dir, "0001_core.sql"),
      await readFile(new URL("../../packages/database/migrations/0001_core.sql", import.meta.url)),
    );
    await writeFile(
      join(dir, "9999_failure.sql"),
      "CREATE TABLE should_rollback(id int); SELECT 1/0;",
    );
    await assert.rejects(migrate(pool, pathToFileURL(`${dir}/`)), /division by zero/);
    assert.equal(
      (await pool.query("SELECT to_regclass('should_rollback') AS table_name")).rows[0].table_name,
      null,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("constraints protegem domínio e vínculo principal artigo/evento", async () => {
  const user = (
    await pool.query(
      "INSERT INTO users(email,name) VALUES('teste@exemplo.com','Teste') RETURNING id",
    )
  ).rows[0].id;
  const concept = (await pool.query("INSERT INTO concepts(name) VALUES('Selic') RETURNING id"))
    .rows[0].id;
  await assert.rejects(
    pool.query("INSERT INTO user_concepts(user_id,concept_id,mastery_score) VALUES($1,$2,1.1)", [
      user,
      concept,
    ]),
    /check constraint/,
  );
  await assert.rejects(
    pool.query("INSERT INTO saved_contents(user_id) VALUES($1)", [user]),
    /check constraint/,
  );
  await assert.rejects(
    pool.query(
      "INSERT INTO concept_relations(from_id,to_id,relation,source_type,source_id,method,confidence) VALUES($1,$1,'REQUIRES','manual',$2,'manual',1)",
      [concept, user],
    ),
    /check constraint/,
  );
});

test("transação revertida não deixa tarefas órfãs", async () => {
  const marker = randomBytes(8).toString("hex");
  await assert.rejects(
    transaction(pool, async (client) => {
      await enqueue(boss, client, QUEUES.search, { marker });
      throw new Error("rollback proposital");
    }),
    /rollback proposital/,
  );
  assert.equal(
    (
      await pool.query("SELECT count(*)::int AS count FROM pgboss.job WHERE data->>'marker'=$1", [
        marker,
      ])
    ).rows[0].count,
    0,
  );
});

test("coleta e reexecução preservam um artigo e um conjunto de embeddings", async () => {
  await service.collect(sourceId);
  await service.collect(sourceId);
  assert.equal(
    (
      await pool.query("SELECT count(*)::int AS count FROM pgboss.job WHERE name=$1", [
        QUEUES.article,
      ])
    ).rows[0].count,
    1,
  );
  const { rows } = await pool.query("SELECT id FROM articles");
  assert.equal(rows.length, 1);
  await service.article(rows[0].id);
  await service.article(rows[0].id);
  assert.equal(
    (await pool.query("SELECT count(*)::int AS count FROM article_chunks")).rows[0].count,
    1,
  );
  assert.equal((await pool.query("SELECT count(*)::int AS count FROM ai_runs")).rows[0].count, 1);
  assert.equal(
    (await pool.query("SELECT embedding_version FROM articles")).rows[0].embedding_version,
    MODEL_VERSION,
  );
  const events = (
    await pool.query("INSERT INTO events(title) VALUES('Evento 1'),('Evento 2') RETURNING id")
  ).rows;
  await pool.query("INSERT INTO event_articles(article_id,event_id) VALUES($1,$2)", [
    rows[0].id,
    events[0].id,
  ]);
  await assert.rejects(
    pool.query("INSERT INTO event_articles(article_id,event_id) VALUES($1,$2)", [
      rows[0].id,
      events[1].id,
    ]),
    /duplicate key/,
  );
});

test("API valida entrada, documenta e busca por fila com retentativa real", async () => {
  assert.equal((await app.inject("/api/health")).statusCode, 200);
  assert.equal((await app.inject("/docs/json")).statusCode, 200);
  assert.equal((await app.inject("/api/articles?limit=999")).statusCode, 400);
  assert.equal((await app.inject("/api/articles/invalid")).statusCode, 400);
  assert.equal(
    (await app.inject({ method: "POST", url: "/api/search", payload: { query: "x" } })).statusCode,
    400,
  );
  let attempts = 0;
  await boss.updateQueue(QUEUES.search, { retryDelay: 1, retryBackoff: false });
  await boss.work(QUEUES.search, { pollingIntervalSeconds: 0.5 }, async ([job]) => {
    if (++attempts === 1) throw new Error("falha transitória de teste");
    await service.search(job.data.id);
  });
  const response = await app.inject({
    method: "POST",
    url: "/api/search",
    payload: { query: "juros e inflação" },
  });
  assert.equal(response.statusCode, 202);
  const id = response.json().id;
  const result = await until(async () => {
    const data = (await app.inject(`/api/search/${id}`)).json();
    return data.status === "completed" && data;
  });
  assert.ok(attempts >= 2);
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].title, "Juros e inflação");
  assert.ok(result.results[0].score > 0.99);
});

test("produção protege operações e não publica Swagger", async () => {
  const protectedApp = await buildApp({
    pool,
    boss,
    config: {
      NODE_ENV: "production",
      FRONTEND_URL: "https://example.test",
      OPERATIONS_TOKEN: "x".repeat(32),
    },
    logger: false,
  });
  try {
    assert.equal((await protectedApp.inject("/docs")).statusCode, 404);
    assert.equal(
      (
        await protectedApp.inject({
          method: "POST",
          url: "/api/search",
          payload: { query: "inflação" },
        })
      ).statusCode,
      401,
    );
  } finally {
    await protectedApp.close();
  }
});
