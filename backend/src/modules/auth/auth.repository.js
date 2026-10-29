import { transaction } from "../../database/index.js";

const userColumns = "id, email, name, role";
const sessionUserColumns = "users.id, users.email, users.name, users.role";

export function authRepository(pool) {
  return {
    async findByEmail(email) {
      const { rows } = await pool.query(
        `SELECT ${userColumns}, password_hash, active FROM users WHERE lower(email) = lower($1)`,
        [email],
      );
      return rows[0] ?? null;
    },
    async createAccount({ name, email, passwordHash, tokenHash, expiresAt }) {
      return transaction(pool, async (client) => {
        const {
          rows: [user],
        } = await client.query(
          `INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING ${userColumns}`,
          [name, email, passwordHash],
        );
        await client.query("INSERT INTO user_preferences(user_id) VALUES($1)", [user.id]);
        await client.query(
          "INSERT INTO auth_sessions(token_hash, user_id, expires_at) VALUES($1, $2, $3)",
          [tokenHash, user.id, expiresAt],
        );
        return user;
      });
    },
    async createSession(userId, tokenHash, expiresAt) {
      await pool.query(
        "INSERT INTO auth_sessions(token_hash, user_id, expires_at) VALUES($1, $2, $3)",
        [tokenHash, userId, expiresAt],
      );
    },
    async findSession(tokenHash) {
      const { rows } = await pool.query(
        `SELECT ${sessionUserColumns}
         FROM auth_sessions
         JOIN users ON users.id = auth_sessions.user_id
         WHERE auth_sessions.token_hash = $1
           AND auth_sessions.expires_at > now()
           AND users.active = true`,
        [tokenHash],
      );
      return rows[0] ?? null;
    },
    async deleteSession(tokenHash) {
      await pool.query("DELETE FROM auth_sessions WHERE token_hash = $1", [tokenHash]);
    },
  };
}
