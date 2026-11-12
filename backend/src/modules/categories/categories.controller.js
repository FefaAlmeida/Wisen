import { z } from "zod";

const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  available: z.boolean(),
});
const categoriesResponse = z.object({ categories: z.array(categorySchema) });
const availabilitySchema = z
  .object({
    categories: z
      .array(z.object({ id: z.uuid(), available: z.boolean() }).strict())
      .min(1)
      .max(50),
  })
  .strict()
  .refine(
    ({ categories }) =>
      new Set(categories.map((category) => category.id)).size === categories.length,
    "Cada categoria pode aparecer uma única vez",
  );

export function categoriesController(app, service) {
  const requireAdmin = async (request, reply) => {
    await app.authenticate(request, reply);
    if (reply.sent) return;
    if (request.user.role !== "admin") {
      return reply
        .code(403)
        .send({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
    }
  };

  app.get(
    "/api/categories",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Categorias"],
        response: { 200: categoriesResponse },
      },
    },
    async () => ({ categories: await service.listAvailable() }),
  );

  app.get(
    "/api/admin/categories",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Administração"],
        response: { 200: categoriesResponse },
      },
    },
    async () => ({ categories: await service.listAll() }),
  );

  app.put(
    "/api/admin/categories",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Administração"],
        body: availabilitySchema,
        response: { 200: categoriesResponse },
      },
    },
    async (request) => ({
      categories: await service.updateAvailability(request.body.categories),
    }),
  );
}
