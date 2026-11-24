"use client";

import { History, Search, UsersRound, X } from "lucide-react";
import { useRef, useState } from "react";
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
import { useAdminUsers } from "@/hooks/use-admin-users";
import { toast } from "@/lib/toast";
import FiltroDataCadastro from "./filtroDataCadastro";
import HistoricoUsuarios from "./historicoUsuarios";
import PainelUsuario from "./painelUsuario";
import TabelaUsuarios from "./tabelaUsuarios";

const pageSize = 10;
const roleOptions = { todos: "Todos os perfis", Admin: "Administradores", Usuário: "Usuários" };
const accessOptions = { todos: "Todos os acessos", Ativo: "Ativos", Bloqueado: "Bloqueados" };
const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

export default function GestaoUsuarios({ demo = true }) {
  const { users, history, loading, historyLoading, busy, error, historyError, reload, save } =
    useAdminUsers(demo);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState("contas");
  const currentError = tab === "contas" ? error : historyError;
  const [historyUser, setHistoryUser] = useState(null);
  const historyTab = useRef(null);
  const filtered = users.filter(
    (user) =>
      normalize(`${user.nome} ${user.email}`).includes(normalize(query)) &&
      (role === "todos" || user.permissao === role) &&
      (status === "todos" || user.status === status) &&
      (!date || user.dataCadastro === date.split("-").reverse().join("/")),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * pageSize;
  const historyItems = historyUser
    ? history.filter((entry) => entry.usuarioId === historyUser.id)
    : history;
  function openUser(user) {
    setSelected(user);
    setPanelOpen(true);
  }
  function openHistory(user) {
    setHistoryUser(user);
    setPanelOpen(false);
    setTab("historico");
  }
  function selectTab(value) {
    setHistoryUser(null);
    setTab(value);
  }
  function returnToAccount() {
    selectTab("contas");
    openUser(users.find((user) => user.id === historyUser.id) || historyUser);
  }
  function clearFilters() {
    setQuery("");
    setRole("todos");
    setStatus("todos");
    setDate("");
    setPage(1);
  }
  async function saveUser(id, values) {
    if (await save(id, values)) {
      setPanelOpen(false);
      setSelected(null);
      toast.success("Configurações da conta salvas.");
    }
  }
  return (
    <div className="min-w-0 space-y-7">
      {currentError && !panelOpen && (
        <Notice tone="error">
          <p>{currentError}</p>
          <Button onClick={() => reload()} variant="outline" className="mt-3">
            Tentar novamente
          </Button>
        </Notice>
      )}
      <AdminSummary
        title="Contas cadastradas"
        description="Consulte as contas, bloqueie ou restabeleça o acesso e ajuste o limite diário de gerações por IA. Abra Histórico de alterações para conferir as mudanças registradas."
        loading={loading}
        itemColors="border-transparent bg-[#FBF7E5]"
        items={[
          `${users.length} contas`,
          `${users.filter((user) => user.status === "Ativo").length} ativas`,
          `${users.filter((user) => user.status === "Bloqueado").length} bloqueadas`,
        ]}
      />
      <Tabs value={tab} onValueChange={selectTab} className="w-full gap-3">
        <TabsList aria-label="Gestão de usuários">
          <SegmentedTab value="contas">
            <UsersRound aria-hidden="true" className="size-[18px]" />
            Contas cadastradas{" "}
            {!loading && <span className={segmentCountStyle}>{users.length}</span>}
          </SegmentedTab>
          <SegmentedTab ref={historyTab} value="historico">
            <History aria-hidden="true" className="size-[18px]" />
            Histórico de alterações{" "}
            {!historyLoading && !historyError && history.length > 0 && (
              <span className={segmentCountStyle}>{history.length}</span>
            )}
          </SegmentedTab>
        </TabsList>

        <TabsContent value="contas" className="min-w-0">
          <section
            aria-label="Gestão de contas"
            className="min-w-0 overflow-hidden rounded-2xl border border-wisen-borda bg-white shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
                <div className="relative min-w-0 w-full sm:w-[230px]">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8190A8]"
                  />
                  <Input
                    aria-label="Buscar usuários por nome ou e-mail"
                    placeholder="Buscar nome ou e-mail"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    className={`${adminFilterControl} pl-9`}
                  />
                </div>
                <AdminTableFilter
                  label="Filtrar por perfil"
                  options={roleOptions}
                  width="sm:w-[170px]"
                  value={role}
                  onChange={(value) => {
                    setRole(value);
                    setPage(1);
                  }}
                />
                <AdminTableFilter
                  label="Filtrar por acesso"
                  options={accessOptions}
                  width="sm:w-[165px]"
                  value={status}
                  onChange={(value) => {
                    setStatus(value);
                    setPage(1);
                  }}
                />
                <FiltroDataCadastro
                  value={date}
                  onChange={(value) => {
                    setDate(value);
                    setPage(1);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className={`h-9 w-full gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none sm:w-auto ${adminFilterHover}`}
                >
                  <X aria-hidden="true" className="size-3.5" />
                  Limpar filtros
                </Button>
              </div>
            </div>
            {loading ? (
              <p
                role="status"
                className="border-t border-[#E8EDF4] p-8 text-center text-sm text-[#7182A1]"
              >
                Carregando usuários...
              </p>
            ) : (
              <TabelaUsuarios
                usuarios={filtered.slice(start, start + pageSize)}
                aoAbrirUsuario={openUser}
              />
            )}
            <AdminTableFooter
              countLabel={`${filtered.length} ${filtered.length === 1 ? "conta encontrada" : "contas encontradas"}`}
              paginationLabel="Paginação de usuários"
              loading={loading}
              page={currentPage}
              pages={pages}
              onPageChange={setPage}
            />
          </section>
        </TabsContent>
        <TabsContent value="historico" className="min-w-0">
          <HistoricoUsuarios
            items={historyItems}
            user={historyUser}
            demo={demo}
            loading={historyLoading}
            error={historyError}
            onShowAll={() => {
              setHistoryUser(null);
              historyTab.current?.focus();
            }}
            onReturnToAccount={returnToAccount}
          />
        </TabsContent>
      </Tabs>
      <PainelUsuario
        key={selected?.id ?? "none"}
        usuario={selected}
        aberto={panelOpen}
        busy={busy}
        demo={demo}
        aoFechar={() => {
          if (!busy) setPanelOpen(false);
        }}
        aoSalvar={saveUser}
        aoHistorico={openHistory}
        focoAoFechar={() => (tab === "historico" ? historyTab.current : true)}
      />
    </div>
  );
}
