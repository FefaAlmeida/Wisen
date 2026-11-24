import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GestaoFontes from "../../frontend/src/components/gestaoFontesAdm/gestaoFontes.jsx";
import { renderWithToasts } from "./render-with-toasts";

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());
async function editSource(user, name) {
  const buttons = await screen.findAllByRole("button", { name: `Editar ${name}` });
  await user.click(buttons[0]);
  return screen.findByRole("dialog", { name: "Gerenciar fonte" });
}
describe("gestão de fontes", () => {
  it("pagina as fontes e retorna à primeira página ao filtrar", async () => {
    localStorage.setItem(
      "wisen:fontes:v1",
      JSON.stringify({
        sources: Array.from({ length: 11 }, (_, index) => ({
          id: index + 1,
          nome: `Fonte ${index + 1}`,
          url: `https://example.test/rss/${index + 1}`,
          ativo: true,
          ultimaColeta: "Ainda não realizada",
          frequencia: "1 hora",
        })),
        logs: [],
      }),
    );
    const user = userEvent.setup();
    renderWithToasts(<GestaoFontes />);
    expect(await screen.findByText("11 fontes encontradas")).toBeInTheDocument();
    const pagination = within(screen.getByRole("navigation", { name: "Paginação de fontes" }));
    expect(pagination.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Editar Fonte 11" })).not.toBeInTheDocument();

    await user.click(pagination.getByRole("button", { name: "Próxima página" }));
    expect(pagination.getByText("2 de 2")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Editar Fonte 11" }).length).toBeGreaterThan(0);
    expect(pagination.getByRole("button", { name: "Próxima página" })).toBeDisabled();

    await user.type(screen.getByLabelText("Buscar fontes por nome ou endereço"), "Fonte 1");
    expect(pagination.getByText("1 de 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(pagination.getByText("1 de 2")).toBeInTheDocument();
  });

  it("filtra por nome, status e frequência e limpa os filtros", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoFontes />);
    await screen.findAllByRole("button", { name: "Editar G1" });
    await user.type(screen.getByLabelText("Buscar fontes por nome ou endereço"), "g1");
    expect(
      screen.queryByRole("button", { name: "Editar Valor Econômico" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    await user.click(screen.getByRole("combobox", { name: "Filtrar fontes por status" }));
    await user.click(await screen.findByRole("option", { name: "Pausadas" }));
    await user.click(screen.getByRole("combobox", { name: "Filtrar fontes por frequência" }));
    await user.click(await screen.findByRole("option", { name: "6 horas" }));
    expect(screen.getAllByRole("button", { name: "Editar Agência Brasil" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByRole("button", { name: "Editar G1" })).not.toBeInTheDocument();
  });
  it("exibe os registros de coleta em uma aba com contador", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoFontes />);
    await screen.findAllByRole("button", { name: "Editar G1" });
    expect(screen.queryByText("Timeout na conexão com o feed RSS (30s)")).not.toBeInTheDocument();
    const logsTab = screen.getByRole("tab", { name: "Registros de coleta 4" });
    await user.click(logsTab);
    expect(logsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Registros de coleta 4" })).toHaveTextContent(
      "Timeout na conexão",
    );
    expect(screen.queryByRole("button", { name: "Editar G1" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Fontes cadastradas 5" }));
    expect(await screen.findAllByRole("button", { name: "Editar G1" })).not.toHaveLength(0);
  });
  it("adiciona, edita e preserva a fonte ao recarregar", async () => {
    const user = userEvent.setup();
    const view = renderWithToasts(<GestaoFontes />);
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
    renderWithToasts(<GestaoFontes />);
    await editSource(user, "Nome atualizado");
    expect(screen.getByLabelText("URL do feed RSS")).toHaveValue("https://example.test/rss");
    expect(screen.getByLabelText("Frequência de coleta")).toHaveValue("24 horas");
  });
  it("pausa uma fonte e mantém os filtros coerentes", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoFontes />);
    const pause = await screen.findAllByRole("button", { name: "Pausar G1" });
    await user.click(pause[0]);
    await screen.findByText("Fonte pausada.");
    await user.click(screen.getByRole("combobox", { name: "Filtrar fontes por status" }));
    await user.click(await screen.findByRole("option", { name: "Ativas" }));
    expect(screen.queryByRole("button", { name: "Editar G1" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("combobox", { name: "Filtrar fontes por status" }));
    await user.click(await screen.findByRole("option", { name: "Pausadas" }));
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
    renderWithToasts(<GestaoFontes demo={false} />);
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
