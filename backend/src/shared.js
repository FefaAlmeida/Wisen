import { z } from "zod";

export const MODEL = Object.freeze({
  id: "Xenova/multilingual-e5-small",
  revision: "761b726dd34fb83930e26aab4e9ac3899aa1fa78",
  dtype: "int8",
  dimensions: 384,
  chunkTokens: 430,
  overlapTokens: 50,
});
export const MODEL_VERSION = `${MODEL.id}@${MODEL.revision}:${MODEL.dtype}:chunks-v1`;
export const SOURCE = Object.freeze({
  slug: "agencia-brasil-economia",
  name: "Agência Brasil — Economia",
  feed: "https://agenciabrasil.ebc.com.br/rss/economia/feed.xml",
  origin: "https://agenciabrasil.ebc.com.br",
});
export const QUEUES = Object.freeze({
  collect: "collect-source",
  article: "process-article",
  search: "semantic-search",
});

export const uuidSchema = z.uuid();
export const searchInput = z.object({
  query: z.string().trim().min(3).max(500),
  limit: z.number().int().min(1).max(20).default(5),
});
export const paginationInput = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export function configuration(env = process.env) {
  return z
    .object({
      NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
      DATABASE_URL: z.url().refine((url) => /^postgres(ql)?:/.test(url), "Use uma URL PostgreSQL"),
      PORT: z.coerce.number().int().min(1).max(65535).default(8080),
      FRONTEND_URL: z.url().default("http://localhost:3000"),
      MODEL_CACHE_DIR: z.string().default("/models"),
      OPERATIONS_TOKEN: z.string().min(32).optional(),
    })
    .superRefine((config, ctx) => {
      if (config.NODE_ENV === "production" && !config.OPERATIONS_TOKEN) {
        ctx.addIssue({
          code: "custom",
          path: ["OPERATIONS_TOKEN"],
          message: "Defina um token de operação em produção",
        });
      }
    })
    .parse(env);
}
