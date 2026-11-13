import { describe, expect, it } from "vitest";
import { loginDestination } from "../../frontend/src/lib/auth.js";

describe("destino após login", () => {
  it("preserva o destino interno e parâmetros", () => {
    expect(loginDestination("/paginaGuardados?aba=eventos#lista", "http://localhost", "user")).toBe(
      "/paginaGuardados?aba=eventos#lista",
    );
  });
  it("preserva o destino administrativo e seus parâmetros", () => {
    expect(loginDestination("/paginaGestaoUsuariosAdm?pagina=2", "http://localhost", "admin")).toBe(
      "/paginaGestaoUsuariosAdm?pagina=2",
    );
  });
  it.each(["/paginaInicialCliente", "/paginaPerfil", "/paginaSessaoRevisao/detalhes"])(
    "admin não retorna à área de cliente: %s",
    (path) => expect(loginDestination(path, "http://localhost", "admin")).toBe("/paginaInicioAdm"),
  );
  it.each(["/paginaInicioAdm", "/paginaGestaoCategoriasAdm/detalhes"])(
    "cliente não retorna à área administrativa: %s",
    (path) =>
      expect(loginDestination(path, "http://localhost", "user")).toBe("/paginaInicialCliente"),
  );
  it.each([
    null,
    "/paginaLogin",
    "/api/auth/logout",
    "/paginaInicioAdm-falso",
    "http://[",
    "https://evil.test/",
    "//evil.test",
    "javascript:alert(1)",
  ])("usa destino seguro com next=%s", (value) => {
    expect(loginDestination(value, "http://localhost", "user")).toBe("/paginaInicialCliente");
    expect(loginDestination(value, "http://localhost", "admin")).toBe("/paginaInicioAdm");
  });
});
