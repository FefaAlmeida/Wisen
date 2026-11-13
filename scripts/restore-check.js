// Validates a backup in a temporary database, never in the development database.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { createPool } from "../backend/src/database/index.js";
import { withTestDatabase } from "../test/scripts/database.js";

const path = process.argv[2];
if (!path) throw new Error("Uso: node scripts/restore-check.js caminho.sql.gz");
const sql = gunzipSync(readFileSync(path))
  .toString("utf8")
  .replace(/^CREATE SCHEMA public;$/m, "");
await withTestDatabase(async (url) => {
  const pool = createPool(url);
  try {
    await pool.query("DROP SCHEMA public CASCADE;CREATE SCHEMA public");
  } finally {
    await pool.end();
  }
  const result = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      "-i",
      "--network",
      "host",
      "pgvector/pgvector:pg17",
      "psql",
      url,
      "--no-psqlrc",
      "--set",
      "ON_ERROR_STOP=1",
    ],
    { input: sql, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Falha na restauração do backup: ${result.stderr}`);
  const check = createPool(url);
  try {
    console.log({
      restored: true,
      migrations: Number(
        (await check.query("SELECT count(*) FROM schema_migrations")).rows[0].count,
      ),
    });
  } finally {
    await check.end();
  }
});
