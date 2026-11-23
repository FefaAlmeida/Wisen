import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, test } from "node:test";
import { createPool } from "../../backend/src/database/index.js";
import {
  feedInteraction,
  personalizedFeed,
  rankFeed,
} from "../../backend/src/modules/platform/feed.js";
import { MODEL_VERSION } from "../../backend/src/shared.js";

const pool = createPool(process.env.TEST_DATABASE_URL);
after(() => pool.end());
test("feed vetorial, leitura idempotente, isolamento, descoberta e sessão estável", async () => {
  const user = (
    await pool.query("INSERT INTO users(name,email) VALUES('Feed',$1) RETURNING id", [
      `${randomUUID()}@example.test`,
    ])
  ).rows[0].id;
  const other = (
    await pool.query("INSERT INTO users(name,email) VALUES('Outro',$1) RETURNING id", [
      `${randomUUID()}@example.test`,
    ])
  ).rows[0].id;
  await pool.query("INSERT INTO user_preferences(user_id,interests) VALUES($1,'{TesteFeed}')", [
    user,
  ]);
  const vector = JSON.stringify(Array.from({ length: 384 }, (_, i) => (i === 383 ? 1 : 0)));
  await pool.query(
    "INSERT INTO feed_profiles(user_id,embedding,model_version,interests) VALUES($1,$2,$3,$4)",
    [user, vector, MODEL_VERSION, ["TesteFeed"]],
  );
  const source = (
    await pool.query("INSERT INTO sources(slug,name,feed_url) VALUES($1,$1,$2) RETURNING id", [
      randomUUID(),
      `https://example.test/${randomUUID()}`,
    ])
  ).rows[0].id;
  const ids = [];
  for (let n = 0; n < 10; n++) {
    const event = (
      await pool.query(
        "INSERT INTO events(title,summary,status,topics,embedding,embedding_version) VALUES($1,'Resumo','processed',$2,$3,$4) RETURNING id",
        [`Feed ${n}`, n < 8 ? ["TesteFeed"] : ["DescobertaFeed"], vector, MODEL_VERSION],
      )
    ).rows[0].id;
    const article = (
      await pool.query(
        "INSERT INTO articles(source_id,url,title,visible) VALUES($1,$2,$3,true) RETURNING id",
        [source, `https://example.test/${randomUUID()}`, `Artigo ${n}`],
      )
    ).rows[0].id;
    await pool.query("INSERT INTO event_articles(event_id,article_id) VALUES($1,$2)", [
      event,
      article,
    ]);
    ids.push(event);
  }
  const first = await personalizedFeed(pool, user, { limit: 2, topic: "TesteFeed" });
  assert.equal(first.items.length, 2);
  assert.ok(Number(first.items[0].similarity) > 0.99);
  const eventId = first.items[0].id;
  const send = (type, seconds = 0, requestId = randomUUID()) =>
    feedInteraction(pool, user, { eventId, type, seconds, requestId });
  await send("open");
  let feed = await personalizedFeed(pool, user, { topic: "TesteFeed" });
  assert.equal(feed.items.find((e) => e.id === eventId).reading_status, "reading");
  const requestId = randomUUID();
  await send("progress", 15, requestId);
  await send("progress", 15, requestId);
  await send("progress", 15);
  feed = await personalizedFeed(pool, user, { topic: "TesteFeed" });
  assert.equal(feed.items.find((e) => e.id === eventId).reading_status, "read");
  assert.equal(
    (
      await pool.query("SELECT seconds FROM feed_progress WHERE user_id=$1 AND event_id=$2", [
        user,
        eventId,
      ])
    ).rows[0].seconds,
    30,
  );
  const next = await personalizedFeed(pool, user, {
    limit: 2,
    page: 2,
    topic: "TesteFeed",
    sessionId: first.sessionId,
  });
  assert.ok(next.items.every((e) => !first.items.some((a) => a.id === e.id)));
  assert.equal(
    (await personalizedFeed(pool, other, { topic: "TesteFeed" })).items.find(
      (e) => e.id === eventId,
    ).reading_status,
    "unread",
  );
  await pool.query("UPDATE events SET summary='Nova informação' WHERE id=$1", [eventId]);
  assert.equal(
    (await personalizedFeed(pool, user, { topic: "TesteFeed" })).items.find((e) => e.id === eventId)
      .updated,
    true,
  );
  await send("dismiss");
  assert.ok(
    !(await personalizedFeed(pool, user, { topic: "TesteFeed" })).items.some(
      (e) => e.id === eventId,
    ),
  );
  const ranked = rankFeed(
    ids.map((id, i) => ({
      id,
      relevance: 1,
      discovery: i >= 8,
      topics: [],
      updated_at: new Date(),
    })),
  );
  assert.equal(ranked[4].discovery, true);
  assert.equal(ranked[9].discovery, true);
});
