import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createPool } from "../../backend/src/database/index.js";
import { migrate } from "../../backend/src/database/migrate.js";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const databasePort = process.env.TEST_DATABASE_HOST_PORT || "55439";
export const databaseUrl = `postgres://wisen_test:wisen_test@127.0.0.1:${databasePort}/wisen_test`;
const project = `wisen-tests-${process.pid}`;

function compose(args) {
  const result = spawnSync(
    "docker",
    ["compose", "--project-name", project, "--file", "test/compose.yml", ...args],
    {
      cwd: root,
      env: { ...process.env, TEST_DATABASE_HOST_PORT: databasePort },
      stdio: "inherit",
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`docker compose ${args.join(" ")} falhou`);
}

export async function withTestDatabase(run) {
  try {
    compose(["up", "--detach", "--wait", "database"]);
    const pool = createPool(databaseUrl);
    try {
      const applied = await migrate(pool);
      console.log(`migrations de teste: ${applied.length ? applied.join(", ") : "em dia"}`);
    } finally {
      await pool.end();
    }
    await run(databaseUrl);
  } finally {
    compose(["down", "--remove-orphans"]);
  }
}
