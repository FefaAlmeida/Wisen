export function loginDestination(requestedPath, origin, role) {
  const fallback = role === "admin" ? "/paginaInicioAdm" : "/paginaInicialCliente";
  if (!requestedPath) return fallback;
  try {
    const destination = new URL(requestedPath, origin);
    return destination.origin === origin
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
