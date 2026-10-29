import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { env, pipeline } from "@huggingface/transformers";
import { MODEL, MODEL_VERSION } from "../../backend/src/shared.js";

export async function createEmbedder(cacheDir, { download = false } = {}) {
  if (!download) {
    const marker = await readFile(join(cacheDir, "wisen-model.json"), "utf8").catch(() => null);
    if (!marker || JSON.parse(marker).version !== MODEL_VERSION)
      throw new Error("Modelo não preparado. Execute npm run setup:model.");
  }
  env.allowRemoteModels = download;
  const modelPath = download ? MODEL.id : join(cacheDir, MODEL.id, MODEL.revision);
  const extractor = await pipeline("feature-extraction", modelPath, {
    ...(download ? { revision: MODEL.revision } : {}),
    dtype: MODEL.dtype,
    device: "cpu",
    cache_dir: cacheDir,
    local_files_only: !download,
    session_options: { intraOpNumThreads: 2, interOpNumThreads: 1 },
  });
  const embed = async (text, kind = "passage") => {
    if (extractor.tokenizer.encode(`${kind}: ${text}`).length > 512)
      throw new Error("Entrada excede 512 tokens");
    const output = await extractor(`${kind}: ${text}`, { pooling: "mean", normalize: true });
    const vector = Array.from(output.data);
    if (vector.length !== MODEL.dimensions || vector.some((value) => !Number.isFinite(value)))
      throw new Error("Saída inválida do modelo");
    return vector;
  };
  return {
    embed,
    chunks: (text) => splitTokens(text, extractor.tokenizer),
    dispose: () => extractor.dispose(),
    async markReady() {
      await mkdir(cacheDir, { recursive: true });
      await writeFile(
        join(cacheDir, "wisen-model.json"),
        JSON.stringify({ version: MODEL_VERSION, model: MODEL }),
      );
    },
  };
}

export function splitTokens(text, tokenizer) {
  const tokens = tokenizer.encode(text, { add_special_tokens: false });
  const chunks = [];
  let start = 0;
  while (start < tokens.length) {
    let end = Math.min(start + MODEL.chunkTokens, tokens.length);
    let content = tokenizer.decode(tokens.slice(start, end), { skip_special_tokens: true }).trim();
    // A decodificação e nova tokenização podem alterar o número de tokens.
    while (tokenizer.encode(`passage: ${content}`).length > 512 && end > start) {
      end--;
      content = tokenizer.decode(tokens.slice(start, end), { skip_special_tokens: true }).trim();
    }
    if (!content) throw new Error("Não foi possível dividir o conteúdo em trechos");
    chunks.push({ content, tokenCount: tokenizer.encode(`passage: ${content}`).length });
    if (end === tokens.length) break;
    // Normalmente end não muda. Se mudou, preserve a continuidade do texto.
    start = Math.max(start + 1, end - MODEL.overlapTokens);
  }
  return chunks;
}
