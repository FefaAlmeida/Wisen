import { createHash } from "node:crypto";
import { MODEL_VERSION, SOURCE } from "@wisen/shared";
import { downloadText, extractArticle, parseFeed } from "./source.js";

export function processingService(repository, embedder, download = downloadText) {
  return {
    async collect(sourceId) {
      const source = await repository.source(sourceId);
      if (!source?.enabled) return;
      if (source.feed_url !== SOURCE.feed) throw new Error("Fonte ainda não suportada");
      const items = await parseFeed(await download(source.feed_url, { feed: true }));
      return repository.saveFeed(sourceId, items);
    },
    async article(id) {
      const article = await repository.article(id);
      if (
        !article ||
        (article.processing_status === "processed" && article.embedding_version === MODEL_VERSION)
      )
        return;
      await repository.articleStatus(id, "processing");
      const content = article.content || extractArticle(await download(article.url));
      const chunks = embedder.chunks(content);
      const start = performance.now();
      for (const chunk of chunks) chunk.vector = await embedder.embed(chunk.content);
      const hash = createHash("sha256").update(content).digest("hex");
      await repository.saveEmbeddings(
        id,
        content,
        hash,
        chunks,
        Math.round(performance.now() - start),
      );
      return {
        chunks: chunks.length,
        elapsedMs: Math.round(performance.now() - start),
        rssMiB: Math.round(process.memoryUsage().rss / 1048576),
        maxRssMiB: Math.round(process.resourceUsage().maxRSS / 1024),
      };
    },
    async search(id) {
      const request = await repository.search(id);
      if (!request || request.status === "completed") return;
      if (request.model_version !== MODEL_VERSION)
        throw new Error("Versão do modelo da busca não corresponde ao worker");
      await repository.searchStatus(id, "processing");
      const vector = await embedder.embed(request.query, "query");
      return repository.completeSearch(id, vector, request.result_limit);
    },
  };
}
