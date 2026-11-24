import { expect, test } from "@playwright/test";
import { createPool } from "../../backend/src/database/index.js";

let clientNumber = 1;
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.50.0.${clientNumber++}` });
});

test("endereços antigos preservam o destino e recuperação continua disponível", async ({
  page,
}) => {
  for (const path of ["/paginaLogin", "/paginaCadastro"]) {
    await page.goto(`${path}?next=%2FpaginaGuardados`);
    await expect(page).toHaveURL(/\/auth\?next=%2FpaginaGuardados$/);
    await expect(page.getByLabel("Senha", { exact: true })).toHaveCount(0);
  }
  const email = `recovery-${Date.now()}@example.test`;
  await page.request.post("/api/auth/register", { data: { email, password: "senha-segura-123" } });
  await page.context().clearCookies();
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Que bom te ver de novo.");
  await page.getByRole("button", { name: "Esqueci minha senha" }).click();
  await expect(page).toHaveURL(/\/auth\?next=%2FpaginaGuardados$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Recupere seu acesso.");
  await expect(page.getByLabel("E-mail")).toHaveValue(email);
});

test("onboarding retoma nome pendente e mantém nome salvo após recarregar", async ({ page }) => {
  const email = `resume-${Date.now()}@example.test`;
  await page.request.post("/api/auth/register", { data: { email, password: "senha-segura-123" } });
  await page.goto("/paginaInicialCliente");
  await expect(page.getByRole("textbox", { name: "Nome Completo" })).toBeVisible();
  await page.reload();
  await page.getByRole("textbox", { name: "Nome Completo" }).fill("Lia");
  await page.getByRole("combobox", { name: "Localização" }).fill("sao paulo brasil");
  await page.getByRole("option", { name: "São Paulo, Brasil", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Quais assuntos interessam a você?");
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Quais assuntos interessam a você?");
  const profile = await (await page.request.get("/api/auth/profile")).json();
  expect(profile.user.name).toBe("Lia");
  expect(profile.preferences.onboardingCompleted).toBe(false);
});

test("cadastro, rota privada, busca, logout e login funcionam no navegador", async ({ page }) => {
  const email = `playwright-${Date.now()}@example.test`;
  const password = "senha-de-playwright-123";

  await page.goto("/auth");
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("textbox", { name: "Nome Completo" }).fill("Pessoa Playwright");
  await page.getByRole("combobox", { name: "Localização" }).fill("sao paulo brasil");
  await page.getByRole("option", { name: "São Paulo, Brasil", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  const onboarding = page.getByRole("region", { name: "Personalize sua experiência" });
  await expect(onboarding).toBeVisible();
  await onboarding.getByRole("button", { name: "Economia", exact: true }).click();
  await onboarding.getByRole("button", { name: "Juros", exact: true }).click();
  await onboarding.getByRole("button", { name: "Tecnologia", exact: true }).click();
  await onboarding.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Entendo o básico").check();
  await page.getByRole("button", { name: "Concluir", exact: true }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Conceitos" }),
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
  await page.getByRole("dialog").getByRole("button", { name: "Conceitos" }).click();
  await expect(page).toHaveURL(/\/paginaBiblioteca$/);
  await expect(page.getByRole("heading", { name: /Biblioteca de conceitos/ })).toBeVisible();

  await page.getByRole("button", { name: "Abrir menu do perfil" }).click();
  await page.getByRole("button", { name: "Sair da conta" }).click();
  await expect(page).toHaveURL(/\/auth$/);
  expect((await page.context().cookies()).some((cookie) => cookie.name === "wisen_session")).toBe(
    false,
  );

  await page.goto("/paginaGuardados");
  await expect(page).toHaveURL(/\/auth\?next=/);
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: /^entrar/i }).click();
  await expect(page).toHaveURL(/\/paginaGuardados$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const session = await page.request.get("/api/auth/session");
  expect(session.ok()).toBe(true);
  expect((await session.json()).user.email).toBe(email);
});

test("formulário impede senha curta no navegador", async ({ page }) => {
  await page.goto("/auth");
  await page.getByLabel("E-mail").fill(`senha-curta-${Date.now()}@example.test`);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Senha", { exact: true }).fill("1234567");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/auth$/);
  await expect(page.getByLabel("Senha", { exact: true })).toBeFocused();
});

test("rotas de administração exigem sessão e papel de administrador", async ({ page }) => {
  await page.goto("/auth");
  await page.getByLabel("E-mail").fill(`admin-route-${Date.now()}@example.test`);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Senha", { exact: true }).fill("senha-de-teste-123");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByRole("textbox", { name: "Nome Completo" })).toBeVisible();

  await page.goto("/paginaGestaoUsuariosAdm");
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);

  await page.context().clearCookies();
  await page.goto("/paginaGestaoUsuariosAdm");
  await expect(page).toHaveURL(/\/auth\?next=/);
});

test("landing oferece entrada unificada em desktop e celular", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const navigation = page.getByRole("navigation", { name: "Navegação da plataforma" });
    await expect(navigation.getByRole("link")).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Abrir menu", exact: true })).toHaveCount(0);
    await navigation.getByRole("link", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeVisible();
  }
});

test("landing oferece acesso e navegação funcional em desktop e celular", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const navigation = page.getByRole("navigation", { name: "Navegação da plataforma" });
    await expect(navigation.getByRole("link", { name: "Entrar", exact: true })).toBeVisible();
    await expect(navigation.getByRole("link")).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Abrir menu", exact: true })).toHaveCount(0);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.getByRole("link", { name: "Veja como funciona" }).click();
    await expect(page).toHaveURL(/\/#sobre$/);
    await expect(page.getByRole("heading", { name: /Transforme informação/ })).toBeInViewport();
    const startLink = page.getByRole("link", { name: "Começar a usar o Wisen" });
    await startLink.scrollIntoViewIfNeeded();
    await expect(page.locator("#inicio")).not.toBeInViewport();
    await expect.poll(() => page.locator("video").evaluate((video) => video.paused)).toBe(true);
    await navigation.getByRole("link", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await page.goto("/");
    await startLink.click();
    await expect(page).toHaveURL(/\/auth$/);
  }
  await page.goto("/");
  await expect(page.locator('a[href="/paginaLanding"]')).toHaveCount(0);
});

test("perfil salva cartões independentemente, mantém alterações e encerra sessão", async ({
  page,
}) => {
  const email = `profile-${Date.now()}@example.test`;
  await page.goto("/auth");
  await page.getByLabel("E-mail").fill(email);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Senha", { exact: true }).fill("senha-de-perfil-123");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("textbox", { name: "Nome Completo" }).fill("Pessoa Perfil");
  await page.getByRole("combobox", { name: "Localização" }).fill("sao paulo brasil");
  await page.getByRole("option", { name: "São Paulo, Brasil", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  for (const name of ["Economia", "Juros", "Saúde"]) {
    await page.getByRole("button", { name, exact: true }).click();
  }
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Entendo o básico").check();
  await page.getByRole("button", { name: "Concluir", exact: true }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);
  await page.goto("/paginaPerfil");
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Pessoa Perfil");
  await page.getByLabel("Nome", { exact: true }).fill("Nome ainda não salvo");
  await page.getByRole("button", { name: "Saúde", exact: true }).click();
  await page.getByRole("button", { name: "Tecnologia", exact: true }).click();
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
  expect((await response.json()).preferences.interests).toEqual([
    "Economia",
    "Juros",
    "Tecnologia",
  ]);
  await page.getByRole("button", { name: /Encerrar sessão/ }).click();
  await expect(page).toHaveURL(/\/auth$/);
  await page.goto("/paginaPerfil");
  await expect(page).toHaveURL(/\/auth\?next=/);
});

test("admin fica na administração e pode sair em desktop e celular", async ({ page }) => {
  const email = `admin-isolation-${Date.now()}@example.test`;
  const password = "senha-admin-isolado-123";
  const registered = await page.request.post("/api/auth/register", {
    data: { name: "Administrador", email, password },
  });
  expect(registered.status()).toBe(201);
  const { user } = await registered.json();
  const pool = createPool(process.env.DATABASE_URL);
  try {
    await pool.query("UPDATE users SET role='admin' WHERE id=$1", [user.id]);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/auth?next=%2FpaginaInicialCliente");
      await page.getByLabel("E-mail").fill(email);
      await page.getByRole("button", { name: "Continuar", exact: true }).click();
      await page.getByLabel("Senha", { exact: true }).fill(password);
      await page.getByRole("button", { name: /^entrar/i }).click();
      await expect(page).toHaveURL(/\/paginaInicioAdm$/);
      await page.getByRole("button", { name: "Abrir menu do perfil" }).click();
      await expect(page.getByRole("link", { name: "Meu perfil" })).toHaveAttribute(
        "href",
        "/paginaPerfilAdm",
      );
      for (const path of ["/paginaInicialCliente", "/paginaPerfil", "/paginaSessaoRevisao"]) {
        await page.goto(path);
        await expect(page).toHaveURL(/\/paginaInicioAdm$/);
      }
      expect((await page.request.get("/api/feed")).status()).toBe(403);
      expect((await page.request.get("/api/admin/overview")).status()).toBe(200);
      await page.getByRole("button", { name: "Abrir menu do perfil" }).click();
      await page.getByRole("button", { name: "Sair da conta", exact: true }).click();
      await expect(page).toHaveURL(/\/auth$/);
      expect((await page.request.get("/api/auth/session")).status()).toBe(401);
    }
  } finally {
    await pool.end();
  }
});

test("gestão de usuários mostra o cadastro e a foto de perfil salvos", async ({ page }) => {
  const email = `admin-avatar-${Date.now()}@example.test`;
  const password = "senha-admin-avatar-123";
  const registered = await page.request.post("/api/auth/register", {
    data: { name: "Pessoa com Foto", email, password },
  });
  expect(registered.status()).toBe(201);
  const { user } = await registered.json();
  const avatarUrl = `/api/admin/users/${user.id}/avatar`;
  const photo =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jP1sAAAAASUVORK5CYII=";
  const uploaded = await page.request.put("/api/auth/avatar", {
    data: { avatarDataUrl: photo },
  });
  expect(uploaded.status()).toBe(200);
  expect((await page.request.get("/api/admin/users")).status()).toBe(403);
  expect((await page.request.get(avatarUrl)).status()).toBe(403);

  const pool = createPool(process.env.DATABASE_URL);
  try {
    await pool.query("UPDATE users SET role='admin' WHERE id=$1", [user.id]);
  } finally {
    await pool.end();
  }
  await page.route("**/api/account/status", (route) =>
    route.fulfill({ json: { aiProvider: "mock" } }),
  );
  await page.goto("/paginaGestaoUsuariosAdm");
  await page.getByRole("textbox", { name: "Buscar usuários por nome ou e-mail" }).fill(email);
  const account = page.getByRole("row").filter({ hasText: email });
  await expect(account).toContainText("Pessoa com Foto");
  const avatar = account.locator("img");
  await expect(avatar).toBeVisible();
  await expect(avatar).toHaveAttribute("src", avatarUrl);
  await expect.poll(() => avatar.evaluate((image) => image.naturalWidth)).toBe(1);

  const removed = await page.request.put("/api/auth/avatar", { data: { avatarDataUrl: null } });
  expect(removed.status()).toBe(200);
  expect((await page.request.get(avatarUrl)).status()).toBe(404);
  await page.reload();
  await page.getByRole("textbox", { name: "Buscar usuários por nome ou e-mail" }).fill(email);
  await expect(account.getByText("PC", { exact: true })).toBeVisible();
});

test("onboarding no celular exige três interesses e uma opção de familiaridade", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.request.post("/api/auth/register", {
    data: {
      name: "Pessoa Onboarding",
      email: `skip-${Date.now()}@example.test`,
      password: "senha-onboarding-123",
    },
  });
  await page.goto("/paginaInicialCliente");
  await expect(page.getByRole("button", { name: "Pular esta etapa" })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Localização" }).fill("sao paulo brasil");
  await page.getByRole("option", { name: "São Paulo, Brasil", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeDisabled();
  for (const name of ["Economia", "Juros", "Tecnologia"]) {
    await page.getByRole("dialog").getByRole("button", { name, exact: true }).click();
  }
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveAccessibleName(
    "Como você se sente ao ler sobre economia?",
  );
  await expect(page.getByRole("button", { name: "Concluir", exact: true })).toBeDisabled();
  await page.getByLabel("Estou começando").check();
  await page.getByRole("button", { name: "Concluir", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Suas notícias/ })).toBeVisible();
  await expect
    .poll(
      async () =>
        (await (await page.request.get("/api/auth/profile")).json()).preferences
          .onboardingCompleted,
    )
    .toBe(true);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
