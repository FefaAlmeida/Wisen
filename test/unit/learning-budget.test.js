import assert from "node:assert/strict";
import test from "node:test";
import { estimateCost } from "../../backend/src/modules/generation/budget.js";
import { generateStructured } from "../../backend/src/modules/generation/provider.js";
import { advanceKnowledge } from "../../backend/src/modules/platform/learning.js";

test("leitura não concede domínio; evidências, erros e intervalos são determinísticos", () => {
  let current = {};
  for (let n = 0; n < 3; n++) {
    const next = advanceKnowledge(current, "correct", new Date("2026-01-01T00:00:00Z"));
    current = {
      mastery_score: next.score,
      successful_reviews: next.successes,
      failed_reviews: next.failures,
    };
  }
  assert.equal(current.mastery_score, 0.75);
  assert.equal(advanceKnowledge(current, "correct").status, "mastered");
  const miss = advanceKnowledge(current, "incorrect");
  assert.equal(miss.successes, 0);
  assert.equal(miss.days, 1);
  assert.equal(miss.score, 0.5);
  const gap = advanceKnowledge(current, "gap");
  assert.equal(gap.score, 0);
  assert.equal(gap.status, "gap");
  assert.throws(() => advanceKnowledge(current, "exposure"));
});
test("estimativa financeira inclui câmbio e margem sem arredondar para baixo", () => {
  assert.equal(
    estimateCost(4e6, 1e6, {
      AI_INPUT_USD_PER_MILLION: 0.1,
      AI_OUTPUT_USD_PER_MILLION: 0.5,
      AI_USD_BRL: 6,
      AI_COST_MARGIN: 1.2,
    }),
    6.48,
  );
});
test("provedor não chama API sem chave e não expõe resposta HTTP com segredos", async () => {
  await assert.rejects(
    generateStructured({ AI_PROVIDER: "openai" }, {}, {}, "test", () =>
      assert.fail("Não deve chamar rede"),
    ),
    { code: "PROVIDER_NOT_CONFIGURED" },
  );
});
