import { timingSafeEqual } from "node:crypto";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { articlesController } from "./modules/articles/articles.controller.js";
import { articlesRepository } from "./modules/articles/articles.repository.js";
import { articlesService } from "./modules/articles/articles.service.js";
import { searchController } from "./modules/search/search.controller.js";
import { searchRepository } from "./modules/search/search.repository.js";
import { searchService } from "./modules/search/search.service.js";

export async function buildApp({ pool, boss, config, logger = true }) {
  const app = Fastify({
    logger: logger
      ? { redact: ["req.headers.authorization", "req.headers.cookie"], level: "info" }
      : false,
    bodyLimit: 16384,
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(cors, { origin: config.FRONTEND_URL });
  await app.register(helmet);
  await app.register(rateLimit, { max: 60, timeWindow: "1 minute" });
  await app.register(swagger, {
    openapi: { info: { title: "Wisen API", version: "0.1.0" } },
    transform: jsonSchemaTransform,
  });
  if (config.NODE_ENV !== "production") await app.register(swaggerUi, { routePrefix: "/docs" });
  // Até existir autenticação de usuários, os endpoints de busca são operacionais.
  app.addHook("onRequest", async (request, reply) => {
    if (!request.url.startsWith("/api/search") || !config.OPERATIONS_TOKEN) return;
    const expected = Buffer.from(`Bearer ${config.OPERATIONS_TOKEN}`);
    const actual = Buffer.from(request.headers.authorization ?? "");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return reply
        .code(401)
        .send({ code: "UNAUTHORIZED", message: "Token de operação obrigatório" });
    }
  });
  app.setErrorHandler((error, request, reply) => {
    const status = error.validation
      ? 400
      : error.statusCode >= 400 && error.statusCode < 500
        ? error.statusCode
        : 500;
    if (status === 500) request.log.error({ err: error }, "Falha ao atender requisição");
    reply.code(status).send({
      code:
        status === 400 ? "VALIDATION_ERROR" : status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message:
        status === 500
          ? "Erro interno no servidor"
          : status === 400
            ? "Dados da requisição inválidos"
            : error.message,
    });
  });
  app.get(
    "/api/health",
    {
      schema: {
        tags: ["Saúde"],
        response: { 200: z.object({ status: z.literal("ok"), database: z.literal("ok") }) },
      },
    },
    async () => {
      await pool.query("SELECT 1");
      return { status: "ok", database: "ok" };
    },
  );
  articlesController(app, articlesService(articlesRepository(pool)));
  searchController(app, searchService(searchRepository(pool, boss)));
  return app;
}
