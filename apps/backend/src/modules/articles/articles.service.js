const serialize = (row) => ({ ...row, published_at: row.published_at?.toISOString() ?? null });

export function articlesService(repository) {
  return {
    async list(input) {
      return (await repository.list(input)).map(serialize);
    },
    async find(id) {
      const row = await repository.find(id);
      if (!row) throw Object.assign(new Error("Artigo não encontrado"), { statusCode: 404 });
      return serialize(row);
    },
  };
}
