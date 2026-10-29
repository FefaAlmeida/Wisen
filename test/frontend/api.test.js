import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, requisitar } from "../../frontend/src/services/api.js";

describe("requisitar", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("usa same-origin, envia JSON e retorna o payload", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { name: "Ana" } }),
    });

    await expect(
      requisitar("/auth/login", {
        method: "POST",
        body: { email: "ana@example.test", password: "senha" },
      }),
    ).resolves.toEqual({ user: { name: "Ana" } });

    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ana@example.test", password: "senha" }),
      }),
    );
  });

  it("representa resposta 204 como null", async () => {
    fetch.mockResolvedValue({ ok: true, status: 204 });
    await expect(requisitar("/auth/logout", { method: "POST" })).resolves.toBeNull();
  });

  it("preserva status e código da API em erros HTTP", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ code: "UNAUTHORIZED", message: "Faça login" }),
    });

    await expect(requisitar("/auth/session")).rejects.toMatchObject({
      name: "ApiError",
      message: "Faça login",
      status: 401,
      code: "UNAUTHORIZED",
    });
    await expect(requisitar("/auth/session")).rejects.toBeInstanceOf(ApiError);
  });

  it("usa mensagem padrão quando a API não retorna JSON", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error();
      },
    });
    await expect(requisitar("/articles")).rejects.toMatchObject({
      message: "Não foi possível completar a solicitação.",
      status: 502,
      code: "HTTP_ERROR",
    });
  });
});
