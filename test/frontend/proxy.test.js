import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "../../frontend/src/proxy.js";

const adminRoutes = [
  "/paginaInicioAdm",
  "/paginaCuidadoriaEventosAdm",
  "/paginaGestaoUsuariosAdm",
  "/paginaGestaoFonteAdm",
  "/paginaGestaoCategoriasAdm",
  "/paginaMonitorIa",
];

function request(path) {
  const url = new URL(path, "http://localhost");
  return { url: url.href, nextUrl: url, headers: new Headers({ cookie: "wisen_session=test" }) };
}

describe("proteção das rotas após integração", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it.each(adminRoutes)("exige papel admin em %s e em suas subrotas", async (path) => {
    expect(config.matcher).toContain(`${path}/:path*`);
    fetch.mockResolvedValue({ ok: true, json: async () => ({ user: { role: "user" } }) });
    for (const route of [path, `${path}/detalhes`]) {
      const response = await proxy(request(route));
      expect(response.headers.get("location")).toBe("http://localhost/paginaInicialCliente");
    }
    fetch.mockResolvedValue({ ok: true, json: async () => ({ user: { role: "admin" } }) });
    expect((await proxy(request(path))).headers.get("x-middleware-next")).toBe("1");
  });

  it("preserva o destino no login de quem não tem sessão", async () => {
    fetch.mockResolvedValue({ ok: false, status: 401 });
    const response = await proxy(request("/paginaGestaoUsuariosAdm?pagina=2"));
    const location = new URL(response.headers.get("location"));
    expect(location.pathname).toBe("/paginaLogin");
    expect(location.searchParams.get("next")).toBe("/paginaGestaoUsuariosAdm?pagina=2");
  });

  it("retorna indisponibilidade quando não consegue validar a sessão", async () => {
    fetch.mockRejectedValue(new Error("offline"));
    expect((await proxy(request(adminRoutes[0]))).status).toBe(503);
    fetch.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("invalid JSON");
      },
    });
    expect((await proxy(request(adminRoutes[0]))).status).toBe(503);
  });

  it.each([null, {}, { user: { role: "unknown" } }])(
    "rejeita sessão inválida: %j",
    async (session) => {
      fetch.mockResolvedValue({ ok: true, json: async () => session });
      for (const path of [adminRoutes[0], "/paginaInicialCliente"]) {
        expect((await proxy(request(path))).status).toBe(503);
      }
    },
  );

  it.each(
    config.matcher.filter((path) => !adminRoutes.some((route) => path === `${route}/:path*`)),
  )("restringe %s e subrotas a clientes", async (matcher) => {
    const path = matcher.replace("/:path*", "");
    fetch.mockResolvedValue({ ok: true, json: async () => ({ user: { role: "admin" } }) });
    for (const route of [path, `${path}/detalhes?aba=1`]) {
      expect((await proxy(request(route))).headers.get("location")).toBe(
        "http://localhost/paginaInicioAdm",
      );
    }
    fetch.mockResolvedValue({ ok: true, json: async () => ({ user: { role: "user" } }) });
    expect((await proxy(request(path))).headers.get("x-middleware-next")).toBe("1");
  });

  it("protege a sessão de revisão para visitantes", async () => {
    expect(config.matcher).toContain("/paginaSessaoRevisao/:path*");
    fetch.mockResolvedValue({ ok: false, status: 401 });
    const response = await proxy(request("/paginaSessaoRevisao"));
    expect(new URL(response.headers.get("location")).pathname).toBe("/paginaLogin");
  });
});
