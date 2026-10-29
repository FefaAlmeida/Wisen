import { PgBoss } from "pg-boss";
import { QUEUES } from "../shared.js";

export async function createQueue(
  connectionString,
  onError = (error) => console.error(error.message),
) {
  const boss = new PgBoss({ connectionString, max: 3, application_name: "wisen-queue" });
  boss.on("error", onError);
  try {
    await boss.start();
    for (const name of Object.values(QUEUES)) {
      await boss.createQueue(name, {
        retryLimit: 3,
        retryDelay: 5,
        retryBackoff: true,
        expireInSeconds: 600,
        retentionSeconds: 86400,
        deleteAfterSeconds: 86400,
      });
    }
    return boss;
  } catch (error) {
    await boss.stop();
    throw error;
  }
}

// A tarefa e o registro de negócio são confirmados na mesma transação.
export function enqueue(boss, client, name, data, options = {}) {
  return boss.send(name, data, {
    ...options,
    db: { executeSql: (sql, params) => client.query(sql, params) },
  });
}
