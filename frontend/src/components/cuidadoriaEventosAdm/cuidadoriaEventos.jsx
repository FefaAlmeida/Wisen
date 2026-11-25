"use client";

import { ClipboardCheck, Files, Newspaper, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { adminActionHover } from "@/components/admin/adminButtonStyles";
import { AdminSummary } from "@/components/admin/adminSummary";
import {
  AdminTableFilter,
  adminFilterControl,
  adminFilterHover,
} from "@/components/admin/adminTableFilter";
import { AdminTableFooter } from "@/components/admin/adminTableFooter";
import { Feedback, Notice } from "@/components/app/feedback";
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
import {
  SegmentedButton,
  segmentCountStyle,
  segmentListStyle,
} from "@/components/ui/segmented-control";
import { useEventCuration } from "@/hooks/use-event-curation";
import { findDuplicatePairs } from "@/lib/event-curation";
import { toast } from "@/lib/toast";
import CardEvento from "./cardEvento";
import PainelArtigos, { ArticleSource } from "./painelArtigos";

const secondary =
  "h-auto min-h-8 whitespace-normal border-wisen-borda px-3 py-1.5 text-xs text-wisen-texto-forte";
const pageSize = 10;
const statusTitles = {
  pendentes: "Eventos a revisar",
  revisados: "Eventos revisados",
  todos: "Todos os eventos",
};
const eventEmpty = {
  pendentes: {
    title: "Tudo revisado por aqui",
    description: "Novos agrupamentos aparecerão nesta fila.",
  },
  revisados: {
    title: "Nenhum evento revisado",
    description: "Os agrupamentos confirmados aparecerão nesta fila.",
  },
  todos: {
    title: "Nenhum evento encontrado",
    description: "Os agrupamentos feitos pela IA aparecerão nesta fila.",
  },
};
const queues = {
  pendentes: {
    title: "Revisar eventos",
    icon: ClipboardCheck,
    column: "Evento",
    count: ["evento", "eventos"],
  },
  artigos: {
    title: "Artigos sem evento",
    icon: Newspaper,
    column: "Artigo",
    count: ["artigo", "artigos"],
    empty: {
      title: "Nenhum artigo sem evento",
      description: "Os artigos disponíveis já estão organizados em eventos.",
    },
  },
  duplicados: {
    title: "Possíveis duplicados",
    icon: Files,
    column: "Eventos semelhantes",
    count: ["par de eventos", "pares de eventos"],
    empty: {
      title: "Nenhum possível duplicado",
      description: "Novos agrupamentos podem gerar sugestões de eventos semelhantes.",
    },
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
  const [page, setPage] = useState(1);
  const [openedId, setOpenedId] = useState(null);
  const [articleQuery, setArticleQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [destination, setDestination] = useState("");
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const queueButton = useRef(null);
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
      contains(`${event.titulo} ${event.resumo}`, query.trim()),
  );
  const articles = unassociated.filter(
    (article) =>
      (category === "todas" || article.categoria === category) &&
      contains(`${article.titulo} ${article.fonte ?? ""}`, query.trim()),
  );
  const duplicates = pairs.filter(
    ({ first, second }) =>
      (category === "todas" || first.categoria === category || second.categoria === category) &&
      contains(`${first.titulo} ${second.titulo}`, query.trim()),
  );
  const items = { pendentes: filtered, artigos: articles, duplicados: duplicates }[queue];
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = Boolean(query || category !== "todas");
  const empty = queue === "pendentes" ? eventEmpty[status] : queues[queue].empty;

  function clearFilters() {
    setQuery("");
    setCategory("todas");
    setPage(1);
  }
  function switchQueue(value) {
    if (value === queue) return;
    setQueue(value);
    clearFilters();
  }
  function openReview(event) {
    setOpenedId(event.id);
    setArticleQuery("");
  }
  function closeReview() {
    setOpenedId(null);
    requestAnimationFrame(() => queueButton.current?.focus());
  }
  function openModal(value) {
    setModal(value);
    setDestination("");
    setFormError("");
  }
  async function saveAction(action, feedback) {
    if (!(await dispatch(action))) return false;
    toast.success(feedback);
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
    <div className="@container/curadoria min-w-0 space-y-4">
      {loaded && error && (
        <Notice tone="error">
          <p>{error}</p>
          <Button variant="outline" onClick={() => reload()} className="mt-3">
            Tentar novamente
          </Button>
        </Notice>
      )}
      {loading ? (
        <Feedback tone="loading" title="Carregando a fila de revisão..." />
      ) : !loaded ? (
        <Feedback
          tone="error"
          title="Não foi possível carregar a fila"
          description={error}
          onRetry={() => reload()}
        />
      ) : opened ? (
        <PainelArtigos
          evento={opened}
          busy={busy}
          canMove={events.some((event) => event.id !== opened.id)}
          buscaArtigo={articleQuery}
          setBuscaArtigo={setArticleQuery}
          aoFechar={closeReview}
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
              closeReview();
          }}
        />
      ) : (
        <>
          <AdminSummary
            title="Organização dos eventos"
            description="Confira os agrupamentos feitos pela IA, associe artigos avulsos e compare possíveis duplicatas."
            items={[
              `${counts.pendentes} ${counts.pendentes === 1 ? "evento" : "eventos"} a revisar`,
              `${counts.artigos} ${counts.artigos === 1 ? "artigo" : "artigos"} sem evento`,
              `${counts.duplicados} ${counts.duplicados === 1 ? "possível duplicado" : "possíveis duplicados"}`,
            ]}
            itemColors="border-transparent bg-[#FBF7E5]"
          />
          <nav aria-label="Filas de revisão" className={segmentListStyle}>
            {Object.entries(queues).map(([key, item]) => (
              <SegmentedButton
                key={key}
                ref={queue === key ? queueButton : null}
                aria-pressed={queue === key}
                onClick={() => switchQueue(key)}
              >
                <item.icon aria-hidden="true" className="size-[18px]" />
                {item.title} <span className={segmentCountStyle}>{counts[key]}</span>
              </SegmentedButton>
            ))}
          </nav>
          <section className="wisen-panel overflow-hidden" aria-labelledby="curadoria-fila">
            <div className="space-y-4 px-4 py-4 sm:px-5">
              <h2 id="curadoria-fila" className="text-sm font-semibold text-wisen-titulo">
                {queue === "pendentes" ? statusTitles[status] : queues[queue].title}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full min-w-0 sm:w-60">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-wisen-texto-suave"
                  />
                  <Input
                    aria-label="Buscar na fila"
                    placeholder={queue === "artigos" ? "Buscar artigo ou fonte" : "Buscar evento"}
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    className={`${adminFilterControl} pl-9`}
                  />
                </div>
                <AdminTableFilter
                  label="Filtrar por categoria"
                  width={queue === "pendentes" ? "flex-1 sm:w-48 sm:flex-none" : "sm:w-48"}
                  options={[
                    { value: "todas", label: "Todas as categorias" },
                    ...categories.map((item) => ({ value: item, label: item })),
                  ]}
                  value={category}
                  onChange={(value) => {
                    setCategory(value);
                    setPage(1);
                  }}
                />
                {queue === "pendentes" && (
                  <AdminTableFilter
                    label="Mostrar eventos"
                    width="flex-1 sm:w-44 sm:flex-none"
                    options={{
                      pendentes: `A revisar (${pending.length})`,
                      revisados: `Revisados (${events.length - pending.length})`,
                      todos: "Todos os eventos",
                    }}
                    value={status}
                    onChange={(value) => {
                      setStatus(value);
                      setPage(1);
                    }}
                  />
                )}
                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className={`h-10 gap-1.5 border-wisen-borda px-3 text-xs font-normal text-wisen-texto-suave shadow-none ${adminFilterHover}`}
                  >
                    <X aria-hidden="true" className="size-3.5" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
            {visible.length ? (
              <>
                <div className="flex items-center justify-between border-y border-[#E8EDF4] bg-[#E8EFFA] px-4 py-3 text-[10px] font-bold tracking-wider text-[#30466E] uppercase sm:px-5">
                  <span>{queues[queue].column}</span>
                  <span className="hidden @min-[38rem]/curadoria:inline">Ação</span>
                </div>
                <div className="divide-y divide-[#E8EDF4]">
                  {queue === "pendentes" &&
                    visible.map((event) => (
                      <CardEvento
                        key={event.id}
                        evento={event}
                        aoRevisar={openReview}
                        busy={busy}
                      />
                    ))}
                  {queue === "artigos" &&
                    visible.map((article) => (
                      <article
                        key={article.id}
                        className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-wisen-admin-hover sm:px-5"
                      >
                        <div className="min-w-0 flex-1 basis-56">
                          <h3 className="text-sm font-semibold leading-6 break-words text-wisen-titulo">
                            {article.titulo}
                          </h3>
                          <p className="mt-1 text-xs leading-5 break-words text-wisen-texto-suave">
                            {[article.fonte, article.categoria, article.data]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          {!events.length && (
                            <p className="mt-1 text-xs text-wisen-texto-suave">
                              Ainda não há eventos disponíveis para associação.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ArticleSource url={article.url} />
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!events.length || busy}
                            onClick={() => openModal({ type: "mover", article, sourceId: null })}
                            className={`${secondary} ${adminActionHover}`}
                          >
                            Associar a um evento
                          </Button>
                        </div>
                      </article>
                    ))}
                  {queue === "duplicados" &&
                    visible.map((pair) => (
                      <article
                        key={`${pair.first.id}-${pair.second.id}`}
                        className="grid min-w-0 items-center gap-3 px-4 py-4 transition-colors hover:bg-wisen-admin-hover sm:px-5 @min-[48rem]/curadoria:grid-cols-[minmax(0,1fr)_auto]"
                      >
                        <div className="grid min-w-0 gap-2 @min-[32rem]/curadoria:grid-cols-2">
                          {[pair.first, pair.second].map((event) => (
                            <div
                              key={event.id}
                              className="min-w-0 rounded-lg border border-wisen-borda bg-wisen-superficie px-3 py-2.5"
                            >
                              <h3 className="text-sm font-semibold leading-5 break-words text-wisen-titulo">
                                {event.titulo}
                              </h3>
                              <p className="mt-1 text-xs break-words text-wisen-texto-suave">
                                {event.categoria} · {event.artigos.length}{" "}
                                {event.artigos.length === 1 ? "artigo" : "artigos"}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => {
                            openModal({ type: "comparar", pair });
                            setDestination(String(pair.first.id));
                          }}
                          className={`${secondary} justify-self-start ${adminActionHover}`}
                        >
                          Comparar eventos
                        </Button>
                      </article>
                    ))}
                </div>
              </>
            ) : (
              <div className="space-y-2 border-t border-[#E8EDF4] px-4 py-12 text-center">
                <h3 className="text-sm font-semibold text-wisen-titulo">
                  {hasFilters ? "Nenhum resultado encontrado" : empty.title}
                </h3>
                <p className="text-sm leading-6 text-wisen-texto-suave">
                  {hasFilters ? "Tente outra busca ou limpe os filtros." : empty.description}
                </p>
                {!hasFilters &&
                  queue === "pendentes" &&
                  status === "pendentes" &&
                  events.length > pending.length && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus("revisados")}
                      className={`${secondary} hover:bg-wisen-admin-control-hover`}
                    >
                      Ver eventos revisados
                    </Button>
                  )}
              </div>
            )}
            <AdminTableFooter
              countLabel={`${items.length} ${queues[queue].count[items.length === 1 ? 0 : 1]}`}
              paginationLabel="Paginação da fila"
              page={currentPage}
              pages={pages}
              onPageChange={setPage}
            />
          </section>
          {demo && (
            <p className="text-xs leading-5 text-wisen-texto-suave">
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
        <DialogContent size={modal?.type === "comparar" ? "wide" : "md"} data-wisen-area="admin">
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
                ? "Atualize os dados e volte à revisão do agrupamento."
                : modal?.type === "retirar"
                  ? "O artigo voltará à fila de artigos sem evento."
                  : modal?.type === "comparar"
                    ? "Se os artigos tratarem do mesmo acontecimento, escolha qual evento receberá todos os artigos."
                    : "Escolha o acontecimento que corresponde ao assunto deste artigo. O agrupamento ficará disponível para revisão."}
            </DialogDescription>
          </DialogHeader>
          {modal?.type === "editar" && editing ? (
            <DialogForm onSubmit={saveEdit}>
              <DialogBody className="space-y-4">
                {formError && (
                  <p role="alert" className="text-sm text-red-700">
                    {formError}
                  </p>
                )}

                <div className="admin-dialog-panel space-y-4">
                  <label
                    htmlFor="revisao-titulo"
                    className="block space-y-2 text-sm text-[#526584]"
                  >
                    <span>Título do evento</span>
                    <Input
                      required
                      maxLength={300}
                      id="revisao-titulo"
                      value={editing.titulo}
                      onChange={(event) => setEditing({ ...editing, titulo: event.target.value })}
                      className="wisen-control w-full"
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
                      className="wisen-control w-full min-w-0 resize-y py-2 leading-6"
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
                      onChange={(event) =>
                        setEditing({ ...editing, categoria: event.target.value })
                      }
                      className="wisen-control w-full"
                    />
                  </label>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button type="submit" disabled={busy} className={dialogPrimaryAction}>
                  {busy ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </DialogForm>
          ) : modal?.type === "comparar" ? (
            <>
              <DialogBody className="space-y-4">
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  {[modal.pair.first, modal.pair.second].map((event) => (
                    <section key={event.id} className="admin-dialog-panel">
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
                            <ArticleSource url={article.url} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <label className="admin-dialog-panel block space-y-2 text-sm text-[#526584]">
                  <span>Manter o título e resumo de</span>
                  <select
                    className={adminFilterControl}
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
                  <p className="admin-dialog-panel break-words text-sm font-medium leading-6 text-wisen-titulo">
                    {modal.article.titulo}
                  </p>
                  {modal.type === "mover" && (
                    <label className="admin-dialog-panel grid gap-3 text-sm text-[#526584]">
                      <span>Evento de destino</span>
                      <select
                        className={adminFilterControl}
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
