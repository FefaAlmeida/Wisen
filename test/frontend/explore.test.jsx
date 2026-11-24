import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PaginaExplorar from "../../frontend/src/app/paginaExplorar/page.jsx";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("@/components/homeCliente/menuPerfil", () => ({ default: () => null }));
vi.mock("@/components/sidebar", () => ({ default: () => null }));
vi.mock("@/components/homeCliente/connectionsBackground", () => ({
  ConnectionsBackground: ({ fadeTop }) => (
    <div data-testid="connections-background" data-fade-top={fadeTop} />
  ),
}));
describe("filtros da página Explorar integrada", () => {
  beforeEach(() =>
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) => ({
        ok: true,
        json: async () =>
          url === "/api/categories"
            ? { categories: [{ name: "Economia" }, { name: "Tecnologia" }] }
            : url === "/api/account/status"
              ? { aiProvider: "openai", user: { email_verified_at: "2026-11-13" } }
              : {
                  items: Array.from({ length: 6 }, (_, i) => ({
                    id: `evento-${i}`,
                    title: `Evento ${i}`,
                    summary: "Resumo",
                    updated_at: "2026-11-13",
                  })),
                },
      })),
    ),
  );
  afterEach(() => vi.unstubAllGlobals());
  it("combina filtros reais da API e limpa todos os controles", async () => {
    const user = userEvent.setup();
    render(<PaginaExplorar />);
    expect(await screen.findByTestId("connections-background")).toHaveAttribute(
      "data-fade-top",
      "false",
    );
    await screen.findByText("6 notícias");
    expect(screen.getAllByRole("link", { name: /^Evento \d$/ })).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Evento 0" })).toHaveAttribute(
      "href",
      "/paginaEvento?id=evento-0",
    );
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/feed?order=personalized&page=1&topic=&q=",
        expect.anything(),
      ),
    );
  });

  it("edita os temas no cartão e recarrega o feed com uma nova sessão após salvar", async () => {
    const user = userEvent.setup();
    let saved = ["Comércio", "Contas públicas", "Educação"];
    let failSave = true;
    fetch.mockImplementation(async (url, options) => {
      if (url === "/api/auth/profile") {
        if (options?.method === "PUT") {
          if (failSave) {
            return { ok: false, json: async () => ({ message: "Falha ao salvar os temas" }) };
          }
          saved = JSON.parse(options.body).interests;
          return { ok: true, json: async () => ({ user: { name: "Leitora" } }) };
        }
        return { ok: true, json: async () => ({ preferences: { interests: saved } }) };
      }
      if (url === "/api/categories") {
        const categories = ["Comércio", "Contas públicas", "Educação", "Saúde"].map((name) => ({
          name,
        }));
        return { ok: true, json: async () => ({ categories }) };
      }
      return { ok: true, json: async () => ({ items: [], sessionId: "ses-1", hasMore: true }) };
    });

    render(<PaginaExplorar />);
    const card = within(screen.getByRole("region", { name: "Seus temas" }));
    const edit = card.getByRole("button", { name: "Editar áreas de interesse" });
    expect(card.getByText(/Acompanhe as notícias do dia/)).toBeInTheDocument();
    expect(await card.findByText("Comércio")).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Próxima" }));
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/feed?order=personalized&page=2&topic=&q=&sessionId=ses-1",
        expect.anything(),
      ),
    );

    await user.click(edit);
    const dialog = within(screen.getByRole("dialog", { name: "Editar áreas de interesse" }));
    const selected = dialog.getByRole("button", { name: "Comércio", pressed: true });
    await user.click(selected);
    expect(dialog.getByRole("button", { name: "Salvar interesses" })).toBeDisabled();
    await user.click(dialog.getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(card.getByText("Comércio")).toBeInTheDocument();

    await user.click(edit);
    const reopened = within(screen.getByRole("dialog", { name: "Editar áreas de interesse" }));
    await user.click(reopened.getByRole("button", { name: "Comércio", pressed: true }));
    await user.type(reopened.getByRole("textbox", { name: "Buscar temas de interesse" }), "saude");
    await user.click(reopened.getByRole("button", { name: "Saúde", pressed: false }));
    const save = reopened.getByRole("button", { name: "Salvar interesses" });
    await user.click(save);
    expect(await reopened.findByRole("alert")).toHaveTextContent("Falha ao salvar os temas");
    expect(card.getByText("Comércio")).toBeInTheDocument();

    failSave = false;
    fetch.mockClear();
    await user.click(save);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/profile",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ interests: ["Contas públicas", "Educação", "Saúde"] }),
      }),
    );
    expect(card.getByText("Saúde")).toBeInTheDocument();
    expect(card.queryByText("Comércio")).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/feed?order=personalized&page=1&topic=&q=",
      expect.anything(),
    );
  });
});
