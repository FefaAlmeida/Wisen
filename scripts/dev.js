import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
if (existsSync(".env")) process.loadEnvFile(".env");
if (process.env.NODE_ENV === "production") {
  throw new Error("npm run dev é exclusivo do desenvolvimento. Use o fluxo de deploy em produção.");
}
const dockerFrontend = process.argv.includes("--docker");
if (process.argv.slice(2).some((arg) => arg !== "--docker")) {
  throw new Error("Uso: node scripts/dev.js [--docker]");
}
const frontendPort = process.env.FRONTEND_HOST_PORT || "3000";
const backendPort = process.env.BACKEND_HOST_PORT || "8080";
let nextBin;
if (!dockerFrontend) {
  for (const port of [frontendPort, backendPort]) {
    if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
      throw new Error("FRONTEND_HOST_PORT e BACKEND_HOST_PORT devem ser portas entre 1 e 65535.");
    }
  }
  try {
    const require = createRequire(new URL("../frontend/package.json", import.meta.url));
    nextBin = require.resolve("next/dist/bin/next");
  } catch {
    throw new Error(
      "Instale as dependências locais com npm install antes de executar npm run dev.",
    );
  }
}
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
  "import {readFile} from 'node:fs/promises';import {MODEL_VERSION} from './backend/src/shared.js';const marker=await readFile(process.env.MODEL_CACHE_DIR+'/wisen-model.json','utf8').catch(()=>null);if(!marker||JSON.parse(marker).version!==MODEL_VERSION){console.error('Execute npm run setup:model antes de iniciar.');process.exit(1)}",
);
compose("up", "-d", "--wait", "database");
compose("run", "--rm", "migrate");
compose("run", "--rm", "--no-deps", "backend", "node", "backend/src/database/seed.js");
compose("run", "--rm", "--no-deps", "backend", "node", "backend/src/database/demo.js");
compose(
  "up",
  "-d",
  "--wait",
  "--wait-timeout",
  "240",
  "backend",
  "ai",
  ...(dockerFrontend ? ["frontend"] : []),
);
console.log(
  `Wisen: http://localhost:${frontendPort} | Swagger: http://localhost:${backendPort}/docs`,
);
console.log("Logs: npm run dev:logs | Parar: npm run dev:down");
if (!dockerFrontend) {
  console.log(
    "Frontend local com atualização automática. Ctrl+C encerra o frontend; containers continuam ativos.",
  );
  const frontend = spawn(
    process.execPath,
    [nextBin, "dev", "--turbopack", "--hostname", "127.0.0.1", "--port", frontendPort],
    {
      cwd: fileURLToPath(new URL("../frontend/", import.meta.url)),
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: frontendPort,
        BACKEND_INTERNAL_URL: `http://127.0.0.1:${backendPort}/api`,
      },
    },
  );
  let stopping = false;
  function stop(signal) {
    if (stopping) return;
    stopping = true;
    if (frontend.exitCode !== null || frontend.signalCode !== null) return;
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(frontend.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      frontend.kill(signal);
    }
  }
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));
  frontend.once("error", (error) => {
    console.error(`Não foi possível iniciar o frontend: ${error.message}`);
    process.exitCode = 1;
  });
  frontend.once("exit", (code) => {
    process.exitCode = stopping ? 0 : (code ?? 1);
  });
}
