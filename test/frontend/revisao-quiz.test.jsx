import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuizRevisao from "../../frontend/src/components/centralRevisao/quizRevisao.jsx";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    default: (props) => React.createElement("img", props),
  };
});

describe("quiz de revisão", () => {
  it("oferece somente as opções de dificuldade", () => {
    render(<QuizRevisao />);

    expect(screen.queryByRole("button", { name: "Errei" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fácil" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Médio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Difícil" })).toBeInTheDocument();
  });
});
