export function searchService(repository) {
  return {
    create(input, userId) {
      return repository.create(input, userId);
    },
    async find(id, userId, isOperations) {
      const row = await repository.find(id, userId, isOperations);
      if (!row) throw Object.assign(new Error("Busca não encontrada"), { statusCode: 404 });
      return row;
    },
  };
}
