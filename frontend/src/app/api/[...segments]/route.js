const apiUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8080/api";
const allowedRoots = new Set(["articles", "auth", "health", "search"]);
const allowedAuthActions = new Set(["login", "logout", "register", "session"]);

async function forward(request, context) {
  const { segments } = await context.params;
  const [root, action] = segments ?? [];
  if (
    !allowedRoots.has(root) ||
    (root === "auth" && (segments.length !== 2 || !allowedAuthActions.has(action))) ||
    (root === "health" && segments.length !== 1) ||
    (root === "search" && segments.length > 2) ||
    (root === "articles" && segments.length > 2)
  ) {
    return Response.json({ message: "Rota não encontrada" }, { status: 404 });
  }
  if (
    (root === "auth" && action === "session" && request.method !== "GET") ||
    (root === "auth" && action !== "session" && request.method !== "POST") ||
    ((root === "articles" || root === "health") && request.method !== "GET")
  ) {
    return Response.json({ message: "Método não permitido" }, { status: 405 });
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
        ...(request.headers.get("x-real-ip")
          ? { "x-real-ip": request.headers.get("x-real-ip") }
          : {}),
        cookie: request.headers.get("cookie") ?? "",
      },
      body: request.method === "GET" ? undefined : await request.arrayBuffer(),
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
  const cookies = upstream.headers.getSetCookie?.() ?? [upstream.headers.get("set-cookie")];
  for (const cookie of cookies.filter(Boolean)) {
    headers.append("set-cookie", cookie);
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

export const GET = forward;
export const POST = forward;
