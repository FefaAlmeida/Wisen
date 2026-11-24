import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CuradoriaEventos from "../../frontend/src/components/cuidadoriaEventosAdm/cuidadoriaEventos.jsx";
import { renderWithToasts } from "./render-with-toasts";

const saved = () => JSON.parse(localStorage.getItem("wisen:curadoria:v2"));
async function openFirst(user) {
  const buttons = await screen.findAllByRole("button", { name: /^Revisar evento:/ });
  await user.click(buttons[0]);
  await screen.findByRole("region", { name: "Revisar agrupamento" });
}
beforeEach(() => {
  localStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => vi.unstubAllGlobals());

describe("fila de revisão de eventos", () => {
  it("salva a confirmação na API real e atualiza a fila", async () => {
    let approved = false;
    const fetchMock = vi.fn(async (url, options) => {
      if (url === "/api/admin/actions") {
        approved = JSON.parse(options.body).reviewed;
        return { ok: true, status: 200, json: async () => ({ saved: true }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          events: [
            {
              id: "event-real",
              title: "Evento real",
              summary: "Resumo real",
              topics: ["Economia"],
              curated: approved,
              started_at: "2026-11-19",
              articles: [
                {
                  id: "article-real",
                  title: "Artigo real",
                  source: "Fonte",
                  published_at: "2026-11-19",
                  url: "https://example.test/article",
                },
              ],
            },
          ],
          unassociated: [],
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderWithToasts(<CuradoriaEventos demo={false} />);
    await openFirst(user);
    await user.click(screen.getByRole("button", { name: "Confirmar agrupamento" }));
    await screen.findByText("Agrupamento confirmado. O evento foi movido para os revisados.");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/actions",
      expect.objectContaining({ method: "POST", body: expect.stringContaining('"reviewed":true') }),
    );
    expect(screen.queryByRole("heading", { name: "Evento real" })).not.toBeInTheDocument();
    expect(localStorage.getItem("wisen:curadoria:v2")).toBeNull();
  });

  it("mostra falha de carregamento sem anunciar uma fila concluída", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Servidor indisponível")));
    renderWithToasts(<CuradoriaEventos demo={false} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Servidor indisponível");
    expect(
      screen.queryByRole("heading", { name: "Tudo revisado por aqui" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Filas de revisão" })).not.toBeInTheDocument();
  });

  it("começa pelas pendências e preserva a revisão ao recarregar", async () => {
    const user = userEvent.setup();
    const view = renderWithToasts(<CuradoriaEventos />);
    await screen.findByRole("heading", { name: "Eventos a revisar" });
    expect(
      screen.queryByRole("heading", { name: "Aprovação de novo medicamento para diabetes" }),
    ).not.toBeInTheDocument();
    await openFirst(user);
    await user.click(screen.getByRole("button", { name: "Confirmar agrupamento" }));
    await screen.findByText("Agrupamento confirmado. O evento foi movido para os revisados.");
    expect(saved().events.find((event) => event.id === 1).status).toBe("Revisado");
    view.unmount();
    renderWithToasts(<CuradoriaEventos />);
    await screen.findByRole("heading", { name: "Eventos a revisar" });
    expect(
      screen.queryByRole("heading", { name: "Reunião do Copom e decisão da Selic" }),
    ).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Mostrar eventos"), "revisados");
    expect(
      screen.getByRole("heading", { name: "Reunião do Copom e decisão da Selic" }),
    ).toBeInTheDocument();
  });

  it("retira um artigo sem excluir e o associa a outro evento", async () => {
    const user = userEvent.setup();
    renderWithToasts(<CuradoriaEventos />);
    await openFirst(user);
    await user.click(screen.getAllByRole("button", { name: "Retirar do evento" })[0]);
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Retirar artigo",
        exact: true,
      }),
    );
    await waitFor(() =>
      expect(saved().unassociated.some((article) => article.id === 101)).toBe(true),
    );
    expect(saved().events[0].artigos.some((article) => article.id === 101)).toBe(false);
    await user.click(screen.getByRole("button", { name: "Voltar à fila", exact: true }));
    await user.click(screen.getByRole("button", { name: /Artigos sem evento/ }));
    const article = screen
      .getByRole("heading", { name: "Copom mantém Selic em 10,75% ao ano" })
      .closest("article");
    await user.click(within(article).getByRole("button", { name: "Associar a um evento" }));
    await user.selectOptions(screen.getByLabelText("Evento de destino"), "2");
    await user.click(screen.getByRole("button", { name: "Confirmar associação" }));
    await waitFor(() => expect(saved().unassociated.some((item) => item.id === 101)).toBe(false));
    expect(
      saved()
        .events.find((event) => event.id === 2)
        .artigos.some((item) => item.id === 101),
    ).toBe(true);
  });

  it("volta à primeira página ao filtrar a fila", async () => {
    localStorage.setItem(
      "wisen:curadoria:v2",
      JSON.stringify({
        events: Array.from({ length: 12 }, (_, index) => ({
          id: index + 1,
          titulo: `Evento ${index + 1}`,
          resumo: "Resumo para revisão",
          categoria: "Economia",
          status: "Pendente",
          artigos: [],
        })),
        unassociated: [],
      }),
    );
    const user = userEvent.setup();
    renderWithToasts(<CuradoriaEventos />);
    const pages = within(await screen.findByRole("navigation", { name: "Paginação da fila" }));
    await user.click(pages.getByRole("button", { name: "Próxima página" }));
    expect(pages.getByText("2 de 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evento 12", exact: true })).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Buscar na fila" }), "Evento 12");
    expect(pages.getByText("1 de 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(pages.getByText("1 de 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evento 1", exact: true })).toBeInTheDocument();
  });

  it("compara duplicados e une os artigos sem confirmar a revisão automaticamente", async () => {
    const user = userEvent.setup();
    renderWithToasts(<CuradoriaEventos />);
    await screen.findByRole("heading", { name: "Eventos a revisar" });
    await user.click(screen.getByRole("button", { name: /Possíveis duplicados/ }));
    await user.click(screen.getByRole("button", { name: "Comparar eventos" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Reunião do Copom e decisão da Selic");
    await user.click(screen.getByRole("button", { name: "Unir e revisar" }));
    await screen.findByRole("region", { name: "Revisar agrupamento" });
    expect(saved().events).toHaveLength(5);
    const event = saved().events.find((item) => item.id === 1);
    expect(event.status).toBe("Ajustado");
    expect(event.artigos).toHaveLength(7);
    expect(new Set(event.artigos.map((article) => article.id)).size).toBe(7);
  });

  it("não anuncia sucesso quando o navegador impede salvar", async () => {
    const user = userEvent.setup();
    renderWithToasts(<CuradoriaEventos />);
    await openFirst(user);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    await user.click(screen.getByRole("button", { name: "Confirmar agrupamento" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível salvar");
    expect(screen.getByRole("region", { name: "Revisar agrupamento" })).toBeInTheDocument();
    expect(
      screen.queryByText("Agrupamento confirmado. O evento foi movido para os revisados."),
    ).not.toBeInTheDocument();
  });

  it("edita o resumo mantendo a revisão pendente até a confirmação", async () => {
    const user = userEvent.setup();
    renderWithToasts(<CuradoriaEventos />);
    await openFirst(user);
    await user.click(screen.getByRole("button", { name: "Editar informações" }));
    fireEvent.change(screen.getByLabelText("Título do evento"), {
      target: { value: "Título corrigido" },
    });
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await screen.findByRole("heading", { name: "Título corrigido" });
    expect(saved().events[0].status).toBe("Ajustado");
    expect(screen.getByRole("button", { name: "Confirmar agrupamento" })).toBeEnabled();
  });
});
