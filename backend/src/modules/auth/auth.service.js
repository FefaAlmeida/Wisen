import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const passwordOptions = { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };
const sessionDurationMs = 30 * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64, passwordOptions);
  return `${salt.toString("base64url")}.${hash.toString("base64url")}`;
}

async function verifyPassword(password, storedHash) {
  const [saltText, hashText] = storedHash?.split(".") ?? [];
  if (!saltText || !hashText) return false;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(hashText, "base64url");
  if (salt.length !== 16 || expected.length !== 64) return false;
  const actual = await scrypt(password, salt, expected.length, passwordOptions);
  return timingSafeEqual(actual, expected);
}

function createSessionToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

function invalidCredentials() {
  return Object.assign(new Error("E-mail ou senha inválidos"), { statusCode: 401 });
}

export function authService(repository) {
  return {
    async register({ name, email, password }) {
      const passwordHash = await hashPassword(password);
      const { token, tokenHash } = createSessionToken();
      const expiresAt = new Date(Date.now() + sessionDurationMs);
      try {
        const user = await repository.createAccount({
          name,
          email,
          passwordHash,
          tokenHash,
          expiresAt,
        });
        return { user, token };
      } catch (error) {
        if (error.code === "23505") {
          throw Object.assign(new Error("Este e-mail já está cadastrado"), { statusCode: 409 });
        }
        throw error;
      }
    },
    async login({ email, password, remember = false }) {
      const user = await repository.findByEmail(email);
      if (!user?.active || !(await verifyPassword(password, user.password_hash))) {
        throw invalidCredentials();
      }
      const { token, tokenHash } = createSessionToken();
      const maxAge = remember ? sessionDurationMs : 24 * 60 * 60 * 1000;
      await repository.createSession(user.id, tokenHash, new Date(Date.now() + maxAge));
      return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
        maxAge: maxAge / 1000,
      };
    },
    async findSession(token) {
      if (!token) return null;
      return repository.findSession(hashToken(token));
    },
    async logout(token) {
      if (token) await repository.deleteSession(hashToken(token));
    },
  };
}
