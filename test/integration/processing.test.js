import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { workerRepository } from "../../ai/src/repository.js";
import { processingService } from "../../ai/src/service.js";
import { createPool, transaction } from "../../backend/src/database/index.js";
import { searchRepository } from "../../backend/src/modules/search/search.repository.js";
import { createQueue } from "../../backend/src/queue/index.js";
import { MODEL_VERSION, QUEUES } from "../../backend/src/shared.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
let boss;
let repository;
before(async () => {
  boss = await createQueue(process.env.TEST_DATABASE_URL);
  repository = workerRepository(pool, boss);
});
after(async () => {
  await boss?.stop();
  await pool.end();
});

async function source() {
  const id = randomUUID();
  await pool.query("INSERT INTO sources(id,slug,name,feed_url) VALUES($1,$2,'Teste',$3)", [
    id,
    `source-${id}`,
    `https://example.test/${id}`,
  ]);
  return id;
}

test("coletas concorrentes não duplicam artigos ou tarefas; gravação de embeddings é idempotente", async () => {
  const sourceId = await source();
  const item = {
    url: `https://example.test/${randomUUID()}`,
    title: "Artigo de teste",
    publishedAt: new Date().toISOString(),
  };
  const counts = await Promise.all([
    repository.saveFeed(sourceId, [item]),
    repository.saveFeed(sourceId, [item]),
  ]);
  assert.equal(
    counts.reduce((sum, count) => sum + count, 0),
    1,
  );
  const {
    rows: [article],
  } = await pool.query("SELECT * FROM articles WHERE source_id=$1", [sourceId]);
  const { rows: jobs } = await pool.query(
    "SELECT id FROM pgboss.job WHERE name=$1 AND data->>'articleId'=$2",
    [QUEUES.article, article.id],
  );
  assert.equal(jobs.length, 1);
  const chunks = [
    { content: "Inflação e juros", tokenCount: 4, vector: [1, ...Array(383).fill(0)] },
  ];
  await repository.saveEmbeddings(article.id, "Inflação e juros", "hash", chunks, 10);
  await repository.saveEmbeddings(article.id, "Inflação e juros", "hash", chunks, 10);
  assert.equal(
    (await pool.query("SELECT id FROM article_chunks WHERE article_id=$1", [article.id])).rowCount,
    1,
  );
  assert.equal(
    (await pool.query("SELECT id FROM ai_runs WHERE article_id=$1", [article.id])).rowCount,
    1,
  );
  assert.equal(await repository.saveFeed(sourceId, [item]), 0);
  const searches = searchRepository(pool, boss);
  const search = await searches.create({ query: "Inflação e juros", limit: 1 }, null);
  await processingService(repository, { embed: async () => chunks[0].vector }).search(search.id);
  const completed = await searches.find(search.id, null, true);
  assert.equal(completed.status, "completed");
  assert.equal(completed.results[0].id, article.id);
  assert.equal(completed.results[0].score, 1);
  assert.equal(
    (await pool.query("SELECT embedding_version FROM articles WHERE id=$1", [article.id])).rows[0]
      .embedding_version,
    MODEL_VERSION,
  );
});

test("falha ao enfileirar reverte artigo e registro de coleta", async () => {
  const sourceId = await source();
  const failing = workerRepository(pool, {
    send: async () => {
      throw new Error("fila indisponível");
    },
  });
  await assert.rejects(
    failing.saveFeed(sourceId, [
      { url: `https://example.test/${randomUUID()}`, title: "Teste", publishedAt: null },
    ]),
    /fila indisponível/,
  );
  assert.equal(
    (await pool.query("SELECT id FROM articles WHERE source_id=$1", [sourceId])).rowCount,
    0,
  );
  assert.equal(
    (await pool.query("SELECT id FROM collection_runs WHERE source_id=$1", [sourceId])).rowCount,
    0,
  );
});

test("transação reverte alterações quando uma operação falha", async () => {
  const id = randomUUID();
  await assert.rejects(
    transaction(pool, async (client) => {
      await client.query("INSERT INTO concepts(id,name) VALUES($1,$2)", [id, `rollback-${id}`]);
      throw new Error("falha controlada");
    }),
    /falha controlada/,
  );
  assert.equal((await pool.query("SELECT id FROM concepts WHERE id=$1", [id])).rowCount, 0);
});
