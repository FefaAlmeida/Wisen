import { transaction } from "../../database/index.js";
import { enqueue } from "../../queue/index.js";
import { MODEL_VERSION, QUEUES } from "../../shared.js";

export function searchRepository(pool, boss) {
  return {
    async create({ query, limit }, userId) {
      return transaction(pool, async (client) => {
        const {
          rows: [row],
        } = await client.query(
          "INSERT INTO search_requests(user_id,query,result_limit,model_version) VALUES($1,$2,$3,$4) RETURNING id,status",
          [userId, query, limit, MODEL_VERSION],
        );
        await enqueue(boss, client, QUEUES.search, { id: row.id });
        return row;
      });
    },
    async find(id, userId, isOperations) {
      const { rows } = userId
        ? await pool.query(
            "SELECT id,status,results,error FROM search_requests WHERE id=$1 AND user_id=$2",
            [id, userId],
          )
        : isOperations
          ? await pool.query("SELECT id,status,results,error FROM search_requests WHERE id=$1", [
              id,
            ])
          : { rows: [] };
      return rows[0];
    },
  };
}
