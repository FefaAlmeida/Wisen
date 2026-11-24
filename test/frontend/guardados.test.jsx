import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import PainelGuardados from "../../frontend/src/components/guardados/painelGuardados.jsx";

it("remove e restaura um conceito marcado pelo mesmo controle das notícias salvas", async () => {
  const user = userEvent.setup();
  render(<PainelGuardados />);

  const marcadorNoticia = screen.getAllByRole("button", { name: /^Remover dos salvos:/ })[0];
  const classeMarcador = marcadorNoticia.className;
  const abaConceitos = screen.getByRole("tab", { name: /^Conceitos marcados/ });
  await user.click(abaConceitos);
  expect(within(abaConceitos).getByText("5")).toBeVisible();

  expect(screen.queryByText(/^(Em revisão|Lacuna|Dominado)$/)).not.toBeInTheDocument();
  const marcador = screen.getByRole("button", { name: "Remover dos salvos: Taxa Selic" });
  expect(marcador.className).toBe(classeMarcador);

  await user.click(marcador);
  expect(screen.queryByRole("link", { name: "Taxa Selic" })).not.toBeInTheDocument();
  expect(within(abaConceitos).getByText("4")).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent("Conceito removido dos salvos.");

  await user.click(screen.getByRole("button", { name: "Desfazer" }));
  expect(screen.getByRole("link", { name: "Taxa Selic" })).toBeVisible();
  expect(within(abaConceitos).getByText("5")).toBeVisible();
});
