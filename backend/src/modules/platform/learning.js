import { transaction } from "../../database/index.js";

export const LEARNING_VERSION = "mastery-v1";
export function advanceKnowledge(current, verdict, now = new Date()) {
  const delta = { correct: 0.25, partial: 0.1, incorrect: -0.25, gap: 0 }[verdict];
  if (delta === undefined) throw new Error("Evidência inválida");
  const score =
    verdict === "gap" ? 0 : Math.max(0, Math.min(1, Number(current.mastery_score ?? 0) + delta));
  const successes =
    verdict === "correct"
      ? Number(current.successful_reviews ?? 0) + 1
      : verdict === "incorrect" || verdict === "gap"
        ? 0
        : Number(current.successful_reviews ?? 0);
  const steps = [1, 3, 7, 14, 30];
  const days = verdict === "correct" ? steps[Math.min(successes - 1, 4)] : 1;
  return {
    score,
    successes,
    failures: Number(current.failed_reviews ?? 0) + (verdict === "incorrect" ? 1 : 0),
    status: score >= 0.75 && successes >= 2 ? "mastered" : score < 0.4 ? "gap" : "review",
    days,
    nextReview: new Date(now.getTime() + days * 86400000),
  };
}
export async function recordEvidence(
  client,
  userId,
  conceptId,
  verdict,
  requestId,
  reviewId = null,
) {
  await client.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [userId]);
  const duplicate = (
    await client.query(
      "SELECT evidence FROM user_interactions WHERE request_id=$1 AND user_id=$2",
      [requestId, userId],
    )
  ).rows[0];
  if (duplicate) return duplicate.evidence;
  await client.query(
    "INSERT INTO user_concepts(user_id,concept_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
    [userId, conceptId],
  );
  const old = (
    await client.query(
      "SELECT * FROM user_concepts WHERE user_id=$1 AND concept_id=$2 FOR UPDATE",
      [userId, conceptId],
    )
  ).rows[0];
  const next = advanceKnowledge(old, verdict);
  await client.query(
    "UPDATE user_concepts SET mastery_score=$3,status=$4,successful_reviews=$5,failed_reviews=$6,last_review=CASE WHEN $7 THEN now() ELSE last_review END,next_review=$8,review_interval_days=$9 WHERE user_id=$1 AND concept_id=$2",
    [
      userId,
      conceptId,
      next.score,
      next.status,
      next.successes,
      next.failures,
      verdict !== "gap",
      next.nextReview,
      next.days,
    ],
  );
  await client.query(
    "INSERT INTO user_interactions(user_id,concept_id,type,evidence,request_id) VALUES($1,$2,$3,$4,$5)",
    [
      userId,
      conceptId,
      verdict,
      JSON.stringify({ ...next, version: LEARNING_VERSION, reviewId }),
      requestId,
    ],
  );
  await client.query(
    "UPDATE user_preferences SET knowledge_version=knowledge_version+1 WHERE user_id=$1",
    [userId],
  );
  if (reviewId)
    await client.query("UPDATE reviews SET completed_at=now() WHERE id=$1 AND user_id=$2", [
      reviewId,
      userId,
    ]);
  // Schedule only questions that have not already been answered correctly.
  const question = (
    await client.query(
      `SELECT q.* FROM question_bank q WHERE concept_id=$1 AND ($3::uuid IS NULL OR q.id<>(SELECT question_id FROM reviews WHERE id=$3)) AND NOT EXISTS(SELECT 1 FROM review_attempts a JOIN reviews r ON r.id=a.review_id WHERE r.user_id=$2 AND r.question_id=q.id AND a.correct AND a.created_at > now()-interval '24 hours') ORDER BY random() LIMIT 1`,
      [conceptId, userId, reviewId],
    )
  ).rows[0];
  if (question)
    await client.query(
      `INSERT INTO reviews(user_id,concept_id,due_at,format,question,question_id) VALUES($1,$2,$3,'recognition',$4,$5) ON CONFLICT(user_id,concept_id) WHERE completed_at IS NULL DO UPDATE SET due_at=excluded.due_at`,
      [
        userId,
        conceptId,
        next.nextReview,
        JSON.stringify({ prompt: question.prompt, options: question.options }),
        question.id,
      ],
    );
  return next;
}
export function learningService(pool) {
  return {
    async interact(userId, { conceptId, type, requestId }) {
      return transaction(pool, async (c) => {
        if (type === "gap") return recordEvidence(c, userId, conceptId, "gap", requestId);
        await c.query(
          "INSERT INTO user_interactions(user_id,concept_id,type,request_id) VALUES($1,$2,$3,$4) ON CONFLICT(request_id) DO NOTHING",
          [userId, conceptId, type, requestId],
        );
        await c.query(
          "INSERT INTO user_concepts(user_id,concept_id,last_exposure) VALUES($1,$2,now()) ON CONFLICT(user_id,concept_id) DO UPDATE SET last_exposure=now()",
          [userId, conceptId],
        );
        return { recorded: true };
      });
    },
    async answer(userId, { reviewId, answer, requestId }) {
      return transaction(pool, async (c) => {
        await c.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [userId]);
        const attempt = (
          await c.query(
            "SELECT * FROM review_attempts a JOIN reviews r ON r.id=a.review_id WHERE a.request_id=$1 AND r.user_id=$2",
            [requestId, userId],
          )
        ).rows[0];
        if (attempt) return { correct: attempt.correct, feedback: attempt.feedback };
        const review = (
          await c.query(
            "SELECT r.*,q.correct_index,q.explanation FROM reviews r JOIN question_bank q ON q.id=r.question_id WHERE r.id=$1 AND r.user_id=$2 FOR UPDATE OF r",
            [reviewId, userId],
          )
        ).rows[0];
        if (!review || review.completed_at)
          throw Object.assign(new Error("Revisão não disponível"), { statusCode: 409 });
        const already = (
          await c.query(
            "SELECT 1 FROM review_attempts a JOIN reviews r ON r.id=a.review_id WHERE r.user_id=$1 AND r.question_id=$2 AND a.correct AND a.created_at > now()-interval '24 hours'",
            [userId, review.question_id],
          )
        ).rowCount;
        const correct = answer === review.correct_index;
        const before =
          (
            await c.query(
              "SELECT mastery_score FROM user_concepts WHERE user_id=$1 AND concept_id=$2",
              [userId, review.concept_id],
            )
          ).rows[0]?.mastery_score ?? 0;
        const next = already
          ? { score: before }
          : await recordEvidence(
              c,
              userId,
              review.concept_id,
              correct ? "correct" : "incorrect",
              requestId,
              review.id,
            );
        if (already)
          await c.query("UPDATE reviews SET completed_at=now() WHERE id=$1", [review.id]);
        await c.query(
          "INSERT INTO review_attempts(review_id,answer,correct,feedback,mastery_before,mastery_after,request_id) VALUES($1,$2,$3,$4,$5,$6,$7)",
          [
            review.id,
            JSON.stringify({ selected: answer }),
            correct,
            review.explanation,
            before,
            next.score,
            requestId,
          ],
        );
        return { correct, feedback: review.explanation, knowledge: next };
      });
    },
  };
}
