import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConceitosSalvos } from "../../frontend/src/components/biblioteca/conceitosSalvos.jsx";
import { DemoContext } from "../../frontend/src/components/demo/mode.jsx";
import { requisitar } from "../../frontend/src/services/api.js";

vi.mock("@/services/api", () => ({ requisitar: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("conceitos salvos", () => {
  beforeEach(() => {
    requisitar.mockReset();
    localStorage.clear();
  });

  it("lista apenas conceitos da API e remove pelo identificador do item salvo", async () => {
    const user = userEvent.setup();
    requisitar
      .mockResolvedValueOnce({
        items: [
          { id: "saved-concept", concept_id: "concept-1", title: "Inflação" },
          { id: "saved-event", event_id: "event-1", title: "Uma notícia" },
          { id: "saved-article", article_id: "article-1", title: "Um artigo" },
        ],
      })
      .mockResolvedValueOnce({ saved: false })
      .mockResolvedValueOnce({ items: [] });
    render(<ConceitosSalvos />);
    expect(await screen.findByRole("link", { name: "Inflação" })).toHaveAttribute(
      "href",
      "/paginaConceito?id=concept-1",
    );
    expect(screen.queryByText("Uma notícia")).not.toBeInTheDocument();
    expect(screen.queryByText("Um artigo")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remover Inflação dos salvos" }));
    expect(await screen.findByText("Você ainda não salvou nenhum conceito.")).toBeVisible();
    expect(requisitar).toHaveBeenCalledWith("/saved/saved-concept", { method: "DELETE" });
  });

  it("não mistura os salvos de contas diferentes na demonstração", async () => {
    localStorage.setItem("wisen:demo:saved-concepts:other-user", JSON.stringify(["Inflação"]));
    requisitar.mockResolvedValue({ user: { id: "current-user" } });
    render(
      <DemoContext value={true}>
        <ConceitosSalvos />
      </DemoContext>,
    );
    expect(await screen.findByText("Você ainda não salvou nenhum conceito.")).toBeVisible();
    expect(screen.queryByRole("link", { name: /^Inflação/ })).not.toBeInTheDocument();
  });
});
