import { unlink, writeFile } from "node:fs/promises";
import { createPool } from "@wisen/database";
import { createQueue } from "@wisen/queue";
import { configuration, QUEUES } from "@wisen/shared";
import { createEmbedder } from "./embeddings.js";
import { workerRepository } from "./repository.js";
import { processingService } from "./service.js";

const config = configuration();
const pool = createPool(config.DATABASE_URL);
let boss;
let embedder;
let heartbeat;
let reconcile;
// Todas as inferências compartilham um limite, mesmo entre filas diferentes.
let inferenceTail = Promise.resolve();
function serial(task) {
  const next = inferenceTail.then(task, task);
  inferenceTail = next.catch(() => {});
  return next;
}
async function close() {
  clearInterval(heartbeat);
  clearInterval(reconcile);
  await unlink("/tmp/wisen-worker-ready").catch(() => {});
  await boss?.stop({ graceful: true, timeout: 30000 });
  await inferenceTail;
  await embedder?.dispose();
  await pool.end();
}
try {
  await unlink("/tmp/wisen-worker-ready").catch(() => {});
  embedder = await createEmbedder(config.MODEL_CACHE_DIR);
  await embedder.embed("Verificação do modelo local.");
  boss = await createQueue(config.DATABASE_URL);
  const repository = workerRepository(pool, boss);
  const service = processingService(repository, embedder);
  for (const [kind, name] of Object.entries(QUEUES)) {
    await boss.work(
      name,
      { batchSize: 1, localConcurrency: 1, includeMetadata: true, pollingIntervalSeconds: 1 },
      async ([job]) => {
        try {
          const result =
            kind === "collect"
              ? await service.collect(job.data.sourceId)
              : await serial(() => service[kind](job.data.articleId ?? job.data.id));
          console.log(
            JSON.stringify({
              event: "job-completed",
              queue: name,
              id: job.id,
              ...(kind === "article" ? result : {}),
            }),
          );
        } catch (error) {
          const final = job.retryCount >= job.retryLimit;
          if (kind === "article")
            await repository.articleStatus(
              job.data.articleId,
              final ? "failed" : "pending",
              "Falha de processamento; consulte logs do worker",
            );
          if (kind === "search")
            await repository.searchStatus(
              job.data.id,
              final ? "failed" : "pending",
              final ? "Não foi possível concluir a busca" : null,
            );
          if (kind === "collect")
            await repository.sourceError(
              job.data.sourceId,
              "Falha na coleta; consulte logs do worker",
            );
          console.error(
            JSON.stringify({
              event: "job-failed",
              queue: name,
              id: job.id,
              retry: job.retryCount,
              message: error.message,
            }),
          );
          throw error;
        }
      },
    );
  }
  await repository.reconcileFailures();
  reconcile = setInterval(
    () => repository.reconcileFailures().catch((error) => console.error(error.message)),
    30000,
  );
  const beat = () =>
    writeFile("/tmp/wisen-worker-ready", String(Date.now())).catch((error) =>
      console.error(error.message),
    );
  await beat();
  heartbeat = setInterval(beat, 5000);
  console.log(
    JSON.stringify({
      event: "worker-ready",
      rssMiB: Math.round(process.memoryUsage().rss / 1048576),
      maxRssMiB: Math.round(process.resourceUsage().maxRSS / 1024),
    }),
  );
  for (const signal of ["SIGINT", "SIGTERM"])
    process.once(signal, () =>
      close().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
      }),
    );
} catch (error) {
  console.error(error.message);
  await close();
  process.exitCode = 1;
}
