import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { generationWorker } from "../../ai/src/generation.js";
import { createPool } from "../../backend/src/database/index.js";
import { decryptMail } from "../../backend/src/modules/accounts/mail-crypto.js";
import { configuration } from "../../backend/src/shared.js";

const pool = createPool(process.env.DATABASE_URL);
let eventId, conceptId, articleId;
test.beforeAll(async () => {
  const source = (
    await pool.query(
      "INSERT INTO sources(slug,name,feed_url,attribution,internal_reading) VALUES($1,'Fonte de teste',$2,'Fonte de teste',true) RETURNING id",
      [`e2e-${randomUUID()}`, `https://example.test/${randomUUID()}`],
    )
  ).rows[0];
  eventId = (
    await pool.query(
      "INSERT INTO events(title,summary,status,started_at,topics) VALUES('Decisão de juros no teste','O comitê anunciou uma decisão sobre a taxa de juros.','processed',now(),'{Juros}') RETURNING id",
    )
  ).rows[0].id;
  articleId = (
    await pool.query(
      "INSERT INTO articles(source_id,url,title,content,processing_status,published_at) VALUES($1,$2,'Publicação sobre juros','Os juros representam o custo do crédito. A decisão pode influenciar o consumo e a atividade econômica.','processed',now()) RETURNING id",
      [source.id, `https://example.test/${randomUUID()}`],
    )
  ).rows[0].id;
  await pool.query("INSERT INTO event_articles(article_id,event_id) VALUES($1,$2)", [
    articleId,
    eventId,
  ]);
  conceptId = (
    await pool.query(
      "INSERT INTO concepts(name,description) VALUES($1,'Juros representam o custo do crédito.') RETURNING id",
      [`Juros do teste ${randomUUID()}`],
    )
  ).rows[0].id;
  await pool.query(
    "INSERT INTO event_concepts(event_id,concept_id,source_type,source_id,method,confidence) VALUES($1,$2,'article',$3,'fixture',1)",
    [eventId, conceptId, articleId],
  );
  for (let n = 0; n < 4; n++)
    await pool.query(
      'INSERT INTO question_bank(concept_id,prompt,options,correct_index,explanation,rubric) VALUES($1,$2,\'["Custo do crédito","Salário","Imposto","Câmbio"]\',0,\'Juros são o custo do crédito.\',\'Identificar custo do crédito\')',
      [conceptId, `Questão ${n + 1}: o que representam juros?`],
    );
});
test.afterAll(async () => {
  await pool.end();
});
test("ciclo real de leitura, lacuna, revisão e adaptação persiste no navegador", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": "10.51.0.1" });
  const email = `mvp-browser-${randomUUID()}@example.test`;
  await page.goto("/paginaCadastro");
  await page.getByLabel("Nome completo").fill("Leitor de Economia");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("senha-do-mvp-123");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/paginaInicialCliente$/);
  await page.getByRole("dialog").getByRole("button", { name: "Economia", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Juros", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Salvar interesses", exact: true })
    .click();
  await page.getByLabel("Como você se sente ao ler sobre economia?", { exact: false }).count();
  await page.locator("#familiaridade").selectOption("beginner");
  await expect(page.getByText(/Familiaridade salva/)).toBeVisible();
  const user = (await pool.query("SELECT * FROM users WHERE email=$1", [email])).rows[0];
  const mail = (await pool.query("SELECT body FROM mail_outbox WHERE user_id=$1", [user.id]))
    .rows[0];
  const text = decryptMail(mail.body, { OPERATIONS_TOKEN: process.env.OPERATIONS_TOKEN });
  const url = new URL(text.match(/https?:\/\/[^\s]+/)[0]);
  await page.goto(`/conta?action=verify&token=${url.searchParams.get("token")}`);
  await page.getByRole("button", { name: "Confirmar e-mail" }).click();
  await expect(page.getByText("E-mail confirmado", { exact: true })).toBeVisible();
  await page.goto(`/paginaEvento?id=${eventId}`);
  await expect(page.getByRole("heading", { name: "Decisão de juros no teste" })).toBeVisible();
  await page.getByRole("button", { name: "Não sei", exact: true }).click();
  await expect(page.getByText(/Lacuna registrada/)).toBeVisible();
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByText("Salvo na sua biblioteca")).toBeVisible();
  await page.getByRole("button", { name: "Explicar para mim" }).click();
  const config = configuration({ ...process.env, OPENAI_API_KEY: "fake-key-not-used" });
  await expect
    .poll(async () =>
      Number(
        (
          await pool.query(
            "SELECT count(*) FROM generation_tasks WHERE user_id=$1 AND operation='explanation'",
            [user.id],
          )
        ).rows[0].count,
      ),
    )
    .toBe(1);
  const run = async () => {
    const task = (
      await pool.query(
        "SELECT * FROM generation_tasks WHERE user_id=$1 AND operation='explanation' AND status='pending' ORDER BY created_at DESC LIMIT 1",
        [user.id],
      )
    ).rows[0];
    await generationWorker(pool, config, async (_config, input) => ({
      data: {
        text: input.context.concepts.some((c) => c.status === "mastered")
          ? "Como você já domina juros, vamos conectar a decisão ao consumo."
          : "Juros são o custo do crédito. Vamos entender esse conceito primeiro.",
        concepts: [],
      },
      usage: { input_tokens: 500, output_tokens: 60 },
    }))(task.id);
  };
  await run();
  await expect(
    page.getByText("Juros são o custo do crédito. Vamos entender esse conceito primeiro."),
  ).toBeVisible();
  for (let n = 0; n < 3; n++) {
    await page.goto("/paginaRevisoes");
    await page.getByRole("radio", { name: "Custo do crédito" }).check();
    await page.getByRole("button", { name: "Corrigir resposta" }).click();
    await expect(page.getByText(/Resposta correta/)).toBeVisible();
  }
  await page.goto(`/paginaEvento?id=${eventId}`);
  await expect(page.getByText("Dominado", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explicar para mim" }).click();
  await expect
    .poll(async () =>
      Number(
        (
          await pool.query(
            "SELECT count(*) FROM generation_tasks WHERE user_id=$1 AND status='pending'",
            [user.id],
          )
        ).rows[0].count,
      ),
    )
    .toBe(1);
  await run();
  await expect(page.getByText(/Como você já domina juros/)).toBeVisible();
  await page.goto("/paginaGuardados");
  await expect(page.getByRole("link", { name: "Decisão de juros no teste" })).toBeVisible();
  await page.screenshot({ path: "/tmp/wisen-mvp-event.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/artigo?id=${articleId}`);
  await page
    .getByLabel("Selecione no texto ou cole um trecho deste artigo")
    .fill("Os juros representam o custo do crédito.");
  await expect(page.getByRole("button", { name: "Explicar trecho" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: "/tmp/wisen-mvp-article-mobile.png", fullPage: true });
});
