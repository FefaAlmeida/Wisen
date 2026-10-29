import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { root, withTestDatabase } from "./database.js";

let exitCode = 0;
await withTestDatabase(async (databaseUrl) => {
  const directory = resolve(root, "test/integration");
  const files = readdirSync(directory)
    .filter((name) => name.endsWith(".test.js"))
    .sort()
    .map((name) => resolve(directory, name));
  const result = spawnSync(process.execPath, ["--test", ...files], {
    cwd: root,
    env: {
      ...process.env,
      TEST_DATABASE_URL: databaseUrl,
      TEST_OPERATIONS_TOKEN: "test-operations-token-with-at-least-32-characters",
    },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  exitCode = result.status ?? 1;
});
process.exitCode = exitCode;
