import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createPool } from "../../backend/src/database/index.js";
import { seedDevelopmentAdmin } from "../../backend/src/database/seed.js";
import { authRepository } from "../../backend/src/modules/auth/auth.repository.js";
import { authService } from "../../backend/src/modules/auth/auth.service.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
const auth = authService(authRepository(pool));
after(() => pool.end());

test("seed cria administrador autenticável e preserva conta e preferências nas repetições", async () => {
  const email = "wisenadmin@gmail.com";
  try {
    const user = await seedDevelopmentAdmin(pool);
    const login = await auth.login({ email, password: "AdminWisen@123" });
    assert.equal(login.user.id, user.id);
    assert.equal(login.user.role, "admin");
    assert.ok(await auth.getProfile(user.id));

    await auth.changePassword(user.id, {
      currentPassword: "AdminWisen@123",
      newPassword: "SenhaAlterada@456",
    });
    await pool.query("UPDATE user_preferences SET interests = $1 WHERE user_id = $2", [
      ["Tecnologia"],
      user.id,
    ]);
    // Uma conta existente com o mesmo e-mail também deve receber o papel administrativo.
    await pool.query("UPDATE users SET role = 'user' WHERE id = $1", [user.id]);
    const repeated = await Promise.all([seedDevelopmentAdmin(pool), seedDevelopmentAdmin(pool)]);
    assert.ok(repeated.every((result) => result.id === user.id && result.role === "admin"));
    const updatedLogin = await auth.login({ email, password: "SenhaAlterada@456" });
    assert.equal(updatedLogin.user.role, "admin");
    assert.deepEqual((await auth.getProfile(user.id)).preferences.interests, ["Tecnologia"]);
    const { rows } = await pool.query("SELECT id FROM users WHERE lower(email) = lower($1)", [
      email,
    ]);
    assert.equal(rows.length, 1);

    await pool.query("UPDATE users SET active = false WHERE id = $1", [user.id]);
    await seedDevelopmentAdmin(pool);
    await assert.rejects(auth.login({ email, password: "SenhaAlterada@456" }), {
      statusCode: 401,
    });
  } finally {
    await pool.query("DELETE FROM users WHERE email = $1", [email]);
  }
});

test("seed recusa execução em produção antes de acessar o banco", async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    await assert.rejects(seedDevelopmentAdmin(null), /exclusivo do ambiente de desenvolvimento/);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
