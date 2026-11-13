import { transaction } from "../../backend/src/database/index.js";
import { enqueue } from "../../backend/src/queue/index.js";
import { QUEUES, SOURCES } from "../../backend/src/shared.js";
export async function scheduleWork(pool, boss, config, tasks) {
  await transaction(pool, async (c) => {
    await c.query("SELECT pg_advisory_xact_lock(881341)");
    for (const definition of SOURCES)
      await c.query(
        "INSERT INTO sources(slug,name,feed_url,attribution,internal_reading) VALUES($1,$2,$3,$2,true) ON CONFLICT(slug) DO NOTHING",
        [definition.slug, definition.name, definition.feed],
      );
    const sources = (
      await c.query(
        "SELECT * FROM sources WHERE enabled AND (last_collected_at IS NULL OR last_collected_at<now()-($1*interval '1 minute')) ORDER BY last_collected_at NULLS FIRST",
        [config.COLLECTION_INTERVAL_MINUTES],
      )
    ).rows;
    for (const source of sources) await sendOnce(c, boss, QUEUES.collect, "sourceId", source.id);
    const mail = (
      await c.query(
        "SELECT id FROM mail_outbox WHERE status IN ('pending','failed') AND attempts<5 AND created_at>now()-interval '1 day' LIMIT 50",
      )
    ).rows;
    for (const row of mail) await sendOnce(c, boss, QUEUES.mail, "id", row.id);
    const paused = (
      await c.query(
        "SELECT id FROM generation_tasks WHERE status='paused' AND error IN ('BUDGET_EXHAUSTED','DAILY_LIMIT','EMAIL_UNVERIFIED','Configure OPENAI_API_KEY para habilitar geração') AND updated_at<now()-interval '5 minutes' LIMIT 20",
      )
    ).rows;
    if (config.OPENAI_API_KEY)
      for (const row of paused) {
        await c.query("UPDATE generation_tasks SET updated_at=now() WHERE id=$1", [row.id]);
        await sendOnce(c, boss, QUEUES.generate, "id", row.id);
      }
  });
  if (config.OPENAI_API_KEY) {
    const articles = (
      await pool.query(
        "SELECT a.id FROM articles a WHERE a.processing_status='processed' AND a.visible AND NOT EXISTS(SELECT 1 FROM article_analyses aa WHERE aa.article_id=a.id) AND NOT EXISTS(SELECT 1 FROM generation_tasks t WHERE t.article_id=a.id AND t.operation='analysis' AND t.status IN ('pending','processing','paused','completed')) ORDER BY a.created_at LIMIT 5",
      )
    ).rows;
    for (const article of articles)
      await tasks.create(null, { operation: "analysis", articleId: article.id });
    const concepts = (
      await pool.query(
        "SELECT c.id FROM concepts c WHERE NOT EXISTS(SELECT 1 FROM question_bank q WHERE q.concept_id=c.id) AND NOT EXISTS(SELECT 1 FROM generation_tasks t WHERE t.concept_id=c.id AND t.operation='questions' AND t.status IN ('pending','processing','paused','completed')) LIMIT 3",
      )
    ).rows;
    for (const concept of concepts)
      await tasks.create(null, { operation: "questions", conceptId: concept.id });
  }
}
async function sendOnce(c, boss, name, key, id) {
  const exists = await c.query(
    "SELECT 1 FROM pgboss.job WHERE name=$1 AND data->>$2=$3 AND state IN ('created','active','retry')",
    [name, key, id],
  );
  if (!exists.rowCount) await enqueue(boss, c, name, { [key]: id });
}
