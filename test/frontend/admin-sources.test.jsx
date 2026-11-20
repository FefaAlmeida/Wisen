import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GestaoFontes from "../../frontend/src/components/gestaoFontesAdm/gestaoFontes.jsx";

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());
async function editSource(user, name) {
  const buttons = await screen.findAllByRole("button", { name: `Editar ${name}` });
  await user.click(buttons[0]);
  return screen.findByRole("dialog", { name: "Gerenciar fonte" });
}
describe("gestão de fontes", () => {
  it("filtra por nome, status e frequência e limpa os filtros", async () => {
    const user = userEvent.setup();
    render(<GestaoFontes />);
    await screen.findAllByRole("button", { name: "Editar G1" });
    await user.type(screen.getByLabelText("Buscar fontes por nome ou endereço"), "g1");
    expect(
      screen.queryByRole("button", { name: "Editar Valor Econômico" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    await user.selectOptions(screen.getByLabelText("Filtrar fontes por status"), "pausadas");
    await user.selectOptions(screen.getByLabelText("Filtrar fontes por frequência"), "6 horas");
    expect(screen.getAllByRole("button", { name: "Editar Agência Brasil" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByRole("button", { name: "Editar G1" })).not.toBeInTheDocument();
  });
  it("abre os registros em uma janela própria", async () => {
    const user = userEvent.setup();
    render(<GestaoFontes />);
    await screen.findAllByRole("button", { name: "Editar G1" });
    expect(screen.queryByText("Timeout na conexão com o feed RSS (30s)")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Registros de coleta" }));
    expect(await screen.findByRole("dialog", { name: "Registros de coleta" })).toHaveTextContent(
      "Timeout na conexão",
    );
    await user.click(screen.getByRole("button", { name: "Fechar registros" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("adiciona, edita e preserva a fonte ao recarregar", async () => {
    const user = userEvent.setup();
    const view = render(<GestaoFontes />);
    await screen.findAllByRole("button", { name: "Editar G1" });
    await user.click(screen.getByRole("button", { name: "Adicionar fonte", exact: true }));
    const dialog = screen.getByRole("dialog", { name: "Adicionar fonte" });
    fireEvent.change(screen.getByLabelText("Nome do veículo"), { target: { value: "Nova fonte" } });
    fireEvent.change(screen.getByLabelText("URL do feed RSS"), {
      target: { value: "https://example.test/rss" },
    });
    await user.selectOptions(screen.getByLabelText("Frequência de coleta"), "24 horas");
    await user.click(within(dialog).getByRole("button", { name: "Adicionar fonte" }));
    await screen.findByText("Fonte adicionada.");
    await editSource(user, "Nova fonte");
    fireEvent.change(screen.getByLabelText("Nome do veículo"), {
      target: { value: "Nome atualizado" },
    });
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await screen.findByText("Configurações da fonte salvas.");
    view.unmount();
    render(<GestaoFontes />);
    await editSource(user, "Nome atualizado");
    expect(screen.getByLabelText("URL do feed RSS")).toHaveValue("https://example.test/rss");
    expect(screen.getByLabelText("Frequência de coleta")).toHaveValue("24 horas");
  });
  it("pausa uma fonte e mantém os filtros coerentes", async () => {
    const user = userEvent.setup();
    render(<GestaoFontes />);
    const pause = await screen.findAllByRole("button", { name: "Pausar G1" });
    await user.click(pause[0]);
    await screen.findByText("Fonte pausada.");
    await user.selectOptions(screen.getByLabelText("Filtrar fontes por status"), "ativas");
    expect(screen.queryByRole("button", { name: "Editar G1" })).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Filtrar fontes por status"), "pausadas");
    expect(screen.getAllByRole("button", { name: "Ativar G1" }).length).toBeGreaterThan(0);
  });
  it("usa as ações existentes da API para fontes reais", async () => {
    let enabled = true;
    const fetchMock = vi.fn(async (url, options) => {
      if (url === "/api/admin/actions") {
        enabled = JSON.parse(options.body).enabled;
        return { ok: true, status: 200, json: async () => ({ saved: true }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              id: "source-real",
              name: "Fonte real",
              feed_url: "https://example.test/rss",
              enabled,
              last_collected_at: null,
              last_error: null,
            },
          ],
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<GestaoFontes demo={false} />);
    await editSource(user, "Fonte real");
    expect(screen.getByLabelText("Nome do veículo")).toHaveAttribute("readonly");
    await user.click(screen.getByRole("switch", { name: "Fonte ativa" }));
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/actions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ action: "source", id: "source-real", enabled: false }),
      }),
    );
    expect(localStorage.getItem("wisen:fontes:v1")).toBeNull();
  });
});
