import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { generationWorker } from "../../ai/src/generation.js";
import { buildApp } from "../../backend/src/app.js";
import { createPool } from "../../backend/src/database/index.js";
import { accountService } from "../../backend/src/modules/accounts/accounts.js";
import { decryptMail } from "../../backend/src/modules/accounts/mail-crypto.js";
import { budgetService } from "../../backend/src/modules/generation/budget.js";
import { createQueue } from "../../backend/src/queue/index.js";
import { configuration } from "../../backend/src/shared.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
const config = configuration({
  DATABASE_URL: process.env.TEST_DATABASE_URL,
  NODE_ENV: "test",
  OPERATIONS_TOKEN: process.env.TEST_OPERATIONS_TOKEN,
  OPENAI_API_KEY: "test-key-never-sent",
  AI_MONTHLY_LIMIT_BRL: "1",
});
let app, boss, user, cookie;
before(async () => {
  boss = await createQueue(config.DATABASE_URL);
  app = await buildApp({ pool, boss, config, logger: false });
  await app.ready();
  const r = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: "10.80.0.1",
    payload: {
      name: "Pessoa MVP",
      email: `mvp-${randomUUID()}@example.test`,
      password: "senha-muito-segura",
    },
  });
  assert.equal(r.statusCode, 201, r.body);
  user = r.json().user;
  cookie = r.headers["set-cookie"].split(";")[0];
});
after(async () => {
  await app?.close();
  await boss?.stop();
  await pool.end();
});
const call = (url, method = "GET", payload) =>
  app.inject({ url, method, payload, headers: { cookie }, remoteAddress: "10.80.0.2" });
