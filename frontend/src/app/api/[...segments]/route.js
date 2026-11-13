const apiUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8080/api";
const platformMethods = {
  feed: ["GET"],
  events: ["GET"],
  reading: ["GET"],
  concepts: ["GET"],
  discover: ["GET"],
  knowledge: ["GET"],
  reviews: ["GET", "POST"],
  interactions: ["POST"],
  preferences: ["GET", "PUT"],
  saved: ["GET", "POST", "DELETE"],
  generations: ["GET", "POST"],
  account: ["GET", "POST", "DELETE"],
  admin: ["GET", "POST"],
};
const allowedRoots = new Set([
  "categories",
  "articles",
  "auth",
  "health",
  "search",
  ...Object.keys(platformMethods),
]);

// 1. Incluído "profile" nas ações permitidas de auth
const allowedAuthActions = new Set([
  "login",
  "logout",
  "register",
  "session",
  "profile",
  "avatar",
  "password",
]);

async function forward(request, context) {
  const { segments } = await context.params;
  const [root, action] = segments ?? [];

  if (
    !allowedRoots.has(root) ||
    (root === "auth" && (segments.length !== 2 || !allowedAuthActions.has(action))) ||
    (root === "categories" && segments.length !== 1) ||
    (root === "health" && segments.length !== 1) ||
    (root === "search" && segments.length > 2) ||
    (root === "articles" && segments.length > 2)
  ) {
    return Response.json({ message: "Rota não encontrada" }, { status: 404 });
  }

  // 2. Restringe os métodos aceitos por recurso.
  const isMethodAllowed =
    platformMethods[root]?.includes(request.method) ||
    (root === "auth" && action === "session" && request.method === "GET") ||
    (root === "auth" && action === "profile" && request.method === "GET") ||
    (root === "auth" && action === "profile" && request.method === "PUT") ||
    (root === "auth" && action === "avatar" && request.method === "PUT") ||
    (root === "auth" && action === "password" && request.method === "PUT") ||
    (root === "auth" &&
      ["login", "logout", "register"].includes(action) &&
      request.method === "POST") ||
    (root === "categories" && request.method === "GET") ||
    (root === "admin" && action === "categories" && ["GET", "PUT"].includes(request.method)) ||
    ((root === "articles" || root === "health") && request.method === "GET") ||
    (root === "search" && request.method === "GET") ||
    (root === "search" && segments.length === 1 && request.method === "POST");

  if (!isMethodAllowed) {
    return Response.json({ message: "Método não permitido" }, { status: 405 });
  }

  if (!["GET", "HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (
      origin &&
      new URL(origin).host !== (request.headers.get("host") || new URL(request.url).host)
    )
      return Response.json({ message: "Origem não permitida" }, { status: 403 });
  }
  const path = segments.map(encodeURIComponent).join("/");
  const query = new URL(request.url).search;
  let upstream;

  try {
    upstream = await fetch(`${apiUrl}/${path}${query}`, {
      method: request.method,
      headers: {
        ...(request.headers.get("content-type")
          ? { "content-type": request.headers.get("content-type") }
          : {}),
        ...(request.headers.get("authorization")
          ? { authorization: request.headers.get("authorization") }
          : {}),
        ...(request.headers.get("x-forwarded-for")
          ? { "x-forwarded-for": request.headers.get("x-forwarded-for") }
          : {}),
        cookie: request.headers.get("cookie") ?? "",
      },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return Response.json({ message: "Não foi possível acessar o servidor." }, { status: 503 });
  }

  const headers = new Headers();
  headers.set("cache-control", "no-store");
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  for (const name of ["retry-after", "allow", "content-disposition"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  const cookies = upstream.headers.getSetCookie?.() ?? [upstream.headers.get("set-cookie")];
  for (const cookie of cookies.filter(Boolean)) {
    headers.append("set-cookie", cookie);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}

// 3. Exportado explicitamente o verbo PUT para o Next.js aceitar a requisição
export const GET = forward;
export const POST = forward;
export const PUT = forward;

export const DELETE = forward;
