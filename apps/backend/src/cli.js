import { setTimeout as delay } from "node:timers/promises";
import { createPool, transaction } from "@wisen/database";
import { createQueue, enqueue } from "@wisen/queue";
import { configuration, QUEUES, SOURCE } from "@wisen/shared";

const config = configuration();
const [command, ...args] = process.argv.slice(2);
if (command === "collect") {
  const pool = createPool(config.DATABASE_URL);
  const boss = await createQueue(config.DATABASE_URL);
  try {
    const result = await transaction(pool, async (client) => {
      const {
        rows: [source],
      } = await client.query(
        "INSERT INTO sources(slug,name,feed_url) VALUES($1,$2,$3) ON CONFLICT(slug) DO UPDATE SET name=excluded.name RETURNING id,enabled",
        [SOURCE.slug, SOURCE.name, SOURCE.feed],
      );
      if (!source.enabled) throw new Error("Fonte desativada");
      return enqueue(boss, client, QUEUES.collect, { sourceId: source.id });
    });
    console.log(`Coleta agendada: ${result}. Acompanhe com npm run dev:logs.`);
  } finally {
    await boss.stop();
    await pool.end();
  }
} else if (command === "search") {
  const query = args.join(" ").trim();
  if (!query) throw new Error("Uso: npm run search -- inflação e juros");
  const base = `http://127.0.0.1:${config.PORT}`;
  const headers = {
    "content-type": "application/json",
    ...(config.OPERATIONS_TOKEN ? { authorization: `Bearer ${config.OPERATIONS_TOKEN}` } : {}),
  };
  const response = await fetch(`${base}/api/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(await response.text());
  const { id } = await response.json();
  for (let attempt = 0; attempt < 180; attempt++) {
    const response = await fetch(`${base}/api/search/${id}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();
    if (result.status === "completed") {
      console.log(JSON.stringify(result.results, null, 2));
      break;
    }
    if (result.status === "failed") throw new Error(result.error);
    if (attempt === 179)
      throw new Error(`Busca ainda pendente: ${id}. Consulte GET /api/search/${id}.`);
    await delay(1000);
  }
} else {
  throw new Error("Comandos: collect | search <texto>");
}
