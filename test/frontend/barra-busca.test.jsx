import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BarraBusca } from "../../frontend/src/components/barraBusca.jsx";

describe("localizar nesta página", () => {
  it("destaca texto sem diferenciar acentos e navega entre ocorrências", () => {
    const onQueryChange = vi.fn();
    render(
      <main>
        <BarraBusca onQueryChange={onQueryChange} />
        <article>
          <h1>Inflação e economia</h1>
          <p>A inflação afeta o custo de vida.</p>
        </article>
      </main>,
    );

    const input = screen.getByRole("searchbox", { name: "Localizar nesta página" });
    fireEvent.change(input, { target: { value: "inflacao" } });
    expect(onQueryChange).toHaveBeenCalledWith("inflacao");
    fireEvent.click(screen.getByRole("button", { name: "Localizar" }));

    expect(screen.getByRole("status")).toHaveTextContent("1 de 2 ocorrências");
    expect(screen.getByRole("heading", { name: "Inflação e economia" })).toHaveAttribute(
      "data-wisen-page-search-current",
      "",
    );

    fireEvent.click(screen.getByRole("button", { name: "Próxima ocorrência" }));
    expect(screen.getByRole("status")).toHaveTextContent("2 de 2 ocorrências");
    expect(screen.getByText("A inflação afeta o custo de vida.")).toHaveAttribute(
      "data-wisen-page-search-current",
      "",
    );
  });

  it("informa quando o termo não aparece na página", () => {
    render(
      <main>
        <BarraBusca />
        <p>Conteúdo disponível nesta página.</p>
      </main>,
    );

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "inexistente" } });
    fireEvent.click(screen.getByRole("button", { name: "Localizar" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhuma ocorrência encontrada nesta página.",
    );
  });
});
