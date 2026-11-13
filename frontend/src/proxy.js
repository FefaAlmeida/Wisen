import { NextResponse } from "next/server";
import { loginDestination, routeRole } from "./lib/auth";

const apiUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8080/api";
export async function proxy(request) {
  const requiredRole = routeRole(request.nextUrl.pathname);
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
    let session;
    try {
      session = await response.json();
      if (!["user", "admin"].includes(session?.user?.role)) throw new Error("Invalid role");
    } catch {
      return NextResponse.json(
        { message: "Não foi possível verificar as permissões da conta." },
        { status: 503 },
      );
    }

    if (requiredRole && session.user.role !== requiredRole) {
      return NextResponse.redirect(
        new URL(loginDestination(null, request.nextUrl.origin, session.user.role), request.url),
      );
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
    "/paginaSessaoRevisao/:path*",
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
