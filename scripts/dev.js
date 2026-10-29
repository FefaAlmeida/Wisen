import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

if (existsSync(".env")) process.loadEnvFile(".env");
function compose(...args) {
  const result = spawnSync("docker", ["compose", ...args], { stdio: "inherit", env: process.env });
  if (result.error || result.status !== 0)
    throw new Error(`docker compose ${args.join(" ")} falhou`);
}
compose("build", "backend");
compose("stop", "frontend", "backend", "ai");
compose("run", "--rm", "--no-deps", "dependencies");
compose(
  "run",
  "--rm",
  "--no-deps",
  "ai",
  "node",
  "--input-type=module",
  "-e",
  "import {readFile} from 'node:fs/promises';import {MODEL_VERSION} from '@wisen/shared';const marker=await readFile('/models/wisen-model.json','utf8').catch(()=>null);if(!marker||JSON.parse(marker).version!==MODEL_VERSION){console.error('Execute npm run setup:model antes de iniciar.');process.exit(1)}",
);
compose("up", "-d", "--wait", "database");
compose("run", "--rm", "migrate");
compose("up", "-d", "--wait", "--wait-timeout", "240", "backend", "frontend", "ai");
console.log(
  `Wisen: http://localhost:${process.env.FRONTEND_HOST_PORT || 3000} | Swagger: http://localhost:${process.env.BACKEND_HOST_PORT || 8080}/docs`,
);
console.log("Logs: npm run dev:logs | Parar: npm run dev:down");
