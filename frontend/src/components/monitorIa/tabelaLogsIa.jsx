"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import { useState } from "react";
import {
  AdminTableFilter,
  adminFilterControl,
  adminFilterHover,
} from "@/components/admin/adminTableFilter";
import { AdminTableFooter } from "@/components/admin/adminTableFooter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const logs = [
  {
    dataHora: "23/10/2026 14:32",
    modelo: "GPT-4o",
    tipo: "API externa",
    operacao: "Resumo de notícia",
    tokens: "1.240 / 390",
    latencia: "3,2 s",
    custo: "0,042",
    status: "Sucesso",
  },
  {
    dataHora: "23/10/2026 14:18",
    modelo: "Transformers.js",
    tipo: "Local",
    operacao: "Extração de conceitos",
    tokens: "950 / 210",
    latencia: "1,1 s",
    custo: "0,000",
    status: "Sucesso",
  },
  {
    dataHora: "23/10/2026 13:55",
    modelo: "Claude 3.5",
    tipo: "API externa",
    operacao: "Relacionamento de conceitos",
    tokens: "1.560 / 420",
    latencia: "4,8 s",
    custo: "0,065",
    status: "Sucesso",
  },
  {
    dataHora: "23/10/2026 12:41",
    modelo: "ONNX (Local)",
    tipo: "Local",
    operacao: "Classificação de tema",
    tokens: "620 / 180",
    latencia: "0,9 s",
    custo: "0,000",
    status: "Sucesso",
  },
  {
    dataHora: "23/10/2026 11:07",
    modelo: "Gemini 1.5",
    tipo: "API externa",
    operacao: "Geração de explicação",
    tokens: "1.800 / 560",
    latencia: "5,1 s",
    custo: "0,071",
    status: "Sucesso",
  },
];

const typeOptions = { all: "Todos os tipos", "API externa": "API externa", Local: "Local" };
const pageSize = 5;
const metrics = [
  { key: "tokens", label: "Tokens (entrada / saída)" },
  { key: "latencia", label: "Latência" },
  { key: "custo", label: "Custo (R$)" },
];

function LogModel({ log }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-medium break-words text-wisen-titulo">{log.modelo}</p>
      <p className="mt-1 text-xs text-[#7182A1]">{log.tipo}</p>
    </div>
  );
}

function LogStatus({ status }) {
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
      {status}
    </span>
  );
}

function LogMetrics({ log }) {
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
      {metrics.map(({ key, label }) => (
        <div key={key}>
          <dt className="text-[#7182A1]">{label}</dt>
          <dd className="mt-1 tabular-nums text-wisen-titulo">{log[key]}</dd>
        </div>
      ))}
    </dl>
  );
}

function LogAction({ log, onOpen, mobile = false }) {
  return (
    <Button
      variant={mobile ? "outline" : "ghost"}
      aria-haspopup="dialog"
      aria-label={`Ver detalhes de ${log.modelo}`}
      onClick={() => onOpen(log)}
      className={
        mobile
          ? "h-10 w-full border-wisen-borda text-xs text-[#526584] hover:bg-wisen-admin-control-hover active:bg-wisen-admin-control-hover"
          : "text-xs text-[#526584] hover:bg-transparent hover:text-wisen-destaque dark:hover:bg-transparent"
      }
    >
      Ver detalhes
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </Button>
  );
}

