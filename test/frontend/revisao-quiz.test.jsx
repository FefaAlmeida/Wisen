import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CentralRevisao from "../../frontend/src/components/centralRevisao/centralRevisao.jsx";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("prévia de revisões", () => {
  it("abre com indicadores e leva à preparação em uma página separada", () => {
    render(<CentralRevisao />);
    expect(screen.getByRole("heading", { name: "Central de revisões." })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Resumo das revisões" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nova revisão" })).toHaveAttribute(
      "href",
      "/paginaRevisoes/nova",
    );
    expect(screen.queryByText("Começar")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Últimas revisões" })).toBeInTheDocument();
  });
  it("orienta a preparar uma revisão se a sessão for aberta sem assuntos", () => {
    render(<CentralRevisao view="sessao" initialTemas={["inexistente"]} />);
    expect(screen.getByRole("link", { name: "Nova revisão" })).toHaveAttribute(
      "href",
      "/paginaRevisoes/nova",
    );
    expect(screen.queryByRole("button", { name: /Próxima questão/ })).not.toBeInTheDocument();
  });
  it("sai da sessão para a central", async () => {
    const user = userEvent.setup();
    render(<CentralRevisao view="sessao" initialTemas={["juros"]} />);
    await user.click(screen.getByRole("button", { name: "Sair da revisão" }));
    expect(push).toHaveBeenLastCalledWith("/paginaRevisoes");
  });
  it("abre na preparação e combina áreas e temas sem duplicar questões", async () => {
    const user = userEvent.setup();
    render(<CentralRevisao view="nova" />);
    expect(screen.getByRole("button", { name: /Continuar/ })).toBeDisabled();
    expect(screen.queryByText("Qual é um dos objetivos da taxa Selic?")).not.toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /Economia/ }));
    await user.click(screen.getByRole("checkbox", { name: /Efeito estufa/ }));
    expect(screen.getByText("6 questões selecionadas")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /Inflação/ }));
    expect(screen.getByText("4 questões selecionadas")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Economia/ }).indeterminate).toBe(true);
    await user.click(screen.getByRole("button", { name: /Continuar/ }));
    expect(
      screen.getByRole("heading", { name: "Em qual formato você quer revisar?" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /Flashcards/ }));
    await user.click(screen.getByRole("button", { name: /Continuar/ }));
    expect(screen.getByRole("heading", { name: "Tudo pronto para começar?" })).toBeInTheDocument();
    expect(screen.getByText("Flashcards", { exact: true })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Voltar/ }));
    expect(screen.getByRole("radio", { name: /Flashcards/ })).toBeChecked();
    await user.click(screen.getByRole("button", { name: /Continuar/ }));
    await user.click(screen.getByRole("button", { name: /Iniciar revisão/ }));
    const url = new URL(push.mock.calls.at(-1)[0], "http://localhost");
    expect(url.pathname).toBe("/paginaSessaoRevisao");
    expect(url.searchParams.get("formato")).toBe("flashcards");
    expect(new Set(url.searchParams.get("temas").split(","))).toEqual(new Set(["juros", "clima"]));
  });

  it("corrige, bloqueia alterações, preserva respostas e avalia somente ao concluir", async () => {
    const user = userEvent.setup();
    render(<CentralRevisao view="sessao" initialTemas={["juros"]} />);
    expect(screen.getByRole("button", { name: /Próxima questão/ })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Fácil" })).not.toBeInTheDocument();
    const correta = screen.getByRole("button", { name: /Controlar a inflação/ });
    await user.click(correta);
    expect(screen.getByRole("status")).toHaveTextContent("Resposta correta!");
    expect(correta).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: /Fixar todos os preços/ }));
    expect(correta).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: /Próxima questão/ }));
    await user.click(screen.getByRole("button", { name: /Sempre gratuito/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Resposta incorreta.");
    expect(screen.getByLabelText("Sua resposta está incorreta")).toBeInTheDocument();
    expect(screen.getByLabelText("Alternativa correta")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Anterior/ }));
    expect(screen.getByRole("button", { name: /Controlar a inflação/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: /Próxima questão/ }));
    await user.click(screen.getByRole("button", { name: /Concluir revisão/ }));
    expect(screen.getByText("1 de 2 respostas corretas")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Médio" }));
    expect(screen.getByRole("status")).toHaveTextContent("Avaliação da sessão: médio.");
    await user.click(screen.getByRole("button", { name: /Preparar outra revisão/ }));
    expect(push).toHaveBeenLastCalledWith("/paginaRevisoes/nova");
  });

  it("exige revelar flashcards, preserva revelação e conclui sem atribuir acertos", async () => {
    const user = userEvent.setup();
    render(<CentralRevisao view="sessao" initialTemas={["juros"]} initialModo="flashcards" />);
    expect(screen.getByRole("button", { name: /Próxima questão/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Revelar resposta" }));
    await user.click(screen.getByRole("button", { name: /Próxima questão/ }));
    await user.click(screen.getByRole("button", { name: /Anterior/ }));
    expect(screen.queryByRole("button", { name: "Revelar resposta" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Próxima questão/ }));
    await user.click(screen.getByRole("button", { name: "Revelar resposta" }));
    await user.click(screen.getByRole("button", { name: /Concluir revisão/ }));
    expect(screen.getByText("2 cartões revisados")).toBeInTheDocument();
    expect(screen.queryByText(/respostas corretas/)).not.toBeInTheDocument();
  });
});
