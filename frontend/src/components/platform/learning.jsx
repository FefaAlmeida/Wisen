"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PageIntro } from "@/components/app/pageHeader";
import { ConceitosSalvos } from "@/components/biblioteca/conceitosSalvos";
import { FiltrosBiblioteca } from "@/components/biblioteca/filtrosBiblioteca";
import ConceptDetail, { ConceptPanel } from "@/components/conceito/conceptDetail";
import conceptStyles from "@/components/conceito/conceptDetail.module.css";
import newsStyles from "@/components/demo/newsDetail.module.css";
import learningStyles from "@/components/meuConhecimento/conhecimento.module.css";
import { Button } from "@/components/ui/button";
import {
  Exposure,
  Frame,
  Generation,
  Panel,
  requisitar,
  SaveButton,
  State,
  statusText,
  useResource,
} from "./shared";
export function Library({ knowledge = false }) {
  const initialFilter = useSearchParams()?.get("filtro");
  const [filter, setFilter] = useState(
    ["lacunas", "revisao", "dominados", "salvos"].includes(initialFilter) ? initialFilter : "todos",
  );
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const resource = useResource(
    knowledge ? "/knowledge" : `/concepts?limit=30&page=${page}&q=${encodeURIComponent(query)}`,
  );
  if (knowledge) return <LearningOverview resource={resource} />;
  return (
    <Frame title="Biblioteca de conceitos" active="Conceitos">
      <Panel>
        <h2 className="mb-2 font-semibold">Os conceitos por trás das notícias</h2>
        <p className="mb-5 text-sm text-[#65748B]">
          Consulte os conceitos que aparecem nos artigos e veja seu nível de conhecimento em cada
          um. Conceitos ainda não avaliados não representam lacunas comprovadas.
        </p>
        <Link className="mr-5 underline" href="/paginaConhecimento">
          Acompanhar meu aprendizado
        </Link>
        {!knowledge && (
          <label className="mt-5 block text-sm">
            Buscar conceitos
            <input
              value={query}
              maxLength={200}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>
        )}
        <div className="mt-5">
          <FiltrosBiblioteca
            includeSaved
            filtroAtivo={filter}
            onFiltroChange={setFilter}
            items={(resource.data?.items ?? []).map((c) => ({
              status: statusText[c.display_status ?? c.status],
            }))}
          />
        </div>
        {filter === "salvos" ? (
          <div className="mt-6">
            <ConceitosSalvos />
          </div>
        ) : (
          <State resource={resource}>
            <ul className="mt-6 divide-y">
              {resource.data?.items
                ?.filter(
                  (c) =>
                    filter === "todos" ||
                    (c.display_status ?? c.status) ===
                      { lacunas: "gap", revisao: "review", dominados: "mastered" }[filter],
                )
                .map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                      <Link
                        href={`/paginaConceito?id=${c.concept_id ?? c.id}`}
                        className="font-medium underline"
                      >
                        {c.name}
                      </Link>
                      {c.description && (
                        <p className="mt-1 text-sm text-[#65748B]">{c.description}</p>
                      )}
                    </div>
                    <span className="text-sm text-[#65748B]">
                      Seu nível: {statusText[c.display_status ?? c.status] ?? "Ainda não avaliado"}
                    </span>
                  </li>
                ))}
            </ul>
            {!knowledge && (
              <div className="mt-5 flex justify-between">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((v) => v - 1)}
                >
                  Anterior
                </Button>
                <span>Página {page}</span>
                <Button
                  variant="outline"
                  disabled={(resource.data?.items?.length ?? 0) < 30}
                  onClick={() => setPage((v) => v + 1)}
                >
                  Próxima
                </Button>
              </div>
            )}
            {!resource.data?.items?.length && (
              <p className="mt-6">
                Seu histórico aparecerá aqui conforme você explorar os conceitos.
              </p>
            )}
          </State>
        )}
      </Panel>
    </Frame>
  );
}
function LearningOverview({ resource }) {
  const items = resource.data?.items ?? [];
  const assessed = items.filter(
    (c) => c.last_review || ["gap", "review", "mastered"].includes(c.status),
  );
  const consolidated = assessed.filter((c) => c.status === "mastered");
  const reinforce = assessed.filter((c) => c.status === "gap");
  const average = assessed.length
    ? Math.round(
        (assessed.reduce((sum, c) => sum + Number(c.mastery_score ?? 0), 0) / assessed.length) *
          100,
      )
    : null;
  return (
    <Frame
      title={
        <>
          Acompanhe sua <span className="text-wisen-destaque">evolução</span>
        </>
      }
      active="Aprendizado"
    >
      <div className={learningStyles.overview}>
        <State resource={resource}>
          <section className={learningStyles.stats} aria-label="Resumo do aprendizado">
            {[
              ["Nível estimado", average === null ? "Ainda não avaliado" : `${average}/100`],
              ["Conceitos consolidados", consolidated.length],
              ["Conceitos para reforçar", reinforce.length],
            ].map(([label, value]) => (
              <article key={label} className={learningStyles.stat}>
                <h2 className={learningStyles.statTop}>{label}</h2>
                <p className="text-3xl font-semibold tracking-tight text-wisen-titulo">{value}</p>
                <span aria-hidden="true" className="h-1 w-10 rounded-full bg-wisen-destaque" />
              </article>
            ))}
          </section>
          <LearningPanel title="Seu conhecimento por conceito">
            <p className="mb-4 text-sm text-wisen-texto-suave">
              Este é seu retrato atual. O histórico de evolução ao longo do tempo ainda não está
              disponível.
            </p>
            {items.length ? (
              <ul className="divide-y divide-wisen-borda">
                {items.map((c) => (
                  <li
                    key={c.concept_id ?? c.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <Link
                        className="rounded-md font-medium text-wisen-titulo underline-offset-4 hover:underline"
                        href={`/paginaConceito?id=${c.concept_id ?? c.id}`}
                      >
                        {c.name}
                      </Link>
                      <p className="mt-1 text-sm text-wisen-texto-suave">
                        {statusText[c.display_status ?? c.status] ?? "Ainda não avaliado"}
                      </p>
                    </div>
                    <span className="rounded-lg bg-wisen-superficie px-3 py-2 text-sm font-semibold text-wisen-titulo">
                      {assessed.includes(c)
                        ? `${Math.round(Number(c.mastery_score ?? 0) * 100)}/100`
                        : "Ainda não avaliado"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                Seu aprendizado aparecerá aqui conforme você avaliar os conceitos e praticar nas
                revisões.
              </p>
            )}
          </LearningPanel>
          <LearningPanel title="Como estimamos seu nível">
            <p className="text-sm text-wisen-texto-suave">
              O nível considera respostas nas revisões e dúvidas registradas. Acertos aumentam a
              estimativa; erros indicam necessidade de reforço. Um conceito é consolidado a partir
              de 75 pontos e pelo menos duas respostas corretas. A taxa de acerto das sessões fica
              em Revisões. Ler um artigo ou concluir uma sessão, por si só, não comprova domínio.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                className="inline-flex min-h-10 items-center rounded-lg bg-wisen-destaque-suave px-4 text-sm font-semibold text-wisen-titulo"
                href="/paginaRevisoes"
              >
                Praticar nas revisões
              </Link>
              <Link
                className="inline-flex min-h-10 items-center rounded-lg border border-wisen-borda px-4 text-sm font-medium text-wisen-titulo"
                href="/paginaBiblioteca"
              >
                Consultar conceitos
              </Link>
            </div>
          </LearningPanel>
        </State>
      </div>
    </Frame>
  );
}
function LearningPanel({ title, children }) {
  return (
    <section className={`${learningStyles.panel} mb-5`}>
      <div className={learningStyles.panelHeader}>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
export function ConceptPage() {
  const id = useSearchParams().get("id");
  const resource = useResource(`/concepts/${id ?? "missing"}`);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const data = resource.data;
  async function gap() {
    setBusy(true);
    try {
      await requisitar("/interactions", {
        method: "POST",
        body: { conceptId: id, type: "gap", requestId: crypto.randomUUID() },
      });
      setMessage("Lacuna registrada. A revisão será preparada para você.");
      resource.reload();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Frame active="Conceitos">
      <State resource={resource}>
        {data && (
          <>
            <Exposure concepts={[data]} />
            <ConceptDetail
              name={data.name}
              description={data.description}
              status={statusText[data.status]}
              actions={<SaveButton type="concept" id={id} />}
              connections={(data.relations ?? []).map((relation) => ({
                name: relation.name,
                href: `/paginaConceito?id=${relation.to_id}`,
                relation:
                  relation.relation === "REQUIRES"
                    ? "Pré-requisito"
                    : relation.relation === "PART_OF"
                      ? "Faz parte de"
                      : "Relacionado",
              }))}
              events={(data.events ?? []).map((event) => ({
                title: event.title,
                href: `/paginaEvento?id=${event.id}`,
              }))}
              sidebar={
                <>
                  <ConceptPanel eyebrow="Seu aprendizado" title="Aprenda no seu ritmo">
                    <p className={conceptStyles.muted}>
                      Se este conceito ainda não ficou claro, registre sua dúvida para retomá-lo nas
                      revisões.
                    </p>
                    <div className={conceptStyles.studyActions}>
                      <Button className={conceptStyles.secondary} disabled={busy} onClick={gap}>
                        {busy ? "Registrando…" : "Ainda tenho dúvidas"}
                      </Button>
                      <Link href="/paginaRevisoes" className={conceptStyles.primary}>
                        Ver minhas revisões
                      </Link>
                    </div>
                    <p role="status" className={conceptStyles.feedback}>
                      {message}
                    </p>
                  </ConceptPanel>
                  {data.history?.length > 0 && (
                    <ConceptPanel eyebrow="Sua trajetória" title="Últimas interações">
                      <ol className={conceptStyles.history}>
                        {data.history.slice(0, 5).map((item) => (
                          <li key={`${item.created_at}-${item.type}`}>
                            <p>
                              {{
                                gap: "Lacuna registrada",
                                correct: "Revisão correta",
                                incorrect: "Revisão incorreta",
                                partial: "Resposta parcial",
                              }[item.type] ?? "Contato com o conceito"}
                            </p>
                            <time dateTime={item.created_at}>
                              {new Date(item.created_at).toLocaleString("pt-BR")}
                            </time>
                          </li>
                        ))}
                      </ol>
                    </ConceptPanel>
                  )}
                </>
              }
            >
              <section aria-labelledby="concept-explanation">
                <div className={newsStyles.sectionHeading}>
                  <h2 id="concept-explanation">Entenda o conceito</h2>
                  <p>Aprofunde a definição com uma explicação para você.</p>
                </div>
                <div className={newsStyles.prose}>
                  <Generation key={id} target={{ conceptId: id }} operation="concept" />
                </div>
                {data.aliases?.length > 0 && (
                  <p className={`${conceptStyles.muted} mt-6`}>
                    Também chamado de: {data.aliases.map((alias) => alias.alias).join(", ")}
                  </p>
                )}
              </section>
            </ConceptDetail>
          </>
        )}
      </State>
    </Frame>
  );
}
export function Saved() {
  const resource = useResource("/saved");
  const [error, setError] = useState("");
  async function remove(id) {
    try {
      await requisitar(`/saved/${id}`, { method: "DELETE" });
      resource.reload();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <Frame
      title={
        <>
          Meus <span className="text-wisen-destaque">salvos</span>
        </>
      }
      active="Salvos"
    >
      <PageIntro title="Notícias e conceitos salvos">
        Acesse os conteúdos que você salvou para ler ou revisar quando quiser.
      </PageIntro>
      <Panel>
        <State resource={resource}>
          {resource.data?.items?.length ? (
            <ul className="divide-y">
              {resource.data.items.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <Link
                    className="min-w-0 text-sm break-words underline"
                    href={
                      s.article_id
                        ? `/artigo?id=${s.article_id}`
                        : s.event_id
                          ? `/paginaEvento?id=${s.event_id}`
                          : `/paginaConceito?id=${s.concept_id}`
                    }
                  >
                    {s.title}
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => remove(s.id)}
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-wisen-texto-suave">Você ainda não tem conteúdos salvos.</p>
          )}
        </State>
        {error && <p role="alert">{error}</p>}
      </Panel>
    </Frame>
  );
}
export function Reviews() {
  const resource = useResource("/reviews");
  return (
    <Frame title="Suas revisões" active="Revisões">
      <State resource={resource}>
        {resource.data?.items?.length ? (
          resource.data.items.map((r) => <Review key={r.id} review={r} onDone={resource.reload} />)
        ) : (
          <Panel>
            <p>
              Você não tem revisões disponíveis. Explore conceitos e registre suas dúvidas para
              começar.
            </p>
            <Link href="/paginaExplorar" className="mt-4 block underline">
              Explorar notícias
            </Link>
          </Panel>
        )}
      </State>
    </Frame>
  );
}
function Review({ review, onDone }) {
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [task, setTask] = useState(null);
  async function submit(open = false) {
    setBusy(true);
    try {
      if (open) {
        const t = await requisitar("/generations", {
          method: "POST",
          body: { operation: "grade", reviewId: review.id, answer, requestId: crypto.randomUUID() },
        });
        setTask(t);
      } else {
        const result = await requisitar("/reviews/answer", {
          method: "POST",
          body: { reviewId: review.id, answer: selected, requestId: crypto.randomUUID() },
        });
        setFeedback(
          `${result.correct ? "Resposta correta." : "Vamos revisar."} ${result.feedback}`,
        );
      }
    } catch (e) {
      setFeedback(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function check() {
    try {
      const t = await requisitar(`/generations/${task.id}`);
      setTask(t);
      if (t.status === "completed") setFeedback(t.result.feedback);
      else
        setFeedback(t.error ?? "Avaliação em andamento. Consulte novamente em alguns instantes.");
    } catch (e) {
      setFeedback(e.message);
    }
  }
  return (
    <Panel title={review.name}>
      <p className="mb-3 text-xs text-[#65748B]">
        Revisão prevista para {new Date(review.due_at).toLocaleDateString("pt-BR")}
      </p>
      <p className="mb-5 text-lg font-medium">{review.question.prompt}</p>
      <fieldset disabled={busy || !!feedback || !!task} className="mb-4 space-y-3">
        <legend className="sr-only">Escolha uma resposta</legend>
        {review.question.options?.map((option, index) => (
          <label key={option} className="flex gap-3 rounded-lg border p-3">
            <input
              type="radio"
              name={review.id}
              checked={selected === index}
              onChange={() => setSelected(index)}
            />
            {option}
          </label>
        ))}
      </fieldset>
      <Button disabled={busy || selected === null || !!feedback || !!task} onClick={() => submit()}>
        Corrigir resposta
      </Button>
      <details className="mt-5">
        <summary className="cursor-pointer text-sm underline">
          Prefiro explicar com minhas palavras
        </summary>
        <label htmlFor={`resposta-${review.id}`} className="mt-4 block text-sm">
          Sua explicação
        </label>
        <textarea
          id={`resposta-${review.id}`}
          maxLength={5000}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="my-3 min-h-24 w-full rounded-lg border p-3"
        />
        <Button disabled={busy || !answer || !!task || !!feedback} onClick={() => submit(true)}>
          Avaliar explicação
        </Button>
      </details>
      {task && (
        <Button className="mt-4" variant="outline" onClick={check}>
          Consultar avaliação
        </Button>
      )}
      {feedback && (
        <div role="status" className="mt-5 space-y-3">
          <p>{feedback}</p>
          <Button variant="outline" onClick={onDone}>
            Atualizar revisões
          </Button>
        </div>
      )}
    </Panel>
  );
}
