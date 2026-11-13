import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function key(config) {
  if (!config.OPERATIONS_TOKEN)
    throw new Error("Configure OPERATIONS_TOKEN para proteger e-mails pendentes");
  return createHash("sha256").update(config.OPERATIONS_TOKEN).digest();
}
export function encryptMail(text, config) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(config), iv);
  const content = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), content].map((v) => v.toString("base64url")).join(".");
}
export function decryptMail(text, config) {
  const [iv, tag, content] = text.split(".").map((v) => Buffer.from(v, "base64url"));
  const cipher = createDecipheriv("aes-256-gcm", key(config), iv);
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(content), cipher.final()]).toString("utf8");
}
