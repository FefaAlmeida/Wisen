import { transaction, vectorLiteral } from "../../backend/src/database/index.js";
import { enqueue } from "../../backend/src/queue/index.js";
import { MODEL_VERSION, QUEUES } from "../../backend/src/shared.js";

export function workerRepository(pool, boss) {
  return {
    async source(id) {
      return (await pool.query("SELECT * FROM sources WHERE id=$1", [id])).rows[0];
    },
    async article(id) {
      return (await pool.query("SELECT * FROM articles WHERE id=$1", [id])).rows[0];
    },
    async search(id) {
      return (await pool.query("SELECT * FROM search_requests WHERE id=$1", [id])).rows[0];
    },
    async saveFeed(sourceId, items) {
      return transaction(pool, async (client) => {
        let queued = 0;
        for (const item of items) {
          const {
            rows: [article],
          } = await client.query(
            `INSERT INTO articles(source_id,url,title,published_at) VALUES($1,$2,$3,$4)
             ON CONFLICT(url) DO UPDATE SET url=excluded.url RETURNING id,embedding_version,processing_status`,
            [sourceId, item.url, item.title, item.publishedAt],
          );
          if (
            article.embedding_version === MODEL_VERSION &&
            article.processing_status === "processed"
          )
            continue;
          // O upsert acima mantém um row lock até o commit: coletas concorrentes
          // verificam a fila em sequência, sem impedir reenvio de tarefas falhas.
          const pending = await client.query(
            "SELECT 1 FROM pgboss.job WHERE name=$1 AND data->>'articleId'=$2 AND state IN ('created','retry','active') LIMIT 1",
            [QUEUES.article, article.id],
          );
          if (pending.rowCount) continue;
          await enqueue(boss, client, QUEUES.article, { articleId: article.id });
          queued++;
        }
        await client.query(
          "UPDATE sources SET last_collected_at=now(),last_error=NULL WHERE id=$1",
          [sourceId],
        );
        await client.query(
          "INSERT INTO collection_runs(source_id,status,articles_found) VALUES($1,'completed',$2)",
          [sourceId, items.length],
        );
        return queued;
      });
    },
    async articleStatus(id, status, error = null) {
      await pool.query(
        "UPDATE articles SET processing_status=$2,last_error=$3,updated_at=now() WHERE id=$1",
        [id, status, error],
      );
    },
    async searchStatus(id, status, error = null) {
      await pool.query(
        "UPDATE search_requests SET status=$2,error=$3,updated_at=now() WHERE id=$1",
        [id, status, error],
      );
    },
    async saveEmbeddings(id, content, hash, chunks, elapsedMs) {
      await transaction(pool, async (client) => {
        const {
          rows: [current],
        } = await client.query(
          "SELECT content_hash,embedding_version FROM articles WHERE id=$1 FOR UPDATE",
          [id],
        );
        if (current?.content_hash === hash && current?.embedding_version === MODEL_VERSION) {
          await client.query(
            "UPDATE articles SET processing_status='processed',last_error=NULL,updated_at=now() WHERE id=$1",
            [id],
          );
          return;
        }
        await client.query("DELETE FROM article_chunks WHERE article_id=$1", [id]);
        for (const [position, chunk] of chunks.entries()) {
          await client.query(
            "INSERT INTO article_chunks(article_id,position,content,token_count,model_version,embedding) VALUES($1,$2,$3,$4,$5,$6::vector)",
            [
              id,
              position,
              chunk.content,
              chunk.tokenCount,
              MODEL_VERSION,
              vectorLiteral(chunk.vector),
            ],
          );
        }
        await client.query(
          "UPDATE articles SET content=$2,content_hash=$3,embedding_version=$4,processing_status='processed',last_error=NULL,updated_at=now() WHERE id=$1",
          [id, content, hash, MODEL_VERSION],
        );
        await client.query(
          "INSERT INTO ai_runs(article_id,provider,model,operation,latency_ms,status) VALUES($1,'local',$2,'embedding',$3,'completed')",
          [id, MODEL_VERSION, elapsedMs],
        );
      });
    },
    async completeSearch(id, vector, limit) {
      const { rows } = await pool.query(
        `
        WITH matches AS (
          SELECT DISTINCT ON (a.id) a.id,a.title,a.url,left(c.content,400) AS excerpt,
            1 - (c.embedding <=> $1::vector) AS score
          FROM article_chunks c JOIN articles a ON a.id=c.article_id
          WHERE c.model_version=$2 AND a.processing_status='processed'
          ORDER BY a.id,c.embedding <=> $1::vector,c.position
        ) SELECT * FROM matches ORDER BY score DESC,id LIMIT $3`,
        [vectorLiteral(vector), MODEL_VERSION, limit],
      );
      await pool.query(
        "UPDATE search_requests SET status='completed',results=$2::jsonb,error=NULL,updated_at=now() WHERE id=$1",
        [id, JSON.stringify(rows)],
      );
      return rows;
    },
    async sourceError(id, message) {
      await transaction(pool, async (client) => {
        await client.query("UPDATE sources SET last_error=$2 WHERE id=$1", [id, message]);
        await client.query(
          "INSERT INTO collection_runs(source_id,status,error) VALUES($1,'failed',$2)",
          [id, message],
        );
      });
    },
    async reconcileFailures() {
      // Inclui tarefas que esgotaram tentativas por encerramento abrupto do processo.
      await pool.query(
        `UPDATE articles a SET processing_status='failed',last_error='Tentativas esgotadas; execute a coleta novamente',updated_at=now()
        WHERE processing_status IN ('pending','processing') AND EXISTS
          (SELECT 1 FROM pgboss.job j WHERE j.name=$1 AND j.state='failed' AND j.data->>'articleId'=a.id::text)
        AND NOT EXISTS (SELECT 1 FROM pgboss.job j WHERE j.name=$1 AND j.state IN ('created','retry','active') AND j.data->>'articleId'=a.id::text)`,
        [QUEUES.article],
      );
      await pool.query(
        `UPDATE search_requests s SET status='failed',error='Tentativas esgotadas; envie uma nova busca',updated_at=now()
        WHERE status IN ('pending','processing') AND EXISTS
          (SELECT 1 FROM pgboss.job j WHERE j.name=$1 AND j.state='failed' AND j.data->>'id'=s.id::text)
        AND NOT EXISTS (SELECT 1 FROM pgboss.job j WHERE j.name=$1 AND j.state IN ('created','retry','active') AND j.data->>'id'=s.id::text)`,
        [QUEUES.search],
      );
      await pool.query(
        "DELETE FROM search_requests WHERE created_at < now() - interval '7 days' AND status IN ('completed','failed')",
      );
    },
  };
}
