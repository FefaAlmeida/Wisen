import { isPublicDemoPath } from "../lib/public-demo.js";

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function requisitar(caminho, { body, headers, signal, ...options } = {}) {
  if (typeof window !== "undefined" && isPublicDemoPath(window.location.pathname)) {
    const { demoRequest } = await import("./public-demo");
    signal?.throwIfAborted();
    return demoRequest(caminho, options.method ?? "GET", body);
  }
  const response = await fetch(`/api${caminho}`, {
    ...options,
    credentials: "same-origin",
    headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: signal ?? AbortSignal.timeout(15000),
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(
      payload?.message || "Não foi possível completar a solicitação.",
      response.status,
      payload?.code || "HTTP_ERROR",
    );
  return payload;
}
