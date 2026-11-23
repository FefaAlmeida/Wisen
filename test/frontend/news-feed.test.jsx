import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PaginaExplorar from "../../frontend/src/components/demo/paginaExplorar";
import HomeFeed from "../../frontend/src/components/platform/homeFeed";

vi.mock("@/components/app/appTopBar", () => ({ AppTopBar: () => null }));
vi.mock("@/components/sidebar", () => ({ default: () => null }));
vi.mock("@/components/footer", () => ({ Footer: () => null }));
vi.mock("@/components/homeCliente/connectionsBackground", () => ({
  ConnectionsBackground: () => null,
}));

const item = {
  id: "evento-1",
  title: "Uma notícia compartilhada",
  summary: "Resumo da notícia",
  topics: ["Economia"],
  updated_at: "2026-11-22",
  source_count: 2,
  recommendation_reason: "Seu interesse em Economia",
  reading_status: "reading",
};

describe.each([
  ["Início", HomeFeed],
  ["Explorar", PaginaExplorar],
])("card de notícias em %s", (_name, Feed) => {
  let dismissed;
  let failDismiss;

  beforeEach(() => {
    dismissed = false;
    failDismiss = false;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) => {
        if (url === "/api/feed/interactions") {
          if (failDismiss) throw new Error("Sem conexão");
          dismissed = true;
          return { ok: true, json: async () => ({ saved: true }) };
        }
        return {
          ok: true,
          json: async () =>
            url === "/api/auth/profile"
              ? { preferences: { interests: [] } }
              : { items: dismissed ? [] : [item] },
        };
      }),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("abre pelo título e registra desinteresse, atualizando o feed", async () => {
    const user = userEvent.setup();
    render(<Feed />);
    expect(await screen.findByRole("link", { name: item.title })).toHaveAttribute(
      "href",
      "/paginaEvento?id=evento-1",
    );
    expect(screen.queryByRole("link", { name: /Ler notícia/ })).not.toBeInTheDocument();
    expect(screen.getByText("2 fonte(s)")).toBeInTheDocument();
    expect(screen.getByText("Continuar lendo")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Não tenho interesse" });
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    await user.click(button);
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/feed/interactions",
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
        }),
      ),
    );
    const [, options] = fetch.mock.calls.find(([url]) => url === "/api/feed/interactions");
    expect(JSON.parse(options.body)).toEqual({
      eventId: item.id,
      type: "dismiss",
      requestId: expect.any(String),
    });
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: item.title })).not.toBeInTheDocument(),
    );
  });

  it("mantém a notícia e permite tentar novamente quando salvar falha", async () => {
    failDismiss = true;
    const user = userEvent.setup();
    render(<Feed />);
    await user.click(await screen.findByRole("button", { name: "Não tenho interesse" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao salvar preferência");
    expect(screen.getByRole("link", { name: item.title })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Não tenho interesse" })).toBeEnabled();
    failDismiss = false;
    await user.click(screen.getByRole("button", { name: "Não tenho interesse" }));
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: item.title })).not.toBeInTheDocument(),
    );
  });
});