test("verificação usa token único; geração exige e-mail verificado", async () => {
  const concept = (
    await pool.query(
      "INSERT INTO concepts(name,description) VALUES($1,'Conceito econômico') RETURNING id",
      [`Conceito ${randomUUID()}`],
    )
  ).rows[0];
  const denied = await call("/api/generations", "POST", {
    operation: "concept",
    conceptId: concept.id,
  });
  assert.equal(denied.statusCode, 403);
  const mail = (await pool.query("SELECT body FROM mail_outbox WHERE user_id=$1", [user.id]))
    .rows[0];
  const token = new URL(
    decryptMail(mail.body, config).match(/https?:\/\/[^\s]+/)[0],
  ).searchParams.get("token");
  const verified = await call("/api/account/verify", "POST", { token });
  assert.equal(verified.statusCode, 200, verified.body);
  assert.equal((await call("/api/account/verify", "POST", { token })).statusCode, 400);
  const task = await call("/api/generations", "POST", {
    operation: "concept",
    conceptId: concept.id,
  });
  assert.equal(task.statusCode, 202, task.body);
  await generationWorker(pool, config, async () => ({
    data: { text: "Explicação de economia.", concepts: [] },
    usage: { input_tokens: 300, output_tokens: 40 },
  }))(task.json().id);
  const result = await call(`/api/generations/${task.json().id}`);
  assert.equal(result.json().status, "completed", result.body);
  const other = await app.inject({ url: `/api/generations/${task.json().id}` });
  assert.equal(other.statusCode, 401);
  const unavailable = await buildApp({
    pool,
    boss: {
      send: async () => {
        throw new Error("Fila indisponível");
      },
    },
    config,
    logger: false,
  });
  try {
    const registered = await unavailable.inject({
      method: "POST",
      url: "/api/auth/register",
      remoteAddress: "10.80.0.55",
      payload: {
        name: "Conta recuperável",
        email: `queue-failure-${randomUUID()}@example.test`,
        password: "senha-recuperavel-123",
      },
    });
    assert.equal(registered.statusCode, 201, registered.body);
    assert.ok(registered.headers["set-cookie"]);
  } finally {
    await unavailable.close();
  }
});
test("reservas concorrentes não ultrapassam teto e consumo desconhecido permanece reservado", async () => {
  const budget = budgetService(pool, { ...config, AI_MONTHLY_LIMIT_BRL: 1 });
  const ids = [];
  for (let n = 0; n < 12; n++)
    ids.push(
      (
        await pool.query(
          "INSERT INTO generation_tasks(user_id,operation,cache_key,input) VALUES($1,'concept',$2,'{}') RETURNING *",
          [user.id, randomUUID()],
        )
      ).rows[0],
    );
  const attempts = await Promise.allSettled(
    ids.map((task) => budget.reserve(task, 100000, 100000)),
  );
  const successful = attempts.filter((r) => r.status === "fulfilled");
  assert.ok(successful.length > 0);
  assert.ok(successful.length < 12);
  const summary = await budget.summary();
  assert.ok(summary.committed <= summary.limit);
  const charge = successful[0].value;
  await budget.settle(charge.id, null);
  const unknown = (await pool.query("SELECT * FROM generation_charges WHERE id=$1", [charge.id]))
    .rows[0];
  assert.equal(unknown.status, "unknown");
  await budget.settle(charge.id, { input_tokens: 100, output_tokens: 20 });
  await budget.settle(charge.id, { input_tokens: 100, output_tokens: 20 });
  assert.ok((await budget.summary()).committed >= 0);
  // Free known unbilled reservations so subsequent scenarios are independent.
  for (const result of successful.slice(1)) await budget.settle(result.value.id, null, true);
});
test("questões não expõem gabarito; respostas são idempotentes e salvos persistem", async () => {
  const c = (
    await pool.query("INSERT INTO concepts(name) VALUES($1) RETURNING id", [
      `Juros ${randomUUID()}`,
    ])
  ).rows[0];
  const _q = (
    await pool.query(
      "INSERT INTO question_bank(concept_id,prompt,options,correct_index,explanation,rubric) VALUES($1,'O que são juros?','[\"Custo do crédito\",\"Imposto\",\"Salário\",\"Câmbio\"]',0,'Juros representam o custo do crédito.','Mencionar custo do crédito') RETURNING id",
      [c.id],
    )
  ).rows[0];
  await call("/api/interactions", "POST", {
    conceptId: c.id,
    type: "gap",
    requestId: randomUUID(),
  });
  const list = await call("/api/reviews");
  assert.equal(list.statusCode, 200, list.body);
  const review = list.json().items.find((r) => r.concept_id === c.id);
  assert.ok(review);
  assert.equal(review.question.correct_index, undefined);
  assert.equal(review.question.rubric, undefined);
  const { taskService } = await import("../../backend/src/modules/generation/tasks.js");
  const pendingTasks = taskService(pool, boss, config);
  const grade = await pendingTasks.create(user.id, {
    operation: "grade",
    reviewId: review.id,
    answer: "Juros representam o custo do crédito.",
    requestId: randomUUID(),
  });
  const repeated = await pendingTasks.create(user.id, {
    operation: "grade",
    reviewId: review.id,
    answer: "Juros representam o custo do crédito.",
    requestId: randomUUID(),
  });
  assert.equal(grade.id, repeated.id);
  const body = { reviewId: review.id, answer: 0, requestId: randomUUID() };
  const first = await call("/api/reviews/answer", "POST", body);
  assert.equal(first.statusCode, 200, first.body);
  assert.equal(first.json().correct, true);
  assert.equal((await call("/api/reviews/answer", "POST", body)).json().correct, true);
  const score = (
    await pool.query("SELECT mastery_score FROM user_concepts WHERE user_id=$1 AND concept_id=$2", [
      user.id,
      c.id,
    ])
  ).rows[0].mastery_score;
  assert.equal(score, 0.25);
  assert.equal((await call("/api/saved", "POST", { type: "concept", id: c.id })).statusCode, 200);
  assert.ok((await call("/api/saved")).json().items.some((s) => s.concept_id === c.id));
  assert.equal((await call("/api/admin/overview")).statusCode, 403);
  assert.equal((await call("/api/feed")).statusCode, 200);
});
test("recuperação invalida sessões e token não pode ser reutilizado", async () => {
  await accountService(pool, boss, config).request(user.id, "reset");
  const mail = (
    await pool.query("SELECT body FROM mail_outbox WHERE user_id=$1 AND subject LIKE 'Redefina%'", [
      user.id,
    ])
  ).rows[0];
  const token = new URL(
    decryptMail(mail.body, config).match(/https?:\/\/[^\s]+/)[0],
  ).searchParams.get("token");
  const result = await call("/api/account/reset", "POST", { token, password: "nova-senha-segura" });
  assert.equal(result.statusCode, 200, result.body);
  assert.equal((await call("/api/auth/session")).statusCode, 401);
  assert.equal(
    (await call("/api/account/reset", "POST", { token, password: "outra-senha-segura" }))
      .statusCode,
    400,
  );
});

