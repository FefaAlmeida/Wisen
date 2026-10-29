export function searchService(repository) {
  return {
    create(input) {
      return repository.create(input);
    },
    async find(id) {
      const row = await repository.find(id);
      if (!row) throw Object.assign(new Error("Busca não encontrada"), { statusCode: 404 });
      return row;
    },
  };
}
