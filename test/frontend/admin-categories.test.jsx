import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import GestaoCategorias from "@/components/gestaoCategoriasAdm/gestaoCategorias";
import { requisitar } from "@/services/api";
import { renderWithToasts } from "./render-with-toasts";

vi.mock("@/services/api", () => ({ requisitar: vi.fn() }));

it("exibe cada categoria em uma linha e salva a disponibilidade respeitando o mínimo", async () => {
  const categories = [
    { id: 1, name: "Economia", description: "Mercados e finanças", available: true },
    { id: 2, name: "Cultura", available: true },
    { id: 3, name: "Ciência", available: true },
    { id: 4, name: "Esportes", available: true },
  ];
  const updatedCategories = categories.map((category) =>
    category.id === 1 ? { ...category, available: false } : category,
  );
  vi.mocked(requisitar)
    .mockResolvedValueOnce({ categories })
    .mockResolvedValueOnce({ categories: updatedCategories });
  const user = userEvent.setup();
  renderWithToasts(<GestaoCategorias />);

  const table = await screen.findByRole("table");
  const row = within(table).getByRole("row", { name: /Economia/ });
  const toggle = within(row).getByRole("switch", { name: "Disponibilizar Economia" });
  const save = screen.getByRole("button", { name: "Salvar disponibilidade" });
  expect(within(row).getByRole("rowheader")).toHaveTextContent("Mercados e finanças");
  expect(within(row).getByRole("cell", { name: "Disponível" })).toBeInTheDocument();
  expect(save).toBeDisabled();

  await user.click(toggle);

  expect(within(row).getByRole("cell", { name: "Oculta" })).toBeInTheDocument();
  expect(screen.getByText(/3 de 4 disponíveis/)).toBeInTheDocument();
  expect(within(table).getByRole("switch", { name: "Disponibilizar Cultura" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );

  await user.click(save);

  expect(await screen.findByText("Disponibilidade dos assuntos atualizada.")).toBeInTheDocument();
  expect(requisitar).toHaveBeenLastCalledWith("/admin/categories", {
    method: "PUT",
    body: { categories: updatedCategories.map(({ id, available }) => ({ id, available })) },
  });
  expect(save).toBeDisabled();
});