test("análise estruturada cria evento, conceitos, relações e proveniência; curadoria persiste", async () => {
  const source = (
    await pool.query(
      "INSERT INTO sources(slug,name,feed_url,internal_reading) VALUES($1,'Fonte análise',$2,true) RETURNING id",
      [`analysis-${randomUUID()}`, `https://example.test/${randomUUID()}`],
    )
  ).rows[0];
  const article = (
    await pool.query(
      "INSERT INTO articles(source_id,url,title,content,processing_status,published_at) VALUES($1,$2,'Decisão de juros','A taxa Selic influencia os juros.','processed',now()) RETURNING id",
      [source.id, `https://example.test/${randomUUID()}`],
    )
  ).rows[0];
  const { taskService } = await import("../../backend/src/modules/generation/tasks.js");
  const tasks = taskService(pool, boss, config);
  const task = await tasks.create(null, { operation: "analysis", articleId: article.id });
  const name = `Selic ${randomUUID()}`,
    prerequisite = `Juros ${randomUUID()}`;
  await generationWorker(pool, config, async () => ({
    data: {
      title: "Decisão de juros",
      summary: "A taxa Selic influencia os juros.",
      event_id: null,
      topics: ["Juros"],
      concepts: [
        { name, description: "Taxa básica de juros.", alias_of: null, aliases: [] },
        { name: prerequisite, description: "Custo do crédito.", alias_of: null, aliases: [] },
      ],
      entities: [
        {
          name: "Banco Central de teste",
          type: "institution",
          description: "Autoridade monetária.",
        },
      ],
      relations: [
        {
          from: name,
          to: prerequisite,
          relation: "REQUIRES",
          evidence: "A taxa Selic influencia os juros.",
        },
      ],
    },
    usage: { input_tokens: 800, output_tokens: 300 },
  }))(task.id);
  const completed = (await pool.query("SELECT * FROM generation_tasks WHERE id=$1", [task.id]))
    .rows[0];
  assert.equal(completed.status, "completed", completed.error);
  const event = (
    await pool.query("SELECT event_id FROM event_articles WHERE article_id=$1", [article.id])
  ).rows[0];
  assert.ok(event);
  assert.equal(
    Number(
      (await pool.query("SELECT count(*) FROM event_concepts WHERE event_id=$1", [event.event_id]))
        .rows[0].count,
    ),
    2,
  );
  assert.ok(
    (
      await pool.query(
        "SELECT 1 FROM concept_relations WHERE source_id=$1 AND relation='REQUIRES'",
        [article.id],
      )
    ).rowCount,
  );
  // Authenticate a dedicated administrator rather than granting permissions via request data.
  const registered = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: "10.80.0.25",
    payload: {
      name: "Administrador",
      email: `admin-${randomUUID()}@example.test`,
      password: "senha-de-admin-123",
    },
  });
  const admin = registered.json().user;
  await pool.query("UPDATE users SET role='admin' WHERE id=$1", [admin.id]);
  const adminCookie = registered.headers["set-cookie"].split(";")[0];
  const change = await app.inject({
    method: "POST",
    url: "/api/admin/actions",
    headers: { cookie: adminCookie },
    payload: {
      action: "event",
      id: event.event_id,
      title: "Título revisado",
      summary: "Resumo revisado pelo administrador.",
    },
  });
  assert.equal(change.statusCode, 200, change.body);
  const updated = (await pool.query("SELECT * FROM events WHERE id=$1", [event.event_id])).rows[0];
  assert.equal(updated.curated, true);
  assert.equal(updated.title, "Título revisado");
  const exported = await app.inject({
    url: "/api/admin/export/results?dataset=generation",
    headers: { cookie: adminCookie },
  });
  assert.equal(exported.statusCode, 200, exported.body);
  assert.ok(exported.body.includes("latency_ms"));
  assert.ok(!exported.body.includes(admin.email));
});

