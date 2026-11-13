import { NextResponse } from "next/server";

const apiUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8080/api";
const adminRoutes = [
  "/paginaInicioAdm",
  "/paginaCuidadoriaEventosAdm",
  "/paginaGestaoUsuariosAdm",
  "/paginaGestaoFonteAdm",
  "/paginaGestaoCategoriasAdm",
  "/paginaMonitorIa",
];

export async function proxy(request) {
  const isAdminRoute = adminRoutes.some(
    (route) =>
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`),
  );
  let response;
  try {
    const forwardedIp = request.headers.get("x-forwarded-for");
    response = await fetch(`${apiUrl}/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        ...(forwardedIp ? { "x-forwarded-for": forwardedIp } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível verificar sua sessão." },
      { status: 503 },
    );
  }

  if (response.ok) {
    if (isAdminRoute) {
      let session;
      try {
        session = await response.json();
      } catch {
        return NextResponse.json(
          { message: "Não foi possível verificar as permissões da conta." },
          { status: 503 },
        );
      }

      if (session?.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/paginaInicialCliente", request.url));
      }
    }

    return NextResponse.next();
  }
  if (response.status !== 401 && response.status !== 403) {
    return NextResponse.json(
      { message: "Não foi possível verificar sua sessão." },
      { status: 503 },
    );
  }

  const loginUrl = new URL("/paginaLogin", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/paginaInicialCliente/:path*",
    "/paginaBiblioteca/:path*",
    "/paginaExplorar/:path*",
    "/paginaConceito/:path*",
    "/paginaConhecimento/:path*",
    "/paginaEvento/:path*",
    "/paginaGuardados/:path*",
    "/paginaRevisoes/:path*",
    "/paginaPerfil/:path*",
    "/artigo/:path*",
    "/paginaInicioAdm/:path*",
    "/paginaCuidadoriaEventosAdm/:path*",
    "/paginaGestaoUsuariosAdm/:path*",
    "/paginaGestaoFonteAdm/:path*",
    "/paginaGestaoCategoriasAdm/:path*",
    "/paginaMonitorIa/:path*",
  ],
};
