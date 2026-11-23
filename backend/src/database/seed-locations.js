import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPool, transaction } from "./index.js";

export async function seedLocations(pool) {
  const data = JSON.parse(
    await readFile(new URL("../../data/locations/data.json", import.meta.url), "utf8"),
  );
  return transaction(pool, async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(91827462)");
    await client.query(
      `INSERT INTO countries (code, name)
       SELECT code, name FROM jsonb_to_recordset($1::jsonb) AS c(code text, name text)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`,
      [JSON.stringify(data.countries)],
    );
    await client.query(
      `INSERT INTO states (id, country_code, code, name)
       SELECT id, "countryCode", code, name
       FROM jsonb_to_recordset($1::jsonb) AS s(id integer, "countryCode" text, code text, name text)
       ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, name = EXCLUDED.name
       WHERE states.country_code = EXCLUDED.country_code`,
      [JSON.stringify(data.states)],
    );
    return { countries: data.countries.length, states: data.states.length };
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pool = createPool();
  try {
    console.log(await seedLocations(pool));
  } finally {
    await pool.end();
  }
}
