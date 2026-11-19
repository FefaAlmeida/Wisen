import { z } from "zod";
import { transaction } from "../../database/index.js";
import { hasRecentQuestionEvidence, recordEvidence } from "./learning.js";

const fail = (message, statusCode = 409) => Object.assign(new Error(message), { statusCode });
const uuid = z.uuid();
async function owned(c, userId, sessionId) {
  const session = (
    await c.query("SELECT * FROM review_sessions WHERE id=$1 AND user_id=$2 FOR UPDATE", [
      sessionId,
      userId,
    ])
  ).rows[0];
  if (!session) throw fail("Sessão não encontrada", 404);
  return session;
}
async function view(c, userId, sessionId) {
  const session = (
    await c.query(
      "SELECT id,format,created_at,completed_at,difficulty FROM review_sessions WHERE id=$1 AND user_id=$2",
      [sessionId, userId],
    )
  ).rows[0];
  if (!session) throw fail("Sessão não encontrada", 404);
  const items = (
    await c.query("SELECT * FROM review_session_items WHERE session_id=$1 ORDER BY position", [
      sessionId,
    ])
  ).rows.map(({ snapshot, ...item }) => ({
    id: item.id,
    conceptId: item.concept_id,
    pergunta: snapshot.prompt,
    opcoes: snapshot.options,
    titulo: snapshot.name,
    contexto: snapshot.context,
    sourceUrl: snapshot.sourceUrl,
    resposta: item.answer ?? undefined,
    revelada: !!item.completed_at,
    ...(item.completed_at
      ? { correta: snapshot.correct_index, explicacao: snapshot.explanation, correct: item.correct }
      : {}),
  }));
  return { ...session, items };
}
export function reviewController(app, pool) {
  const secured = { preHandler: app.authenticateClient };
  const params = z.object({ sessionId: uuid });
  app.get("/api/reviews/catalog", secured, async () => ({
    items: (
      await pool.query(
        `SELECT c.id,c.name,count(q.id)::int total FROM concepts c JOIN question_bank q ON q.concept_id=c.id GROUP BY c.id ORDER BY c.name`,
      )
    ).rows,
  }));
  app.get("/api/reviews/summary", secured, async (req) => {
    const history = (
      await pool.query(
        `SELECT s.id,s.format,s.created_at,s.completed_at,count(i.id)::int total,array_agg(DISTINCT i.snapshot->>'name') names FROM review_sessions s JOIN review_session_items i ON i.session_id=s.id WHERE s.user_id=$1 GROUP BY s.id ORDER BY s.created_at DESC LIMIT 20`,
        [req.user.id],
      )
    ).rows;
    const week = (
      await pool.query(
        `SELECT to_char(d,'YYYY-MM-DD') AS "day",to_char(d,'DD/MM') label,count(i.id)::int total,count(i.id) FILTER(WHERE s.format='quiz')::int quizzes,count(i.id) FILTER(WHERE i.correct)::int correct FROM generate_series((now() AT TIME ZONE 'America/Sao_Paulo')::date-6,(now() AT TIME ZONE 'America/Sao_Paulo')::date,'1 day') d LEFT JOIN review_sessions s ON s.user_id=$1 LEFT JOIN review_session_items i ON i.session_id=s.id AND (i.completed_at AT TIME ZONE 'America/Sao_Paulo')::date=d::date GROUP BY d ORDER BY d`,
        [req.user.id],
      )
    ).rows;
    const days = (
      await pool.query(
        `SELECT DISTINCT to_char(i.completed_at AT TIME ZONE 'America/Sao_Paulo','YYYY-MM-DD') AS "day" FROM review_session_items i JOIN review_sessions s ON s.id=i.session_id WHERE s.user_id=$1 AND i.completed_at IS NOT NULL ORDER BY "day" DESC`,
        [req.user.id],
      )
    ).rows.map((r) => r.day);
    let streak = 0;
    const cursor = new Date(`${week.at(-1).day}T12:00:00Z`);
    if (!days.includes(cursor.toISOString().slice(0, 10)))
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    while (days.includes(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return { history, week, streak };
  });
  app.post(
    "/api/reviews/sessions",
    {
      ...secured,
      schema: {
        body: z.object({
          conceptIds: z.array(uuid).min(1).max(30),
          format: z.enum(["quiz", "flashcards"]),
          requestId: uuid,
        }),
      },
    },
    async (req) =>
      transaction(pool, async (c) => {
        await c.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [req.user.id]);
        const prior = (
          await c.query("SELECT id FROM review_sessions WHERE user_id=$1 AND request_id=$2", [
            req.user.id,
            req.body.requestId,
          ])
        ).rows[0];
        if (prior) return view(c, req.user.id, prior.id);
        const questions = (
          await c.query(
            `SELECT q.*,c.name,COALESCE(e.summary,c.description) context,a.url source_url FROM question_bank q JOIN concepts c ON c.id=q.concept_id LEFT JOIN LATERAL(SELECT ev.id,ev.summary FROM event_concepts ec JOIN events ev ON ev.id=ec.event_id WHERE ec.concept_id=c.id AND ev.lifecycle_status='active' ORDER BY ev.updated_at DESC LIMIT 1) e ON true LEFT JOIN LATERAL(SELECT ar.url FROM event_articles ea JOIN articles ar ON ar.id=ea.article_id WHERE ea.event_id=e.id AND ar.visible LIMIT 1) a ON true WHERE c.id=ANY($1::uuid[]) ORDER BY c.name,q.created_at,q.id LIMIT 30`,
            [req.body.conceptIds],
          )
        ).rows;
        if (!questions.length)
          throw fail("Não há questões disponíveis para os assuntos escolhidos");
        const session = (
          await c.query(
            "INSERT INTO review_sessions(user_id,request_id,format) VALUES($1,$2,$3) RETURNING id",
            [req.user.id, req.body.requestId, req.body.format],
          )
        ).rows[0];
        for (const [position, q] of questions.entries())
          await c.query(
            "INSERT INTO review_session_items(session_id,question_id,concept_id,position,snapshot) VALUES($1,$2,$3,$4,$5)",
            [
              session.id,
              q.id,
              q.concept_id,
              position,
              JSON.stringify({
                prompt: q.prompt,
                options: q.options,
                correct_index: q.correct_index,
                explanation: q.explanation,
                name: q.name,
                context: q.context,
                sourceUrl: q.source_url,
              }),
            ],
          );
        return view(c, req.user.id, session.id);
      }),
  );
  app.get("/api/reviews/sessions/:sessionId", { ...secured, schema: { params } }, (req) =>
    view(pool, req.user.id, req.params.sessionId),
  );
  app.post(
    "/api/reviews/sessions/:sessionId/items/:itemId",
    {
      ...secured,
      schema: {
        params: params.extend({ itemId: uuid }),
        body: z.object({ answer: z.number().int().min(0).max(3).optional() }),
      },
    },
    (req) =>
      transaction(pool, async (c) => {
        await c.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [req.user.id]);
        const session = await owned(c, req.user.id, req.params.sessionId);
        const item = (
          await c.query(
            "SELECT * FROM review_session_items WHERE id=$1 AND session_id=$2 FOR UPDATE",
            [req.params.itemId, session.id],
          )
        ).rows[0];
        if (!item) throw fail("Questão não encontrada", 404);
        if (item.completed_at) return view(c, req.user.id, session.id);
        if (session.completed_at) throw fail("Sessão já concluída");
        let correct = null;
        if (session.format === "quiz") {
          if (req.body.answer === undefined || req.body.answer >= item.snapshot.options.length)
            throw fail("Selecione uma alternativa válida", 400);
          correct = req.body.answer === item.snapshot.correct_index;
          const repeated = await hasRecentQuestionEvidence(c, req.user.id, item.question_id);
          if (!repeated)
            await recordEvidence(
              c,
              req.user.id,
              item.concept_id,
              correct ? "correct" : "incorrect",
              item.id,
            );
        }
        await c.query(
          "UPDATE review_session_items SET answer=$2,correct=$3,completed_at=now() WHERE id=$1",
          [item.id, session.format === "quiz" ? req.body.answer : null, correct],
        );
        return view(c, req.user.id, session.id);
      }),
  );
  app.post(
    "/api/reviews/sessions/:sessionId/complete",
    {
      ...secured,
      schema: {
        params,
        body: z.object({ difficulty: z.enum(["Fácil", "Médio", "Difícil"]).optional() }),
      },
    },
    (req) =>
      transaction(pool, async (c) => {
        const session = await owned(c, req.user.id, req.params.sessionId);
        if (
          (
            await c.query(
              "SELECT 1 FROM review_session_items WHERE session_id=$1 AND completed_at IS NULL",
              [session.id],
            )
          ).rowCount
        )
          throw fail("Conclua todos os itens antes de finalizar");
        await c.query(
          "UPDATE review_sessions SET completed_at=COALESCE(completed_at,now()),difficulty=COALESCE($2,difficulty) WHERE id=$1",
          [session.id, req.body.difficulty],
        );
        return view(c, req.user.id, session.id);
      }),
  );
}
