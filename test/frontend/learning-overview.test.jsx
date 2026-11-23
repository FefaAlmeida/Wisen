import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Library } from "../../frontend/src/components/platform/learning.jsx";
import { requisitar } from "../../frontend/src/services/api.js";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("@/services/api", () => ({ requisitar: vi.fn() }));
vi.mock("@/components/platform/shared", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    Frame: ({ title, children }) => (
      <main>
        <h1>{title}</h1>
        {children}
      </main>
    ),
  };
});

describe("painel de aprendizado conectado", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calcula o nível apenas com conceitos avaliados e mantém os não avaliados explícitos", async () => {
    requisitar.mockResolvedValue({
      items: [
        {
          id: "1",
          name: "Selic",
          status: "mastered",
          display_status: "review",
          mastery_score: "0.8",
        },
        { id: "2", name: "Inflação", status: "gap", mastery_score: "0.2" },
        { id: "3", name: "Clima", status: "unassessed", mastery_score: "0" },
      ],
    });
    render(<Library knowledge />);
    expect(await screen.findByText("50/100")).toBeVisible();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Acompanhe sua evolução");
    const unassessed = screen.getByRole("link", { name: "Clima" }).closest("li");
    expect(within(unassessed).getAllByText("Ainda não avaliado")).toHaveLength(2);
    expect(within(unassessed).queryByText("0/100")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Praticar nas revisões" })).toHaveAttribute(
      "href",
      "/paginaRevisoes",
    );
    expect(
      screen.getByRole("heading", { name: "Conceitos consolidados" }).parentElement,
    ).toHaveTextContent("1");
  });

  it("orienta quem ainda não tem dados, sem exibir um nível zero", async () => {
    requisitar.mockResolvedValue({ items: [] });
    render(<Library knowledge />);
    expect(await screen.findByText("Ainda não avaliado")).toBeVisible();
    expect(screen.queryByText("0/100")).not.toBeInTheDocument();
    expect(screen.getByText(/Seu aprendizado aparecerá aqui/)).toBeVisible();
  });
});
