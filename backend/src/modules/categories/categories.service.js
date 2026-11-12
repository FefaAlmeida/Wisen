export function categoriesService(repository) {
  return {
    listAvailable: () => repository.listAvailable(),
    listAll: () => repository.listAll(),
    updateAvailability: (categories) => repository.updateAvailability(categories),
  };
}
