import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/paginaLogin",
  "/paginaCadastro",
  "/paginaInicialCliente",
  "/paginaBiblioteca",
  "/paginaEvento",
  "/paginaConceito",
  "/paginaConhecimento",
  "/paginaRevisoes",
  "/paginaGuardados",
  "/paginaPerfil",
];
for (const route of routes) {
  test(`rota preservada: ${route}`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator("body")).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test("biblioteca permanece navegável em tela pequena", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/paginaBiblioteca");
  await expect(page.getByRole("heading", { name: "Biblioteca de conceitos" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
