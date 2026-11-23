import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../../frontend/src/app/api/[...segments]/route.js";

describe("encaminhamento da consulta de e-mail", () => {
  afterEach(() => vi.unstubAllGlobals());

  const context = { params: Promise.resolve({ segments: ["auth", "check-email"] }) };

  it.each([
    ["locations", "options"],
    ["locations", "countries"],
    ["locations", "countries", "BR", "states"],
  ])("encaminha somente consultas ao catálogo geográfico: %j", async (...segments) => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({}));
    vi.stubGlobal("fetch", fetchMock);
    const routeContext = { params: Promise.resolve({ segments }) };
    const response = await GET(
      new Request(`http://localhost/api/${segments.join("/")}`),
      routeContext,
    );
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(
      (
        await POST(
          new Request(`http://localhost/api/${segments.join("/")}`, { method: "POST" }),
          routeContext,
        )
      ).status,
    ).toBe(405);
    expect(
      (
        await GET(new Request("http://localhost/api/locations/cities"), {
          params: Promise.resolve({ segments: ["locations", "cities"] }),
        })
      ).status,
    ).toBe(404);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("encaminha POST ao backend e preserva resposta e limite de tentativas", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ exists: true }));
    vi.stubGlobal("fetch", fetchMock);
    const request = new Request("http://localhost/api/auth/check-email", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost" },
      body: JSON.stringify({ email: "ana@example.test" }),
    });
    const response = await POST(request, context);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ exists: true });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/check-email$/),
      expect.objectContaining({ method: "POST", cache: "no-store" }),
    );
    fetchMock.mockResolvedValueOnce(
      Response.json(
        { message: "Limite atingido" },
        { status: 429, headers: { "retry-after": "60" } },
      ),
    );
    const limited = await POST(new Request(request.url, { method: "POST", body: "{}" }), context);
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("60");
  });

  it("recusa GET e origem diferente sem consultar backend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await GET(new Request("http://localhost/api/auth/check-email"), context)).status).toBe(
      405,
    );
    expect(
      (
        await POST(
          new Request("http://localhost/api/auth/check-email", {
            method: "POST",
            headers: { origin: "https://example.test" },
          }),
          context,
        )
      ).status,
    ).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
