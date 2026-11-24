import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import MenuPerfil from "../../frontend/src/components/homeCliente/menuPerfil.jsx";

vi.mock("@/services/api", () => ({ requisitar: async () => null }));

it("fecha o menu ao clicar fora e mantém o menu aberto ao clicar dentro", async () => {
  const user = userEvent.setup();
  render(
    <>
      <h1>Conteúdo da página</h1>
      <MenuPerfil />
    </>,
  );
  const avatar = screen.getByRole("button", { name: "Abrir menu do perfil" });

  await user.click(avatar);
  await user.click(screen.getByText("Minha conta"));
  expect(avatar).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("link", { name: "Meu perfil" })).toBeVisible();

  await user.click(screen.getByRole("heading", { name: "Conteúdo da página" }));
  expect(avatar).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("link", { name: "Meu perfil" })).not.toBeInTheDocument();

  await user.click(avatar);
  expect(avatar).toHaveAttribute("aria-expanded", "true");
  await user.click(avatar);
  expect(avatar).toHaveAttribute("aria-expanded", "false");
});
