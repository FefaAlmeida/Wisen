import { createHash } from "node:crypto";
import { transaction } from "../../database/index.js";
import { enqueue } from "../../queue/index.js";
import { MODEL_VERSION, QUEUES } from "../../shared.js";
import { platformRead } from "../platform/read.js";
import { generationMode } from "./mode.js";

export const PROMPT_VERSION = "economia-v1";
export const fingerprint = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
export function taskService(pool, boss, config) {
  const read = platformRead(pool);
  return {
    async create(
      userId,
      { operation, eventId, articleId, conceptId, reviewId, passage, answer, requestId },
    ) {
      const preferences = userId
        ? (await pool.query("SELECT * FROM user_preferences WHERE user_id=$1", [userId])).rows[0]
        : null;
      let context;
      if (operation === "grade") {
        const review = (
          await pool.query(
            "SELECT r.*,q.rubric,q.explanation FROM reviews r JOIN question_bank q ON q.id=r.question_id WHERE r.id=$1 AND r.user_id=$2 AND r.completed_at IS NULL",
            [reviewId, userId],
          )
        ).rows[0];
        if (!review) throw Object.assign(new Error("Revisão não disponível"), { statusCode: 409 });
        conceptId = review.concept_id;
        context = {
          question: review.question,
          rubric: review.rubric,
          expected: review.explanation,
          answer,
          requestId,
        };
      } else if (eventId) context = await read.event(userId, eventId);
      else if (articleId) {
        context = await read.article(articleId);
        if (context?.event_id && operation !== "analysis")
          context.event = await read.event(userId, context.event_id);
        if (context && !context.internal_reading)
          throw Object.assign(new Error("Leitura interna indisponível"), { statusCode: 403 });
        if (passage && !context?.content?.includes(passage))
          throw Object.assign(new Error("Selecione um trecho deste artigo"), { statusCode: 400 });
      } else if (conceptId) context = await read.concept(userId, conceptId);
      if (context?.history) delete context.history;
      if (!context) throw Object.assign(new Error("Conteúdo não encontrado"), { statusCode: 404 });
      if (operation === "analysis") {
        context = { article: context, ...(await analysisCandidates(pool, articleId)) };
      }
      const input = {
        provider: generationMode(config),
        operation,
        context,
        passage,
        familiarity: preferences?.familiarity ?? "beginner",
        interests: preferences?.interests ?? [],
        knowledgeVersion: preferences?.knowledge_version ?? 0,
        instruction:
          operation === "questions"
            ? "Gere 4 questões objetivas distintas com exatamente 4 alternativas cada e rubrica para resposta aberta."
            : operation === "analysis"
              ? "Analise o artigo. event_id deve ser um candidato existente somente se descrever o mesmo acontecimento. alias_of deve ser o ID de um conceito fornecido somente se equivalentes. Inclua evidências textuais nas relações."
              : "Explique em 150–300 palavras. Concentre-se em lacunas e revisões; evite repetir conceitos dominados. Para aprofundamento, forneça um exemplo adicional.",
      };
      const cache = fingerprint({
        userId,
        operation,
        eventId,
        articleId,
        conceptId,
        reviewId,
        input:
          operation === "grade"
            ? { ...input, context: { ...input.context, requestId: undefined } }
            : input,
        provider: generationMode(config),
        model: config.AI_MODEL,
        prompt: PROMPT_VERSION,
      });
      return transaction(pool, async (c) => {
        const old = (
          await c.query(
            "SELECT id,status,result,error FROM generation_tasks t WHERE cache_key=$1 AND (status IN ('pending','processing','completed','paused') OR EXISTS(SELECT 1 FROM generation_charges c WHERE c.task_id=t.id AND c.status IN ('reserved','unknown'))) ORDER BY created_at DESC LIMIT 1",
            [cache],
          )
        ).rows[0];
        if (old) return old;
        if (userId) await c.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [userId]);
        if (operation === "grade") {
          await c.query("SELECT id FROM reviews WHERE id=$1 FOR UPDATE", [reviewId]);
          const pending = (
            await c.query(
              "SELECT id,status,result,error FROM generation_tasks WHERE review_id=$1 AND user_id=$2 AND operation='grade' AND status IN ('pending','processing','paused') ORDER BY created_at LIMIT 1",
              [reviewId, userId],
            )
          ).rows[0];
          if (pending) return pending;
        }
        if (userId) {
          const pending = Number(
            (
              await c.query(
                "SELECT count(*) FROM generation_tasks WHERE user_id=$1 AND status IN ('pending','processing','paused')",
                [userId],
              )
            ).rows[0].count,
          );
          const limit =
            (await c.query("SELECT generation_limit FROM users WHERE id=$1", [userId])).rows[0]
              ?.generation_limit ?? config.AI_DAILY_USER_LIMIT;
          if (pending >= limit)
            throw Object.assign(
              new Error("Você já tem várias gerações pendentes. Aguarde sua conclusão."),
              { statusCode: 429 },
            );
        }
        const task = (
          await c.query(
            "INSERT INTO generation_tasks(user_id,operation,event_id,article_id,concept_id,review_id,cache_key,input) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(cache_key) WHERE status IN ('pending','processing','completed','paused') DO NOTHING RETURNING id,status,result,error",
            [
              userId,
              operation,
              eventId,
              articleId,
              conceptId,
              reviewId,
              cache,
              JSON.stringify(input),
            ],
          )
        ).rows[0];
        if (!task)
          return (
            await c.query(
              "SELECT id,status,result,error FROM generation_tasks WHERE cache_key=$1",
              [cache],
            )
          ).rows[0];
        await enqueue(boss, c, QUEUES.generate, { id: task.id });
        return task;
      });
    },
    async get(userId, id) {
      return (
        (
          await pool.query(
            "SELECT id,status,result,error,operation FROM generation_tasks WHERE id=$1 AND user_id=$2",
            [id, userId],
          )
        ).rows[0] ?? null
      );
    },
  };
}

export async function analysisCandidates(pool, articleId) {
  const candidateEvents = (
    await pool.query(
      "SELECT id,title,summary FROM events WHERE lifecycle_status='active' AND updated_at>now()-interval '7 days' ORDER BY embedding <=> (SELECT avg(embedding) FROM article_chunks WHERE article_id=$1 AND model_version=$2),updated_at DESC LIMIT 15",
      [articleId, MODEL_VERSION],
    )
  ).rows;
  const knownConcepts = (
    await pool.query(
      "SELECT id,name FROM concepts ORDER BY embedding <=> (SELECT avg(embedding) FROM article_chunks WHERE article_id=$1 AND model_version=$2),created_at DESC LIMIT 150",
      [articleId, MODEL_VERSION],
    )
  ).rows;
  return { candidateEvents, knownConcepts };
}
