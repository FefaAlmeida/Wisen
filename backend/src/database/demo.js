import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../modules/auth/auth.service.js";
import { demoConcepts, mockQuestions } from "../modules/generation/mock.js";
import { generationMode } from "../modules/generation/mode.js";
import { configuration } from "../shared.js";
import { createPool, transaction } from "./index.js";

const stories = [
  [
    "Como a inflação muda o orçamento das famílias",
    "Uma família compara os preços de alimentação, transporte e moradia para reorganizar seu orçamento. O cenário mostra como a inflação afeta o poder de compra.",
    [0, 5],
  ],
  [
    "Juros e crédito: o que muda em uma compra parcelada",
    "Uma loja simula diferentes condições de financiamento. A taxa Selic ajuda a entender por que o custo do crédito pode mudar e como isso afeta o consumo.",
    [1, 0],
  ],
  [
    "Por que o dólar influencia produtos do dia a dia",
    "Uma empresa que importa peças compara seus custos em diferentes cenários de câmbio. A variação da moeda pode chegar ao consumidor, dependendo dos estoques e da concorrência.",
    [2, 0],
  ],
  [
    "Crescimento econômico além de um único indicador",
    "O Produto Interno Bruto ajuda a acompanhar a atividade de uma economia. Neste exemplo, produção, serviços e consumo apresentam ritmos diferentes de expansão.",
    [3, 5],
  ],
  [
    "Como as escolhas do orçamento público afetam a economia",
    "Um município discute como distribuir recursos entre infraestrutura, educação e saúde. A política fiscal envolve escolhas de gastos e arrecadação com efeitos sobre a população.",
    [4, 3],
  ],
  [
    "Oferta e demanda na feira: entendendo os preços",
    "Uma safra maior aumenta a oferta de alimentos, enquanto a procura permanece estável. O exemplo de oferta e demanda ajuda a explicar por que alguns preços podem recuar.",
    [5, 0],
  ],
];

