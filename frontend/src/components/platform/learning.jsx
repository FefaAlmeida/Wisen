"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiltrosBiblioteca } from "@/components/biblioteca/filtrosBiblioteca";
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
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const resource = useResource(
    knowledge ? "/knowledge" : `/concepts?limit=30&page=${page}&q=${encodeURIComponent(query)}`,
  );
  return (
    <Frame
      title={knowledge ? "Meu conhecimento" : "Biblioteca de conceitos"}
      active="Meu conhecimento"
    >
      <Panel>
        <p className="mb-5 text-sm text-[#65748B]">
          Seu progresso é construído durante as leituras e revisões. Conceitos ainda não avaliados
          não representam lacunas comprovadas.
        </p>
        <Link className="mr-5 underline" href="/paginaConhecimento">
          Meu conhecimento
        </Link>
        <Link className="underline" href="/paginaBiblioteca">
          Todos os conceitos
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
            filtroAtivo={filter}
            onFiltroChange={setFilter}
            items={(resource.data?.items ?? []).map((c) => ({
              status: statusText[c.display_status ?? c.status],
            }))}
          />
        </div>
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
                <li key={c.id} className="flex items-center justify-between gap-4 py-4">
                  <Link
                    href={`/paginaConceito?id=${c.concept_id ?? c.id}`}
                    className="font-medium underline"
                  >
                    {c.name}
                  </Link>
                  <span className="text-sm text-[#65748B]">
                    {statusText[c.display_status ?? c.status] ?? "Ainda não avaliado"}
                  </span>
                </li>
              ))}
          </ul>
          {!knowledge && (
            <div className="mt-5 flex justify-between">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((v) => v - 1)}>
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
      </Panel>
    </Frame>
  );
}
export function ConceptPage() {
  const id = useSearchParams().get("id");
  const resource = useResource(`/concepts/${id ?? "missing"}`);
  const [message, setMessage] = useState("");
  const data = resource.data;
  async function gap() {
    try {
      await requisitar("/interactions", {
        method: "POST",
        body: { conceptId: id, type: "gap", requestId: crypto.randomUUID() },
      });
      setMessage("Lacuna registrada. A revisão será preparada para você.");
      resource.reload();
    } catch (e) {
      setMessage(e.message);
    }
  }
  return (
    <Frame title="Conceito" active="Meu conhecimento">
      <State resource={resource}>
        {data && (
          <>
            <Exposure concepts={[data]} />
            <Panel>
              <h2 className="mb-3 text-3xl font-semibold">{data.name}</h2>
              <p className="mb-5 text-sm">{statusText[data.status] ?? "Ainda não avaliado"}</p>
              <p className="mb-6 max-w-prose leading-8">{data.description}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button onClick={gap}>Não sei</Button>
                <SaveButton type="concept" id={id} />
              </div>
              <p role="status" className="mt-3">
                {message}
              </p>
            </Panel>
            <Panel title="Explicação para você">
              <Generation target={{ conceptId: id }} operation="concept" />
            </Panel>
            <Panel title="Conexões">
              {data.relations.map((r) => (
                <p key={`${r.to_id}-${r.relation}`} className="mb-3">
                  {r.relation === "REQUIRES"
                    ? "Pré-requisito"
                    : r.relation === "PART_OF"
                      ? "Faz parte de"
                      : "Relacionado"}
                  :{" "}
                  <Link className="underline" href={`/paginaConceito?id=${r.to_id}`}>
                    {r.name}
                  </Link>
                </p>
              ))}
              <p className="text-sm">
                Também chamado de: {data.aliases.map((a) => a.alias).join(", ") || data.name}
              </p>
            </Panel>
            <Panel title="Acontecimentos relacionados">
              {data.events.map((e) => (
                <p key={e.id} className="mb-3">
                  <Link className="underline" href={`/paginaEvento?id=${e.id}`}>
                    {e.title}
                  </Link>
                </p>
              ))}
            </Panel>
            <Panel title="Seu histórico">
              {data.history.map((h) => (
                <p key={`${h.created_at}-${h.type}`} className="mb-2 text-sm">
                  {new Date(h.created_at).toLocaleString("pt-BR")} ·{" "}
                  {h.type === "gap"
                    ? "Lacuna registrada"
                    : h.type === "correct"
                      ? "Revisão correta"
                      : h.type === "incorrect"
                        ? "Revisão incorreta"
                        : h.type === "partial"
                          ? "Resposta parcial"
                          : "Contato com o conceito"}
                </p>
              ))}
            </Panel>
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
    <Frame title="Conteúdos salvos" active="Salvos">
      <Panel>
        <State resource={resource}>
          {resource.data?.items?.length ? (
            <ul className="divide-y">
              {resource.data.items.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <Link
                    className="underline"
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
                  <Button variant="outline" onClick={() => remove(s.id)}>
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Salve artigos, eventos ou conceitos para voltar a eles depois.</p>
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
