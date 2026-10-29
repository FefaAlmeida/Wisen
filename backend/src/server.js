import { buildApp } from "./app.js";
import { createPool } from "./database/index.js";
import { createQueue } from "./queue/index.js";
import { configuration } from "./shared.js";

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
