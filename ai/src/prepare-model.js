import { createEmbedder } from "./embeddings.js";

const start = performance.now();
const embedder = await createEmbedder(process.env.MODEL_CACHE_DIR || "/models", { download: true });
try {
  await embedder.embed("A taxa de juros influencia a inflação.");
  await embedder.markReady();
  console.log(
    JSON.stringify({
      event: "model-ready",
      dimensions: 384,
      elapsedMs: Math.round(performance.now() - start),
      rssMiB: Math.round(process.memoryUsage().rss / 1048576),
      maxRssMiB: Math.round(process.resourceUsage().maxRSS / 1024),
    }),
  );
} finally {
  await embedder.dispose();
}
