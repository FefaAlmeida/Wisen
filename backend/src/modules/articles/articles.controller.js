import { z } from "zod";
import { paginationInput, uuidSchema } from "../../shared.js";

const article = z.object({
  id: uuidSchema,
  title: z.string(),
  url: z.url(),
  published_at: z.iso.datetime().nullable(),
  processing_status: z.enum(["pending", "processing", "processed", "pending_enrichment", "failed"]),
});

export function articlesController(app, service) {
  app.get(
    "/api/articles",
    {
      schema: {
        tags: ["Artigos"],
        querystring: paginationInput,
        response: {
          200: z.object({ data: z.array(article), page: z.number(), limit: z.number() }),
        },
      },
    },
    async (request) => ({ data: await service.list(request.query), ...request.query }),
  );
  app.get(
    "/api/articles/:id",
    {
      schema: {
        tags: ["Artigos"],
        params: z.object({ id: uuidSchema }),
        response: { 200: article.extend({ content: z.string().nullable() }) },
      },
    },
    (request) => service.find(request.params.id),
  );
}
