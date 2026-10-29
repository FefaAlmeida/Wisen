import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const marker = "node_modules/.wisen-lock-hash";
const hash = createHash("sha256").update(readFileSync("package-lock.json")).digest("hex");
if (existsSync(marker) && readFileSync(marker, "utf8") === hash) {
  console.log("Dependências já correspondem ao lockfile.");
} else {
  const result = spawnSync("npm", ["ci", "--no-audit", "--no-fund"], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
  writeFileSync(marker, hash);
}
