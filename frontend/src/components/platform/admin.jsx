"use client";
import Link from "next/link";
import { useState } from "react";
import { CartoesMetricasAdm } from "@/components/inicioAdm/cartoesMetricasAdm";
import { Button } from "@/components/ui/button";
import { Frame, Panel, requisitar, State, useResource } from "./shared";

const sections = {
  sources: "Fontes",
  articles: "Artigos",
  events: "Eventos",
  concepts: "Conceitos",
  entities: "Entidades",
  users: "Usuários",
  tasks: "Processamento",
  charges: "Consumo de IA",
  audit: "Histórico de alterações",
};
export default function Admin({ initial = "sources" }) {
  const [section, setSection] = useState(initial);
  const resource = useResource(`/admin/${section}`);
  const overview = useResource("/admin/overview");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function act(body) {
    setBusy(true);
    setMessage("");
    try {
      await requisitar("/admin/actions", { method: "POST", body });
      setMessage("Alteração salva");
      setEditing(null);
      resource.reload();
      overview.reload();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Frame
      title="Administração"
      admin
      active={
        {
          sources: "Gestão de fontes",
          events: "Curadoria de eventos",
          users: "Gestão de usuários",
          charges: "Monitor de IA",
          tasks: "Monitor de IA",
        }[section] ?? "Visão geral"
      }
    >
      {overview.data?.counts && (
        <div className="mb-6">
          <CartoesMetricasAdm counts={overview.data.counts} />
        </div>
      )}
      <Panel title="Integrações">
        <p className="text-sm">
          Geração de IA:{" "}
          {overview.data?.integrations?.ai ? "configurada" : "aguardando configuração"}. E-mails:{" "}
          {overview.data?.integrations?.email ? "configurados" : "aguardando configuração"}.
        </p>
      </Panel>
      <Panel title="Orçamento mensal">
        <State resource={overview}>
          <p className="text-lg">
            R$ {overview.data?.budget.committed.toFixed(2)} comprometidos de R${" "}
            {overview.data?.budget.limit.toFixed(2)}
          </p>
          <p className="mt-2 text-sm">
            Saldo estimado: R$ {overview.data?.budget.remaining.toFixed(2)}. Reservas de chamadas
            pendentes estão incluídas.
          </p>
          {overview.data?.budget.alerts.length > 0 && (
            <p role="status" className="mt-3">
              Atenção: consumo atingiu {Math.max(...overview.data.budget.alerts)}% do teto.
            </p>
          )}
        </State>
      </Panel>
      <nav aria-label="Áreas administrativas" className="mb-5 flex flex-wrap gap-2">
        {Object.entries(sections).map(([key, label]) => (
          <Button
            key={key}
            variant={section === key ? "default" : "outline"}
            onClick={() => {
              setSection(key);
              setEditing(null);
            }}
          >
            {label}
          </Button>
        ))}
      </nav>
      <p role="status" className="mb-4">
        {message}
      </p>
      <Panel title={sections[section]}>
        <State resource={resource}>
          <ul className="divide-y">
            {resource.data?.items.map((item) => (
              <li key={item.id} className="py-4">
                <p className="font-medium">
                  {item.title ??
                    item.name ??
                    item.operation ??
                    item.action ??
                    item.model ??
                    item.id}
                </p>
                <p className="mt-1 break-words text-sm text-[#65748B]">
                  {item.email ??
                    item.feed_url ??
                    item.status ??
                    item.processing_status ??
                    item.type}
                </p>
                {item.error && <p className="mt-2 text-sm">{item.error}</p>}
                {section === "charges" && (
                  <p className="mt-2 text-sm">
                    Reservado: R$ {Number(item.reserved_brl).toFixed(4)} · Real estimado:{" "}
                    {item.actual_brl === null
                      ? "A reconciliar"
                      : `R$ ${Number(item.actual_brl).toFixed(4)}`}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {section === "sources" && (
                    <>
                      <Button
                        disabled={busy}
                        variant="outline"
                        onClick={() =>
                          act({ action: "source", id: item.id, enabled: !item.enabled })
                        }
                      >
                        {item.enabled ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        disabled={busy}
                        variant="outline"
                        onClick={() => act({ action: "collect", id: item.id })}
                      >
                        Coletar agora
                      </Button>
                    </>
                  )}
                  {section === "articles" && (
                    <>
                      <Link href={`/artigo?id=${item.id}`} className="px-2 py-2 text-sm underline">
                        Abrir artigo
                      </Link>
                      <Button
                        disabled={busy}
                        variant="outline"
                        onClick={() =>
                          act({ action: "article", id: item.id, visible: !item.visible })
                        }
                      >
                        {item.visible ? "Retirar do feed" : "Republicar"}
                      </Button>
                      <Button
                        disabled={busy}
                        variant="outline"
                        onClick={() => act({ action: "reprocess", id: item.id })}
                      >
                        Reprocessar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditing({ ...item, mode: "move" })}
                      >
                        Mover ou separar
                      </Button>
                    </>
                  )}
                  {["concepts", "events", "users"].includes(section) && (
                    <Button variant="outline" onClick={() => setEditing(item)}>
                      Editar
                    </Button>
                  )}
                  {section === "events" && (
                    <Button
                      variant="outline"
                      onClick={() => setEditing({ ...item, mode: "merge" })}
                    >
                      Unir a outro evento
                    </Button>
                  )}
                  {section === "concepts" && (
                    <Button
                      variant="outline"
                      onClick={() => setEditing({ ...item, mode: "relation" })}
                    >
                      Editar relação
                    </Button>
                  )}
                  {section === "charges" && ["reserved", "unknown"].includes(item.status) && (
                    <Button
                      variant="outline"
                      onClick={() => setEditing({ ...item, mode: "reconcile" })}
                    >
                      Reconciliar consumo
                    </Button>
                  )}
                  {section === "tasks" && ["failed", "paused"].includes(item.status) && (
                    <Button
                      disabled={busy}
                      variant="outline"
                      onClick={() => act({ action: "retry", id: item.id })}
                    >
                      Tentar novamente
                    </Button>
                  )}
                </div>
                {editing?.id === item.id && (
                  <Editor
                    key={`${editing.id}-${editing.mode ?? ""}`}
                    item={editing}
                    section={section}
                    onSave={act}
                    busy={busy}
                  />
                )}
              </li>
            ))}
          </ul>
          {resource.data?.items.length === 0 && <p>Nenhum registro nesta área.</p>}
        </State>
      </Panel>
      <nav aria-label="Exportações do TCC" className="flex flex-wrap gap-4">
        {[
          ["interactions", "Interações"],
          ["reviews", "Revisões"],
          ["knowledge", "Conhecimento"],
          ["feedback", "Feedback"],
          ["generation", "Consumo de IA"],
        ].map(([dataset, label]) => (
          <a
            key={dataset}
            className="underline"
            href={`/api/admin/export/results?dataset=${dataset}`}
          >
            {label} (CSV)
          </a>
        ))}
      </nav>
    </Frame>
  );
}
function Editor({ item, section, onSave, busy }) {
  const [name, setName] = useState(item.name ?? item.title ?? "");
  const [description, setDescription] = useState(item.description ?? item.summary ?? "");
  const [aliases, setAliases] = useState((item.aliases ?? []).join(", "));
  const targets = useResource(item.mode === "relation" ? "/admin/concepts" : "/admin/events");
  const [target, setTarget] = useState("");
  const [relation, setRelation] = useState("RELATED_TO");
  const [remove, setRemove] = useState(false);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [active, setActive] = useState(item.active ?? true);
  const [limit, setLimit] = useState(item.generation_limit ?? 30);
  function submit(e) {
    e.preventDefault();
    let body;
    if (item.mode === "reconcile")
      body = {
        action: "reconcile",
        id: item.id,
        inputTokens: Number(inputTokens),
        outputTokens: Number(outputTokens),
        confirmed,
      };
    else if (item.mode === "move") body = { action: "move", id: item.id, targetId: target || null };
    else if (item.mode === "merge") body = { action: "merge", id: item.id, targetId: target };
    else if (item.mode === "relation")
      body = { action: "relation", id: item.id, targetId: target, relation, remove };
    else if (section === "users")
      body = { action: "user", id: item.id, active, generationLimit: Number(limit) };
    else if (section === "concepts")
      body = {
        action: "concept",
        id: item.id,
        name,
        description,
        aliases: aliases
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };
    else body = { action: "event", id: item.id, title: name, summary: description };
    onSave(body);
  }
  return (
    <form className="mt-4 space-y-4 rounded-xl border bg-[#F0F4F9] p-4" onSubmit={submit}>
      {item.mode === "reconcile" ? (
        <>
          <p className="text-sm">
            Consulte a chamada no provedor antes de liberar qualquer reserva. Informe o total
            faturado, incluindo raciocínio. Use zero somente quando confirmar que não houve consumo.
          </p>
          <label className="block">
            Tokens de entrada
            <input
              type="number"
              min={0}
              required
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
              className="ml-3 rounded border bg-white p-2"
            />
          </label>
          <label className="block">
            Tokens de saída
            <input
              type="number"
              min={0}
              required
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
              className="ml-3 rounded border bg-white p-2"
            />
          </label>
          <label className="flex gap-2">
            <input
              required
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmei o consumo no provedor
          </label>
        </>
      ) : item.mode ? (
        <>
          <label className="block text-sm">
            {item.mode === "relation" ? "Conceito de destino" : "Evento de destino"}
            <select
              value={target}
              required={item.mode !== "move"}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-2 w-full rounded border bg-white p-3"
            >
              <option value="">{item.mode === "move" ? "Criar novo evento" : "Selecione"}</option>
              {targets.data?.items
                .filter((t) => t.id !== item.id && t.lifecycle_status !== "merged")
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title ?? t.name}
                  </option>
                ))}
            </select>
          </label>
          {item.mode === "move" && (
            <p className="text-sm">Deixe vazio para separar o artigo em um novo evento.</p>
          )}
          {item.mode === "relation" && (
            <>
              <select
                aria-label="Tipo de relação"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="rounded border bg-white p-3"
              >
                <option value="RELATED_TO">Relacionado</option>
                <option value="REQUIRES">Pré-requisito</option>
                <option value="PART_OF">Faz parte</option>
              </select>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={remove}
                  onChange={(e) => setRemove(e.target.checked)}
                />
                Remover relação
              </label>
            </>
          )}
        </>
      ) : section === "users" ? (
        <>
          <label className="flex gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Conta ativa
          </label>
          <label className="block">
            Gerações por dia
            <input
              type="number"
              min={1}
              max={10000}
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="ml-3 rounded border bg-white p-2"
            />
          </label>
        </>
      ) : (
        <>
          <label className="block">
            {section === "concepts" ? "Nome" : "Título"}
            <input
              required
              value={name}
              maxLength={section === "concepts" ? 150 : 300}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded border bg-white p-3"
            />
          </label>
          <label className="block">
            {section === "concepts" ? "Definição" : "Resumo"}
            <textarea
              required
              maxLength={section === "concepts" ? 5000 : 10000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-28 w-full rounded border bg-white p-3"
            />
          </label>
          {section === "concepts" && (
            <label className="block">
              Aliases, separados por vírgula
              <input
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                className="mt-2 w-full rounded border bg-white p-3"
              />
            </label>
          )}
        </>
      )}
      <Button disabled={busy} type="submit">
        {busy ? "Salvando…" : "Salvar alteração"}
      </Button>
    </form>
  );
}
