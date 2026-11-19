import assert from "node:assert/strict";
import test from "node:test";
import {
  explanationSchema,
  generateStructured,
} from "../../backend/src/modules/generation/provider.js";
import { configuration } from "../../backend/src/shared.js";

const config = {
  AI_PROVIDER: "openai",
  OPENAI_API_KEY: "fake",
  AI_MODEL: "gpt-6-luna",
  AI_TIMEOUT_MS: 1000,
  AI_MAX_OUTPUT_TOKENS: 4096,
};
test("background defaults off and parses false correctly", () => {
  const env = { DATABASE_URL: "postgres://test:test@localhost/test" };
  assert.equal(configuration(env).AI_BACKGROUND_GENERATION_ENABLED, false);
  assert.equal(
    configuration({ ...env, AI_BACKGROUND_GENERATION_ENABLED: "false" })
      .AI_BACKGROUND_GENERATION_ENABLED,
    false,
  );
  assert.equal(
    configuration({ ...env, AI_BACKGROUND_GENERATION_ENABLED: "true" })
      .AI_BACKGROUND_GENERATION_ENABLED,
    true,
  );
});
test("Responses contract preserves usage for incomplete and refused output", async () => {
  for (const status of ["completed", "incomplete"]) {
    const result = await generateStructured(
      config,
      {},
      explanationSchema,
      "explanation",
      async (url, options) => {
        assert.equal(url, "https://api.openai.com/v1/responses");
        const body = JSON.parse(options.body);
        assert.equal(body.store, false);
        assert.equal(body.text.format.strict, true);
        assert.equal(options.headers.Authorization, "Bearer fake");
        return Response.json({
          status,
          usage: { input_tokens: 20, output_tokens: 10 },
          output: [{ content: [{ type: "output_text", text: '{"text":"ok","concepts":[]}' }] }],
        });
      },
    );
    assert.equal(result.usage.input_tokens, 20);
    assert.equal(result.errorCode, status === "completed" ? null : "PROVIDER_INCOMPLETE");
  }
  const refusal = await generateStructured(config, {}, explanationSchema, "explanation", async () =>
    Response.json({
      status: "completed",
      usage: { input_tokens: 2, output_tokens: 1 },
      output: [{ content: [{ type: "refusal" }] }],
    }),
  );
  assert.equal(refusal.errorCode, "PROVIDER_REFUSAL");
});
test("provider errors are sanitized and distinguish quota from rate limits", async () => {
  for (const [status, providerCode, expected] of [
    [401, "", "PROVIDER_AUTH"],
    [403, "", "PROVIDER_PERMISSION"],
    [404, "", "PROVIDER_MODEL"],
    [429, "insufficient_quota", "PROVIDER_QUOTA"],
    [429, "rate_limit_exceeded", "PROVIDER_RATE_LIMIT"],
  ]) {
    await assert.rejects(
      generateStructured(config, {}, explanationSchema, "explanation", async () =>
        Response.json({ error: { code: providerCode, message: "secret" } }, { status }),
      ),
      (error) => {
        assert.equal(error.code, expected);
        assert.equal(error.definitelyUnbilled, true);
        assert.ok(!error.message.includes("secret"));
        return true;
      },
    );
  }
  await assert.rejects(
    generateStructured(config, {}, explanationSchema, "explanation", async () => {
      throw new Error("private");
    }),
    { code: "PROVIDER_CONNECTION_UNKNOWN" },
  );
});
