import { expect, test } from "@playwright/test";

let clientNumber = 1;
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.50.0.${clientNumber++}` });
});

test("cadastro, rota privada, busca, logout e login funcionam no navegador", async ({ page }) => {
  const email = `playwright-${Date.now()}@example.test`;
  const password = "senha-de-playwright-123";

  await page.goto("/paginaCadastro");
  await page.getByLabel("Nome completo").fill("Pessoa Playwright");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);
  const onboarding = page.getByRole("dialog", { name: "Quais assuntos interessam a você?" });
  await expect(onboarding).toBeVisible();
  await onboarding.getByRole("button", { name: "Economia", exact: true }).click();
  await onboarding.getByRole("button", { name: "Juros", exact: true }).click();
  await onboarding.getByRole("button", { name: "Salvar interesses", exact: true }).click();
  await expect(onboarding).not.toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Meu conhecimento" }),
  ).toBeVisible();

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
  await page.getByRole("button", { name: "Abrir menu de navegação" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Meu conhecimento" }).click();
  await expect(page).toHaveURL(/\/paginaBiblioteca$/);
  await expect(page.getByRole("heading", { name: /Biblioteca de conceitos/ })).toBeVisible();

  await page.getByRole("button", { name: "Abrir menu do perfil" }).click();
  await page.getByRole("button", { name: "Sair da conta" }).click();
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
  await expect(page.getByRole("heading", { name: "Conteúdos salvos", exact: true })).toBeVisible();
  const session = await page.request.get("/api/auth/session");
  expect(session.ok()).toBe(true);
  expect((await session.json()).user.email).toBe(email);
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

test("rotas de administração exigem sessão e papel de administrador", async ({ page }) => {
  await page.goto("/paginaCadastro");
  await page.getByLabel("Nome completo").fill("Pessoa comum");
  await page.getByLabel("E-mail").fill(`admin-route-${Date.now()}@example.test`);
  await page.getByLabel("Senha", { exact: true }).fill("senha-de-teste-123");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);

  await page.goto("/paginaGestaoUsuariosAdm");
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);

  await page.context().clearCookies();
  await page.goto("/paginaGestaoUsuariosAdm");
  await expect(page).toHaveURL(/\/paginaLogin\?next=/);
});

test("landing oferece acesso e navegação funcional em desktop e celular", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const navigation = page.getByRole("navigation", { name: "Navegação da plataforma" });
    await expect(navigation.getByRole("link", { name: "Entrar", exact: true })).toBeVisible();
    await expect(navigation.getByRole("link", { name: "Criar conta", exact: true })).toBeVisible();
    await expect(navigation.getByRole("link", { name: "Acessar plataforma" })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.getByRole("link", { name: "Ver como funciona" }).click();
    await expect(page).toHaveURL(/\/#sobre$/);
    await navigation.getByRole("link", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL(/\/paginaLogin$/);
    await page.goto("/");
    await page.getByRole("link", { name: "Começar agora" }).click();
    await expect(page).toHaveURL(/\/paginaCadastro$/);
  }
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Navegação da plataforma" })
    .getByRole("link", { name: "Acessar plataforma" })
    .click();
  await expect(page).toHaveURL(/\/paginaLogin\?next=%2FpaginaInicialCliente$/);
  await page.goto("/");
  await expect(page.locator('a[href="/paginaLanding"]')).toHaveCount(0);
});

test("perfil salva cartões independentemente, mantém alterações e encerra sessão", async ({
  page,
}) => {
  const email = `profile-${Date.now()}@example.test`;
  await page.goto("/paginaCadastro");
  await page.getByLabel("Nome completo").fill("Pessoa Perfil");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("senha-de-perfil-123");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);
  await page.goto("/paginaPerfil");
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Pessoa Perfil");
  await page.getByLabel("Nome", { exact: true }).fill("Nome ainda não salvo");
  await page.getByRole("button", { name: "Juros", exact: true }).click();
  await page.getByRole("button", { name: "Economia", exact: true }).click();
  await page.getByRole("button", { name: "Salvar interesses" }).click();
  await expect(page.getByText("Assuntos de interesse salvos.")).toBeVisible();
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Nome ainda não salvo");
  let response = await page.request.get("/api/auth/profile");
  expect((await response.json()).user.name).toBe("Pessoa Perfil");
  await page.getByRole("switch", { name: "Resumo semanal" }).click();
  await page.getByRole("button", { name: "Salvar notificações" }).click();
  await expect(page.getByText("Notificações salvas.")).toBeVisible();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("Perfil atualizado com sucesso!")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Nome ainda não salvo");
  await expect(page.getByRole("switch", { name: "Resumo semanal" })).toBeChecked();
  response = await page.request.get("/api/auth/profile");
  expect((await response.json()).preferences.interests).toEqual(["Juros", "Economia"]);
  await page.getByRole("button", { name: /Encerrar sessão/ }).click();
  await expect(page).toHaveURL(/\/paginaLogin$/);
  await page.goto("/paginaPerfil");
  await expect(page).toHaveURL(/\/paginaLogin\?next=/);
});
