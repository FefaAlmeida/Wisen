export const publicDemoPrefix = "/demo";
export const publicDemoHome = `${publicDemoPrefix}/paginaInicialCliente`;

export function isPublicDemoPath(pathname) {
  return pathname.startsWith(`${publicDemoPrefix}/`);
}
