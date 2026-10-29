import { z } from "zod";
import { searchInput, uuidSchema } from "../../shared.js";

export function searchController(app, service) {
  app.post(
    "/api/search",
    {
      preHandler: app.authenticateSearch,
      schema: {
        tags: ["Busca"],
        summary: "Agenda busca semântica no worker",
        body: searchInput,
        response: { 202: z.object({ id: uuidSchema, status: z.literal("pending") }) },
      },
    },
    async (request, reply) =>
      reply.code(202).send(await service.create(request.body, request.user?.id ?? null)),
  );
  app.get(
    "/api/search/:id",
    {
      preHandler: app.authenticateSearch,
      schema: {
        tags: ["Busca"],
        params: z.object({ id: uuidSchema }),
        response: {
          200: z.object({
            id: uuidSchema,
            status: z.enum(["pending", "processing", "completed", "failed"]),
            error: z.string().nullable(),
            results: z
              .array(
                z.object({
                  id: uuidSchema,
                  title: z.string(),
                  url: z.string(),
                  excerpt: z.string(),
                  score: z.number(),
                }),
              )
              .nullable(),
          }),
        },
      },
    },
    (request) => service.find(request.params.id, request.user?.id, request.isOperations),
  );
}
