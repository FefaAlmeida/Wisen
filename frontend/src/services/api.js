export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function requisitar(caminho, { body, headers, signal, ...options } = {}) {
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
