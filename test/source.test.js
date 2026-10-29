import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { vectorLiteral } from "@wisen/database";
import { configuration, SOURCE, searchInput } from "@wisen/shared";
import { articleUrl, extractArticle, parseFeed } from "../apps/ai/src/source.js";

test("fonte aceita somente artigos da editoria e remove tracking", () => {
  assert.equal(
    articleUrl(`${SOURCE.origin}/economia/noticia/2026-10/exemplo?utm_source=rss#trecho`),
    `${SOURCE.origin}/economia/noticia/2026-10/exemplo`,
  );
  for (const value of [
    "http://127.0.0.1/private",
    `${SOURCE.origin}.evil.test/economia/noticia/test`,
    `${SOURCE.origin}/politica/noticia/test`,
  ]) {
    assert.throws(() => articleUrl(value));
  }
});

test("RSS deduplica links e ignora destinos externos", async () => {
  const items = await parseFeed(
    await readFile(new URL("./fixtures/feed.xml", import.meta.url), "utf8"),
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "Juros e inflação");
  await assert.rejects(
    parseFeed('<rss version="2.0"><channel><title>Vazio</title></channel></rss>'),
    /não contém/,
  );
});

test("extração preserva parágrafos e exclui código executável", async () => {
  const text = extractArticle(
    await readFile(new URL("./fixtures/article.html", import.meta.url), "utf8"),
  );
  assert.match(text, /taxa de juros/);
  assert.ok(text.includes("\n\n"));
  assert.ok(!text.includes("alert("));
  assert.ok(!text.includes("RODAPÉ"));
  assert.throws(() => extractArticle("<main>site alterado</main>"), /Estrutura/);
});

test("configuração e entradas inválidas são rejeitadas cedo", () => {
  assert.throws(() => configuration({ DATABASE_URL: "mysql://localhost/db" }));
  assert.throws(() =>
    configuration({ DATABASE_URL: "postgres://localhost/db", NODE_ENV: "production" }),
  );
  assert.throws(() => searchInput.parse({ query: "x" }));
  assert.throws(() => searchInput.parse({ query: "juros", limit: 300 }));
  assert.throws(() => vectorLiteral([1, 2, 3]));
  assert.throws(() => vectorLiteral(Array(384).fill(Number.NaN)));
});
