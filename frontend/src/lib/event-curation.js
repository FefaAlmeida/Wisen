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

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

export function findDuplicatePairs(events) {
  const stopWords = new Set(["para", "sobre", "como", "mais", "pelo", "pela", "entre"]);
  const tokens = (title) =>
    new Set(
      normalize(title)
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 3 && !stopWords.has(word)),
    );
  const pairs = [];
  for (let i = 0; i < events.length; i++) {
    const first = tokens(events[i].titulo);
    for (let j = i + 1; j < events.length; j++) {
      const second = tokens(events[j].titulo);
      const shared = [...first].filter((word) => second.has(word));
      const total = new Set([...first, ...second]).size;
      if (shared.length >= 3 && shared.length / total >= 0.5)
        pairs.push({ first: events[i], second: events[j] });
    }
  }
  return pairs;
}

export function applyCurationAction(state, action) {
  const { events, unassociated } = state;
  if (action.type === "edit" || action.type === "approve") {
    return {
      ...state,
      events: events.map((event) =>
        event.id === action.id
          ? {
              ...event,
              ...(action.type === "edit" ? action.values : {}),
              status: action.type === "approve" ? "Revisado" : "Ajustado",
            }
          : event,
      ),
    };
  }
  if (action.type === "move") {
    const updated = transferArticle(events, action.article, action.sourceId, action.targetId);
    if (updated === events) return state;
    return {
      events: updated,
      unassociated: unassociated.filter((article) => article.id !== action.article.id),
    };
  }
  if (action.type === "remove") {
    const source = events.find((event) => event.id === action.sourceId);
    if (!source?.artigos.some((article) => article.id === action.article.id)) return state;
    return {
      events: events.map((event) =>
        event.id === source.id
          ? {
              ...event,
              status: "Ajustado",
              artigos: event.artigos.filter((article) => article.id !== action.article.id),
            }
          : event,
      ),
      unassociated: [
        ...unassociated.filter((article) => article.id !== action.article.id),
        { ...action.article, categoria: source.categoria },
      ],
    };
  }
  if (action.type === "merge")
    return { ...state, events: mergeEvents(events, action.targetId, action.sourceId) };
  return state;
}
