import assert from "node:assert/strict";
import test from "node:test";
import { processingService } from "../../ai/src/service.js";
import { MODEL_VERSION } from "../../backend/src/shared.js";

test("artigo já processado não repete download ou inferência", async () => {
  const service = processingService(
    { article: async () => ({ processing_status: "processed", embedding_version: MODEL_VERSION }) },
    {},
    () => assert.fail("download repetido"),
  );
  await service.article("article-id");
});

test("falha de inferência não persiste indexação parcial e retentativa reutiliza conteúdo", async () => {
  let failed = true;
  let saved;
  const states = [];
  const service = processingService(
    {
      article: async () => ({ content: "conteúdo já extraído", processing_status: "pending" }),
      articleStatus: async (_id, status) => states.push(status),
      saveEmbeddings: async (...args) => {
        saved = args;
      },
    },
    {
      chunks: () => [
        { content: "primeiro", tokenCount: 2 },
        { content: "segundo", tokenCount: 2 },
      ],
      embed: async (text) => {
        if (failed && text === "segundo") throw new Error("indisponível");
        return Array(384).fill(0.5);
      },
    },
    () => assert.fail("download desnecessário"),
  );
  await assert.rejects(service.article("article-id"), /indisponível/);
  assert.equal(saved, undefined);
  failed = false;
  await service.article("article-id");
  assert.equal(saved[0], "article-id");
  assert.equal(saved[3].length, 2);
  assert.deepEqual(states, ["processing", "processing"]);
});

test("busca concluída é idempotente e versão incompatível não inicia inferência", async () => {
  const repository = { search: async () => ({ status: "completed" }) };
  const service = processingService(repository, {});
  await service.search("search-id");
  repository.search = async () => ({ status: "pending", model_version: "outro-modelo" });
  await assert.rejects(service.search("search-id"), /não corresponde/);
});
