import { expect, test } from "@playwright/test";

test("cadastro, rota privada, busca, logout e login funcionam no navegador", async ({ page }) => {
  const email = `playwright-${Date.now()}@example.test`;
  const password = "senha-de-playwright-123";

  await page.goto("/paginaCadastro");
  await page.getByLabel("Nome completo").fill("Pessoa Playwright");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);
  await expect(page.getByText("Pessoa Playwright")).toBeVisible();
  await expect(page.getByRole("link", { name: "Biblioteca" })).toBeVisible();

  const sessionCookie = (await page.context().cookies()).find(
    (cookie) => cookie.name === "wisen_session",
  );
  expect(sessionCookie?.httpOnly).toBe(true);

  const createdSearch = await page.evaluate(async () => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "inflação e taxa de juros" }),
    });
    return { status: response.status, body: await response.json() };
  });
  expect(createdSearch.status).toBe(202);
  expect(createdSearch.body.status).toBe("pending");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "Biblioteca" }).click();
  await expect(page).toHaveURL(/\/paginaBiblioteca$/);
  await expect(page.getByRole("heading", { name: "Biblioteca de conceitos" })).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/paginaLogin$/);
  expect((await page.context().cookies()).some((cookie) => cookie.name === "wisen_session")).toBe(
    false,
  );

  await page.goto("/paginaGuardados");
  await expect(page).toHaveURL(/\/paginaLogin\?next=/);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: /^entrar/i }).click();
  await expect(page).toHaveURL(/\/paginaGuardados$/);
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});

test("formulário impede senha curta no navegador", async ({ page }) => {
  await page.goto("/paginaCadastro");
  await page.getByLabel("Nome completo").fill("Pessoa");
  await page.getByLabel("E-mail").fill(`senha-curta-${Date.now()}@example.test`);
  await page.getByLabel("Senha", { exact: true }).fill("1234567");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/paginaCadastro$/);
  await expect(page.getByLabel("Senha", { exact: true })).toBeFocused();
});
