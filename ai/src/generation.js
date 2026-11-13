import { randomUUID } from "node:crypto";
import { z } from "zod";
import { transaction, vectorLiteral } from "../../backend/src/database/index.js";
import { budgetService } from "../../backend/src/modules/generation/budget.js";
import { generationMode } from "../../backend/src/modules/generation/mode.js";
import {
  analysisSchema,
  explanationSchema,
  generateStructured,
  gradeSchema,
  questionsSchema,
} from "../../backend/src/modules/generation/provider.js";
import { analysisCandidates, PROMPT_VERSION } from "../../backend/src/modules/generation/tasks.js";
import { recordEvidence } from "../../backend/src/modules/platform/learning.js";
import { MODEL_VERSION } from "../../backend/src/shared.js";

const analysisValidation = z.object({
  title: z.string().min(1).max(300),
  summary: z.string().min(1).max(10000),
  event_id: z.uuid().nullable(),
  topics: z.array(z.string().max(120)).max(20),
  concepts: z
    .array(
      z.object({
        name: z.string().min(1).max(150),
        description: z.string().min(1).max(5000),
        alias_of: z.uuid().nullable(),
        aliases: z.array(z.string().min(1).max(150)).max(10),
      }),
    )
    .max(30),
  entities: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        type: z.string().max(80),
        description: z.string().max(3000),
      }),
    )
    .max(30),
  relations: z
    .array(
      z.object({
        from: z.string(),
        to: z.string(),
        relation: z.enum(["REQUIRES", "RELATED_TO", "PART_OF"]),
        evidence: z.string().min(1),
      }),
    )
    .max(50),
});
const questionsValidation = z.object({
  questions: z
    .array(
      z.object({
        prompt: z.string().min(10).max(1500),
        options: z
          .array(z.string().min(1).max(800))
          .length(4)
          .refine((a) => new Set(a).size === 4),
        correct_index: z.number().int().min(0).max(3),
        explanation: z.string().min(1).max(2000),
        rubric: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(6),
});
export function generationWorker(pool, config, provider = generateStructured, embedder = null) {
  const budget = budgetService(pool, config);
  const mock = generationMode(config) === "mock";
  return async (id) => {
    // Session advisory lock prevents duplicate provider calls after task retries.
    const lock = await pool.connect();
    let locked = false;
    let charge;
    try {
      locked = (
        await lock.query("SELECT pg_try_advisory_lock(hashtextextended($1,0)) locked", [id])
      ).rows[0].locked;
      if (!locked) return;
      const task = (await pool.query("SELECT * FROM generation_tasks WHERE id=$1", [id])).rows[0];
      if (!task || ["completed", "failed"].includes(task.status)) return;
      if (
        (
          await pool.query(
            "SELECT 1 FROM generation_charges WHERE task_id=$1 AND status IN ('reserved','unknown')",
            [id],
          )
        ).rowCount
      ) {
        await pool.query(
          "UPDATE generation_tasks SET status='paused',error='Consumo anterior desconhecido; reconciliação administrativa necessária' WHERE id=$1",
          [id],
        );
        return;
      }
      if (!mock && !config.OPENAI_API_KEY) {
        await pool.query(
          "UPDATE generation_tasks SET status='paused',error='Configure OPENAI_API_KEY para habilitar geração' WHERE id=$1",
          [id],
        );
        return;
      }
      if (task.operation === "analysis") {
        Object.assign(task.input.context, await analysisCandidates(pool, task.article_id));
        await pool.query("UPDATE generation_tasks SET input=$2 WHERE id=$1", [
          task.id,
          JSON.stringify(task.input),
        ]);
      }
      const schema =
        task.operation === "analysis"
          ? analysisSchema
          : task.operation === "questions"
            ? questionsSchema
            : task.operation === "grade"
              ? gradeSchema
              : explanationSchema;
      // UTF-8 bytes are a conservative bound on input tokens, with framing allowance.
      const inputBound =
        Buffer.byteLength(JSON.stringify(task.input)) +
        Buffer.byteLength(JSON.stringify(schema)) +
        3000;
      if (!mock) {
        charge = await budget.reserve(task, inputBound, config.AI_MAX_OUTPUT_TOKENS);
        if (!charge) return;
      }
      await pool.query(
        "UPDATE generation_tasks SET status='processing',error=NULL,updated_at=now() WHERE id=$1",
        [id],
      );
      const started = performance.now();
      const response = await provider(config, task.input, schema, task.operation);
      if (charge) {
        await pool.query("UPDATE generation_charges SET latency_ms=$2 WHERE id=$1", [
          charge.id,
          Math.round(performance.now() - started),
        ]);
        await budget.settle(charge.id, response.usage);
        charge = null;
      }
      if (!response.data) throw new Error("Resposta incompleta do modelo; tente novamente");
      const data =
        task.operation === "analysis"
          ? analysisValidation.parse(response.data)
          : task.operation === "questions"
            ? questionsValidation.parse(response.data)
            : task.operation === "grade"
              ? z
                  .object({
                    verdict: z.enum(["correct", "partial", "incorrect"]),
                    feedback: z.string().max(5000),
                  })
                  .parse(response.data)
              : z
                  .object({ text: z.string().min(1).max(20000), concepts: z.array(z.string()) })
                  .parse(response.data);
      const vectors = new Map();
      if (task.operation === "analysis" && embedder)
        for (const concept of data.concepts)
          vectors.set(
            concept.name,
            await embedder.embed(`${concept.name}: ${concept.description}`),
          );
      await transaction(pool, async (c) => {
        const current = (
          await c.query("SELECT status FROM generation_tasks WHERE id=$1 FOR UPDATE", [id])
        ).rows[0];
        if (current?.status !== "processing")
          throw new Error("Conteúdo atualizado durante a geração");
        if (task.operation === "analysis") await saveAnalysis(c, task, data, config, vectors);
        if (task.operation === "questions") {
          for (const q of data.questions)
            await c.query(
              "INSERT INTO question_bank(concept_id,prompt,options,correct_index,explanation,rubric) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
              [
                task.concept_id,
                q.prompt,
                JSON.stringify(q.options),
                q.correct_index,
                q.explanation,
                q.rubric,
              ],
            );
          await c.query(
            `INSERT INTO reviews(user_id,concept_id,due_at,format,question,question_id) SELECT uc.user_id,uc.concept_id,COALESCE(uc.next_review,now()),'recognition',jsonb_build_object('prompt',q.prompt,'options',q.options),q.id FROM user_concepts uc CROSS JOIN LATERAL(SELECT * FROM question_bank WHERE concept_id=uc.concept_id ORDER BY created_at LIMIT 1) q WHERE uc.concept_id=$1 ON CONFLICT(user_id,concept_id) WHERE completed_at IS NULL DO NOTHING`,
            [task.concept_id],
          );
        }
        if (task.operation === "grade") {
          await c.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [task.user_id]);
          const review = (
            await c.query("SELECT * FROM reviews WHERE id=$1 AND user_id=$2 FOR UPDATE", [
              task.review_id,
              task.user_id,
            ])
          ).rows[0];
          if (!review || review.completed_at) throw new Error("Revisão já concluída");
          const requestId = task.input.context.requestId ?? randomUUID();
          const before =
            (
              await c.query(
                "SELECT mastery_score FROM user_concepts WHERE user_id=$1 AND concept_id=$2",
                [task.user_id, task.concept_id],
              )
            ).rows[0]?.mastery_score ?? 0;
          const repeated = (
            await c.query(
              "SELECT 1 FROM review_attempts a JOIN reviews r ON r.id=a.review_id WHERE r.user_id=$1 AND r.question_id=$2 AND a.correct AND a.created_at>now()-interval '24 hours'",
              [task.user_id, review.question_id],
            )
          ).rowCount;
          const next =
            repeated || mock
              ? { score: before }
              : await recordEvidence(
                  c,
                  task.user_id,
                  task.concept_id,
                  data.verdict,
                  requestId,
                  task.review_id,
                );
          if (repeated || mock)
            await c.query("UPDATE reviews SET completed_at=now() WHERE id=$1", [review.id]);
          await c.query(
            "INSERT INTO review_attempts(review_id,answer,correct,feedback,mastery_before,mastery_after,request_id) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(request_id) DO NOTHING",
            [
              task.review_id,
              JSON.stringify({ text: task.input.context.answer }),
              data.verdict === "correct",
              data.feedback,
              before,
              next.score,
              requestId,
            ],
          );
        }
        // Never expose model-generated answer keys or analysis internals to readers.
        const publicResult =
          task.operation === "questions" ? { message: "Questões disponíveis para revisão" } : data;
        if (mock) publicResult.mock = true;
        await c.query(
          "UPDATE generation_tasks SET status='completed',result=$2,error=NULL,updated_at=now() WHERE id=$1",
          [id, JSON.stringify(publicResult)],
        );
      });
    } catch (error) {
      if (charge) await budget.settle(charge.id, null, error.definitelyUnbilled === true);
      await pool.query(
        "UPDATE generation_tasks SET status=$2,error=$3,updated_at=now() WHERE id=$1",
        [
          id,
          [
            "BUDGET_EXHAUSTED",
            "PROVIDER_NOT_CONFIGURED",
            "DAILY_LIMIT",
            "EMAIL_UNVERIFIED",
          ].includes(error.code)
            ? "paused"
            : "failed",
          error.code ?? "Não foi possível concluir a geração",
        ],
      );
    } finally {
      if (locked) await lock.query("SELECT pg_advisory_unlock(hashtextextended($1,0))", [id]);
      lock.release();
    }
  };
}
async function saveAnalysis(c, task, data, config, vectors) {
  const mock = generationMode(config) === "mock";
  await c.query("SELECT pg_advisory_xact_lock(891723)");
  const article = (
    await c.query("SELECT * FROM articles WHERE id=$1 FOR UPDATE", [task.article_id])
  ).rows[0];
  if (!article?.visible) throw new Error("Artigo indisponível");
  let eventId = data.event_id;
  if (eventId && !task.input.context.candidateEvents.some((e) => e.id === eventId))
    throw new Error("Evento fora dos candidatos");
  const previous = (
    await c.query("SELECT event_id FROM event_articles WHERE article_id=$1", [article.id])
  ).rows[0];
  if (article.curated && previous) eventId = previous.event_id;
  if (!eventId)
    eventId = (
      await c.query(
        "INSERT INTO events(title,summary,started_at,status,topics) VALUES($1,$2,$3,'processed',$4) RETURNING id",
        [data.title, data.summary, article.published_at, data.topics],
      )
    ).rows[0].id;
  else
    await c.query(
      "UPDATE events SET title=CASE WHEN curated THEN title ELSE $2 END,summary=CASE WHEN curated THEN summary ELSE $3 END,status='processed',topics=$4,version=version+1,updated_at=now() WHERE id=$1 AND lifecycle_status='active'",
      [eventId, data.title, data.summary, data.topics],
    );
  await c.query(
    "INSERT INTO event_articles(article_id,event_id) VALUES($1,$2) ON CONFLICT(article_id) DO UPDATE SET event_id=excluded.event_id",
    [article.id, eventId],
  );
  const concepts = new Map();
  for (const concept of data.concepts) {
    let id;
    if (concept.alias_of) {
      if (!task.input.context.knownConcepts.some((c) => c.id === concept.alias_of))
        throw new Error("Conceito fora dos candidatos");
      id = concept.alias_of;
    } else {
      const alias = (
        await c.query("SELECT concept_id FROM concept_aliases WHERE lower(alias)=lower($1)", [
          concept.name,
        ])
      ).rows[0];
      id =
        alias?.concept_id ??
        (
          await c.query(
            "INSERT INTO concepts(name,description) VALUES($1,$2) ON CONFLICT(lower(name)) DO UPDATE SET description=CASE WHEN concepts.curated THEN concepts.description ELSE excluded.description END RETURNING id",
            [concept.name, concept.description],
          )
        ).rows[0].id;
    }
    concepts.set(concept.name, id);
    if (vectors.has(concept.name))
      await c.query("UPDATE concepts SET embedding=$2::vector,embedding_version=$3 WHERE id=$1", [
        id,
        vectorLiteral(vectors.get(concept.name)),
        MODEL_VERSION,
      ]);
    const curated = (await c.query("SELECT curated FROM concepts WHERE id=$1", [id])).rows[0]
      ?.curated;
    for (const alias of curated ? [] : [concept.name, ...concept.aliases])
      await c.query(
        "INSERT INTO concept_aliases(concept_id,alias) VALUES($1,$2) ON CONFLICT(lower(alias)) DO NOTHING",
        [id, alias],
      );
    for (const [table, column, key] of [
      ["article_concepts", "article_id", article.id],
      ["event_concepts", "event_id", eventId],
    ])
      await c.query(
        `INSERT INTO ${table}(${column},concept_id,source_type,source_id,method,model,confidence) VALUES($1,$2,'article',$3,'structured-analysis',$4,0.8) ON CONFLICT DO NOTHING`,
        [key, id, article.id, mock ? "mock-v1" : config.AI_MODEL],
      );
  }
  for (const entity of data.entities) {
    const id = (
      await c.query(
        "INSERT INTO entities(name,type,description) VALUES($1,$2,$3) ON CONFLICT(name,type) DO UPDATE SET name=excluded.name RETURNING id",
        [entity.name, entity.type, entity.description],
      )
    ).rows[0].id;
    for (const [table, column, key] of [
      ["article_entities", "article_id", article.id],
      ["event_entities", "event_id", eventId],
    ])
      await c.query(
        `INSERT INTO ${table}(${column},entity_id,source_type,source_id,method,model,confidence) VALUES($1,$2,'article',$3,'structured-analysis',$4,0.8) ON CONFLICT DO NOTHING`,
        [key, id, article.id, mock ? "mock-v1" : config.AI_MODEL],
      );
  }
  for (const rel of data.relations) {
    const from = concepts.get(rel.from),
      to = concepts.get(rel.to);
    if (!from || !to || from === to || !article.content.includes(rel.evidence)) continue;
    const override = (
      await c.query(
        "SELECT after_data FROM admin_audit WHERE action='relation' AND target_id=$1 AND after_data->>'targetId'=$2 AND after_data->>'relation'=$3 ORDER BY created_at DESC LIMIT 1",
        [from, to, rel.relation],
      )
    ).rows[0];
    if (override?.after_data.remove) continue;
    await c.query(
      "INSERT INTO concept_relations(from_id,to_id,relation,source_type,source_id,method,model,confidence) VALUES($1,$2,$3,'article',$4,'structured-analysis',$5,0.8) ON CONFLICT DO NOTHING",
      [from, to, rel.relation, article.id, mock ? "mock-v1" : config.AI_MODEL],
    );
  }
  await c.query(
    "UPDATE events SET embedding=(SELECT avg(ch.embedding) FROM event_articles ea JOIN article_chunks ch ON ch.article_id=ea.article_id JOIN articles a ON a.id=ea.article_id AND a.visible WHERE ea.event_id=$1 AND ch.model_version=$2),embedding_version=$2 WHERE id=$1",
    [eventId, MODEL_VERSION],
  );
  await c.query(
    "INSERT INTO event_relations(from_id,to_id,relation,source_type,source_id,method,model,confidence) SELECT $1,ec.event_id,'RELATED_TO','article',$2,'shared-concepts',$3,0.6 FROM event_concepts ec WHERE ec.concept_id IN (SELECT concept_id FROM event_concepts WHERE event_id=$1) AND ec.event_id<>$1 GROUP BY ec.event_id HAVING count(*)>=2 ON CONFLICT DO NOTHING",
    [eventId, article.id, mock ? "mock-v1" : config.AI_MODEL],
  );
  await c.query(
    "INSERT INTO article_analyses(article_id,task_id,model,prompt_version,data) VALUES($1,$2,$3,$4,$5) ON CONFLICT(task_id) DO NOTHING",
    [article.id, task.id, mock ? "mock-v1" : config.AI_MODEL, PROMPT_VERSION, JSON.stringify(data)],
  );
}
