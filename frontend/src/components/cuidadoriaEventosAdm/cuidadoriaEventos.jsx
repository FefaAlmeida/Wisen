"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
  dialogPrimaryAction,
  dialogSecondaryAction,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEventCuration } from "@/hooks/use-event-curation";
import { findDuplicatePairs } from "@/lib/event-curation";
import CardEvento from "./cardEvento";
import PainelArtigos from "./painelArtigos";

const control =
  "h-11 w-full min-w-0 rounded-lg border border-wisen-borda bg-white px-3 text-sm text-[#30466E] outline-none transition-colors hover:bg-wisen-admin-hover focus-visible:ring-2 focus-visible:ring-[#D7BF4D]/40";
const secondary =
  "h-auto min-h-10 whitespace-normal border-wisen-borda px-4 py-2 text-[#30466E] hover:bg-wisen-admin-hover";
const queues = {
  pendentes: {
    title: "Revisar eventos",
    description: "Confira se os artigos foram agrupados corretamente.",
  },
  artigos: {
    title: "Artigos sem evento",
    description: "Encontre o acontecimento ao qual cada artigo pertence.",
  },
  duplicados: {
    title: "Possíveis duplicados",
    description: "Compare eventos semelhantes antes de unir.",
  },
};
const contains = (text, query) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .includes(
      query
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR"),
    );

