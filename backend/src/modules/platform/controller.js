import { z } from "zod";
import { transaction } from "../../database/index.js";
import { enqueue } from "../../queue/index.js";
import { QUEUES, SOURCES } from "../../shared.js";
import { budgetService } from "../generation/budget.js";
import { taskService } from "../generation/tasks.js";
import { learningService } from "./learning.js";
import { platformRead } from "./read.js";

const id = z.uuid();
const page = z.object({
  q: z.string().max(200).default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  order: z.enum(["personalized", "recent"]).default("personalized"),
  topic: z.string().max(120).default(""),
});
const missing = () => Object.assign(new Error("Conteúdo não encontrado"), { statusCode: 404 });
export function platformController(app, pool, boss, config) {
  const read = platformRead(pool),
    learning = learningService(pool),
    tasks = taskService(pool, boss, config),
    budget = budgetService(pool, config);
  const secured = { preHandler: app.authenticate };
  app.get("/api/feed", { ...secured, schema: { querystring: page } }, async (req) => ({
    items: await read.feed(req.user.id, req.query),
  }));
  app.get("/api/events/:id", { ...secured, schema: { params: z.object({ id }) } }, async (req) => {
    const data = await read.event(req.user.id, req.params.id);
    if (!data) throw missing();
    return data;
  });
  app.get("/api/reading/:id", { ...secured, schema: { params: z.object({ id }) } }, async (req) => {
    const data = await read.article(req.params.id);
    if (!data) throw missing();
    if (!data.internal_reading) data.content = null;
    return data;
  });
  app.get("/api/concepts", { ...secured, schema: { querystring: page } }, async (req) => ({
    items: await read.concepts(req.user.id, req.query),
  }));
  app.get(
    "/api/concepts/:id",
    { ...secured, schema: { params: z.object({ id }) } },
    async (req) => {
      const data = await read.concept(req.user.id, req.params.id);
      if (!data) throw missing();
      return data;
    },
  );
  app.get(
    "/api/discover",
    { ...secured, schema: { querystring: z.object({ q: z.string().trim().min(2).max(200) }) } },
    (req) => read.search(req.user.id, req.query.q),
  );
  app.get("/api/knowledge", secured, async (req) => ({ items: await read.knowledge(req.user.id) }));
  app.get("/api/reviews", secured, async (req) => ({ items: await read.reviews(req.user.id) }));
  app.post(
    "/api/reviews/answer",
    {
      ...secured,
      schema: {
        body: z.object({ reviewId: id, answer: z.number().int().min(0).max(3), requestId: id }),
      },
    },
    (req) => learning.answer(req.user.id, req.body),
  );
  app.post(
    "/api/interactions",
    {
      ...secured,
      schema: {
        body: z.object({
          conceptId: id,
          type: z.enum(["gap", "exposure", "explanation"]),
          requestId: id,
        }),
      },
    },
    (req) => learning.interact(req.user.id, req.body),
  );
  app.put(
    "/api/preferences/familiarity",
    {
      ...secured,
      schema: {
        body: z.object({ familiarity: z.enum(["beginner", "basic", "experienced"]).nullable() }),
      },
    },
    async (req) => {
      await pool.query(
        "UPDATE user_preferences SET familiarity=$2,knowledge_version=knowledge_version+1 WHERE user_id=$1",
        [req.user.id, req.body.familiarity],
      );
      return { saved: true };
    },
  );
  app.get(
    "/api/preferences/familiarity",
    secured,
    async (req) =>
      (await pool.query("SELECT familiarity FROM user_preferences WHERE user_id=$1", [req.user.id]))
        .rows[0],
  );
  app.get("/api/saved", secured, async (req) => ({ items: await read.saved(req.user.id) }));
  app.post(
    "/api/saved",
    {
      ...secured,
      schema: { body: z.object({ type: z.enum(["article", "event", "concept"]), id }) },
    },
    async (req) => {
      const column = { article: "article_id", event: "event_id", concept: "concept_id" }[
        req.body.type
      ];
      const item =
        req.body.type === "article"
          ? await read.article(req.body.id)
          : req.body.type === "event"
            ? await read.event(req.user.id, req.body.id)
            : await read.concept(req.user.id, req.body.id);
      if (!item) throw missing();
      await pool.query(
        `INSERT INTO saved_contents(user_id,${column}) VALUES($1,$2) ON CONFLICT(user_id,${column}) DO NOTHING`,
        [req.user.id, req.body.id],
      );
      return { saved: true };
    },
  );
  app.delete(
    "/api/saved/:id",
    { ...secured, schema: { params: z.object({ id }) } },
    async (req) => {
      await pool.query("DELETE FROM saved_contents WHERE id=$1 AND user_id=$2", [
        req.params.id,
        req.user.id,
      ]);
      return { saved: false };
    },
  );
  const generationBody = z
    .object({
      operation: z.enum(["explanation", "concept", "passage", "deepen", "grade"]),
      eventId: id.optional(),
      articleId: id.optional(),
      conceptId: id.optional(),
      reviewId: id.optional(),
      passage: z.string().min(1).max(5000).optional(),
      answer: z.string().min(1).max(5000).optional(),
      requestId: id.optional(),
    })
    .superRefine((v, ctx) => {
      if (
        v.operation === "grade"
          ? !v.reviewId || !v.answer || !v.requestId
          : Number(!!v.eventId) + Number(!!v.articleId) + Number(!!v.conceptId) !== 1
      )
        ctx.addIssue({ code: "custom", message: "Selecione um conteúdo ou uma revisão válida" });
      if (v.operation === "passage" && (!v.articleId || !v.passage))
        ctx.addIssue({ code: "custom", message: "Selecione um trecho de artigo" });
    });
  app.post(
    "/api/generations",
    { ...secured, schema: { body: generationBody } },
    async (req, reply) => {
      const user = (
        await pool.query("SELECT email_verified_at FROM users WHERE id=$1", [req.user.id])
      ).rows[0];
      if (!user.email_verified_at)
        return reply.code(403).send({
          code: "EMAIL_UNVERIFIED",
          message: "Confirme seu e-mail para gerar explicações",
        });
      return reply.code(202).send(await tasks.create(req.user.id, req.body));
    },
  );
  app.get(
    "/api/generations/:id",
    { ...secured, schema: { params: z.object({ id }) } },
    async (req) => {
      const task = await tasks.get(req.user.id, req.params.id);
      if (!task) throw missing();
      return task;
    },
  );
  app.post(
    "/api/generations/:id/feedback",
    {
      ...secured,
      schema: {
        params: z.object({ id }),
        body: z.object({ useful: z.boolean(), clear: z.boolean(), unnecessary: z.boolean() }),
      },
    },
    async (req) => {
      if (!(await tasks.get(req.user.id, req.params.id))) throw missing();
      await pool.query(
        "INSERT INTO explanation_feedback(user_id,task_id,useful,clear,unnecessary) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,task_id) DO UPDATE SET useful=excluded.useful,clear=excluded.clear,unnecessary=excluded.unnecessary",
        [req.user.id, req.params.id, req.body.useful, req.body.clear, req.body.unnecessary],
      );
      return { saved: true };
    },
  );
  const admin = {
    preHandler: async (req, reply) => {
      await app.authenticate(req, reply);
      if (reply.sent) return;
      if (req.user.role !== "admin")
        return reply.code(403).send({ message: "Acesso administrativo necessário" });
    },
  };
  app.get("/api/admin/overview", admin, async () => ({
    budget: await budget.summary(),
    integrations: {
      ai: !!config.OPENAI_API_KEY,
      email: !!(config.RESEND_API_KEY && config.EMAIL_FROM),
    },
    counts: (
      await pool.query(
        `SELECT (SELECT count(*) FROM users) users,(SELECT count(*) FROM articles) articles,(SELECT count(*) FROM events WHERE lifecycle_status='active') events,(SELECT count(*) FROM concepts) concepts,(SELECT count(*) FROM generation_tasks WHERE status IN ('failed','paused')) errors`,
      )
    ).rows[0],
  }));
  const lists = {
    sources: "SELECT * FROM sources ORDER BY name",
    articles:
      "SELECT id,title,url,processing_status,last_error,visible,source_id FROM articles ORDER BY created_at DESC LIMIT 100",
    events: "SELECT * FROM events ORDER BY updated_at DESC LIMIT 100",
    concepts:
      "SELECT c.*,COALESCE((SELECT jsonb_agg(alias) FROM concept_aliases WHERE concept_id=c.id),'[]') aliases FROM concepts c ORDER BY name LIMIT 100",
    entities: "SELECT * FROM entities ORDER BY name LIMIT 100",
    users:
      "SELECT id,name,email,role,active,email_verified_at,generation_limit FROM users ORDER BY created_at DESC LIMIT 100",
    tasks:
      "SELECT id,operation,status,error,created_at FROM generation_tasks ORDER BY created_at DESC LIMIT 100",
    charges:
      "SELECT id,task_id,model,reserved_brl,actual_brl,status,created_at FROM generation_charges ORDER BY created_at DESC LIMIT 100",
    audit: "SELECT * FROM admin_audit ORDER BY created_at DESC LIMIT 100",
  };
  app.get(
    "/api/admin/:resource",
    { ...admin, schema: { params: z.object({ resource: z.enum(Object.keys(lists)) }) } },
    async (req) => ({ items: (await pool.query(lists[req.params.resource])).rows }),
  );
  const action = z.discriminatedUnion("action", [
    z.object({ action: z.literal("source"), id, enabled: z.boolean() }),
    z.object({ action: z.literal("collect"), id }),
    z.object({ action: z.literal("article"), id, visible: z.boolean() }),
    z.object({ action: z.literal("reprocess"), id }),
    z.object({
      action: z.literal("user"),
      id,
      active: z.boolean(),
      generationLimit: z.number().int().min(1).max(10000),
    }),
    z.object({
      action: z.literal("concept"),
      id,
      name: z.string().trim().min(1).max(150),
      description: z.string().min(1).max(5000),
      aliases: z.array(z.string().trim().min(1).max(150)).max(20),
    }),
    z.object({
      action: z.literal("event"),
      id,
      title: z.string().min(1).max(300),
      summary: z.string().min(1).max(10000),
    }),
    z.object({ action: z.literal("merge"), id, targetId: id }),
    z.object({ action: z.literal("move"), id, targetId: id.nullable() }),
    z.object({
      action: z.literal("relation"),
      id,
      targetId: id,
      relation: z.enum(["REQUIRES", "RELATED_TO", "PART_OF"]),
      remove: z.boolean(),
    }),
    z.object({ action: z.literal("retry"), id }),
    z.object({
      action: z.literal("reconcile"),
      id,
      inputTokens: z.number().int().min(0),
      outputTokens: z.number().int().min(0),
      confirmed: z.literal(true),
    }),
  ]);
  app.post("/api/admin/actions", { ...admin, schema: { body: action } }, async (req) => {
    await transaction(pool, async (c) => {
      await c.query("SELECT pg_advisory_xact_lock(891723)");
      const b = req.body;
      const table = {
        source: "sources",
        collect: "sources",
        article: "articles",
        reprocess: "articles",
        user: "users",
        concept: "concepts",
        event: "events",
        merge: "events",
        move: "articles",
        relation: "concepts",
        retry: "generation_tasks",
        reconcile: "generation_charges",
      }[b.action];
      const before = (
        await c.query(
          `SELECT to_jsonb(t)-'password_hash'-'input'-'result'-'avatar_data_url'-'email'-'name' data FROM ${table} t WHERE id=$1 FOR UPDATE`,
          [b.id],
        )
      ).rows[0];
      if (!before) throw missing();
      if (b.action === "source")
        await c.query("UPDATE sources SET enabled=$2 WHERE id=$1", [b.id, b.enabled]);
      if (b.action === "collect") {
        if (!SOURCES.some((s) => s.feed === before.data.feed_url)) throw missing();
        await enqueue(boss, c, QUEUES.collect, { sourceId: b.id });
      }
      if (b.action === "article")
        await c.query("UPDATE articles SET visible=$2,curated=true,updated_at=now() WHERE id=$1", [
          b.id,
          b.visible,
        ]);
      if (b.action === "reprocess") {
        await c.query(
          "UPDATE articles SET processing_status='pending',embedding_version=NULL WHERE id=$1",
          [b.id],
        );
        await c.query("DELETE FROM generation_tasks WHERE article_id=$1 AND operation='analysis'", [
          b.id,
        ]);
        await c.query("DELETE FROM article_analyses WHERE article_id=$1", [b.id]);
        await enqueue(boss, c, QUEUES.article, { articleId: b.id });
      }
      if (b.action === "user") {
        if (b.id === req.user.id && !b.active)
          throw Object.assign(new Error("Não desative a própria conta"), { statusCode: 400 });
        await c.query("UPDATE users SET active=$2,generation_limit=$3 WHERE id=$1", [
          b.id,
          b.active,
          b.generationLimit,
        ]);
        if (!b.active) await c.query("DELETE FROM auth_sessions WHERE user_id=$1", [b.id]);
      }
      if (b.action === "concept") {
        await c.query("UPDATE concepts SET name=$2,description=$3,curated=true WHERE id=$1", [
          b.id,
          b.name,
          b.description,
        ]);
        await c.query("DELETE FROM concept_aliases WHERE concept_id=$1", [b.id]);
        for (const alias of new Set([b.name, ...b.aliases]))
          await c.query("INSERT INTO concept_aliases(concept_id,alias) VALUES($1,$2)", [
            b.id,
            alias,
          ]);
      }
      if (b.action === "event")
        await c.query(
          "UPDATE events SET title=$2,summary=$3,curated=true,version=version+1,updated_at=now() WHERE id=$1",
          [b.id, b.title, b.summary],
        );
      if (b.action === "merge") {
        if (b.id === b.targetId)
          throw Object.assign(new Error("Escolha outro evento"), { statusCode: 400 });
        if (
          !(
            await c.query(
              "SELECT id FROM events WHERE id=$1 AND lifecycle_status='active' FOR UPDATE",
              [b.targetId],
            )
          ).rowCount
        )
          throw missing();
        await c.query(
          "UPDATE articles SET curated=true WHERE id IN (SELECT article_id FROM event_articles WHERE event_id=$1)",
          [b.id],
        );
        await c.query("UPDATE event_articles SET event_id=$2 WHERE event_id=$1", [
          b.id,
          b.targetId,
        ]);
        await c.query(
          "UPDATE events SET lifecycle_status='merged',curated=true,version=version+1 WHERE id=$1",
          [b.id],
        );
        await c.query(
          "UPDATE events SET curated=true,version=version+1,updated_at=now() WHERE id=$1",
          [b.targetId],
        );
      }
      if (b.action === "move") {
        let target = b.targetId;
        if (!target)
          target = (
            await c.query(
              "INSERT INTO events(title,started_at,status,curated) SELECT title,published_at,'processed',true FROM articles WHERE id=$1 RETURNING id",
              [b.id],
            )
          ).rows[0].id;
        if (
          !(
            await c.query(
              "SELECT id FROM events WHERE id=$1 AND lifecycle_status='active' FOR UPDATE",
              [target],
            )
          ).rowCount
        )
          throw missing();
        await c.query(
          "INSERT INTO event_articles(article_id,event_id) VALUES($1,$2) ON CONFLICT(article_id) DO UPDATE SET event_id=excluded.event_id",
          [b.id, target],
        );
        await c.query("UPDATE articles SET curated=true WHERE id=$1", [b.id]);
      }
      if (["move", "merge", "article", "reprocess"].includes(b.action)) {
        await c.query("DELETE FROM event_concepts WHERE method <> 'manual'");
        await c.query(
          "INSERT INTO event_concepts(event_id,concept_id,source_type,source_id,method,model,confidence) SELECT DISTINCT ON(ea.event_id,ac.concept_id) ea.event_id,ac.concept_id,ac.source_type,ac.source_id,ac.method,ac.model,ac.confidence FROM event_articles ea JOIN articles a ON a.id=ea.article_id AND a.visible JOIN article_concepts ac ON ac.article_id=a.id ORDER BY ea.event_id,ac.concept_id,ac.created_at DESC ON CONFLICT DO NOTHING",
        );
        await c.query("DELETE FROM event_entities WHERE method <> 'manual'");
        await c.query(
          "INSERT INTO event_entities(event_id,entity_id,source_type,source_id,method,model,confidence) SELECT DISTINCT ON(ea.event_id,ac.entity_id) ea.event_id,ac.entity_id,ac.source_type,ac.source_id,ac.method,ac.model,ac.confidence FROM event_articles ea JOIN articles a ON a.id=ea.article_id AND a.visible JOIN article_entities ac ON ac.article_id=a.id ORDER BY ea.event_id,ac.entity_id,ac.created_at DESC ON CONFLICT DO NOTHING",
        );
        await c.query("UPDATE events SET version=version+1");
      }
      if (b.action === "relation") {
        if (b.remove)
          await c.query(
            "DELETE FROM concept_relations WHERE from_id=$1 AND to_id=$2 AND relation=$3",
            [b.id, b.targetId, b.relation],
          );
        else
          await c.query(
            "INSERT INTO concept_relations(from_id,to_id,relation,source_type,source_id,method,confidence) VALUES($1,$2,$3,'user',$4,'manual',1) ON CONFLICT(from_id,to_id,relation) DO UPDATE SET method='manual',source_type=excluded.source_type,source_id=excluded.source_id,model=NULL,confidence=1",
            [b.id, b.targetId, b.relation, req.user.id],
          );
      }
      if (b.action === "reconcile") {
        const charge = before.data;
        const taskStatus = (
          await c.query("SELECT status FROM generation_tasks WHERE id=$1", [charge.task_id])
        ).rows[0]?.status;
        if (charge.status === "reserved" && taskStatus !== "paused")
          throw Object.assign(new Error("Aguarde o encerramento da chamada antes de reconciliar"), {
            statusCode: 409,
          });
        if (!["reserved", "unknown"].includes(charge.status))
          throw Object.assign(new Error("Consumo já reconciliado"), { statusCode: 409 });
        const actual =
          Math.ceil(
            ((b.inputTokens * Number(charge.input_rate) +
              b.outputTokens * Number(charge.output_rate)) /
              1e6) *
              Number(charge.fx) *
              Number(charge.margin) *
              1e8,
          ) / 1e8;
        await c.query("UPDATE budget_months SET committed_brl=committed_brl+$2-$3 WHERE month=$1", [
          charge.month,
          actual,
          charge.reserved_brl,
        ]);
        await c.query(
          "UPDATE generation_charges SET actual_brl=$2,input_tokens=$3,output_tokens=$4,status='completed' WHERE id=$1",
          [b.id, actual, b.inputTokens, b.outputTokens],
        );
      }
      if (b.action === "retry") {
        if (
          (
            await c.query(
              "SELECT 1 FROM generation_charges WHERE task_id=$1 AND status IN ('reserved','unknown')",
              [b.id],
            )
          ).rowCount
        )
          throw Object.assign(
            new Error("Reconcilie o consumo no provedor antes de tentar novamente"),
            { statusCode: 409 },
          );
        await c.query(
          "UPDATE generation_tasks SET status='pending',error=NULL WHERE id=$1 AND status IN ('failed','paused')",
          [b.id],
        );
        await enqueue(boss, c, QUEUES.generate, { id: b.id });
      }
      if (["concept", "relation"].includes(b.action))
        await c.query("UPDATE user_preferences SET knowledge_version=knowledge_version+1");
      if (
        ["article", "reprocess", "move", "merge", "concept", "relation", "event"].includes(b.action)
      ) {
        await c.query(
          "UPDATE generation_tasks SET status='failed',result=NULL,error='Conteúdo atualizado; solicite uma nova explicação',updated_at=now() WHERE operation IN ('explanation','concept','passage','deepen') AND status IN ('pending','processing','completed','paused')",
        );
        await c.query(
          "UPDATE search_requests SET status='failed',results=NULL,error='Conteúdo atualizado; realize uma nova busca' WHERE status='completed'",
        );
      }
      await c.query(
        "INSERT INTO admin_audit(actor_id,action,target_id,before_data,after_data) VALUES($1,$2,$3,$4,$5)",
        [req.user.id, b.action, b.id, JSON.stringify(before.data), JSON.stringify(b)],
      );
    });
    return { saved: true };
  });
  const exports = {
    interactions: {
      columns: ["participant", "type", "created_at", "concept_id", "score", "rule_version"],
      sql: "SELECT md5(i.user_id::text||$1) participant,i.type,i.created_at,i.concept_id,i.evidence->>'score' score,i.evidence->>'version' rule_version FROM user_interactions i ORDER BY i.created_at",
    },
    reviews: {
      columns: [
        "participant",
        "concept_id",
        "created_at",
        "correct",
        "mastery_before",
        "mastery_after",
      ],
      sql: "SELECT md5(r.user_id::text||$1) participant,r.concept_id,a.created_at,a.correct,a.mastery_before,a.mastery_after FROM review_attempts a JOIN reviews r ON r.id=a.review_id ORDER BY a.created_at",
    },
    knowledge: {
      columns: ["participant", "concept_id", "mastery_score", "status", "next_review"],
      sql: "SELECT md5(user_id::text||$1) participant,concept_id,mastery_score,status,next_review FROM user_concepts",
    },
    feedback: {
      columns: ["participant", "task_id", "useful", "clear", "unnecessary", "created_at"],
      sql: "SELECT md5(user_id::text||$1) participant,task_id,useful,clear,unnecessary,created_at FROM explanation_feedback",
    },
    generation: {
      columns: [
        "participant",
        "operation",
        "model",
        "input_tokens",
        "output_tokens",
        "actual_brl",
        "reserved_brl",
        "status",
        "created_at",
        "latency_ms",
      ],
      sql: "SELECT md5(g.user_id::text||$1) participant,t.operation,g.model,g.input_tokens,g.output_tokens,g.actual_brl,g.reserved_brl,g.status,g.created_at,g.latency_ms FROM generation_charges g LEFT JOIN generation_tasks t ON t.id=g.task_id",
    },
  };
  app.get(
    "/api/admin/export/results",
    {
      ...admin,
      schema: {
        querystring: z.object({ dataset: z.enum(Object.keys(exports)).default("interactions") }),
      },
    },
    async (req, reply) => {
      const dataset = exports[req.query.dataset];
      const rows = (await pool.query(dataset.sql, [config.OPERATIONS_TOKEN ?? "development"])).rows;
      const cell = (value) => {
        const text = String(value ?? "");
        return '"' + (/^[=+@\-\t\r]/.test(text) ? "'" : "") + text.replaceAll('"', '""') + '"';
      };
      return reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header("Content-Disposition", `attachment; filename="wisen-${req.query.dataset}.csv"`)
        .send(
          [
            dataset.columns.join(","),
            ...rows.map((row) => dataset.columns.map((key) => cell(row[key])).join(",")),
          ].join("\n"),
        );
    },
  );
}
