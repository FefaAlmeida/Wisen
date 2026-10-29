import { spawn, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { root, withTestDatabase } from "./database.js";

const backendPort = process.env.E2E_BACKEND_PORT || "18080";
const frontendPort = process.env.E2E_FRONTEND_PORT || "18081";
const baseUrl = `http://127.0.0.1:${frontendPort}`;
const token = "test-operations-token-with-at-least-32-characters";
const nextBin = resolve(root, "node_modules/next/dist/bin/next");
const playwrightCli = resolve(root, "node_modules/@playwright/test/cli.js");

function launch(file, args, env, cwd = root) {
  const child = spawn(process.execPath, [file, ...args], {
    cwd,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.on("error", (error) => {
    output = `${output}${error.message}\n`.slice(-30000);
  });
  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      output = `${output}${chunk}`.slice(-30000);
    });
  }
  const exited = new Promise((resolveExit) => {
    child.once("exit", (code, signal) => resolveExit({ code, signal }));
  });
  return {
    child,
    exited,
    get output() {
      return output;
    },
  };
}

async function waitFor(url, server, label) {
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    if (server.child.exitCode !== null || server.child.signalCode !== null) {
      throw new Error(`${label} encerrou antes de ficar pronto:\n${server.output}`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 400));
  }
  throw new Error(`${label} não ficou pronto em 120 segundos:\n${server.output}`);
}

async function stop(server) {
  if (!server || server.child.exitCode !== null || server.child.signalCode !== null) return;
  server.child.kill("SIGTERM");
  let timer;
  const stopped = await Promise.race([
    server.exited.then(() => true),
    new Promise((resolveTimeout) => {
      timer = setTimeout(() => resolveTimeout(false), 8000);
    }),
  ]);
  clearTimeout(timer);
  if (!stopped) {
    server.child.kill("SIGKILL");
    await server.exited;
  }
}

let exitCode = 0;
await withTestDatabase(async (databaseUrl) => {
  const env = {
    ...process.env,
    NODE_ENV: "test",
    DATABASE_URL: databaseUrl,
    PORT: backendPort,
    FRONTEND_URL: baseUrl,
    BACKEND_INTERNAL_URL: `http://127.0.0.1:${backendPort}/api`,
    OPERATIONS_TOKEN: token,
    NEXT_TELEMETRY_DISABLED: "1",
    E2E_BASE_URL: baseUrl,
  };
  let backend;
  let frontend;
  try {
    backend = launch("backend/src/server.js", [], env);
    frontend = launch(
      nextBin,
      ["dev", "--webpack", "--hostname", "127.0.0.1", "--port", frontendPort],
      env,
      resolve(root, "frontend"),
    );
    await waitFor(`http://127.0.0.1:${backendPort}/api/health`, backend, "backend de teste");
    await waitFor(`${baseUrl}/paginaLogin`, frontend, "frontend de teste");

    const result = spawnSync(
      process.execPath,
      [playwrightCli, "test", "--config=test/playwright.config.js"],
      { cwd: root, env, stdio: "inherit" },
    );
    if (result.error) throw result.error;
    exitCode = result.status ?? 1;
    if (exitCode !== 0) {
      console.error("\nLogs do backend de teste:\n", backend.output);
      console.error("\nLogs do frontend de teste:\n", frontend.output);
    }
  } finally {
    await stop(frontend);
    await stop(backend);
  }
});
process.exitCode = exitCode;
