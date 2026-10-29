import { createPool } from "@wisen/database";
import { createQueue } from "@wisen/queue";
import { configuration } from "@wisen/shared";
import { buildApp } from "./app.js";

const config = configuration();
const pool = createPool(config.DATABASE_URL);
let boss;
let app;
try {
  await pool.query("SELECT 1 FROM schema_migrations LIMIT 1");
  boss = await createQueue(config.DATABASE_URL);
  app = await buildApp({ pool, boss, config });
  app.addHook("onClose", async () => {
    await boss.stop();
    await pool.end();
  });
  await app.listen({ port: config.PORT, host: "0.0.0.0" });
} catch (error) {
  console.error(error.message);
  await boss?.stop();
  await pool.end();
  process.exitCode = 1;
}
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, async () => {
    await app?.close();
  });
