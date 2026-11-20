"use client";
import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { requisitar, useResource } from "@/components/platform/shared";
import RevisoesLayout from "./layout";
import NovaRevisao from "./novaRevisao";
import PainelRevisoes from "./painelRevisoes";
import QuizRevisao from "./quizRevisao";
import styles from "./revisoes.module.css";

export default function LiveReviews({ view = "painel" }) {
  const params = useSearchParams();
  const sessionId = params.get("sessao");
  const router = useRouter();
  const catalog = useResource("/reviews/catalog");
  const resource = useResource(
    view === "sessao" && sessionId
      ? `/reviews/sessions/${encodeURIComponent(sessionId)}`
      : "/reviews/summary",
  );
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(null);
  const heading = useRef(null);
  const current = session ?? resource.data;
  const concepts = catalog.data?.items ?? [];
  const areas = concepts.length
    ? [
        {
          id: "economia",
          nome: "Economia",
          temas: concepts.map((c) => ({ id: c.id, nome: c.name })),
        },
      ]
    : [];
  const questions = concepts.flatMap((c) =>
    Array.from({ length: c.total }, (_, i) => ({ id: `${c.id}-${i}`, temaId: c.id })),
  );
  async function action(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function start(conceptIds, format) {
    await action(async () => {
      requestId.current ??= crypto.randomUUID();
      const data = await requisitar("/reviews/sessions", {
        method: "POST",
        body: { conceptIds, format, requestId: requestId.current },
      });
      router.push(`/paginaSessaoRevisao?sessao=${data.id}`);
    });
  }
  function move(next) {
    setIndex(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  let content;
  if (catalog.loading || resource.loading)
    content = (
      <p role="status" className={styles.page}>
        Carregando suas revisões…
      </p>
    );
  else if (catalog.error || resource.error)
    content = (
      <div className={styles.page} role="alert">
        <p>{catalog.error || resource.error}</p>
        <button
          className={styles.secundario}
          type="button"
          onClick={() => {
            catalog.reload();
            resource.reload();
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  else if (view === "painel")
    content = <PainelRevisoes areas={areas} questoes={questions} summary={resource.data} />;
  else if (view === "nova")
    content = concepts.length ? (
      <NovaRevisao areas={areas} questoes={questions} onStart={start} busy={busy} />
    ) : (
      <div className={styles.page}>
        <h1>Novas revisões estão a caminho</h1>
        <p>
          Ainda não há questões disponíveis. Explore os conceitos enquanto preparamos novas
          atividades.
        </p>
        <Link className={styles.voltar} href="/paginaExplorar">
          Explorar notícias
        </Link>
      </div>
    );
  else if (!sessionId)
    content = (
      <div className={styles.page}>
        <h1>Prepare sua revisão primeiro</h1>
        <Link data-wisen-hover="preserve" className={styles.primario} href="/paginaRevisoes/nova">
          Nova revisão
        </Link>
      </div>
    );
  else {
    const items = current.items ?? [];
    const position =
      index ??
      Math.max(
        0,
        items.findIndex((i) => !i.revelada),
      );
    const item = items[position];
    const done = items.filter((i) => i.revelada).length;
    content = (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 ref={heading} tabIndex={-1}>
            {current.completed_at ? "Revisão concluída" : "Sua revisão"}
          </h1>
          <p className={styles.descricao}>Progresso salvo na sua conta</p>
        </header>
        {current.completed_at ? (
          <section className={`${styles.panel} ${styles.resultado}`}>
            <CheckCheck size={36} />
            <h2>Uma etapa a mais no seu aprendizado</h2>
            <p>
              {current.format === "quiz"
                ? `${items.filter((i) => i.correct).length} de ${items.length} respostas corretas`
                : `${done} cartões revisados`}
            </p>
            <fieldset className={styles.avaliacao}>
              <legend>
                Como foi esta revisão? <small>Opcional</small>
              </legend>
              <div>
                {["Fácil", "Médio", "Difícil"].map((d) => (
                  <button
                    className={styles.secundario}
                    key={d}
                    type="button"
                    disabled={busy}
                    aria-pressed={current.difficulty === d}
                    onClick={() =>
                      action(async () =>
                        setSession(
                          await requisitar(`/reviews/sessions/${sessionId}/complete`, {
                            method: "POST",
                            body: { difficulty: d },
                          }),
                        ),
                      )
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>
            <Link data-wisen-hover="preserve" className={styles.primario} href="/paginaRevisoes">
              Voltar à central
            </Link>
          </section>
        ) : (
          item && (
            <section className={`${styles.panel} ${styles.sessao}`}>
              <div className={styles.sessaoTopo}>
                <span>
                  {current.format === "quiz" ? "Questão" : "Cartão"} {position + 1} de{" "}
                  {items.length}
                </span>
                <Link href="/paginaRevisoes" className={styles.textButton}>
                  Sair da revisão
                </Link>
              </div>
              <progress
                className={styles.progresso}
                max={items.length}
                value={done}
                aria-label="Progresso da revisão"
              />
              <QuizRevisao
                live
                busy={busy}
                questao={item}
                modo={current.format}
                resposta={item.resposta}
                revelada={item.revelada}
                onResponder={(answer) => {
                  setIndex(position);
                  return action(async () =>
                    setSession(
                      await requisitar(`/reviews/sessions/${sessionId}/items/${item.id}`, {
                        method: "POST",
                        body: { answer },
                      }),
                    ),
                  );
                }}
                onRevelar={() => {
                  setIndex(position);
                  return action(async () =>
                    setSession(
                      await requisitar(`/reviews/sessions/${sessionId}/items/${item.id}`, {
                        method: "POST",
                        body: {},
                      }),
                    ),
                  );
                }}
              />
              {item.sourceUrl && (
                <a href={item.sourceUrl} target="_blank" rel="noreferrer" className={styles.voltar}>
                  Consultar fonte da notícia
                </a>
              )}
              <nav className={styles.navegacao} aria-label="Navegação da revisão">
                <button
                  type="button"
                  className={styles.secundario}
                  disabled={busy || position === 0}
                  onClick={() => move(position - 1)}
                >
                  <ArrowLeft size={17} /> Anterior
                </button>
                <button
                  type="button"
                  data-wisen-hover="preserve"
                  className={styles.primario}
                  disabled={busy || !item.revelada}
                  onClick={() => {
                    if (position < items.length - 1) move(position + 1);
                    else
                      action(async () => {
                        setSession(
                          await requisitar(`/reviews/sessions/${sessionId}/complete`, {
                            method: "POST",
                            body: {},
                          }),
                        );
                        move(0);
                      });
                  }}
                >
                  {position === items.length - 1 ? "Concluir revisão" : "Próxima questão"}{" "}
                  <ArrowRight size={17} />
                </button>
              </nav>
            </section>
          )
        )}
      </div>
    );
  }
  return (
    <RevisoesLayout>
      {error && (
        <div role="alert" className={styles.page}>
          {error}
        </div>
      )}
      {content}
    </RevisoesLayout>
  );
}
