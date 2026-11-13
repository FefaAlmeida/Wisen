export function platformRead(pool) {
  return {
    async feed(userId, { order = "personalized", q = "", page = 1, limit = 12, topic = "" } = {}) {
      const { rows } = await pool.query(
        `SELECT e.*,count(DISTINCT a.source_id)::int source_count,
    (CASE WHEN EXISTS(SELECT 1 FROM unnest(e.topics) t JOIN unnest(COALESCE(p.interests,'{}'::text[])) i ON lower(t)=lower(i)) THEN 3 ELSE 0 END + exp(-greatest(0,extract(epoch FROM now()-e.updated_at))/604800.0) + .2*least(3,(SELECT count(*) FROM event_concepts ec LEFT JOIN user_concepts uc ON uc.concept_id=ec.concept_id AND uc.user_id=$1 WHERE ec.event_id=e.id AND (uc.status='gap' OR uc.next_review<now())))) AS relevance
   FROM events e JOIN event_articles ea ON ea.event_id=e.id JOIN articles a ON a.id=ea.article_id AND a.visible
   LEFT JOIN user_preferences p ON p.user_id=$1
   WHERE e.lifecycle_status='active' AND e.status='processed' AND ($6='' OR EXISTS(SELECT 1 FROM unnest(e.topics) t WHERE lower(t)=lower($6))) AND ($2='' OR to_tsvector('portuguese',e.title||' '||COALESCE(e.summary,'')) @@ plainto_tsquery('portuguese',$2) OR e.title ILIKE '%'||$2||'%')
   GROUP BY e.id,p.interests ORDER BY CASE WHEN $3='personalized' THEN (CASE WHEN EXISTS(SELECT 1 FROM unnest(e.topics) t JOIN unnest(COALESCE(p.interests,'{}'::text[])) i ON lower(t)=lower(i)) THEN 3 ELSE 0 END + exp(-greatest(0,extract(epoch FROM now()-e.updated_at))/604800.0)) ELSE 0 END DESC,e.updated_at DESC,e.id LIMIT $4 OFFSET $5`,
        [userId, q, order, limit, (page - 1) * limit, topic],
      );
      if (order === "personalized") {
        const remaining = [...rows],
          ranked = [],
          seen = new Map();
        const score = (item) =>
          Number(item.relevance) -
          Math.min(
            0.6,
            (item.topics ?? [])
              .filter((t) => t.toLowerCase() !== "economia")
              .reduce((sum, t) => sum + (seen.get(t) ?? 0), 0) * 0.15,
          );
        while (remaining.length) {
          remaining.sort((a, b) => score(b) - score(a));
          const item = remaining.shift();
          ranked.push(item);
          for (const topic of item.topics ?? []) seen.set(topic, (seen.get(topic) ?? 0) + 1);
        }
        return ranked;
      }
      return rows;
    },
    async event(userId, id) {
      const event = (
        await pool.query(
          "SELECT * FROM events WHERE id=$1 AND lifecycle_status='active' AND status='processed'",
          [id],
        )
      ).rows[0];
      if (!event) return null;
      const articles = (
        await pool.query(
          "SELECT a.id,a.title,a.url,a.published_at,s.name source,s.attribution,s.internal_reading FROM event_articles ea JOIN articles a ON a.id=ea.article_id JOIN sources s ON s.id=a.source_id WHERE ea.event_id=$1 AND a.visible ORDER BY a.published_at,a.id",
          [id],
        )
      ).rows;
      const concepts = (
        await pool.query(
          `SELECT c.*,uc.mastery_score,CASE WHEN uc.next_review<now() AND uc.status='mastered' THEN 'review' ELSE uc.status END status FROM event_concepts ec JOIN concepts c ON c.id=ec.concept_id LEFT JOIN user_concepts uc ON uc.concept_id=c.id AND uc.user_id=$2 WHERE ec.event_id=$1`,
          [id, userId],
        )
      ).rows;
      const entities = (
        await pool.query(
          "SELECT n.* FROM event_entities en JOIN entities n ON n.id=en.entity_id WHERE en.event_id=$1",
          [id],
        )
      ).rows;
      const related = (
        await pool.query(
          "SELECT e.id,e.title FROM event_relations r JOIN events e ON e.id=CASE WHEN r.from_id=$1 THEN r.to_id ELSE r.from_id END WHERE (r.from_id=$1 OR r.to_id=$1) AND e.lifecycle_status='active'",
          [id],
        )
      ).rows;
      return { ...event, articles, concepts, entities, related };
    },
    async article(id) {
      return (
        (
          await pool.query(
            "SELECT a.*,s.name source,s.attribution,s.internal_reading,ea.event_id FROM articles a JOIN sources s ON s.id=a.source_id LEFT JOIN event_articles ea ON ea.article_id=a.id WHERE a.id=$1 AND a.visible",
            [id],
          )
        ).rows[0] ?? null
      );
    },
    async concepts(userId, { q = "", page = 1, limit = 30 } = {}) {
      return (
        await pool.query(
          `SELECT c.*,uc.mastery_score,CASE WHEN uc.next_review<now() AND uc.status='mastered' THEN 'review' ELSE uc.status END status,uc.next_review FROM concepts c LEFT JOIN user_concepts uc ON uc.concept_id=c.id AND uc.user_id=$1 WHERE ($2='' OR c.name ILIKE '%'||$2||'%' OR EXISTS(SELECT 1 FROM concept_aliases ca WHERE ca.concept_id=c.id AND ca.alias ILIKE '%'||$2||'%')) ORDER BY c.name,c.id LIMIT $3 OFFSET $4`,
          [userId, q, limit, (page - 1) * limit],
        )
      ).rows;
    },
    async concept(userId, id) {
      const concept = (
        await pool.query(
          "SELECT c.*,uc.mastery_score,CASE WHEN uc.next_review<now() AND uc.status='mastered' THEN 'review' ELSE uc.status END status,uc.next_review FROM concepts c LEFT JOIN user_concepts uc ON uc.concept_id=c.id AND uc.user_id=$2 WHERE c.id=$1",
          [id, userId],
        )
      ).rows[0];
      if (!concept) return null;
      const aliases = (
        await pool.query("SELECT alias FROM concept_aliases WHERE concept_id=$1", [id])
      ).rows;
      const relations = (
        await pool.query(
          "SELECT r.*,c.name FROM concept_relations r JOIN concepts c ON c.id=r.to_id WHERE r.from_id=$1",
          [id],
        )
      ).rows;
      const events = (
        await pool.query(
          "SELECT e.* FROM event_concepts ec JOIN events e ON e.id=ec.event_id WHERE ec.concept_id=$1 AND e.status='processed' AND e.lifecycle_status='active' ORDER BY e.updated_at DESC LIMIT 10",
          [id],
        )
      ).rows;
      const history = (
        await pool.query(
          "SELECT type,evidence,created_at FROM user_interactions WHERE user_id=$1 AND concept_id=$2 ORDER BY created_at DESC LIMIT 30",
          [userId, id],
        )
      ).rows;
      return { ...concept, aliases, relations, events, history };
    },
    async knowledge(userId) {
      return (
        await pool.query(
          `SELECT c.id,c.name,uc.*,CASE WHEN uc.next_review<now() AND uc.status='mastered' THEN 'review' ELSE uc.status END display_status FROM user_concepts uc JOIN concepts c ON c.id=uc.concept_id WHERE user_id=$1 ORDER BY uc.next_review NULLS LAST,c.name`,
          [userId],
        )
      ).rows;
    },
    async reviews(userId) {
      return (
        await pool.query(
          "SELECT r.id,r.concept_id,r.due_at,r.format,r.question,c.name FROM reviews r JOIN concepts c ON c.id=r.concept_id WHERE r.user_id=$1 AND r.completed_at IS NULL ORDER BY r.due_at LIMIT 100",
          [userId],
        )
      ).rows;
    },
    async saved(userId) {
      return (
        await pool.query(
          "SELECT s.*,COALESCE(a.title,e.title,c.name) title FROM saved_contents s LEFT JOIN articles a ON a.id=s.article_id AND a.visible LEFT JOIN events e ON e.id=s.event_id AND e.lifecycle_status='active' LEFT JOIN concepts c ON c.id=s.concept_id WHERE s.user_id=$1 AND COALESCE(a.title,e.title,c.name) IS NOT NULL ORDER BY s.created_at DESC",
          [userId],
        )
      ).rows;
    },
    async search(userId, q) {
      return {
        events: await this.feed(userId, { q }),
        concepts: await this.concepts(userId, { q }),
        articles: (
          await pool.query(
            "SELECT id,title,url FROM articles WHERE visible AND processing_status='processed' AND to_tsvector('portuguese',title||' '||COALESCE(content,'')) @@ plainto_tsquery('portuguese',$1) ORDER BY published_at DESC LIMIT 20",
            [q],
          )
        ).rows,
        entities: (
          await pool.query(
            "SELECT id,name,type,description FROM entities WHERE name ILIKE '%'||$1||'%' LIMIT 20",
            [q],
          )
        ).rows,
      };
    },
  };
}
