export function transferArticle(events, article, sourceId, targetId) {
  const source = events.find((event) => event.id === sourceId);
  const target = events.find((event) => event.id === targetId);
  if (
    !target ||
    sourceId === targetId ||
    (sourceId !== null && !source?.artigos.some((item) => item.id === article.id))
  )
    return events;
  return events.map((event) => {
    if (event.id === sourceId)
      return {
        ...event,
        artigos: event.artigos.filter((item) => item.id !== article.id),
        status: "Ajustado",
      };
    if (event.id === targetId)
      return {
        ...event,
        artigos: target.artigos.some((item) => item.id === article.id)
          ? target.artigos
          : [...target.artigos, article],
        status: "Ajustado",
      };
    return event;
  });
}

export function mergeEvents(events, firstId, secondId) {
  const first = events.find((event) => event.id === firstId);
  const second = events.find((event) => event.id === secondId);
  if (!first || !second || firstId === secondId) return events;
  const articles = new Map();
  for (const article of [...first.artigos, ...second.artigos]) {
    if (!articles.has(article.id)) articles.set(article.id, article);
  }
  return events
    .filter((event) => event.id !== secondId)
    .map((event) =>
      event.id === firstId
        ? { ...event, artigos: [...articles.values()], status: "Ajustado" }
        : event,
    );
}
