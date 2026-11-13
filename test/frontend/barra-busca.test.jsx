import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BarraBusca } from "../../frontend/src/components/barraBusca.jsx";
import { DemoContext } from "../../frontend/src/components/demo/mode.jsx";

afterEach(() => vi.unstubAllGlobals());

describe("busca em modal", () => {
  it("abre com foco, filtra demonstrações sem acentos e restaura o foco ao fechar", async () => {
    const user = userEvent.setup();
    render(
      <DemoContext value={true}>
        <BarraBusca />
      </DemoContext>,
    );
    const trigger = screen.getByRole("button", { name: /Buscar no Wisen/ });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const input = within(dialog).getByRole("searchbox");
    await waitFor(() => expect(input).toHaveFocus());
    expect(within(dialog).getAllByRole("link")).toHaveLength(3);
    await user.type(input, "inflacao");
    await user.click(within(dialog).getByRole("button", { name: "Conceitos", exact: true }));
    expect(within(dialog).getByRole("link", { name: /Inflação/ })).toBeVisible();
    expect(within(dialog).queryByRole("link", { name: /Copom/ })).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("abre por atalho, mostra estado vazio e navega pelos resultados com as setas", async () => {
    const user = userEvent.setup();
    render(
      <DemoContext value={true}>
        <BarraBusca />
      </DemoContext>,
    );
    await user.keyboard("/");
    const input = await screen.findByRole("searchbox");
    await user.type(input, "inexistente");
    expect(screen.getByText("Nenhum conteúdo encontrado.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Limpar busca e filtros" }));
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("link")[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("link")[1]).toHaveFocus();
  });

  it("carrega o feed e pesquisa na API com links para os conteúdos", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) => ({
        ok: true,
        json: async () =>
          url.includes("/feed")
            ? { items: [{ id: "1", title: "Notícia recente" }] }
            : { concepts: [{ id: "2", name: "Inflação", description: "Preços" }] },
      })),
    );
    const user = userEvent.setup();
    render(<BarraBusca />);
    await user.click(screen.getByRole("button", { name: /Buscar no Wisen/ }));
    expect(await screen.findByRole("link", { name: /Notícia recente/ })).toHaveAttribute(
      "href",
      "/paginaEvento?id=1",
    );
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "inflação" } });
    expect(await screen.findByRole("link", { name: /Inflação/ })).toHaveAttribute(
      "href",
      "/paginaConceito?id=2",
    );
    expect(fetch).toHaveBeenLastCalledWith("/api/discover?q=infla%C3%A7%C3%A3o", expect.anything());
  });
});
