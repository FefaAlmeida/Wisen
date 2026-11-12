import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../modules/auth/auth.service.js";
import { createPool, transaction } from "./index.js";

export async function seedDevelopmentAdmin(pool) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("O seed de administrador é exclusivo do ambiente de desenvolvimento");
  }

  const passwordHash = await hashPassword("AdminWisen@123");
  return transaction(pool, async (client) => {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (lower(email)) DO UPDATE SET role = 'admin'
       RETURNING id, email, role`,
      ["Administrador Wisen", "wisenadmin@gmail.com", passwordHash],
    );
    await client.query(
      "INSERT INTO user_preferences (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
      [user.id],
    );
    return user;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pool = createPool();
  try {
    const user = await seedDevelopmentAdmin(pool);
    console.log(`Administrador de desenvolvimento disponível: ${user.email}`);
  } finally {
    await pool.end();
  }
}
