import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InterestsCard } from "../../frontend/src/components/perfil/interestsCard.jsx";

describe("cartão de interesses no onboarding", () => {
  it("usa as cores do sistema e oculta os controles internos de salvamento", () => {
    render(
      <InterestsCard
        categories={["Tecnologia", "Economia"]}
        interests={["Tecnologia"]}
        onToggle={vi.fn()}
        showSaveControls={false}
        systemColors
      />,
    );

    expect(screen.getByRole("button", { name: /Tecnologia/ })).toHaveClass("bg-[#F3E69A]");
    expect(screen.getByRole("button", { name: /Economia/ })).toHaveClass("bg-wisen-superficie");
    expect(document.querySelector('[data-slot="card"]')).toHaveClass("bg-wisen-superficie");
    expect(screen.queryByText("Seus assuntos estão salvos.")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Salvar interesses" })).not.toBeInTheDocument();
  });
});
