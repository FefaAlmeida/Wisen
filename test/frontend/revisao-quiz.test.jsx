import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuizRevisao from "../../frontend/src/components/centralRevisao/quizRevisao.jsx";
import ResumoRevisoes from "../../frontend/src/components/centralRevisao/resumoRevisoes.jsx";
import SessaoHoje from "../../frontend/src/components/centralRevisao/sessaoHoje.jsx";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    default: (props) => React.createElement("img", props),
  };
});

describe("quiz de revisão", () => {
  it("exibe as opções de dificuldade e o hover nas setas", () => {
    render(<QuizRevisao />);

    expect(screen.getByRole("button", { name: "Questão anterior" })).toHaveClass(
      "hover:bg-[#EBDD80]",
    );
    expect(screen.getByRole("button", { name: "Próxima questão" })).toHaveClass(
      "hover:bg-[#EBDD80]",
    );
    expect(screen.queryByRole("button", { name: "Errei" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fácil" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Médio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Difícil" })).toBeInTheDocument();
  });

  it("aplica o hover amarelo nas setas dos painéis de revisão", () => {
    render(
      <>
        <ResumoRevisoes />
        <SessaoHoje />
      </>,
    );

    const arrows = screen.getAllByText("→");
    expect(arrows).toHaveLength(5);
    for (const arrow of arrows) {
      expect(arrow).toHaveClass("bg-[#F3E69A]");
      expect(arrow).toHaveClass("group-hover:bg-[#EBDD80]");
      expect(arrow).toHaveClass("group-hover:translate-x-1");
    }
  });
});