export async function seedDemo(pool, config) {
  if (config.NODE_ENV === "production")
    throw new Error("O seed de demonstração é exclusivo do desenvolvimento");
  if (generationMode(config) !== "mock") return null;
  const passwordHash = await hashPassword("ClienteWisen@123");
  return transaction(pool, async (c) => {
    await c.query("SELECT pg_advisory_xact_lock(881342)");
    const user = (
      await c.query(
        "INSERT INTO users(name,email,password_hash,role) VALUES('Cliente Demonstração','cliente@wisen.local',$1,'user') ON CONFLICT(lower(email)) DO UPDATE SET email=users.email RETURNING id,email",
        [passwordHash],
      )
    ).rows[0];
    await c.query(
      "INSERT INTO user_preferences(user_id,interests,familiarity,interest_onboarding_completed) VALUES($1,$2,'beginner',false) ON CONFLICT DO NOTHING",
      [user.id, ["Inflação", "Renda e consumo"]],
    );
    const source = (
      await c.query(
        "INSERT INTO sources(slug,name,feed_url,enabled,attribution,internal_reading) VALUES('wisen-demo','Wisen — Demonstração','https://demo.wisen.invalid/feed',false,'Conteúdo fictício para demonstração de interface',true) ON CONFLICT(slug) DO UPDATE SET slug=excluded.slug RETURNING id",
      )
    ).rows[0];
    const concepts = [];
    for (const concept of demoConcepts) {
      const row = (
        await c.query(
          "INSERT INTO concepts(name,description) VALUES($1,$2) ON CONFLICT(lower(name)) DO UPDATE SET name=concepts.name RETURNING id,name,description",
          [concept.name, concept.description],
        )
      ).rows[0];
      concepts.push(row);
      for (const q of mockQuestions(row).questions)
        await c.query(
          "INSERT INTO question_bank(concept_id,prompt,options,correct_index,explanation,rubric) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
          [row.id, q.prompt, JSON.stringify(q.options), q.correct_index, q.explanation, q.rubric],
        );
    }
    const events = [];
    for (const [index, [title, summary, indices]] of stories.entries()) {
      const article = (
        await c.query(
          "INSERT INTO articles(source_id,url,title,content,published_at,processing_status) VALUES($1,$2,$3,$4,now()-($5*interval '1 hour'),'processed') ON CONFLICT(url) DO UPDATE SET url=excluded.url RETURNING id",
          [
            source.id,
            `https://demo.wisen.invalid/artigos/${index + 1}`,
            `[Demonstração] ${title}`,
            `Cenário fictício para avaliação de interface.\n\n${summary}\n\n${indices.map((i) => demoConcepts[i].description).join("\n\n")}\n\nEste texto é ilustrativo e não descreve um acontecimento real.`,
            index,
          ],
        )
      ).rows[0];
      let event = (
        await c.query("SELECT event_id id FROM event_articles WHERE article_id=$1", [article.id])
      ).rows[0];
      if (!event) {
        event = (
          await c.query(
            "INSERT INTO events(title,summary,started_at,status,topics) VALUES($1,$2,now(),'processed',$3) RETURNING id",
            [
              `[Demonstração] ${title}`,
              `Cenário fictício. ${summary}`,
              indices.map((i) => demoConcepts[i].topic),
            ],
          )
        ).rows[0];
        await c.query("INSERT INTO event_articles(article_id,event_id) VALUES($1,$2)", [
          article.id,
          event.id,
        ]);
      }
      events.push(event);
      const entity = (
        await c.query(
          "INSERT INTO entities(name,type,description) VALUES('Instituto Wisen de Estudos — fictício','Demonstração','Instituição fictícia usada para visualizar as conexões de conteúdo.') ON CONFLICT(name,type) DO UPDATE SET name=excluded.name RETURNING id",
        )
      ).rows[0];
      await c.query(
        "INSERT INTO event_entities(event_id,entity_id,source_type,source_id,method,model,confidence) VALUES($1,$2,'article',$3,'demo-seed','mock-v1',1) ON CONFLICT DO NOTHING",
        [event.id, entity.id, article.id],
      );
      await c.query(
        "INSERT INTO article_analyses(article_id,model,prompt_version,data) SELECT $1,'mock-v1','demo-v1','{}' WHERE NOT EXISTS(SELECT 1 FROM article_analyses WHERE article_id=$1)",
        [article.id],
      );
      await c.query(
        "INSERT INTO event_categories(event_id,category_id) SELECT $1,id FROM categories WHERE name=ANY($2) ON CONFLICT DO NOTHING",
        [event.id, indices.map((i) => demoConcepts[i].topic)],
      );
      for (const i of indices) {
        await c.query(
          "INSERT INTO event_concepts(event_id,concept_id,source_type,source_id,method,model,confidence) VALUES($1,$2,'article',$3,'demo-seed','mock-v1',1) ON CONFLICT DO NOTHING",
          [event.id, concepts[i].id, article.id],
        );
        await c.query(
          "INSERT INTO article_concepts(article_id,concept_id,source_type,source_id,method,model,confidence) VALUES($1,$2,'article',$1,'demo-seed','mock-v1',1) ON CONFLICT DO NOTHING",
          [article.id, concepts[i].id],
        );
      }
    }
    for (const [i, concept] of concepts.entries()) {
      await c.query(
        "INSERT INTO user_concepts(user_id,concept_id,status,mastery_score,successful_reviews,next_review) VALUES($1,$2,$3,$4,$5,now()-interval '1 hour') ON CONFLICT DO NOTHING",
        [
          user.id,
          concept.id,
          ["gap", "review", "mastered"][i % 3],
          [0, 0.5, 0.8][i % 3],
          i % 3 === 2 ? 3 : 0,
        ],
      );
      // Only seed a review once; restarting preserves completed exercises.
      await c.query(
        "INSERT INTO reviews(user_id,concept_id,due_at,format,question,question_id) SELECT $1,$2,now(),'recognition',jsonb_build_object('prompt',q.prompt,'options',q.options),q.id FROM question_bank q WHERE q.concept_id=$2 AND NOT EXISTS(SELECT 1 FROM reviews WHERE user_id=$1 AND concept_id=$2) ORDER BY q.created_at LIMIT 1 ON CONFLICT DO NOTHING",
        [user.id, concept.id],
      );
      await c.query(
        "INSERT INTO concept_relations(from_id,to_id,relation,source_type,source_id,method,model,confidence) VALUES($1,$2,'RELATED_TO','concept',$1,'demo-seed','mock-v1',1) ON CONFLICT DO NOTHING",
        [concept.id, concepts[(i + 1) % concepts.length].id],
      );
      if (i > 0)
        await c.query(
          "INSERT INTO event_relations(from_id,to_id,relation,source_type,source_id,method,model,confidence) VALUES($1,$2,'RELATED_TO','event',$1,'demo-seed','mock-v1',1) ON CONFLICT DO NOTHING",
          [events[0].id, events[i].id],
        );
    }
    await c.query(
      "INSERT INTO saved_contents(user_id,event_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
      [user.id, events[0].id],
    );
    await c.query(
      "INSERT INTO saved_contents(user_id,concept_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
      [user.id, concepts[0].id],
    );
    return user;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = configuration();
  const pool = createPool(config.DATABASE_URL);
  try {
    const user = await seedDemo(pool, config);
    if (user) console.log(`Demonstração disponível: ${user.email}`);
  } finally {
    await pool.end();
  }
}