export function TabelaLogsIa() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const search = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = logs.filter(
    (log) =>
      (type === "all" || type === log.tipo) &&
      [log.modelo, log.operacao].some((value) => value.toLocaleLowerCase("pt-BR").includes(search)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const visibleLogs = filtered.slice(start, start + pageSize);

  return (
    <section
      aria-labelledby="logs-ia-title"
      className="@container/ai-logs min-w-0 overflow-hidden rounded-2xl border border-wisen-borda bg-card shadow-2xs"
    >
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <div>
          <h3 id="logs-ia-title" className="text-base font-semibold text-wisen-titulo">
            Logs de chamadas de IA
          </h3>
          <span
            aria-hidden="true"
            className="mt-1 block h-0.5 w-8 rounded-full bg-wisen-destaque"
          />
          <p className="mt-1 text-sm text-[#7182A1]">
            Registros individuais de cada requisição, com detalhes de consumo, latência e custo.
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="relative w-full min-w-0 sm:w-[230px]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8190A8]"
            />
            <Input
              aria-label="Buscar chamadas por modelo ou operação"
              placeholder="Buscar modelo ou operação"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className={`${adminFilterControl} pl-9`}
            />
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <AdminTableFilter
              label="Filtrar chamadas por tipo"
              options={typeOptions}
              width="flex-1 sm:w-[165px] sm:flex-none"
              value={type}
              onChange={(value) => {
                setType(value);
                setPage(1);
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setType("all");
                setPage(1);
              }}
              className={`h-9 shrink-0 gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs font-normal text-[#607092] shadow-none ${adminFilterHover}`}
            >
              <X aria-hidden="true" className="size-3.5" />
              Limpar filtros
            </Button>
          </div>
        </div>
      </div>
      {visibleLogs.length ? (
        <>
          <div className="hidden @min-[54rem]/ai-logs:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Requisições de IA e métricas de consumo</caption>
              <thead className="border-y border-[#E8EDF4]">
                <tr className="text-[10px] font-semibold tracking-wider text-wisen-titulo uppercase">
                  <th scope="col" className="px-5 py-3">
                    Modelo
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Data e hora
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Operação
                  </th>
                  {metrics.map(({ key, label }) => (
                    <th key={key} scope="col" className="px-3 py-3">
                      {label}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-3 text-center">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-right">
                    <span className="sr-only">Detalhes da requisição</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF0F5]">
                {visibleLogs.map((log) => (
                  <tr key={log.dataHora} className="transition-colors hover:bg-wisen-admin-hover">
                    <td className="px-5 py-4">
                      <LogModel log={log} />
                    </td>
                    <td className="px-3 py-4 text-xs tabular-nums text-[#7182A1]">
                      {log.dataHora}
                    </td>
                    <td className="px-3 py-4 text-xs text-[#7182A1]">{log.operacao}</td>
                    {metrics.map(({ key }) => (
                      <td key={key} className="px-3 py-4 text-xs tabular-nums text-[#7182A1]">
                        {log[key]}
                      </td>
                    ))}
                    <td className="px-3 py-4 text-center">
                      <LogStatus status={log.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <LogAction log={log} onOpen={setSelectedLog} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#E8EDF4] border-t border-[#E8EDF4] @min-[54rem]/ai-logs:hidden">
            {visibleLogs.map((log) => (
              <article key={log.dataHora} className="min-w-0 space-y-4 p-4 sm:p-5">
                <LogModel log={log} />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#7182A1]">
                  <LogStatus status={log.status} />
                  <span className="tabular-nums">{log.dataHora}</span>
                  <span>{log.operacao}</span>
                </div>
                <LogMetrics log={log} />
                <LogAction log={log} onOpen={setSelectedLog} mobile />
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="border-t border-[#E8EDF4] px-5 py-14 text-center">
          <h4 className="text-sm font-medium text-wisen-titulo">Nenhuma requisição encontrada</h4>
          <p className="mt-2 text-sm text-[#7182A1]">Tente outro modelo, operação ou tipo.</p>
        </div>
      )}
      <AdminTableFooter
        countLabel={`${filtered.length} ${filtered.length === 1 ? "requisição encontrada" : "requisições encontradas"}`}
        paginationLabel="Paginação de chamadas de IA"
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
      <Dialog open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent size="sm" data-wisen-area="admin">
            <DialogHeader eyebrow="Monitor de IA">
              <DialogTitle>{selectedLog.modelo}</DialogTitle>
              <DialogDescription>{selectedLog.operacao}</DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#7182A1]">
                <LogStatus status={selectedLog.status} />
                <span>{selectedLog.tipo}</span>
                <span className="tabular-nums">{selectedLog.dataHora}</span>
              </div>
              <LogMetrics log={selectedLog} />
            </DialogBody>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
