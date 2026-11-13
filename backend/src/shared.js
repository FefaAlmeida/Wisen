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
export const SOURCES = Object.freeze([
  SOURCE,
  {
    slug: "agencia-camara-economia",
    name: "Agência Câmara — Economia",
    feed: "https://www.camara.leg.br/noticias/rss/dinamico/ECONOMIA",
    origin: "https://www.camara.leg.br",
  },
]);
export const QUEUES = Object.freeze({
  collect: "collect-source",
  article: "process-article",
  search: "semantic-search",
  generate: "generate-content",
  mail: "send-account-mail",
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
      OPENAI_API_KEY: z.string().default(""),
      AI_PROVIDER: z.enum(["auto", "mock", "openai"]).default("auto"),
      AI_MODEL: z.string().default("gpt-6-luna"),
      AI_INPUT_USD_PER_MILLION: z.coerce.number().nonnegative().default(0.1),
      AI_OUTPUT_USD_PER_MILLION: z.coerce.number().nonnegative().default(0.5),
      AI_USD_BRL: z.coerce.number().positive().default(6),
      AI_COST_MARGIN: z.coerce.number().min(1).default(1.2),
      AI_MONTHLY_LIMIT_BRL: z.coerce.number().nonnegative().default(80),
      AI_DAILY_USER_LIMIT: z.coerce.number().int().positive().default(30),
      AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(1024).max(16000).default(4096),
      AI_TIMEOUT_MS: z.coerce.number().int().positive().default(90000),
      COLLECTION_DAILY_LIMIT: z.coerce.number().int().positive().default(20),
      COLLECTION_INTERVAL_MINUTES: z.coerce.number().int().min(5).default(30),
      RESEND_API_KEY: z.string().default(""),
      EMAIL_FROM: z.string().default(""),
      EMAIL_DAILY_LIMIT: z.coerce.number().int().positive().default(100),
      PUBLIC_DOMAIN: z.string().default("localhost"),
      OPERATIONS_TOKEN: z.string().min(32).optional(),
      TRUST_PROXY: z
        .string()
        .default("")
        .transform((value) =>
          value
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
        ),
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
