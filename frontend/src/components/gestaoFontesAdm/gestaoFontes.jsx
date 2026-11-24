"use client";

import { History, Plus, Rss, Search, X } from "lucide-react";
import { useState } from "react";
import { AdminSummary } from "@/components/admin/adminSummary";
import {
  AdminTableFilter,
  adminFilterControl,
  adminFilterHover,
} from "@/components/admin/adminTableFilter";
import { AdminTableFooter } from "@/components/admin/adminTableFooter";
import { Notice } from "@/components/app/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { segmentCountStyle } from "@/components/ui/segmented-control";
import { SegmentedTab, Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAdminSources } from "@/hooks/use-admin-sources";
import { toast } from "@/lib/toast";
import FormularioFonte, { frequenciasFonte } from "./formularioFonte";
import LogsColeta from "./logsColeta";
import TabelaFontes from "./tabelaFontes";

const pageSize = 10;
const sourceTabStyle =
  "min-w-0 gap-1.5 rounded-lg px-1.5 text-xs whitespace-normal data-active:border-wisen-selecao sm:px-3 sm:text-sm";
const statusOptions = { todos: "Todos os status", ativas: "Ativas", pausadas: "Pausadas" };
const frequencyOptions = {
  todas: "Todas as frequências",
  ...Object.fromEntries(frequenciasFonte.map((item) => [item, item])),
};
const automaticFrequencyOptions = {
  todas: "Todas as frequências",
  Automática: "Automática",
};
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
  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(null);
  const filtered = sources.filter(
    (source) =>
      normalize(`${source.nome} ${source.url}`).includes(normalize(query)) &&
      (status === "todos" || (status === "ativas" ? source.ativo : !source.ativo)) &&
      (frequency === "todas" || source.frequencia === frequency),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * pageSize;
  function edit(source) {
    setEditing(source);
    setOpened(true);
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
    setPage(1);
  }
  async function save(values) {
    if (await perform("save", { ...values, id: editing?.id })) {
      toast.success(editing ? "Configurações da fonte salvas." : "Fonte adicionada.");
      close();
    }
  }
  async function toggle(source) {
    if (await perform("toggle", source))
      toast.success(source.ativo ? "Fonte pausada." : "Fonte ativada.");
  }
  async function collect(source) {
    if (await perform("collect", source)) {
      toast.success("Coleta solicitada. Confira o resultado após o processamento.");
      close();
    }
  }
  return (
    <div className="min-w-0 space-y-7">
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
        description={
          demo
            ? "Adicione fontes de notícias, ajuste a frequência de coleta e ative ou pause fontes. Abra Registros de coleta para consultar erros e avisos da demonstração."
            : "Veja a última coleta de cada fonte, ative ou pause as coletas e solicite uma coleta manual nas configurações da fonte. Abra Registros de coleta para consultar falhas."
        }
        loading={loading}
        itemColors="border-transparent bg-[#FBF7E5]"
        items={[
          `${sources.length} fontes`,
          `${sources.filter((source) => source.ativo).length} ativas`,
          `${sources.filter((source) => !source.ativo).length} pausadas`,
        ]}
      />
      <Tabs defaultValue="fontes" className="w-full gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList
            aria-label="Gestão de fontes"
            className="grid w-full grid-cols-2 rounded-xl sm:w-auto"
          >
            <SegmentedTab value="fontes" className={sourceTabStyle}>
              <Rss aria-hidden="true" className="hidden size-4 min-[380px]:block" />
              Fontes cadastradas{" "}
              {!loading && <span className={segmentCountStyle}>{sources.length}</span>}
            </SegmentedTab>
            <SegmentedTab value="registros" className={sourceTabStyle}>
              <History aria-hidden="true" className="hidden size-4 min-[380px]:block" />
              Registros de coleta{" "}
              {!loading && <span className={segmentCountStyle}>{logs.length}</span>}
            </SegmentedTab>
          </TabsList>
          {demo && (
            <Button
              aria-haspopup="dialog"
              onClick={() => edit(null)}
              disabled={loading || busy}
              className="h-11 w-full gap-2.5 rounded-xl bg-[#101A40] px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-wisen-admin-primary-hover sm:w-auto"
            >
              <Plus aria-hidden="true" className="size-4" />
              Adicionar fonte
            </Button>
          )}
        </div>
        <TabsContent value="fontes" className="min-w-0">
          <section
            aria-label="Gestão de fontes RSS"
            className="min-w-0 overflow-hidden rounded-2xl border border-wisen-borda bg-card shadow-2xs"
          >
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-4 sm:flex sm:flex-wrap sm:px-5">
              <div className="relative col-span-2 w-full min-w-0 sm:w-[230px]">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8190A8]"
                />
                <Input
                  aria-label="Buscar fontes por nome ou endereço"
                  placeholder="Buscar nome ou endereço"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  className={`${adminFilterControl} pl-9`}
                />
              </div>
              <AdminTableFilter
                label="Filtrar fontes por status"
                options={statusOptions}
                width="col-span-2 sm:w-[165px]"
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              />
              <AdminTableFilter
                label="Filtrar fontes por frequência"
                options={demo ? frequencyOptions : automaticFrequencyOptions}
                width="sm:w-[185px]"
                value={frequency}
                onChange={(value) => {
                  setFrequency(value);
                  setPage(1);
                }}
              />
              <Button
                variant="outline"
                onClick={clear}
                className={`h-9 justify-self-end gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none ${adminFilterHover}`}
              >
                <X aria-hidden="true" className="size-3.5" />
                Limpar filtros
              </Button>
            </div>
            {loading ? (
              <p
                role="status"
                className="border-t border-[#E8EDF4] p-8 text-center text-sm text-[#7182A1]"
              >
                Carregando fontes...
              </p>
            ) : (
              <TabelaFontes
                fontes={filtered.slice(start, start + pageSize)}
                aoEditar={edit}
                aoAlternarStatus={toggle}
                busy={busy}
              />
            )}
            <AdminTableFooter
              countLabel={`${filtered.length} ${filtered.length === 1 ? "fonte encontrada" : "fontes encontradas"}`}
              paginationLabel="Paginação de fontes"
              loading={loading}
              page={currentPage}
              pages={pages}
              onPageChange={setPage}
            />
          </section>
        </TabsContent>
        <TabsContent value="registros" className="min-w-0">
          <LogsColeta logs={logs} demo={demo} loading={loading} error={error} />
        </TabsContent>
      </Tabs>
      <FormularioFonte
        aberto={opened}
        aoFechar={close}
        fonte={editing}
        aoSalvar={save}
        aoColetar={collect}
        busy={busy}
        demo={demo}
      />
    </div>
  );
}
