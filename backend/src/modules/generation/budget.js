import { transaction } from "../../database/index.js";

export function estimateCost(inputTokens, outputTokens, config) {
  return (
    Math.ceil(
      ((inputTokens * config.AI_INPUT_USD_PER_MILLION +
        outputTokens * config.AI_OUTPUT_USD_PER_MILLION) /
        1e6) *
        config.AI_USD_BRL *
        config.AI_COST_MARGIN *
        1e8,
    ) / 1e8
  );
}
export function budgetService(pool, config) {
  return {
    async reserve(task, inputTokens, outputTokens) {
      return transaction(pool, async (c) => {
        const taskRow = (
          await c.query("SELECT * FROM generation_tasks WHERE id=$1 FOR UPDATE", [task.id])
        ).rows[0];
        if (!taskRow || taskRow.status === "completed") return null;
        await c.query(
          "INSERT INTO budget_months(month,limit_brl) VALUES(date_trunc('month',now() AT TIME ZONE 'America/Sao_Paulo')::date,$1) ON CONFLICT(month) DO UPDATE SET limit_brl=excluded.limit_brl",
          [config.AI_MONTHLY_LIMIT_BRL],
        );
        const month = (
          await c.query(
            "SELECT * FROM budget_months WHERE month=date_trunc('month',now() AT TIME ZONE 'America/Sao_Paulo')::date FOR UPDATE",
          )
        ).rows[0];
        if (taskRow.user_id) {
          const user = (
            await c.query("SELECT * FROM users WHERE id=$1 FOR UPDATE", [taskRow.user_id])
          ).rows[0];
          if (!user?.active || !user.email_verified_at)
            throw Object.assign(new Error("Confirme seu e-mail para gerar explicações"), {
              code: "EMAIL_UNVERIFIED",
              statusCode: 403,
            });
          const count = Number(
            (
              await c.query(
                "SELECT count(*) FROM generation_charges WHERE user_id=$1 AND created_at>=date_trunc('day',now() AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'America/Sao_Paulo' AND status<>'released'",
                [user.id],
              )
            ).rows[0].count,
          );
          if (count >= (user.generation_limit ?? config.AI_DAILY_USER_LIMIT))
            throw Object.assign(new Error("Limite diário de gerações atingido"), {
              code: "DAILY_LIMIT",
              statusCode: 429,
            });
        }
        const reserve = estimateCost(inputTokens, outputTokens, config);
        if (Number(month.committed_brl) + reserve > Number(month.limit_brl))
          throw Object.assign(new Error("Orçamento mensal de IA esgotado"), {
            code: "BUDGET_EXHAUSTED",
            statusCode: 429,
          });
        await c.query("UPDATE budget_months SET committed_brl=committed_brl+$2 WHERE month=$1", [
          month.month,
          reserve,
        ]);
        return (
          await c.query(
            "INSERT INTO generation_charges(task_id,month,user_id,model,reserved_brl,input_rate,output_rate,fx,margin) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
            [
              task.id,
              month.month,
              taskRow.user_id,
              config.AI_MODEL,
              reserve,
              config.AI_INPUT_USD_PER_MILLION,
              config.AI_OUTPUT_USD_PER_MILLION,
              config.AI_USD_BRL,
              config.AI_COST_MARGIN,
            ],
          )
        ).rows[0];
      });
    },
    async settle(id, usage, release = false) {
      return transaction(pool, async (c) => {
        const charge = (
          await c.query("SELECT * FROM generation_charges WHERE id=$1 FOR UPDATE", [id])
        ).rows[0];
        if (!charge || !["reserved", "unknown"].includes(charge.status)) return;
        if (!usage && !release) {
          await c.query("UPDATE generation_charges SET status='unknown' WHERE id=$1", [id]);
          return;
        }
        const actual = release
          ? 0
          : Math.ceil(
              ((usage.input_tokens * Number(charge.input_rate) +
                usage.output_tokens * Number(charge.output_rate)) /
                1e6) *
                Number(charge.fx) *
                Number(charge.margin) *
                1e8,
            ) / 1e8;
        await c.query("UPDATE budget_months SET committed_brl=committed_brl+$2-$3 WHERE month=$1", [
          charge.month,
          actual,
          charge.reserved_brl,
        ]);
        await c.query(
          "UPDATE generation_charges SET actual_brl=$2,input_tokens=$3,output_tokens=$4,status=$5 WHERE id=$1",
          [
            id,
            actual,
            usage?.input_tokens,
            usage?.output_tokens,
            release ? "released" : "completed",
          ],
        );
      });
    },
    async summary() {
      const month = (
        await pool.query(
          "SELECT * FROM budget_months WHERE month=date_trunc('month',now() AT TIME ZONE 'America/Sao_Paulo')::date",
        )
      ).rows[0];
      const committed = Number(month?.committed_brl ?? 0),
        limit = Number(month?.limit_brl ?? config.AI_MONTHLY_LIMIT_BRL);
      return {
        limit,
        committed,
        remaining: Math.max(0, limit - committed),
        alerts: [50, 75, 90].filter((n) => committed >= (limit * n) / 100),
        currency: "BRL",
        estimated: true,
      };
    },
  };
}
