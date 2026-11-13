import { load } from "cheerio";
import Parser from "rss-parser";
import { SOURCE, SOURCES } from "../../backend/src/shared.js";

export function articleUrl(value) {
  const url = new URL(value);
  if (
    !SOURCES.some(
      (source) =>
        source.origin === url.origin &&
        (source.slug === SOURCE.slug
          ? url.pathname.startsWith("/economia/noticia/")
          : /^\/noticias\/\d+/.test(url.pathname)),
    ) ||
    url.username ||
    url.password
  ) {
    throw new Error("URL fora da fonte de Economia permitida");
  }
  url.hash = "";
  url.search = "";
  return url.href;
}

export async function downloadText(url, { maxBytes = 2_000_000, feed = false } = {}) {
  if (feed ? !SOURCES.some((source) => source.feed === url) : articleUrl(url) !== url)
    throw new Error("URL não permitida");
  const response = await fetch(url, {
    headers: { "User-Agent": "Wisen/0.2 (projeto educacional; coleta automatica)" },
    redirect: "error",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Fonte respondeu HTTP ${response.status}`);
  const reader = response.body.getReader();
  const buffers = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error("Resposta da fonte excede o limite");
      buffers.push(Buffer.from(value));
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(buffers).toString("utf8");
}

export async function parseFeed(xml, source = SOURCE) {
  const feed = await new Parser().parseString(xml);
  const seen = new Set();
  const articles = [];
  for (const item of feed.items.slice(0, 20)) {
    let url;
    try {
      url = articleUrl(item.link);
      if (new URL(url).origin !== source.origin) continue;
    } catch {
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    const date = new Date(item.isoDate ?? item.pubDate);
    articles.push({
      url,
      title: item.title?.trim() || "Sem título",
      publishedAt: Number.isNaN(date.getTime()) ? null : date.toISOString(),
    });
  }
  if (!articles.length) throw new Error("Feed não contém artigos válidos da editoria");
  return articles;
}

export function extractArticle(html) {
  const $ = load(html);
  $("script, style, iframe, nav, footer, aside, form, .related, .social").remove();
  const root = $(".conteudo-noticia, .materia__corpo").first();
  if (!root.length) throw new Error("Estrutura do artigo mudou: seletor não encontrado");
  const content = root
    .find("p,h2,h3,li")
    .map((_, node) => $(node).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean)
    .join("\n\n");
  if (content.length < 200) throw new Error("Artigo sem conteúdo suficiente");
  if (content.length > 150000) throw new Error("Artigo excede o limite desta integração");
  return content;
}
