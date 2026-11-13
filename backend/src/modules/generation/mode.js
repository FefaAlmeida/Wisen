// Auto keeps local previews usable; production requires an explicit provider.
export function generationMode(config) {
  if (config.AI_PROVIDER && config.AI_PROVIDER !== "auto") return config.AI_PROVIDER;
  return config.OPENAI_API_KEY || config.NODE_ENV === "production" ? "openai" : "mock";
}