export default function CuradoriaEventos({ demo = true }) {
  const { events, unassociated, loading, loaded, error, busy, dispatch, reload } =
    useEventCuration(demo);
  const [queue, setQueue] = useState("pendentes");
  const [status, setStatus] = useState("pendentes");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [openedId, setOpenedId] = useState(null);
  const [articleQuery, setArticleQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [destination, setDestination] = useState("");
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const opened = events.find((event) => event.id === openedId);
  const pairs = useMemo(() => findDuplicatePairs(events), [events]);
  const pending = events.filter((event) => event.status !== "Revisado");
  const categories = [
    ...new Set([
      ...events.map((event) => event.categoria),
      ...unassociated.map((article) => article.categoria).filter(Boolean),
    ]),
  ].sort();
  const counts = {
    pendentes: pending.length,
    artigos: unassociated.length,
    duplicados: pairs.length,
  };
  const filtered = events.filter(
    (event) =>
      (status === "todos" ||
        (status === "revisados" ? event.status === "Revisado" : event.status !== "Revisado")) &&
      (category === "todas" || event.categoria === category) &&
      contains(`${event.titulo} ${event.resumo}`, query),
  );
  const articles = unassociated.filter(
    (article) =>
      (category === "todas" || article.categoria === category) &&
      contains(`${article.titulo} ${article.fonte}`, query),
  );
  const duplicates = pairs.filter(
    ({ first, second }) =>
      (category === "todas" || first.categoria === category || second.categoria === category) &&
      contains(`${first.titulo} ${second.titulo}`, query),
  );

  function switchQueue(value) {
    setQueue(value);
    setQuery("");
    setCategory("todas");
    setMessage("");
  }
  function openReview(event) {
    setOpenedId(event.id);
    setArticleQuery("");
    setMessage("");
  }
  function openModal(value) {
    setModal(value);
    setDestination("");
    setFormError("");
  }
  async function saveAction(action, feedback) {
    if (!(await dispatch(action))) return false;
    setMessage(feedback);
    setModal(null);
    return true;
  }
  async function saveEdit(event) {
    event.preventDefault();
    if (!editing.titulo.trim() || !editing.resumo.trim() || !editing.categoria.trim()) {
      setFormError("Preencha título, resumo e categoria.");
      return;
    }
    await saveAction(
      {
        type: "edit",
        id: modal.event.id,
        values: {
          titulo: editing.titulo.trim(),
          resumo: editing.resumo.trim(),
          descricao: editing.resumo.trim(),
          categoria: editing.categoria.trim(),
        },
      },
      "Informações salvas. Confira os artigos e confirme o agrupamento para concluir a revisão.",
    );
  }
  async function transfer() {
    const target = events.find((event) => String(event.id) === destination);
    if (!target) return;
    await saveAction(
      { type: "move", article: modal.article, sourceId: modal.sourceId, targetId: target.id },
      `Artigo associado a “${target.titulo}”. O agrupamento está na fila de revisão.`,
    );
  }
  async function merge() {
    const target = events.find((event) => String(event.id) === destination);
    const source = modal.pair.first.id === target?.id ? modal.pair.second : modal.pair.first;
    if (!target) return;
    if (
      await saveAction(
        { type: "merge", sourceId: source.id, targetId: target.id },
        "Eventos unidos. Confira os artigos do novo agrupamento antes de confirmar.",
      )
    ) {
      setOpenedId(target.id);
      setArticleQuery("");
    }
  }
  const closeModal = () => {
    if (!busy) {
      setModal(null);
      setFormError("");
    }
  };

  return (
    <div className="@container/curadoria min-w-0 space-y-5">
      {message && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
        >
          {message}
        </p>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
        >
          <p>{error}</p>
          {!modal && (
            <Button variant="outline" onClick={() => reload()} className="mt-3">
              Tentar novamente
            </Button>
          )}
        </div>
      )}
      {loading ? (
        <p role="status" className="rounded-xl bg-white p-6 text-sm text-[#7182A1]">
          Carregando a fila de revisão...
        </p>
      ) : !loaded ? null : opened ? (
        <PainelArtigos
          evento={opened}
          busy={busy}
          buscaArtigo={articleQuery}
          setBuscaArtigo={setArticleQuery}
          aoFechar={() => setOpenedId(null)}
          aoEditar={(event) => {
            setEditing({ titulo: event.titulo, resumo: event.resumo, categoria: event.categoria });
            openModal({ type: "editar", event });
          }}
          aoMover={(article) => openModal({ type: "mover", article, sourceId: opened.id })}
          aoRetirar={(article) => openModal({ type: "retirar", article, sourceId: opened.id })}
          aoConfirmar={async () => {
            if (
              await saveAction(
                { type: "approve", id: opened.id },
                "Agrupamento confirmado. O evento foi movido para os revisados.",
              )
            )
              setOpenedId(null);
          }}
        />
      ) : (
        <>
          <div className="rounded-xl border border-[#E8DDA4] bg-[#FBF7E5] p-4 sm:p-5">
            <h2 className="text-base font-medium text-wisen-titulo">
              A IA agrupou os artigos. Agora, confira se fazem sentido juntos.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#7182A1]">
              Um evento reúne notícias sobre o mesmo acontecimento. Comece pelos eventos a revisar,
              confira o resumo e os artigos e confirme o agrupamento.
            </p>
          </div>
          <nav
            aria-label="Filas de revisão"
            className="grid min-w-0 grid-cols-1 gap-3 @min-[48rem]/curadoria:grid-cols-3"
          >
            {Object.entries(queues).map(([key, item]) => (
              <button
                key={key}
                type="button"
                aria-pressed={queue === key}
                onClick={() => switchQueue(key)}
                className={`min-w-0 rounded-xl border p-4 text-left transition-colors hover:bg-wisen-admin-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7BF4D] ${queue === key ? "border-[#E0CF82] bg-[#FBF7E5]" : "border-wisen-borda bg-white"}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-wisen-titulo">{item.title}</span>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-semibold tabular-nums text-[#866D16]">
                    {counts[key]}
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-5 text-[#7182A1]">
                  {item.description}
                </span>
              </button>
            ))}
          </nav>
          <section className="min-w-0 space-y-4" aria-label={queues[queue].title}>
            <header className="space-y-2">
              <h2 className="text-lg font-medium text-wisen-titulo">
                {queue === "pendentes"
                  ? status === "revisados"
                    ? "Eventos revisados"
                    : status === "todos"
                      ? "Todos os eventos"
                      : "Eventos a revisar"
                  : queues[queue].title}
              </h2>
              <p className="text-sm leading-6 text-[#7182A1]">
                {queue === "pendentes"
                  ? "Abra um evento para conferir as informações e os artigos associados."
                  : queue === "artigos"
                    ? "Estes artigos ainda não pertencem a nenhum evento. Escolha um acontecimento existente para associá-los."
                    : "Títulos semelhantes podem se referir ao mesmo acontecimento. Compare o conteúdo antes de decidir unir os eventos."}
              </p>
            </header>
            <div className="grid min-w-0 grid-cols-1 gap-3 @min-[32rem]/curadoria:grid-cols-2 @min-[60rem]/curadoria:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
              <div className="relative min-w-0">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 left-3 size-4 text-[#7182A1]"
                />
                <Input
                  aria-label="Buscar na fila"
                  placeholder={queue === "artigos" ? "Buscar artigo ou fonte" : "Buscar evento"}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className={`${control} pl-10`}
                />
              </div>
              <select
                aria-label="Filtrar por categoria"
                className={control}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="todas">Todas as categorias</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              {queue === "pendentes" && (
                <select
                  aria-label="Mostrar eventos"
                  className={control}
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="pendentes">A revisar ({pending.length})</option>
                  <option value="revisados">Revisados ({events.length - pending.length})</option>
                  <option value="todos">Todos os eventos</option>
                </select>
              )}
            </div>
            {(query || category !== "todas") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setQuery("");
                  setCategory("todas");
                }}
                className="text-xs text-[#7182A1] hover:bg-wisen-admin-hover"
              >
                Limpar filtros
              </Button>
            )}
            {queue === "pendentes" && (
              <div className="space-y-3">
                {filtered.map((event) => (
                  <CardEvento key={event.id} evento={event} aoRevisar={openReview} busy={busy} />
                ))}
                {!filtered.length && (
                  <Empty
                    title={
                      status === "pendentes" && !pending.length
                        ? "Tudo revisado por aqui"
                        : "Nenhum evento encontrado"
                    }
                    description={
                      query || category !== "todas"
                        ? "Tente outra busca ou limpe os filtros."
                        : "Quando houver novos agrupamentos para conferir, eles aparecerão nesta fila."
                    }
                  >
                    {status === "pendentes" &&
                      events.some((event) => event.status === "Revisado") && (
                        <Button
                          variant="outline"
                          onClick={() => setStatus("revisados")}
                          className={secondary}
                        >
                          Ver eventos revisados
                        </Button>
                      )}
                  </Empty>
                )}
              </div>
            )}
            {queue === "artigos" && (
              <div className="space-y-3">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="min-w-0 rounded-xl border border-wisen-borda bg-white p-4 sm:p-5"
                  >
                    <h3 className="break-words text-base font-medium leading-6 text-wisen-titulo">
                      {article.titulo}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[#7182A1]">
                      {article.fonte} · {article.data}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center text-sm text-[#30466E] hover:underline"
                        >
                          Abrir fonte
                        </a>
                      )}
                      <Button
                        variant="outline"
                        disabled={!events.length || busy}
                        onClick={() => openModal({ type: "mover", article, sourceId: null })}
                        className={secondary}
                      >
                        Associar a um evento
                      </Button>
                    </div>
                    {!events.length && (
                      <p className="mt-2 text-xs text-[#7182A1]">
                        Ainda não há eventos disponíveis para associação.
                      </p>
                    )}
                  </article>
                ))}
                {!articles.length && (
                  <Empty
                    title="Nenhum artigo sem evento"
                    description={
                      query || category !== "todas"
                        ? "Nenhum artigo corresponde aos filtros."
                        : "Os artigos disponíveis já estão organizados em eventos."
                    }
                  />
                )}
              </div>
            )}
            {queue === "duplicados" && (
              <div className="space-y-3">
                {duplicates.map((pair) => (
                  <article
                    key={`${pair.first.id}-${pair.second.id}`}
                    className="min-w-0 space-y-4 rounded-xl border border-wisen-borda bg-white p-4 sm:p-5"
                  >
                    <p className="text-xs font-medium text-[#866D16]">
                      Títulos semelhantes · confira se é o mesmo acontecimento
                    </p>
                    <div className="grid min-w-0 grid-cols-1 gap-3 @min-[36rem]/curadoria:grid-cols-2">
                      {[pair.first, pair.second].map((event) => (
                        <div key={event.id} className="min-w-0 rounded-lg bg-[#F8FAFD] p-3">
                          <h3 className="break-words text-sm font-medium leading-6 text-wisen-titulo">
                            {event.titulo}
                          </h3>
                          <p className="mt-2 text-xs text-[#7182A1]">
                            {event.artigos.length} artigos · {event.categoria}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        openModal({ type: "comparar", pair });
                        setDestination(String(pair.first.id));
                      }}
                      className={secondary}
                    >
                      Comparar eventos
                    </Button>
                  </article>
                ))}
                {!duplicates.length && (
                  <Empty
                    title="Nenhum possível duplicado"
                    description="Nenhum par de títulos semelhantes foi encontrado nesta fila. Novos agrupamentos podem gerar outras sugestões."
                  />
                )}
              </div>
            )}
          </section>
          {demo && (
            <p className="text-xs leading-5 text-[#7182A1]">
              Demonstração com conteúdo fictício. Suas alterações ficam salvas neste navegador.
            </p>
          )}
        </>
      )}

      <Dialog
        open={!!modal}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent size="lg">
          <DialogHeader eyebrow="Revisão de eventos">
            <DialogTitle>
              {modal?.type === "editar"
                ? "Editar informações do evento"
                : modal?.type === "retirar"
                  ? "Retirar artigo do evento?"
                  : modal?.type === "comparar"
                    ? "Compare os dois acontecimentos"
                    : modal?.sourceId == null
                      ? "Associar artigo a um evento"
                      : "Mover artigo para outro evento"}
            </DialogTitle>
            <DialogDescription>
              {modal?.type === "editar"
                ? "Corrija o título, o resumo ou a categoria. Depois, confirme o agrupamento na revisão."
                : modal?.type === "retirar"
                  ? "O artigo irá para a fila de artigos sem evento. Ele não será excluído."
                  : modal?.type === "comparar"
                    ? "Una somente se os artigos tratam do mesmo acontecimento. O evento escolhido manterá seu título e receberá todos os artigos."
                    : "Escolha o acontecimento que corresponde ao assunto deste artigo. O agrupamento ficará disponível para revisão."}
            </DialogDescription>
          </DialogHeader>
          {modal?.type === "editar" && editing ? (
            <DialogForm onSubmit={saveEdit}>
              <DialogBody className="space-y-4">
                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                    {error}
                  </p>
                )}
                {formError && (
                  <p role="alert" className="text-sm text-red-700">
                    {formError}
                  </p>
                )}

                <label htmlFor="revisao-titulo" className="block space-y-2 text-sm text-[#526584]">
                  <span>Título do evento</span>
                  <Input
                    required
                    maxLength={300}
                    id="revisao-titulo"
                    value={editing.titulo}
                    onChange={(event) => setEditing({ ...editing, titulo: event.target.value })}
                    className={control}
                  />
                </label>
                <label className="block space-y-2 text-sm text-[#526584]">
                  <span>Resumo do acontecimento</span>
                  <textarea
                    required
                    maxLength={10000}
                    rows={5}
                    value={editing.resumo}
                    onChange={(event) => setEditing({ ...editing, resumo: event.target.value })}
                    className="w-full min-w-0 resize-y rounded-lg border border-wisen-borda bg-white p-3 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-[#D7BF4D]/40"
                  />
                </label>
                <label
                  htmlFor="revisao-categoria"
                  className="block space-y-2 text-sm text-[#526584]"
                >
                  <span>Categoria</span>
                  <Input
                    required
                    maxLength={120}
                    id="revisao-categoria"
                    value={editing.categoria}
                    onChange={(event) => setEditing({ ...editing, categoria: event.target.value })}
                    className={control}
                  />
                </label>
              </DialogBody>
              <DialogFooter>
                <Button
                  type="button"
                  disabled={busy}
                  variant="outline"
                  onClick={closeModal}
                  className={dialogSecondaryAction}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={busy} className={dialogPrimaryAction}>
                  {busy ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </DialogForm>
          ) : modal?.type === "comparar" ? (
            <>
              <DialogBody className="space-y-4">
                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                    {error}
                  </p>
                )}
                {formError && (
                  <p role="alert" className="text-sm text-red-700">
                    {formError}
                  </p>
                )}

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  {[modal.pair.first, modal.pair.second].map((event) => (
                    <section
                      key={event.id}
                      className="min-w-0 rounded-xl border border-wisen-borda bg-white p-4"
                    >
                      <h3 className="break-words font-medium leading-6 text-wisen-titulo">
                        {event.titulo}
                      </h3>
                      <p className="mt-2 break-words text-sm leading-6 text-[#7182A1]">
                        {event.resumo}
                      </p>
                      <p className="mt-4 text-xs font-medium text-[#526584]">
                        Artigos associados ({event.artigos.length})
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-2 text-xs leading-5 text-[#7182A1]">
                        {event.artigos.map((article) => (
                          <li key={article.id} className="break-words">
                            {article.titulo}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <label className="block space-y-2 text-sm text-[#526584]">
                  <span>Manter o título e resumo de</span>
                  <select
                    className={control}
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                  >
                    {[modal.pair.first, modal.pair.second].map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.titulo}
                      </option>
                    ))}
                  </select>
                </label>
              </DialogBody>
              <DialogFooter>
                <Button
                  disabled={busy}
                  variant="outline"
                  onClick={closeModal}
                  className={dialogSecondaryAction}
                >
                  Voltar sem unir
                </Button>
                <Button
                  disabled={busy || !destination}
                  onClick={merge}
                  className={dialogPrimaryAction}
                >
                  {busy ? "Unindo..." : "Unir e revisar"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            modal && (
              <>
                <DialogBody className="space-y-4">
                  {error && (
                    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                      {error}
                    </p>
                  )}
                  {formError && (
                    <p role="alert" className="text-sm text-red-700">
                      {formError}
                    </p>
                  )}

                  <p className="break-words rounded-lg bg-[#F8FAFD] p-4 text-sm font-medium leading-6 text-wisen-titulo">
                    {modal.article.titulo}
                  </p>
                  {modal.type === "mover" && (
                    <label className="block space-y-2 text-sm text-[#526584]">
                      <span>Evento de destino</span>
                      <select
                        className={control}
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                      >
                        <option value="">Escolha um evento</option>
                        {events
                          .filter((event) => event.id !== modal.sourceId)
                          .map((event) => (
                            <option key={event.id} value={event.id}>
                              {event.titulo}
                            </option>
                          ))}
                      </select>
                    </label>
                  )}
                </DialogBody>
                <DialogFooter>
                  <Button
                    disabled={busy}
                    variant="outline"
                    onClick={closeModal}
                    className={dialogSecondaryAction}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={busy || (modal.type === "mover" && !destination)}
                    onClick={
                      modal.type === "retirar"
                        ? () =>
                            saveAction(
                              { type: "remove", sourceId: modal.sourceId, article: modal.article },
                              "Artigo retirado. Ele está na fila de artigos sem evento.",
                            )
                        : transfer
                    }
                    className={dialogPrimaryAction}
                  >
                    {busy
                      ? "Salvando..."
                      : modal.type === "retirar"
                        ? "Retirar artigo"
                        : "Confirmar associação"}
                  </Button>
                </DialogFooter>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Empty({ title, description, children }) {
  return (
    <div className="space-y-3 rounded-xl border border-dashed border-wisen-borda bg-white px-4 py-10 text-center">
      <h3 className="text-base font-medium text-wisen-titulo">{title}</h3>
      <p className="mx-auto max-w-md text-sm leading-6 text-[#7182A1]">{description}</p>
      {children}
    </div>
  );
}
