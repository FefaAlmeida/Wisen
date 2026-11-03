import { NextResponse } from "next/server";

const apiUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8080/api";

export async function proxy(request) {
  let response;
  try {
    const forwardedIp = request.headers.get("x-real-ip");
    response = await fetch(`${apiUrl}/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        ...(forwardedIp ? { "x-real-ip": forwardedIp } : {}),
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
    const adminPaths = ["/paginaInicioAdm", "/paginaGestaoFonteAdm", "/paginaGestaoUsuariosAdm"];
    const isAdminRoute = adminPaths.some(
      (path) =>
        request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
    );

    if (isAdminRoute) {
      const session = await response.json().catch(() => null);
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
    "/paginaConceito/:path*",
    "/paginaConhecimento/:path*",
    "/paginaEvento/:path*",
    "/paginaGuardados/:path*",
    "/paginaRevisoes/:path*",
    "/paginaPerfil/:path*",
    "/paginaInicioAdm/:path*",
    "/paginaGestaoFonteAdm/:path*",
    "/paginaGestaoUsuariosAdm/:path*",
  ],
};
