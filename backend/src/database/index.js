import pg from "pg";

export function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL não definida");
  return new pg.Pool({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });
}

export async function transaction(pool, callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function vectorLiteral(values) {
  if (!Array.isArray(values) || values.length !== 384 || values.some((v) => !Number.isFinite(v))) {
    throw new Error("Embedding deve conter 384 números finitos");
  }
  return `[${values.join(",")}]`;
}
