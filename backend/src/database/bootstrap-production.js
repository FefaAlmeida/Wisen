import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { hashPassword } from "../modules/auth/auth.service.js";
import { createPool, transaction } from "./index.js";

export async function bootstrapProduction(pool, env = process.env) {
  if (!env.WISEN_ADMIN_EMAIL || !env.WISEN_ADMIN_PASSWORD)
    throw new Error("Configure as credenciais do administrador");
  const hash = await hashPassword(env.WISEN_ADMIN_PASSWORD);
  const editorial = JSON.parse(
    await readFile(new URL("../../content/economia-inicial.json", import.meta.url), "utf8"),
  );
  return transaction(pool, async (c) => {
    await c.query("SELECT pg_advisory_xact_lock(881343)");
    const user = (
      await c.query(
        "INSERT INTO users(name,email,password_hash,role,email_verified_at) VALUES('Administrador Wisen',$1,$2,'admin',now()) ON CONFLICT(lower(email)) DO UPDATE SET role='admin' RETURNING id,email",
        [env.WISEN_ADMIN_EMAIL, hash],
      )
    ).rows[0];
    await c.query("INSERT INTO user_preferences(user_id) VALUES($1) ON CONFLICT DO NOTHING", [
      user.id,
    ]);
    if ((await c.query("SELECT 1 FROM editorial_imports WHERE key=$1", [editorial.key])).rowCount)
      return { admin: user.email, editorial: "preservado" };
    const source = (
      await c.query(
        "INSERT INTO sources(slug,name,feed_url,enabled,attribution,internal_reading) VALUES('agencia-brasil-economia','Agência Brasil — Economia','https://agenciabrasil.ebc.com.br/rss/economia/feed.xml',true,'Agência Brasil / EBC — fonte das notícias; sínteses editoriais Wisen',true) ON CONFLICT(slug) DO UPDATE SET attribution=excluded.attribution RETURNING id",
      )
    ).rows[0];
    const concepts = new Map();
    for (const entry of editorial.concepts) {
      const concept = (
        await c.query(
          "INSERT INTO concepts(name,description,curated) VALUES($1,$2,true) ON CONFLICT(lower(name)) DO UPDATE SET name=concepts.name RETURNING id",
          [entry.name, entry.description],
        )
      ).rows[0];
      concepts.set(entry.name, concept.id);
      const q = entry.question;
      await c.query(
        "INSERT INTO question_bank(concept_id,prompt,options,correct_index,explanation,rubric) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
        [concept.id, q.prompt, JSON.stringify(q.options), q.correct_index, q.explanation, q.rubric],
      );
    }
    for (const entry of editorial.events) {
      const article = (
        await c.query(
          "INSERT INTO articles(source_id,url,title,published_at,curated) VALUES($1,$2,$3,$4,true) ON CONFLICT(url) DO UPDATE SET curated=true RETURNING id",
          [source.id, entry.url, entry.title, entry.publishedAt],
        )
      ).rows[0];
      let event = (
        await c.query("SELECT event_id id FROM event_articles WHERE article_id=$1", [article.id])
      ).rows[0];
      if (!event) {
        event = (
          await c.query(
            "INSERT INTO events(title,summary,started_at,status,topics,curated) VALUES($1,$2,$3,'processed',$4,true) RETURNING id",
            [entry.title, entry.summary, entry.publishedAt, ["Economia", ...entry.concepts]],
          )
        ).rows[0];
        await c.query("INSERT INTO event_articles(article_id,event_id) VALUES($1,$2)", [
          article.id,
          event.id,
        ]);
      }
      for (const name of entry.concepts) {
        const id = concepts.get(name);
        for (const [table, column, parent] of [
          ["event_concepts", "event_id", event.id],
          ["article_concepts", "article_id", article.id],
        ])
          await c.query(
            `INSERT INTO ${table}(${column},concept_id,source_type,source_id,method,model,confidence) VALUES($1,$2,'article',$3,'editorial','editorial-v1',1) ON CONFLICT DO NOTHING`,
            [parent, id, article.id],
          );
      }
    }
    await c.query("INSERT INTO editorial_imports(key) VALUES($1)", [editorial.key]);
    return { admin: user.email, events: editorial.events.length, concepts: concepts.size };
  });
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const pool = createPool();
  try {
    console.log(await bootstrapProduction(pool));
  } finally {
    await pool.end();
  }
}
