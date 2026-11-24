import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GestaoUsuarios from "../../frontend/src/components/gestaoUsuariosAdm/gestaoUsuarios.jsx";
import { renderWithToasts } from "./render-with-toasts";

beforeEach(() => localStorage.clear());
async function openUser(user, name) {
  const buttons = await screen.findAllByRole("button", { name: `Gerenciar ${name}` });
  await user.click(buttons[0]);
  await screen.findByRole("dialog", { name });
}
describe("gestão de contas", () => {
  it("promove uma conta real e exibe a alteração no histórico", async () => {
    const user = userEvent.setup();
    const account = {
      id: "person",
      name: "Pessoa",
      email: "pessoa@example.test",
      role: "user",
      active: true,
      generation_limit: 30,
    };
    const history = [];
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options) => {
      if (url === "/api/admin/users") return Response.json({ items: [account] });
      if (url === "/api/admin/audit") return Response.json({ items: history });
      const after = JSON.parse(options.body);
      history.push({
        id: "promotion",
        action: "user",
        target_id: account.id,
        before_data: { ...account },
        after_data: after,
      });
      account.role = after.role;
      return Response.json({ saved: true });
    });

    renderWithToasts(<GestaoUsuarios demo={false} />);
    await openUser(user, account.name);
    await user.selectOptions(screen.getByLabelText("Perfil da conta"), "Admin");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    expect(fetch).toHaveBeenCalledWith(
      "/api/admin/actions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          action: "user",
          id: account.id,
          active: true,
          generationLimit: 30,
          role: "admin",
        }),
      }),
    );
    await user.click(screen.getByRole("tab", { name: "Histórico de alterações 1" }));
    expect(screen.getByText("Perfil: Usuário → Administrador")).toBeVisible();
  });

  it("busca contas reais além das primeiras 100 mesmo quando o histórico falha", async () => {
    const user = userEvent.setup();
    const accounts = Array.from({ length: 101 }, (_, index) => ({
      id: String(index),
      name: `Pessoa ${index + 1}`,
      email: `pessoa${index + 1}@example.test`,
      role: "user",
      active: index !== 100,
      created_at: "2026-08-10T12:00:00Z",
    }));
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) =>
      url === "/api/admin/users"
        ? Response.json({ items: accounts })
        : Response.json({ message: "Histórico indisponível" }, { status: 503 }),
    );

    renderWithToasts(<GestaoUsuarios demo={false} />);
    expect(await screen.findByText("101 contas encontradas")).toBeVisible();
    expect(screen.queryByText("Histórico indisponível")).not.toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Buscar usuários por nome ou e-mail"),
      "pessoa101@example.test",
    );
    expect(screen.getByText("1 conta encontrada")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Gerenciar Pessoa 101" })[0]).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /^Histórico de alterações/ }));
    expect(screen.getByText("Histórico indisponível")).toBeVisible();
  });

  it("seleciona a data pelo teclado no calendário e limpa o filtro", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoUsuarios />);
    const date = screen.getByLabelText("Filtrar por data de cadastro");
    const trigger = screen.getByRole("button", { name: "Abrir calendário de data de cadastro" });
    fireEvent.change(date, { target: { value: "2026-08-09" } });

    await user.click(trigger);
    const calendarName = "Calendário de data de cadastro";
    const calendar = await screen.findByRole("dialog", { name: calendarName });
    const selected = within(calendar).getByRole("gridcell", { selected: true });
    expect(within(selected).getByRole("button")).toHaveFocus();
    await user.keyboard("{ArrowRight}{Enter}");

    expect(date).toHaveValue("2026-08-10");
    expect(await screen.findAllByText("João Silva")).not.toHaveLength(0);
    expect(screen.queryByText("Mariana Costa")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    const reopened = await screen.findByRole("dialog", { name: calendarName });
    await user.click(within(reopened).getByRole("button", { name: "Limpar" }));
    expect(date).toHaveValue("");
    expect(screen.getAllByText("Mariana Costa")).not.toHaveLength(0);
  });

  it("alterna entre a lista e o histórico na página e preserva os filtros", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoUsuarios />);
    const summary = await screen.findByRole("region", { name: "Contas cadastradas" });
    expect(summary.compareDocumentPosition(screen.getByRole("tablist"))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    await user.type(screen.getByLabelText("Buscar usuários por nome ou e-mail"), "joao");
    expect(screen.getAllByText("João Silva").length).toBeGreaterThan(0);
    expect(screen.queryByText("Mariana Costa")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    await user.click(screen.getByRole("combobox", { name: "Filtrar por acesso" }));
    await user.click(await screen.findByRole("option", { name: "Bloqueados" }));
    expect(screen.getAllByText("Carlos Pereira").length).toBeGreaterThan(0);
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    const historyTab = screen.getByRole("tab", { name: "Histórico de alterações" });
    await user.click(historyTab);
    expect(historyTab).toHaveAttribute("aria-selected", "true");
    expect(summary).toBeVisible();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Nenhuma alteração registrada");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Buscar usuários por nome ou e-mail")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Contas cadastradas/ }));
    expect(screen.getAllByText("Carlos Pereira").length).toBeGreaterThan(0);
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("salva a conta e registra apenas alterações realizadas, preservando ao recarregar", async () => {
    const user = userEvent.setup();
    const view = renderWithToasts(<GestaoUsuarios />);
    await openUser(user, "João Silva");
    await user.selectOptions(screen.getByLabelText("Acesso à plataforma"), "Bloqueado");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await screen.findByText("Configurações da conta salvas.");
    await user.click(screen.getByRole("tab", { name: "Histórico de alterações 1" }));
    expect(
      screen.getByRole("list", { name: "Alterações mais recentes primeiro" }),
    ).toHaveTextContent("Acesso: Ativo → Bloqueado");
    expect(screen.queryByText("Login realizado")).not.toBeInTheDocument();
    view.unmount();
    renderWithToasts(<GestaoUsuarios />);
    await openUser(user, "João Silva");
    expect(screen.getByLabelText("Acesso à plataforma")).toHaveValue("Bloqueado");
    await user.click(screen.getByRole("button", { name: "Ver histórico desta conta" }));
    expect(
      await screen.findByRole("region", { name: "Histórico de João Silva" }),
    ).toHaveTextContent("Acesso: Ativo → Bloqueado");
    const historyTab = screen.getByRole("tab", { name: "Histórico de alterações 1" });
    expect(historyTab).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(historyTab).toHaveFocus());
    await user.click(screen.getByRole("button", { name: "Voltar à conta" }));
    expect(await screen.findByRole("dialog", { name: "João Silva" })).toBeInTheDocument();
  });

  it("descarta alterações canceladas ao reabrir a mesma conta", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoUsuarios />);
    await openUser(user, "Mariana Costa");
    await user.selectOptions(screen.getByLabelText("Acesso à plataforma"), "Bloqueado");
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    await openUser(user, "Mariana Costa");
    expect(screen.getByLabelText("Acesso à plataforma")).toHaveValue("Ativo");
    expect(localStorage.getItem("wisen:usuarios:v1")).toBeNull();
  });

  it("o histórico de uma conta não mostra alterações de outra conta", async () => {
    const user = userEvent.setup();
    renderWithToasts(<GestaoUsuarios />);
    for (const name of ["Mariana Costa", "João Silva"]) {
      await openUser(user, name);
      await user.selectOptions(screen.getByLabelText("Acesso à plataforma"), "Bloqueado");
      await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    }
    await openUser(user, "João Silva");
    await user.click(screen.getByRole("button", { name: "Ver histórico desta conta" }));
    const history = await screen.findByRole("region", { name: "Histórico de João Silva" });
    expect(within(history).queryByText("Mariana Costa")).not.toBeInTheDocument();
    expect(within(history).getByText("João Silva")).toBeInTheDocument();
    await user.click(within(history).getByRole("button", { name: "Ver todas as alterações" }));
    const allHistory = screen.getByRole("region", { name: "Linha do tempo" });
    expect(
      within(allHistory)
        .getAllByRole("listitem")
        .map((item) => item.querySelector("h3").textContent),
    ).toEqual(["João Silva", "Mariana Costa"]);
  });
});
