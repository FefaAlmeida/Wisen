import assert from "node:assert/strict";
import test from "node:test";
import { articleUrl, downloadText, extractArticle, parseFeed } from "../../ai/src/source.js";

const url = "https://agenciabrasil.ebc.com.br/economia/noticia/2026-11/exemplo";

test("fonte rejeita URLs externas e normaliza parâmetros sem duplicar artigos", async () => {
  for (const value of [
    "http://127.0.0.1/",
    "https://agenciabrasil.ebc.com.br.evil.test/economia/noticia/x",
    "https://user:pass@agenciabrasil.ebc.com.br/economia/noticia/x",
  ]) {
    assert.throws(() => articleUrl(value));
    await assert.rejects(downloadText(value));
  }
  assert.equal(articleUrl(`${url}?tracking=x#trecho`), url);
  const items = await parseFeed(`<rss version="2.0"><channel><title>Teste</title>
    <item><title>Original</title><link>${url}?tracking=x</link><pubDate>invalid</pubDate></item>
    <item><title>Duplicado</title><link>${url}#trecho</link></item>
    <item><title>Externo</title><link>https://example.test/</link></item>
    </channel></rss>`);
  assert.deepEqual(items, [{ url, title: "Original", publishedAt: null }]);
});

test("extração exige conteúdo suficiente e remove scripts e navegação", () => {
  assert.throws(() => extractArticle("<p>Layout mudou</p>"), /seletor/);
  assert.throws(
    () => extractArticle('<div class="conteudo-noticia"><p>Curto</p></div>'),
    /suficiente/,
  );
  const paragraph = "Uma notícia com informações relevantes para o leitor. ".repeat(8).trim();
  assert.equal(
    extractArticle(
      `<div class="conteudo-noticia"><nav><p>menu</p></nav><script>alert(1)</script><p>${paragraph}</p></div>`,
    ),
    paragraph,
  );
});
