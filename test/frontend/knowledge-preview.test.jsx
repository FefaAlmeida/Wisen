import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GraficoEvolucao } from "../../frontend/src/components/meuConhecimento/graficoEvolucao.jsx";
import { HistoricoAtividades } from "../../frontend/src/components/meuConhecimento/historicoAtividades.jsx";
import {
  categories,
  evolutionHistory,
  getEvolution,
} from "../../frontend/src/components/meuConhecimento/historicoDemo.js";

describe("prévia do conhecimento", () => {
  it("altera a série e o intervalo de datas em cada período", async () => {
    const user = userEvent.setup();
    const { container } = render(<GraficoEvolucao />);
    const series = new Set();
    for (const [label, days, initial] of [
      ["7 dias", 7, 69],
      ["30 dias", 30, 61],
      ["3 meses", 90, 52],
      ["1 ano", 365, 25],
    ]) {
      await user.click(screen.getByRole("button", { name: label, exact: true }));
      expect(screen.getByRole("button", { name: label })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("img")).toHaveAccessibleName(
        `Mastery score nos últimos ${days} dias: de ${initial} para 72 pontos.`,
      );
      series.add(container.querySelector("[data-evolution-line]").getAttribute("points"));
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuetext",
        "13 nov 2026: 72 pontos",
      );
    }
    expect(series.size).toBe(4);
  });

  it("permite consultar os pontos e reinicia a consulta ao trocar o período", async () => {
    const user = userEvent.setup();
    render(<GraficoEvolucao />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "15 out 2026: 61 pontos");
    await user.click(screen.getByRole("button", { name: "7 dias" }));
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "13 nov 2026: 72 pontos");
  });

  it("mantém as janelas de tempo coerentes com um único histórico", () => {
    for (const days of [7, 30, 90, 365]) {
      const history = getEvolution(days);
      expect(history[0]).toEqual(evolutionHistory.at(-days));
      expect(history.at(-1)).toEqual(evolutionHistory.at(-1));
      for (const point of history) {
        expect(point.score).toBeGreaterThanOrEqual(0);
        expect(point.score).toBeLessThanOrEqual(100);
        expect(evolutionHistory.find((item) => item.date === point.date)).toEqual(point);
      }
    }
    expect(categories.reduce((total, item) => total + item.count, 0)).toBe(128);
  });

  it("expande o histórico e filtra atividades de verdade", async () => {
    const user = userEvent.setup();
    render(<HistoricoAtividades />);
    expect(screen.getAllByRole("link")).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "Ver todas as atividades" }));
    expect(screen.getAllByRole("link")).toHaveLength(6);
    await user.click(screen.getByRole("button", { name: "Revisões", exact: true }));
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByText("Concluiu uma revisão")).toHaveLength(2);
    expect(screen.queryByText("Leu uma notícia")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Leituras", exact: true }));
    expect(screen.getAllByText("Leu uma notícia")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Todas", exact: true }));
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });
});
