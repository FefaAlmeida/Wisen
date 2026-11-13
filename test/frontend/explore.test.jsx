import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
              ? { user: { email_verified_at: "2026-11-13" } }
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
  it("combina filtros reais da API com busca local e limpa todos os controles", async () => {
    const user = userEvent.setup();
    render(<PaginaExplorar />);
    expect(screen.getByTestId("connections-background")).toHaveAttribute("data-fade-top", "false");
    await screen.findByText("6 eventos nesta página");
    await screen.findByRole("option", { name: "Tecnologia" });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por assunto" }),
      "Tecnologia",
    );
    await user.selectOptions(screen.getByRole("combobox", { name: "Ordenar notícias" }), "recent");
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/feed?order=recent&page=1&topic=Tecnologia",
        expect.anything(),
      ),
    );
    fireEvent.change(screen.getByLabelText("Localizar nesta página"), {
      target: { value: "nenhum resultado" },
    });
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getByLabelText("Localizar nesta página")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Filtrar por assunto" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Ordenar notícias" })).toHaveValue("personalized");
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/feed?order=personalized&page=1&topic=",
        expect.anything(),
      ),
    );
    await screen.findByText("6 eventos nesta página");
  });
});