test("interrupção real do processo conserva reserva e impede cobrança duplicada", async () => {
  const { spawn } = await import("node:child_process");
  const task = (
    await pool.query(
      "INSERT INTO generation_tasks(user_id,operation,cache_key,input) VALUES($1,'concept',$2,'{}') RETURNING *",
      [user.id, randomUUID()],
    )
  ).rows[0];
  const script = `import {createPool} from './backend/src/database/index.js';import {configuration} from './backend/src/shared.js';import {generationWorker} from './ai/src/generation.js';const config=configuration({...process.env,DATABASE_URL:process.env.TEST_DATABASE_URL,OPENAI_API_KEY:'fake-key-not-sent'});const pool=createPool(config.DATABASE_URL);setInterval(()=>{},1000);await generationWorker(pool,config,async()=>{process.send({started:true});await new Promise(()=>{});})(process.env.TEST_TASK_ID);`;
  const child = spawn(process.execPath, ["--input-type=module", "-e", script], {
    env: { ...process.env, TEST_TASK_ID: task.id, AI_MONTHLY_LIMIT_BRL: "1" },
    stdio: ["ignore", "ignore", "pipe", "ipc"],
  });
  let errors = "";
  child.stderr.on("data", (v) => {
    errors += v.toString();
  });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Worker não iniciou inferência: " + errors)),
        10000,
      );
      child.once("message", () => {
        clearTimeout(timer);
        resolve();
      });
      child.once("exit", () => {
        clearTimeout(timer);
        reject(new Error("Worker encerrou: " + errors));
      });
    });
    const exited = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGKILL");
    await exited;
    const reserved = (
      await pool.query("SELECT * FROM generation_charges WHERE task_id=$1 AND status='reserved'", [
        task.id,
      ])
    ).rows[0];
    assert.ok(reserved);
    await generationWorker(pool, config, () =>
      assert.fail("Consumo desconhecido não pode repetir chamada"),
    )(task.id);
    const paused = (await pool.query("SELECT status FROM generation_tasks WHERE id=$1", [task.id]))
      .rows[0];
    assert.equal(paused.status, "paused");
    await budgetService(pool, config).settle(reserved.id, { input_tokens: 0, output_tokens: 0 });
  } finally {
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
  }
});

test("exclusão remove histórico pessoal e sessão sem apagar custos agregados", async () => {
  const registered = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    remoteAddress: "10.80.0.26",
    payload: {
      name: "Excluir",
      email: `delete-${randomUUID()}@example.test`,
      password: "senha-de-exclusao",
    },
  });
  assert.equal(registered.statusCode, 201, registered.body);
  const account = registered.json().user;
  const accountCookie = registered.headers["set-cookie"].split(";")[0];
  const denied = await app.inject({
    method: "DELETE",
    url: "/api/account",
    headers: { cookie: accountCookie },
    payload: { confirmation: "não" },
  });
  assert.equal(denied.statusCode, 400);
  const deleted = await app.inject({
    method: "DELETE",
    url: "/api/account",
    headers: { cookie: accountCookie },
    payload: { confirmation: "EXCLUIR" },
  });
  assert.equal(deleted.statusCode, 200, deleted.body);
  assert.equal((await pool.query("SELECT 1 FROM users WHERE id=$1", [account.id])).rowCount, 0);
  assert.equal(
    (await pool.query("SELECT 1 FROM mail_outbox WHERE user_id=$1", [account.id])).rowCount,
    0,
  );
  assert.equal(
    (await app.inject({ url: "/api/auth/session", headers: { cookie: accountCookie } })).statusCode,
    401,
  );
});
