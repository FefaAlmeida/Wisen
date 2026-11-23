import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test.afterEach(async ({ page }) => {
  await page.request.delete("/api/account", { data: { confirmation: "EXCLUIR" }, timeout: 5000 });
});

test("localização única mostra bandeiras, aceita busca e persiste após reload", async ({
  page,
}) => {
  const response = await page.request.post("/api/auth/register", {
    data: { email: `location-${randomUUID()}@example.test`, password: "senha-segura-e2e-123" },
  });
  expect(response.status()).toBe(201);
  await page.goto("/onboarding");
  await page.getByRole("textbox", { name: "Nome Completo" }).fill("Pessoa Localização");
  const location = page.getByRole("combobox", { name: "Localização" });
  await expect(page.getByRole("combobox")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeDisabled();
  await location.fill("sao paulo brasil");
  const option = page.getByRole("option", { name: "São Paulo, Brasil", exact: true });
  await expect(option.locator("img")).toHaveAttribute("src", "/flags/br.svg");
  await option.click();
  await expect(location).toHaveValue("São Paulo, Brasil");
  const layout = await page.getByRole("region", { name: /Personalize/ }).evaluate((panel) => {
    const body = panel.querySelector("#onboarding-name-form").parentElement.getBoundingClientRect();
    const form = panel.querySelector("#onboarding-name-form").getBoundingClientRect();
    return Math.abs((form.top + form.bottom) / 2 - (body.top + body.bottom) / 2);
  });
  expect(layout).toBeLessThan(3);
  const invalid = await page.request.put("/api/auth/profile", {
    data: { location: { countryCode: "US", stateId: 2021 } },
  });
  expect(invalid.status()).toBe(400);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Quais assuntos interessam a você?" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Quais assuntos interessam a você?" }),
  ).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "3");
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Nome Completo" })).toHaveValue(
    "Pessoa Localização",
  );
  await expect(location).toHaveValue("São Paulo, Brasil");
  await page.setViewportSize({ width: 390, height: 844 });
  await location.fill("Estados Unidos");
  await expect(page.getByRole("option", { name: /Estados Unidos/ }).first()).toBeVisible();
  await location.press("Escape");
  await expect(page.getByRole("button", { name: "Continuar", exact: true })).toBeDisabled();
  await location.fill("Anguila");
  await page.getByRole("option", { name: "Anguila", exact: true }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  for (const name of ["Economia", "Juros", "Tecnologia"]) {
    await page.getByRole("button", { name, exact: true }).click();
  }
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByLabel("Estou começando").check();
  await page.getByRole("button", { name: "Concluir", exact: true }).click();
  await expect(page).toHaveURL(/\/paginaInicialCliente$/);
  const profile = await page.request.get("/api/auth/profile");
  expect(profile.status()).toBe(200);
  expect((await profile.json()).location).toEqual({ countryCode: "AI", stateId: null });
  expect((await profile.json()).preferences.onboardingCompleted).toBe(true);
});
