import { z } from "zod";

const sessionCookie = "wisen_session";
const cookieOptions = (config) => ({
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  role: z.enum(["user", "admin"]),
});
const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
});
const loginSchema = credentialsSchema.extend({ remember: z.boolean().optional().default(false) });

export function authController(app, service, config) {
  app.decorateRequest("user", null);
  app.decorate("loadUser", async (request) => service.findSession(request.cookies[sessionCookie]));
  app.decorate("authenticate", async (request, reply) => {
    const user = await app.loadUser(request);
    if (!user) {
      return reply.code(401).send({ code: "UNAUTHORIZED", message: "Faça login para continuar" });
    }
    request.user = user;
  });

  app.post(
    "/api/auth/register",
    {
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
      schema: {
        tags: ["Autenticação"],
        body: credentialsSchema.extend({ name: z.string().trim().min(2).max(120) }),
        response: { 201: z.object({ user: userSchema }) },
      },
    },
    async (request, reply) => {
      const { user, token } = await service.register(request.body);
      reply.setCookie(sessionCookie, token, {
        ...cookieOptions(config),
        maxAge: 30 * 24 * 60 * 60,
      });
      return reply.code(201).send({ user });
    },
  );
  app.post(
    "/api/auth/login",
    {
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
      schema: {
        tags: ["Autenticação"],
        body: loginSchema,
        response: { 200: z.object({ user: userSchema }) },
      },
    },
    async (request, reply) => {
      const { user, token, maxAge } = await service.login(request.body);
      reply.setCookie(sessionCookie, token, {
        ...cookieOptions(config),
        maxAge,
      });
      return { user };
    },
  );
  app.get(
    "/api/auth/session",
    {
      preHandler: app.authenticate,
      schema: { tags: ["Autenticação"], response: { 200: z.object({ user: userSchema }) } },
    },
    (request) => ({ user: request.user }),
  );
  app.post(
    "/api/auth/logout",
    { schema: { tags: ["Autenticação"], response: { 204: z.null() } } },
    async (request, reply) => {
      await service.logout(request.cookies[sessionCookie]);
      reply.clearCookie(sessionCookie, cookieOptions(config));
      return reply.code(204).send();
    },
  );
}
