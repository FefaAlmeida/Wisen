import { expect, it } from "vitest";
import { mergeEvents, transferArticle } from "../../frontend/src/lib/event-curation.js";

const article = { id: 101, titulo: "Selic" };
const events = [
  { id: 1, titulo: "Origem", artigos: [article, { id: 102 }] },
  { id: 2, titulo: "Destino", artigos: [{ id: 201 }] },
];
it("transferência mantém contagens coerentes, sem duplicar artigos ou modificar a entrada", () => {
  const transferred = transferArticle(events, article, 1, 2);
  expect(transferred.map((event) => event.artigos.length)).toEqual([1, 2]);
  expect(events.map((event) => event.artigos.length)).toEqual([2, 1]);
  expect(transferArticle(transferred, article, 1, 2)).toBe(transferred);
  expect(transferArticle(events, article, 1, 1)).toBe(events);
  expect(transferArticle(events, article, 1, 99)).toBe(events);
});
it("associação e unificação não duplicam artigos e não removem evento inválido", () => {
  const associated = transferArticle(events, article, null, 2);
  expect(transferArticle(associated, article, null, 2)[1].artigos).toHaveLength(2);
  const merged = mergeEvents(associated, 1, 2);
  expect(merged).toHaveLength(1);
  expect(merged[0].artigos.map((item) => item.id)).toEqual([101, 102, 201]);
  expect(mergeEvents(events, 1, 1)).toBe(events);
  expect(mergeEvents(events, 1, 99)).toBe(events);
});
