export function articlesRepository(pool) {
  return {
    async list({ page, limit }) {
      const { rows } = await pool.query(
        "SELECT id, title, url, published_at, processing_status FROM articles WHERE visible ORDER BY published_at DESC NULLS LAST, id LIMIT $1 OFFSET $2",
        [limit, (page - 1) * limit],
      );
      return rows;
    },
    async find(id) {
      const { rows } = await pool.query(
        "SELECT a.id, a.title, a.url, CASE WHEN s.internal_reading THEN a.content ELSE NULL END content, a.published_at, a.processing_status FROM articles a JOIN sources s ON s.id=a.source_id WHERE a.id=$1 AND a.visible",
        [id],
      );
      return rows[0];
    },
  };
}
