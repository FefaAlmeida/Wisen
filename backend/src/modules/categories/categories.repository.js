import { transaction } from "../../database/index.js";

const categoryColumns = "id, name, description, available";

export function categoriesRepository(pool) {
  return {
    async listAvailable() {
      const { rows } = await pool.query(
        `SELECT ${categoryColumns} FROM categories WHERE available = true ORDER BY name`,
      );
      return rows;
    },

    async listAll() {
      const { rows } = await pool.query(`SELECT ${categoryColumns} FROM categories ORDER BY name`);
      return rows;
    },

    async updateAvailability(updates) {
      return transaction(pool, async (client) => {
        for (const { id, available } of updates) {
          const result = await client.query("UPDATE categories SET available = $1 WHERE id = $2", [
            available,
            id,
          ]);
          if (result.rowCount === 0) {
            throw Object.assign(new Error("Categoria não encontrada"), { statusCode: 404 });
          }
        }

        const { rows } = await client.query(
          `SELECT ${categoryColumns} FROM categories ORDER BY name`,
        );
        if (rows.filter((category) => category.available).length < 3) {
          throw Object.assign(new Error("Mantenha pelo menos três categorias disponíveis."), {
            statusCode: 400,
          });
        }
        return rows;
      });
    },
  };
}
