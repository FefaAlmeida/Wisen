import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import GestaoUsuarios from "../../frontend/src/components/gestaoUsuariosAdm/gestaoUsuarios.jsx";

beforeEach(() => localStorage.clear());
async function openUser(user, name) {
  const buttons = await screen.findAllByRole("button", { name: `Gerenciar ${name}` });
  await user.click(buttons[0]);
  await screen.findByRole("dialog", { name });
}
describe("gestão de contas", () => {
  it("filtra por nome, e-mail e acesso e abre o histórico separado da lista", async () => {
    const user = userEvent.setup();
    render(<GestaoUsuarios />);
    await screen.findByRole("heading", { name: "Contas cadastradas" });
    await user.type(screen.getByLabelText("Buscar usuários por nome ou e-mail"), "joao");
    expect(screen.getAllByText("João Silva").length).toBeGreaterThan(0);
    expect(screen.queryByText("Mariana Costa")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    await user.selectOptions(screen.getByLabelText("Filtrar por acesso"), "Bloqueado");
    expect(screen.getAllByText("Carlos Pereira").length).toBeGreaterThan(0);
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Histórico de alterações" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Nenhuma alteração registrada");
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("salva a conta e registra apenas alterações realizadas, preservando ao recarregar", async () => {
    const user = userEvent.setup();
    const view = render(<GestaoUsuarios />);
    await openUser(user, "João Silva");
    await user.selectOptions(screen.getByLabelText("Acesso à plataforma"), "Bloqueado");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
    await screen.findByText("Configurações da conta salvas.");
    await user.click(screen.getByRole("button", { name: "Histórico de alterações" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Acesso: Ativo → Bloqueado");
    expect(screen.queryByText("Login realizado")).not.toBeInTheDocument();
    view.unmount();
    render(<GestaoUsuarios />);
    await openUser(user, "João Silva");
    expect(screen.getByLabelText("Acesso à plataforma")).toHaveValue("Bloqueado");
    await user.click(screen.getByRole("button", { name: "Ver histórico desta conta" }));
    expect(
      await screen.findByRole("dialog", { name: "Histórico de João Silva" }),
    ).toHaveTextContent("Acesso: Ativo → Bloqueado");
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("descarta alterações canceladas ao reabrir a mesma conta", async () => {
    const user = userEvent.setup();
    render(<GestaoUsuarios />);
    await openUser(user, "Mariana Costa");
    await user.selectOptions(screen.getByLabelText("Acesso à plataforma"), "Bloqueado");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    await openUser(user, "Mariana Costa");
    expect(screen.getByLabelText("Acesso à plataforma")).toHaveValue("Ativo");
    expect(localStorage.getItem("wisen:usuarios:v1")).toBeNull();
  });

  it("o histórico de uma conta não mostra alterações de outra conta", async () => {
    const user = userEvent.setup();
    render(<GestaoUsuarios />);
    for (const name of ["Mariana Costa", "João Silva"]) {
      await openUser(user, name);
      await user.selectOptions(screen.getByLabelText("Acesso à plataforma"), "Bloqueado");
      await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    }
    await openUser(user, "João Silva");
    await user.click(screen.getByRole("button", { name: "Ver histórico desta conta" }));
    const history = await screen.findByRole("dialog", { name: "Histórico de João Silva" });
    expect(within(history).queryByText("Mariana Costa")).not.toBeInTheDocument();
    expect(within(history).getByText("João Silva")).toBeInTheDocument();
  });
});
