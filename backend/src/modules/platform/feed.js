import { transaction } from "../../database/index.js";
import { MODEL_VERSION } from "../../shared.js";

export function rankFeed(items) {
  const remaining = [...items],
    result = [],
    seen = new Map();
  const score = (e) =>
    Number(e.relevance) - (e.topics ?? []).reduce((n, t) => n + (seen.get(t) ?? 0) * 0.08, 0);
  while (remaining.length) {
    remaining.sort(
      (a, b) => score(b) - score(a) || b.updated_at - a.updated_at || a.id.localeCompare(b.id),
    );
    const discovery = result.length % 5 === 4;
    let index = remaining.findIndex((e) => Boolean(e.discovery) === discovery);
    if (index < 0) index = 0;
    const [item] = remaining.splice(index, 1);
    result.push(item);
    for (const topic of item.topics ?? []) seen.set(topic, (seen.get(topic) ?? 0) + 1);
  }
  return result;
}

export const fingerprint = `md5(e.title||coalesce(e.summary,'')||coalesce((SELECT string_agg(a.id::text||coalesce(a.content_hash,''),',' ORDER BY a.id) FROM event_articles ea JOIN articles a ON a.id=ea.article_id AND a.visible WHERE ea.event_id=e.id),''))`;

export async function personalizedFeed(
  pool,
  userId,
  { order = "personalized", q = "", page = 1, limit = 12, topic = "", sessionId } = {},
) {
  const filters = { order, q, topic };
  const { rows } = await pool.query(
    `
    WITH history AS (
      SELECT e.embedding,e.topics, greatest(CASE WHEN fp.seconds>=30 THEN 3 ELSE 1 END,CASE WHEN EXISTS(SELECT 1 FROM saved_contents s LEFT JOIN event_articles ea ON ea.article_id=s.article_id WHERE s.user_id=$1 AND (s.event_id=e.id OR ea.event_id=e.id)) THEN 5 ELSE 0 END)*exp(-extract(epoch FROM now()-fp.updated_at)/2592000.0) weight
      FROM feed_progress fp JOIN events e ON e.id=fp.event_id WHERE fp.user_id=$1 AND NOT fp.dismissed AND fp.updated_at>now()-interval '90 days' AND e.embedding_version=$2
      UNION ALL SELECT e.embedding,e.topics,5*exp(-extract(epoch FROM now()-s.created_at)/2592000.0) FROM saved_contents s LEFT JOIN event_articles ea ON ea.article_id=s.article_id JOIN events e ON e.id=coalesce(s.event_id,ea.event_id) WHERE s.user_id=$1 AND s.created_at>now()-interval '90 days' AND e.embedding_version=$2 AND NOT EXISTS(SELECT 1 FROM feed_progress fp WHERE fp.user_id=$1 AND fp.event_id=e.id)
    ), profile AS (
      SELECT avg(embedding) embedding FROM (
        SELECT h.embedding FROM history h CROSS JOIN LATERAL generate_series(1,greatest(1,ceil(h.weight)::int)) w WHERE h.embedding IS NOT NULL
        UNION ALL SELECT f.embedding FROM feed_profiles f CROSS JOIN generate_series(1,3) w WHERE f.user_id=$1 AND f.model_version=$2 AND f.interests=(SELECT interests FROM user_preferences WHERE user_id=$1)
      ) weighted
    ), dislikes AS (
      SELECT avg(e.embedding) embedding FROM feed_progress f JOIN events e ON e.id=f.event_id WHERE f.user_id=$1 AND f.dismissed AND e.embedding_version=$2
    ), candidates AS (
      SELECT e.id,e.title,e.summary,e.topics,e.updated_at,
      (SELECT count(DISTINCT a.source_id)::int FROM event_articles ea JOIN articles a ON a.id=ea.article_id AND a.visible WHERE ea.event_id=e.id) source_count,
      CASE WHEN fp.seconds>=30 THEN 'read' WHEN fp.event_id IS NOT NULL THEN 'reading' ELSE 'unread' END reading_status,
      coalesce(fp.fingerprint<>${fingerprint},false) updated,
      EXISTS(SELECT 1 FROM unnest(e.topics) t WHERE lower(t)=ANY(SELECT lower(i) FROM user_preferences p,unnest(p.interests) i WHERE p.user_id=$1)) matched,
      EXISTS(SELECT 1 FROM history h,unnest(h.topics) t WHERE t=ANY(e.topics)) habitual,
      CASE WHEN e.embedding_version=$2 AND vector_norm(e.embedding)>0 AND vector_norm(coalesce((SELECT embedding FROM profile),(SELECT embedding FROM feed_profiles WHERE user_id=$1 AND model_version=$2 AND interests=(SELECT interests FROM user_preferences WHERE user_id=$1))))>0 THEN greatest(0,1-(e.embedding <=> coalesce((SELECT embedding FROM profile),(SELECT embedding FROM feed_profiles WHERE user_id=$1 AND model_version=$2 AND interests=(SELECT interests FROM user_preferences WHERE user_id=$1))))) END similarity,
      exp(-greatest(0,extract(epoch FROM now()-e.updated_at))/604800.0) freshness,
      CASE WHEN e.embedding_version=$2 AND vector_norm(e.embedding)>0 AND vector_norm((SELECT embedding FROM dislikes))>0 THEN greatest(0,1-(e.embedding <=> (SELECT embedding FROM dislikes))) ELSE 0 END negative_similarity,
      least(1,(SELECT count(*)::float/3 FROM event_concepts ec JOIN user_concepts uc ON uc.concept_id=ec.concept_id AND uc.user_id=$1 WHERE ec.event_id=e.id AND (uc.status='gap' OR uc.next_review<now()))) learning
      FROM events e LEFT JOIN feed_progress fp ON fp.event_id=e.id AND fp.user_id=$1
      WHERE e.lifecycle_status='active' AND e.status='processed' AND NOT coalesce(fp.dismissed,false)
      AND EXISTS(SELECT 1 FROM event_articles ea JOIN articles a ON a.id=ea.article_id AND a.visible WHERE ea.event_id=e.id)
      AND ($3='' OR e.title ILIKE '%'||$3||'%' OR e.summary ILIKE '%'||$3||'%')
      AND ($4='' OR $4=ANY(e.topics))
    ) SELECT *,NOT(matched OR habitual) discovery,
      (1-negative_similarity*.5)*((coalesce(similarity,0)*.5+matched::int*.25+freshness*.15+learning*.1)/(CASE WHEN similarity IS NULL THEN .5 ELSE 1 END)) * CASE WHEN updated THEN 1 WHEN reading_status='read' THEN .5 WHEN reading_status='reading' THEN .85 ELSE 1 END relevance,
      CASE WHEN matched THEN 'Dos seus interesses' WHEN habitual THEN 'Com base nas suas leituras' ELSE 'Para descobrir' END recommendation_reason
    FROM candidates`,
    [userId, MODEL_VERSION, q, topic],
  );
  let session =
    sessionId &&
    (
      await pool.query(
        "SELECT * FROM feed_sessions WHERE id=$1 AND user_id=$2 AND expires_at>now() AND filters=$3::jsonb",
        [sessionId, userId, JSON.stringify(filters)],
      )
    ).rows[0];
  if (!session) {
    const ranked =
      order === "recent"
        ? rows.sort((a, b) => b.updated_at - a.updated_at || a.id.localeCompare(b.id))
        : rankFeed(rows);
    session = (
      await pool.query(
        "INSERT INTO feed_sessions(user_id,filters,event_ids) VALUES($1,$2,$3) RETURNING *",
        [userId, JSON.stringify(filters), ranked.map((e) => e.id)],
      )
    ).rows[0];
    await pool.query("DELETE FROM feed_sessions WHERE expires_at<now()");
  }
  const byId = new Map(rows.map((e) => [e.id, e]));
  const items = session.event_ids;
  return {
    items: items
      .slice((page - 1) * limit, page * limit)
      .map((id) => byId.get(id))
      .filter(Boolean),
    sessionId: session.id,
    hasMore: page * limit < items.length,
  };
}

