import assert from "node:assert/strict";
import test from "node:test";
import { vectorLiteral } from "../../backend/src/database/index.js";
import { paginationInput, searchInput } from "../../backend/src/shared.js";

test("busca remove espaços externos e aplica limite padrão", () => {
  assert.deepEqual(searchInput.parse({ query: "  juros e inflação  " }), {
    query: "juros e inflação",
    limit: 5,
  });
});

test("busca recusa consultas curtas e limites fora da faixa", () => {
  assert.throws(() => searchInput.parse({ query: "oi" }));
  assert.throws(() => searchInput.parse({ query: "inflação", limit: 21 }));
});

test("paginação converte query strings e aplica defaults", () => {
  assert.deepEqual(paginationInput.parse({ page: "2", limit: "25" }), { page: 2, limit: 25 });
  assert.deepEqual(paginationInput.parse({}), { page: 1, limit: 10 });
});

test("literal de vetor exige 384 números finitos", () => {
  assert.equal(vectorLiteral([0, 0.5, ...Array(382).fill(1)]).startsWith("[0,0.5,1"), true);
  assert.throws(() => vectorLiteral([1, 2]), /384/);
  assert.throws(() => vectorLiteral([...Array(383).fill(1), Number.NaN]), /384/);
});
