import { createHash, randomBytes, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { buildApp } from "../../backend/src/app.js";
import { createPool } from "../../backend/src/database/index.js";
import { createQueue } from "../../backend/src/queue/index.js";
import { configuration } from "../../backend/src/shared.js";
import { withTestDatabase } from "./database.js";

await withTestDatabase(async (databaseUrl) => {
  const config = configuration({
    DATABASE_URL: databaseUrl,
    NODE_ENV: "test",
    OPERATIONS_TOKEN: "load-test-operations-token-at-least-32-chars",
  });
  const pool = createPool(databaseUrl);
  const boss = await createQueue(databaseUrl);
  const app = await buildApp({ pool, boss, config, logger: false });
  try {
    const source = (
      await pool.query(
        "INSERT INTO sources(slug,name,feed_url,internal_reading) VALUES('load','Fonte carga','https://example.test/load',true) RETURNING id",
      )
    ).rows[0];
    for (let n = 0; n < 50; n++) {
      const event = (
        await pool.query(
          "INSERT INTO events(title,summary,status,started_at,topics) VALUES($1,'Resumo de evento para carga.','processed',now(),'{Juros}') RETURNING id",
          [`Evento econômico ${n}`],
        )
      ).rows[0];
      const article = (
        await pool.query(
          "INSERT INTO articles(source_id,url,title,content,processing_status) VALUES($1,$2,$3,'Conteúdo de teste de carga.','processed') RETURNING id",
          [source.id, `https://example.test/load/${n}`, `Artigo ${n}`],
        )
      ).rows[0];
      await pool.query("INSERT INTO event_articles(article_id,event_id) VALUES($1,$2)", [
        article.id,
        event.id,
      ]);
    }
    const concept = (
      await pool.query(
        "INSERT INTO concepts(name,description) VALUES('Conceito de carga','Definição para carga.') RETURNING id",
      )
    ).rows[0];
    const sessions = [];
    for (let n = 0; n < 50; n++) {
      const user = (
        await pool.query(
          "INSERT INTO users(name,email,email_verified_at) VALUES($1,$2,now()) RETURNING id",
          [`Carga ${n}`, `load-${n}@example.test`],
        )
      ).rows[0];
      await pool.query("INSERT INTO user_preferences(user_id,interests) VALUES($1,'{Juros}')", [
        user.id,
      ]);
      const token = randomBytes(32).toString("base64url");
      await pool.query(
        "INSERT INTO auth_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '1 hour')",
        [createHash("sha256").update(token).digest("hex"), user.id],
      );
      sessions.push(token);
    }
    await app.listen({ host: "127.0.0.1", port: 0 });
    const base = app.listeningOrigin;
    const times = [];
    let errors = 0;
    await Promise.all(
      sessions.map(async (token) => {
        for (const path of ["/feed", "/concepts", "/knowledge", "/reviews", "/saved"]) {
          const start = performance.now();
          const response = await fetch(`${base}/api${path}`, {
            headers: { cookie: `wisen_session=${token}` },
          });
          await response.arrayBuffer();
          times.push(performance.now() - start);
          if (!response.ok) errors++;
        }
        const response = await fetch(`${base}/api/generations`, {
          method: "POST",
          headers: { cookie: `wisen_session=${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            operation: "concept",
            conceptId: concept.id,
            requestId: randomUUID(),
          }),
        });
        if (response.status !== 202) errors++;
        await response.arrayBuffer();
      }),
    );
    times.sort((a, b) => a - b);
    const p95 = times[Math.ceil(times.length * 0.95) - 1];
    const result = {
      environment: "local, not production VM",
      users: 50,
      reads: times.length,
      generationsQueued: 50,
      unexpectedErrors: errors,
      p95ms: Math.round(p95),
    };
    console.log(JSON.stringify(result));
    if (errors > 0 || p95 > 2000) throw new Error("Critérios locais de carga não atingidos");
  } finally {
    await app.close();
    await boss.stop();
    await pool.end();
  }
});
