import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PaginaExplorar from "../../frontend/src/app/paginaExplorar/page.jsx";

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }) =>
      React.createElement("a", { href, ...props }, children),
  };
});
vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    default: ({ fill, sizes, ...props }) => React.createElement("img", props),
  };
});
vi.mock("@/components/footer", () => ({ Footer: () => null }));
vi.mock("@/components/homeCliente/connectionsBackground", () => ({
  ConnectionsBackground: ({ fadeTop }) => (
    <div data-testid="connections-background" data-fade-top={fadeTop} />
  ),
}));
vi.mock("@/components/homeCliente/menuPerfil", () => ({ default: () => null }));
vi.mock("@/components/sidebar", () => ({ default: () => null }));

describe("filtros da página Explorar", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ preferences: { interests: ["Economia"] } }),
      }),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("limpa busca, assunto e ordenação", async () => {
    const user = userEvent.setup();
    render(<PaginaExplorar />);

    expect(screen.getByTestId("connections-background")).toHaveAttribute("data-fade-top", "false");
    await screen.findByText("6 notícias");
    expect(screen.queryByRole("button", { name: "Para você" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Todas" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Filtrar por assunto" }));
    await user.click(await screen.findByRole("option", { name: "Tecnologia" }));
    await user.click(screen.getByRole("combobox", { name: "Ordenar notícias" }));
    await user.click(await screen.findByRole("option", { name: "Mais recentes" }));
    fireEvent.change(screen.getByLabelText("Buscar notícias e conceitos"), {
      target: { value: "nenhum resultado" },
    });

    await user.click(screen.getAllByRole("button", { name: "Limpar filtros" })[0]);

    expect(screen.getByLabelText("Buscar notícias e conceitos")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Filtrar por assunto" })).toHaveTextContent(
      "Todos os assuntos",
    );
    expect(screen.getByRole("combobox", { name: "Ordenar notícias" })).toHaveTextContent(
      "relevantes",
    );
    await waitFor(() => expect(screen.getByText("6 notícias")).toBeInTheDocument());
  });
});
