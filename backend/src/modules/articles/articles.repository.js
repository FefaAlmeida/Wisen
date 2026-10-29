export function articlesRepository(pool) {
  return {
    async list({ page, limit }) {
      const { rows } = await pool.query(
        "SELECT id, title, url, published_at, processing_status FROM articles ORDER BY published_at DESC NULLS LAST, id LIMIT $1 OFFSET $2",
        [limit, (page - 1) * limit],
      );
      return rows;
    },
    async find(id) {
      const { rows } = await pool.query(
        "SELECT id, title, url, content, published_at, processing_status FROM articles WHERE id=$1",
        [id],
      );
      return rows[0];
    },
  };
}
