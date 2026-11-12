import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import PerfilPage from "../../frontend/src/app/paginaPerfil/page.jsx";
import { SecurityCard } from "../../frontend/src/components/perfil/securityCard.jsx";

const mocks = vi.hoisted(() => ({ requisitar: vi.fn() }));
vi.mock("@/services/api", () => ({ requisitar: mocks.requisitar }));
vi.mock("@/components/sidebar", () => ({ default: () => null }));
vi.mock("@/components/footer", () => ({ Footer: () => null }));
vi.mock("@/components/homeCliente/menuPerfil", () => ({ default: () => null }));
vi.mock("@/components/homeCliente/connectionsBackground", () => ({
  ConnectionsBackground: () => null,
}));
const profile = {
  user: { name: "Ana Original", email: "ana@example.test" },
  avatarDataUrl: null,
  preferences: { interests: [], notifications: { reviewReminders: true, weeklySummary: false } },
};
beforeEach(() => { mocks.requisitar.mockReset(); });

it("salva cada cartão sem enviar ou substituir rascunhos dos outros", async () => {
  mocks.requisitar.mockResolvedValueOnce(profile).mockResolvedValue({ user: profile.user });
  const user = userEvent.setup();
  render(<PerfilPage />);
  await screen.findByDisplayValue("Ana Original");
  fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Nome pendente" } });
  await user.click(screen.getByRole("button", { name: "Tecnologia" }));
  await user.click(screen.getByRole("button", { name: "Salvar interesses" }));
  await screen.findByText("Assuntos de interesse salvos.");
  expect(mocks.requisitar).toHaveBeenLastCalledWith("/auth/profile", {
    method: "PUT",
    body: { interests: ["Tecnologia"] },
  });
  expect(screen.getByLabelText("Nome")).toHaveValue("Nome pendente");
  await user.click(screen.getByRole("switch", { name: "Resumo semanal" }));
  await user.click(screen.getByRole("button", { name: "Salvar notificações" }));
  await screen.findByText("Notificações salvas.");
  expect(mocks.requisitar).toHaveBeenLastCalledWith("/auth/profile", {
    method: "PUT",
    body: { notifications: { reviewReminders: true, weeklySummary: true } },
  });
  expect(screen.getByLabelText("Nome")).toHaveValue("Nome pendente");
  fireEvent.submit(screen.getByRole("form", { name: "Dados pessoais" }));
  await screen.findByText("Perfil atualizado com sucesso!");
  expect(mocks.requisitar).toHaveBeenLastCalledWith("/auth/profile", {
    method: "PUT",
    body: { name: "Nome pendente", email: "ana@example.test" },
  });
});

it("não permite salvar valores vazios após falha ao carregar e oferece retentativa", async () => {
  mocks.requisitar
    .mockRejectedValueOnce(new Error("Servidor indisponível"))
    .mockResolvedValueOnce(profile);
  const user = userEvent.setup();
  render(<PerfilPage />);
  await screen.findByText("Servidor indisponível");
  expect(screen.getByLabelText("Nome")).toBeDisabled();
  expect(screen.getByRole("button", { name: "Salvar alterações" })).toBeDisabled();
  expect(screen.getByRole("switch", { name: "Resumo semanal" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
  await screen.findByDisplayValue("Ana Original");
  expect(screen.getByLabelText("Nome")).toBeEnabled();
});

it("logout do perfil apresenta falha e permite tentar novamente", async () => {
  mocks.requisitar.mockImplementation(async () => {
    throw new Error("offline");
  });
  const user = userEvent.setup();
  render(<SecurityCard />);
  await user.click(screen.getByRole("button", { name: /Encerrar sessão/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível encerrar a sessão");
  expect(mocks.requisitar.mock.calls).toContainEqual(["/auth/logout", { method: "POST" }]);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Encerrar sessão/ })).toBeEnabled(),
  );
});
