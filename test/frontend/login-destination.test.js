import { describe, expect, it } from "vitest";
import { loginDestination } from "../../frontend/src/lib/auth.js";

describe("destino após login", () => {
  it("preserva o destino interno e parâmetros", () => {
    expect(loginDestination("/paginaGuardados?aba=eventos#lista", "http://localhost", "user")).toBe(
      "/paginaGuardados?aba=eventos#lista",
    );
  });
  it.each([null, "http://[", "https://evil.test/", "//evil.test", "javascript:alert(1)"])(
    "usa destino seguro com next=%s",
    (value) => {
      expect(loginDestination(value, "http://localhost", "user")).toBe("/paginaInicialCliente");
      expect(loginDestination(value, "http://localhost", "admin")).toBe("/paginaInicioAdm");
    },
  );
});
