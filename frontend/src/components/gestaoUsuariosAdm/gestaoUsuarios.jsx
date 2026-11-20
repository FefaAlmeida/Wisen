"use client";

import { ChevronLeft, ChevronRight, History, Search, X } from "lucide-react";
import { useState } from "react";
import { AdminSummary } from "@/components/admin/adminSummary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  dialogSecondaryAction,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAdminUsers } from "@/hooks/use-admin-users";
import PainelUsuario from "./painelUsuario";
import TabelaUsuarios from "./tabelaUsuarios";

const pageSize = 10;
const control =
  "h-9 w-full min-w-0 rounded-[10px] border border-wisen-borda bg-white/85 px-3 text-xs text-[#526584] outline-none transition-colors hover:bg-wisen-admin-hover focus-visible:ring-2 focus-visible:ring-[#D7BF4D]/40";
const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
export default function GestaoUsuarios({ demo = true }) {
  const { users, history, loading, busy, error, reload, save } = useAdminUsers(demo);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyUser, setHistoryUser] = useState(null);
  const [message, setMessage] = useState("");
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
    setMessage("");
  }
  function openHistory(user = null) {
    setHistoryUser(user);
    setPanelOpen(false);
    setHistoryOpen(true);
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
      setMessage("Configurações da conta salvas.");
    }
  }
  return (
    <div className="min-w-0 space-y-7">
      {message && (
        <p
          role="status"
          className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
        </p>
      )}
      {error && !panelOpen && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"
        >
          <p>{error}</p>
          <Button onClick={() => reload()} variant="outline" className="mt-3">
            Tentar novamente
          </Button>
        </div>
      )}
      <AdminSummary
        title="Contas cadastradas"
        description="Consulte os usuários da plataforma e gerencie o acesso de cada conta."
        loading={loading}
        items={[
          `${users.length} contas`,
          `${users.filter((user) => user.status === "Ativo").length} ativas`,
          `${users.filter((user) => user.status === "Bloqueado").length} bloqueadas`,
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
              aria-label="Buscar usuários por nome ou e-mail"
              placeholder="Buscar nome ou e-mail"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className={`${control} pl-9`}
            />
          </div>
          <select
            aria-label="Filtrar por perfil"
            className={`${control} sm:w-[170px]`}
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
          >
            <option value="todos">Todos os perfis</option>
            <option value="Admin">Administradores</option>
            <option value="Usuário">Usuários</option>
          </select>
          <select
            aria-label="Filtrar por acesso"
            className={`${control} sm:w-[165px]`}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="todos">Todos os acessos</option>
            <option value="Ativo">Ativos</option>
            <option value="Bloqueado">Bloqueados</option>
          </select>
          <Input
            aria-label="Filtrar por data de cadastro"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
            className={`${control} sm:w-[165px]`}
          />
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-9 w-full gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none hover:bg-wisen-admin-hover sm:w-auto"
          >
            <X aria-hidden="true" className="size-3.5" />
            Limpar filtros
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#8290A8]">
            {loading
              ? "Carregando contas..."
              : `${filtered.length} ${filtered.length === 1 ? "conta encontrada" : "contas encontradas"}`}
          </p>
          <Button
            variant="outline"
            onClick={() => openHistory()}
            disabled={loading}
            className="h-9 gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none hover:bg-wisen-admin-hover"
          >
            <History aria-hidden="true" className="size-3.5" />
            Histórico de alterações
          </Button>
        </div>
      </div>

      <section
        aria-label="Gestão de contas"
        className="min-w-0 overflow-hidden rounded-2xl border border-wisen-borda bg-white shadow-2xs"
      >
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
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EDF4] bg-[#FAFBFD] px-4 py-4 sm:px-5">
          <p className="text-xs text-[#7182A1]">
            {filtered.length
              ? `Mostrando ${start + 1}–${Math.min(start + pageSize, filtered.length)} de ${filtered.length} contas`
              : "Nenhuma conta nesta lista"}
          </p>
          <nav aria-label="Paginação de usuários" className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Página anterior"
              disabled={loading || currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="size-8 border-wisen-borda text-[#526584] hover:bg-wisen-admin-hover"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-1 text-xs tabular-nums text-[#7182A1]">
              {currentPage} de {pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Próxima página"
              disabled={loading || currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
              className="size-8 border-wisen-borda text-[#526584] hover:bg-wisen-admin-hover"
            >
              <ChevronRight className="size-4" />
            </Button>
          </nav>
        </footer>
      </section>
      {demo && (
        <p className="text-xs leading-5 text-[#7182A1]">
          Contas fictícias de demonstração. As alterações e o histórico ficam salvos neste
          navegador.
        </p>
      )}
      <PainelUsuario
        key={selected?.id ?? "none"}
        usuario={selected}
        aberto={panelOpen}
        busy={busy}
        error={error}
        demo={demo}
        aoFechar={() => {
          if (!busy) setPanelOpen(false);
        }}
        aoSalvar={saveUser}
        aoHistorico={openHistory}
      />
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent size="lg">
          <DialogHeader eyebrow="Administração">
            <DialogTitle>
              {historyUser ? `Histórico de ${historyUser.nome}` : "Histórico de alterações"}
            </DialogTitle>
            <DialogDescription>
              {demo
                ? "Alterações realizadas nas contas de demonstração neste navegador."
                : "Alterações de acesso e limites registradas pelos administradores."}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="min-w-0 divide-y divide-[#E8EDF4]">
              {historyItems.length ? (
                historyItems.map((entry) => (
                  <article key={entry.id} className="space-y-2 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-wisen-titulo">{entry.usuario}</h3>
                      <time className="text-xs text-[#8190A8]">{entry.data}</time>
                    </div>
                    <p className="break-words text-sm leading-6 text-[#7182A1]">
                      {entry.descricao}
                    </p>
                  </article>
                ))
              ) : (
                <div className="py-9 text-center">
                  <p className="text-sm font-medium text-wisen-titulo">
                    Nenhuma alteração registrada
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#7182A1]">
                    Ao salvar uma mudança de acesso ou configuração, ela aparecerá aqui.
                  </p>
                </div>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            {historyUser && (
              <Button
                variant="outline"
                onClick={() => {
                  setHistoryOpen(false);
                  openUser(users.find((user) => user.id === historyUser.id) || historyUser);
                }}
                className={dialogSecondaryAction}
              >
                Voltar à conta
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setHistoryOpen(false)}
              className={dialogSecondaryAction}
            >
              Fechar histórico
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
