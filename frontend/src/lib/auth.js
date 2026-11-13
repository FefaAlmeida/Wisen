const adminRoutes = [
  "/paginaInicioAdm",
  "/paginaCuidadoriaEventosAdm",
  "/paginaGestaoUsuariosAdm",
  "/paginaGestaoFonteAdm",
  "/paginaGestaoCategoriasAdm",
  "/paginaMonitorIa",
];
const clientRoutes = [
  "/paginaInicialCliente",
  "/paginaBiblioteca",
  "/paginaExplorar",
  "/paginaConceito",
  "/paginaConhecimento",
  "/paginaEvento",
  "/paginaGuardados",
  "/paginaRevisoes",
  "/paginaSessaoRevisao",
  "/paginaPerfil",
  "/artigo",
];

export function routeRole(pathname) {
  const matches = (route) => pathname === route || pathname.startsWith(`${route}/`);
  if (adminRoutes.some(matches)) return "admin";
  if (clientRoutes.some(matches)) return "user";
  return null;
}

export function loginDestination(requestedPath, origin, role) {
  const fallback = role === "admin" ? "/paginaInicioAdm" : "/paginaInicialCliente";
  if (!requestedPath) return fallback;
  try {
    const destination = new URL(requestedPath, origin);
    return destination.origin === origin && routeRole(destination.pathname) === role
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
