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

    async findPasswordHashById(userId) {
      const { rows } = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
      return rows[0]?.password_hash ?? null;
    },

    async updatePasswordHash(userId, passwordHash) {
      await pool.query("UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2", [
        passwordHash,
        userId,
      ]);
    },

    async createAccount({ name, email, passwordHash, tokenHash, expiresAt }) {
      return transaction(pool, async (client) => {
        const {
          rows: [user],
        } = await client.query(
          `INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING ${userColumns}`,
          [name, email, passwordHash],
        );
        await client.query(
          "INSERT INTO user_preferences(user_id, interest_onboarding_completed) VALUES($1, false)",
          [user.id],
        );
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

    async findProfile(userId) {
      const { rows } = await pool.query(
        `SELECT ${sessionUserColumns}, users.avatar_data_url, user_preferences.interests,
                user_preferences.interest_onboarding_completed,
                user_preferences.review_reminders, user_preferences.weekly_summary
           FROM users
           JOIN user_preferences ON user_preferences.user_id = users.id
          WHERE users.id = $1`,
        [userId],
      );
      const profile = rows[0];
      if (!profile) return null;

      const {
        id,
        email,
        name,
        role,
        avatar_data_url,
        interests,
        interest_onboarding_completed,
        review_reminders,
        weekly_summary,
      } = profile;
      return {
        user: { id, email, name, role },
        avatarDataUrl: avatar_data_url,
        preferences: {
          interests,
          onboardingCompleted: interest_onboarding_completed,
          notifications: { reviewReminders: review_reminders, weeklySummary: weekly_summary },
        },
      };
    },

    async updateProfile(userId, { name, email, interests, notifications }) {
      return transaction(pool, async (client) => {
        if (interests !== undefined) {
          const { rows } = await client.query(
            "SELECT name FROM categories WHERE available = true AND name = ANY($1::text[])",
            [interests],
          );
          if (rows.length !== interests.length) {
            throw Object.assign(new Error("Um ou mais assuntos não estão disponíveis"), {
              statusCode: 400,
            });
          }
        }

        const {
          rows: [user],
        } = await client.query(
          `UPDATE users 
              SET name = COALESCE($1, name), email = COALESCE($2, email), updated_at = now() 
            WHERE id = $3 
        RETURNING ${userColumns}`,
          [name, email, userId],
        );

        await client.query(
          `INSERT INTO user_preferences (
             user_id, interests, review_reminders, weekly_summary, interest_onboarding_completed
           )
           VALUES ($1, COALESCE($2::text[], '{}'), COALESCE($3::boolean, true), COALESCE($4::boolean, false), $5)
           ON CONFLICT (user_id) DO UPDATE 
           SET interests = COALESCE($2::text[], user_preferences.interests),
               review_reminders = COALESCE($3::boolean, user_preferences.review_reminders),
               weekly_summary = COALESCE($4::boolean, user_preferences.weekly_summary),
               interest_onboarding_completed = user_preferences.interest_onboarding_completed OR $5,
               updated_at = now()`,
          [
            userId,
            interests,
            notifications?.reviewReminders,
            notifications?.weeklySummary,
            interests !== undefined,
          ],
        );

        return user;
      });
    },

    async updateAvatar(userId, avatarDataUrl) {
      await pool.query("UPDATE users SET avatar_data_url = $1, updated_at = now() WHERE id = $2", [
        avatarDataUrl,
        userId,
      ]);
      return avatarDataUrl;
    },
  };
}
