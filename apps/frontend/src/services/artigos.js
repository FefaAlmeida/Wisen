import { requisitar } from "./api";

export const listarArtigos = ({ page = 1, limit = 10, signal } = {}) =>
  requisitar(`/articles?${new URLSearchParams({ page, limit })}`, { signal });
export const consultarArtigo = (id, { signal } = {}) =>
  requisitar(`/articles/${encodeURIComponent(id)}`, { signal });
