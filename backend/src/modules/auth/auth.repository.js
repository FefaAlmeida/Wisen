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

    async updateProfile(userId, { name, email, topics = [], notifications = {} }) {
      return transaction(pool, async (client) => {
        // 1. Atualiza dados principais do usuário
        const {
          rows: [user],
        } = await client.query(
          `UPDATE users 
              SET name = $1, email = $2, updated_at = now() 
            WHERE id = $3 
        RETURNING ${userColumns}`,
          [name, email, userId],
        );

        // 2. Atualiza preferências de notificação
        await client.query(
          `INSERT INTO user_preferences (user_id, review_reminders, weekly_summary)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id) DO UPDATE 
           SET review_reminders = EXCLUDED.review_reminders,
               weekly_summary = EXCLUDED.weekly_summary`,
          [
            userId,
            notifications.reviewReminders ?? true,
            notifications.weeklySummary ?? false,
          ],
        );

        // 3. Substitui os tópicos de interesse selecionados
        await client.query("DELETE FROM user_topics WHERE user_id = $1", [userId]);
        for (const topicSlug of topics) {
          await client.query(
            "INSERT INTO user_topics (user_id, topic_slug) VALUES ($1, $2)",
            [userId, topicSlug],
          );
        }

        return user;
      });
    },
  };
}