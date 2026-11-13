import assert from "node:assert/strict";
import test from "node:test";
import { generateMock } from "../../backend/src/modules/generation/mock.js";
import { generationMode } from "../../backend/src/modules/generation/mode.js";
import { generateStructured } from "../../backend/src/modules/generation/provider.js";

test("auto seleciona mock sem chave local, OpenAI com chave e exige provedor em produção", () => {
  assert.equal(generationMode({ NODE_ENV: "development" }), "mock");
  assert.equal(generationMode({ NODE_ENV: "production" }), "openai");
  assert.equal(generationMode({ OPENAI_API_KEY: "test" }), "openai");
  assert.equal(generationMode({ AI_PROVIDER: "mock", OPENAI_API_KEY: "test" }), "mock");
});

test("mock explica conteúdo e trecho sem rede ou consumo", async () => {
  const input = {
    operation: "passage",
    passage: "Trecho do artigo",
    context: { title: "Inflação", content: "Contexto do artigo" },
  };
  const result = await generateStructured({ AI_PROVIDER: "mock" }, input, {}, "passage", () =>
    assert.fail("Mock não chama rede"),
  );
  assert.match(result.data.text, /Trecho do artigo/);
  assert.match(result.data.text, /demonstração/);
  assert.deepEqual(result.usage, { input_tokens: 0, output_tokens: 0 });
});

test("análise simulada não inventa acontecimentos, entidades ou equivalências", () => {
  const result = generateMock(
    {
      context: {
        article: { title: "Inflação em foco", content: "Texto sobre inflação." },
        knownConcepts: [{ id: "known", name: "Inflação" }],
      },
    },
    "analysis",
  ).data;
  assert.equal(result.event_id, null);
  assert.deepEqual(result.entities, []);
  assert.deepEqual(result.relations, []);
  assert.equal(result.concepts[0].alias_of, "known");
  assert.match(result.summary, /simulada/);
});

test("correção aberta declara que não avaliou o aluno", () => {
  const result = generateMock(
    { context: { answer: "resposta qualquer", expected: "Referência de estudo" } },
    "grade",
  ).data;
  assert.equal(result.verdict, "partial");
  assert.match(result.feedback, /não foi avaliada/);
  assert.match(result.feedback, /Referência de estudo/);
});
