"use client";

import { History, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { AdminSummary } from "@/components/admin/adminSummary";
import { Notice } from "@/components/app/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminSources } from "@/hooks/use-admin-sources";
import FormularioFonte, { frequenciasFonte } from "./formularioFonte";
import LogsColeta from "./logsColeta";
import TabelaFontes from "./tabelaFontes";

const control = "wisen-control w-full min-w-0";
const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
export default function GestaoFontes({ demo = true }) {
  const { sources, logs, loading, busy, error, reload, perform } = useAdminSources(demo);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [frequency, setFrequency] = useState("todas");
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = sources.filter(
    (source) =>
      normalize(`${source.nome} ${source.url}`).includes(normalize(query)) &&
      (status === "todos" || (status === "ativas" ? source.ativo : !source.ativo)) &&
      (frequency === "todas" || source.frequencia === frequency),
  );
  function edit(source) {
    setEditing(source);
    setOpened(true);
    setMessage("");
  }
  function close() {
    if (!busy) {
      setOpened(false);
      setEditing(null);
    }
  }
  function clear() {
    setQuery("");
    setStatus("todos");
    setFrequency("todas");
  }
  async function save(values) {
    if (await perform("save", { ...values, id: editing?.id })) {
      setMessage(editing ? "Configurações da fonte salvas." : "Fonte adicionada.");
      close();
    }
  }
  async function toggle(source) {
    if (await perform("toggle", source))
      setMessage(source.ativo ? "Fonte pausada." : "Fonte ativada.");
  }
  async function collect(source) {
    if (await perform("collect", source)) {
      setMessage("Coleta solicitada. Confira o resultado após o processamento.");
      close();
    }
  }
  return (
    <div className="min-w-0 space-y-7">
      {message && <Notice>{message}</Notice>}
      {error && !opened && (
        <Notice tone="error">
          <p>{error}</p>
          <Button variant="outline" onClick={() => reload()} className="mt-3">
            Tentar novamente
          </Button>
        </Notice>
      )}
      <AdminSummary
        title="Fontes cadastradas"
        description="Consulte os veículos integrados e acompanhe a coleta de notícias da plataforma."
        loading={loading}
        items={[
          `${sources.length} fontes`,
          `${sources.filter((source) => source.ativo).length} ativas`,
          `${sources.filter((source) => !source.ativo).length} pausadas`,
        ]}
      />
      <div className="min-w-0 space-y-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="relative min-w-0 w-full sm:w-[230px]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8190A8]"
            />
            <Input
              aria-label="Buscar fontes por nome ou endereço"
              placeholder="Buscar nome ou endereço"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`${control} pl-9`}
            />
          </div>
          <select
            aria-label="Filtrar fontes por status"
            className={`${control} sm:w-[165px]`}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="ativas">Ativas</option>
            <option value="pausadas">Pausadas</option>
          </select>
          <select
            aria-label="Filtrar fontes por frequência"
            className={`${control} sm:w-[185px]`}
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option value="todas">Todas as frequências</option>
            {(demo ? frequenciasFonte : ["Automática"]).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={clear}
            className="h-9 w-full gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none hover:bg-wisen-admin-hover sm:w-auto"
          >
            <X aria-hidden="true" className="size-3.5" />
            Limpar filtros
          </Button>
          {demo && (
            <Button
              onClick={() => edit(null)}
              disabled={loading || busy}
              className="h-9 w-full gap-1.5 rounded-[10px] bg-[#101A40] px-3 text-xs font-medium text-white hover:bg-[#30466E] sm:ml-auto sm:w-auto"
            >
              <Plus aria-hidden="true" className="size-3.5" />
              Adicionar fonte
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#8290A8]">
            {loading
              ? "Carregando fontes..."
              : `${filtered.length} ${filtered.length === 1 ? "fonte encontrada" : "fontes encontradas"}`}
          </p>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => setLogsOpen(true)}
            className="h-9 gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none hover:bg-wisen-admin-hover"
          >
            <History aria-hidden="true" className="size-3.5" />
            Registros de coleta
          </Button>
        </div>
      </div>
      <section
        aria-label="Gestão de fontes RSS"
        className="min-w-0 overflow-hidden rounded-2xl border border-wisen-borda bg-white shadow-2xs"
      >
        {loading ? (
          <p role="status" className="p-8 text-center text-sm text-[#7182A1]">
            Carregando fontes...
          </p>
        ) : (
          <TabelaFontes fontes={filtered} aoEditar={edit} aoAlternarStatus={toggle} busy={busy} />
        )}
        <footer className="border-t border-[#E8EDF4] bg-[#FAFBFD] px-4 py-4 sm:px-5">
          <p className="text-xs text-[#7182A1]">
            {filtered.length
              ? `Mostrando ${filtered.length} de ${sources.length} fontes`
              : "Nenhuma fonte nesta lista"}
          </p>
        </footer>
      </section>
      {demo && (
        <p className="text-xs leading-5 text-[#7182A1]">
          Fontes e registros ilustrativos de demonstração. As configurações ficam salvas neste
          navegador.
        </p>
      )}
      <LogsColeta aberto={logsOpen} aoFechar={() => setLogsOpen(false)} logs={logs} demo={demo} />
      <FormularioFonte
        aberto={opened}
        aoFechar={close}
        fonte={editing}
        aoSalvar={save}
        aoColetar={collect}
        busy={busy}
        error={error}
        demo={demo}
      />
    </div>
  );
}