export async function feedInteraction(pool, userId, { eventId, type, seconds = 0, requestId }) {
  return transaction(pool, async (c) => {
    const event = (
      await c.query(
        `SELECT ${fingerprint} fingerprint FROM events e WHERE e.id=$1 AND e.lifecycle_status='active' AND EXISTS(SELECT 1 FROM event_articles ea JOIN articles a ON a.id=ea.article_id AND a.visible WHERE ea.event_id=e.id)`,
        [eventId],
      )
    ).rows[0];
    if (!event) throw Object.assign(new Error("Notícia não encontrada"), { statusCode: 404 });
    const inserted = await c.query(
      "INSERT INTO feed_actions(request_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING request_id",
      [requestId, userId],
    );
    if (inserted.rowCount)
      await c.query(
        `INSERT INTO feed_progress(user_id,event_id,seconds,dismissed,fingerprint) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,event_id) DO UPDATE SET seconds=CASE WHEN feed_progress.fingerprint=excluded.fingerprint THEN feed_progress.seconds ELSE 0 END+excluded.seconds,dismissed=feed_progress.dismissed OR excluded.dismissed,fingerprint=excluded.fingerprint,updated_at=now()`,
        [userId, eventId, type === "progress" ? seconds : 0, type === "dismiss", event.fingerprint],
      );
    return { saved: true };
  });
}
