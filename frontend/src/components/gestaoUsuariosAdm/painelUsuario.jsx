"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PainelUsuario({ usuario, aberto, aoFechar, aoSalvar }) {
  const [permissao, setPermissao] = useState("Usuário");
  const [status, setStatus] = useState("Ativo");

  const historicoAcoes = [
    {
      titulo: "Perfil atualizado",
      descricao: "Alterou o e-mail do usuário para atualização cadastral.",
      data: "08/11/2026",
      hora: "14:42",
      tipo: "perfil",
    },
    {
      titulo: "Permissão alterada",
      descricao: "Modificou a permissão para Administrador.",
      data: "04/11/2026",
      hora: "09:15",
      tipo: "permissao",
    },
    {
      titulo: "Login realizado",
      descricao: "Acesso concluído com sucesso ao painel administrativo.",
      data: "02/11/2026",
      hora: "08:30",
      tipo: "login",
    },
  ];

  useEffect(() => {
    if (usuario) {
      setPermissao(usuario.permissao ?? "Usuário");
      setStatus(usuario.status ?? "Ativo");
    }
  }, [usuario]);

  function salvarAlteracoes() {
    if (!usuario) return;

    aoSalvar(usuario.id, {
      permissao,
      status,
    });
  }

  const mostrarAvisoBloqueio = status === "Bloqueado" || status === "Inativo";

  return (
    <Dialog
      open={aberto}
      onOpenChange={(valor) => {
        if (!valor) aoFechar();
      }}
    >
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[680px] gap-0 overflow-y-auto rounded-xl border border-[#DDE5F0] bg-[#FBF8E9] p-0 shadow-[0_24px_70px_rgba(16,26,64,0.2)] sm:max-w-[680px] [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:bg-white/15">
        {usuario && (
          <>
            <DialogHeader className="relative isolate overflow-hidden border-b border-[#314365] bg-gradient-to-r from-[#101A40] via-[#1C2D50] to-[#30466E] px-5 py-6 sm:px-7">
              <span
                aria-hidden="true"
                className="absolute -top-24 -right-12 -z-10 size-64 rounded-full border-[30px] border-white/[0.06]"
              />
              <span
                aria-hidden="true"
                className="absolute -right-4 -bottom-28 -z-10 size-48 rounded-full bg-[#EBDD80]/10 blur-2xl"
              />
              <div className="relative flex items-center gap-4 pr-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-[#EBDD80] text-lg font-bold text-[#101A40] shadow-md">
                  {usuario.iniciais}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#EBDD80] uppercase">
                      PERFIL DO USUÁRIO
                    </span>
                    <Badge
                      className={`gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-xs font-medium shadow-none ${
                        status === "Ativo"
                          ? "bg-[#E3F7EA] text-[#1F7A4C]"
                          : "bg-[#FCEAEA] text-[#B54046]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          status === "Ativo" ? "bg-[#27A56A]" : "bg-[#D24952]"
                        }`}
                      />
                      {status}
                    </Badge>
                  </div>

                  <DialogTitle className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[28px]">
                    {usuario.nome}
                  </DialogTitle>

                  <DialogDescription className="mt-1 text-sm text-[#D7DFEC]">
                    {usuario.email}
                  </DialogDescription>

                  <p className="mt-1 text-xs text-[#AEBBD0]">
                    Usuário desde {usuario.dataCadastro}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="informacoes" className="gap-0 bg-[#FBF8E9]">
              <TabsList
                className="mx-5 mt-5 grid h-11 w-[calc(100%-2.5rem)] grid-cols-2 rounded-lg bg-[#E8EEF6] p-1 sm:mx-7 sm:w-[calc(100%-3.5rem)]"
              >
                <TabsTrigger
                  value="informacoes"
                  className="h-full rounded-md border-0 px-4 text-sm font-medium text-[#657A9B] shadow-none transition-colors hover:bg-[#EBDD80] hover:text-[#101A40] data-[state=active]:bg-[#FBF7E5] data-[state=active]:font-semibold data-[state=active]:text-[#101A40] data-[state=active]:shadow-sm"
                >
                  Informações
                </TabsTrigger>

                <TabsTrigger
                  value="historico"
                  className="h-full rounded-md border-0 px-4 text-sm font-medium text-[#657A9B] shadow-none transition-colors hover:bg-[#EBDD80] hover:text-[#101A40] data-[state=active]:bg-[#FBF7E5] data-[state=active]:font-semibold data-[state=active]:text-[#101A40] data-[state=active]:shadow-sm"
                >
                  Histórico de ações
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="informacoes"
                className="bg-[#FBF8E9] px-4 py-4 sm:px-7 sm:py-5"
              >
                <div className="space-y-4">
                  <section className="space-y-4 rounded-xl border border-[#E5EAF2] bg-white p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-[#101A40] text-[#EBDD80]">
                        <UserRound aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#101A40]">
                          Informações pessoais
                        </h3>
                        <p className="text-xs text-[#8192B2]">Dados cadastrais do usuário</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-[#E5EAF2] bg-white p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8291AA]">
                          Nome completo
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#101A40]">{usuario.nome}</p>
                      </div>

                      <div className="rounded-lg border border-[#E5EAF2] bg-white p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8291AA]">
                          Data de cadastro
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#101A40]">
                          {usuario.dataCadastro}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#E5EAF2] bg-white p-3 sm:col-span-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8291AA]">
                          E-mail
                        </p>
                        <p className="mt-1 break-all text-sm font-medium text-[#101A40]">
                          {usuario.email}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4 rounded-xl border border-[#E5EAF2] bg-white p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-[#101A40] text-[#EBDD80]">
                        <ShieldCheck aria-hidden="true" className="size-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[#101A40]">
                          Configurações da conta
                        </h3>
                        <p className="text-xs text-[#8192B2]">Permissões e acesso</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="admin-user-role"
                          className="text-sm font-medium text-[#30466E]"
                        >
                          Permissões
                        </label>

                        <Select value={permissao} onValueChange={setPermissao}>
                          <SelectTrigger
                            id="admin-user-role"
                            className="h-11 w-full rounded-lg border border-[#D1DBE9] bg-[#F3F6FB] text-sm text-[#101A40] shadow-none transition-colors hover:bg-[#EBDD80] focus:border-[#D7BF4D] focus:bg-[#EBDD80] focus:ring-3 focus:ring-[#D7BF4D]/30 data-[popup-open]:bg-[#EBDD80]"
                          >
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent className="bg-white text-[#101A40]">
                            <SelectItem
                              value="Admin"
                              className="hover:bg-[#EBDD80] focus:bg-[#EBDD80] focus:text-[#101A40] data-[highlighted]:bg-[#EBDD80]"
                            >
                              Administrador
                            </SelectItem>
                            <SelectItem
                              value="Usuário"
                              className="hover:bg-[#EBDD80] focus:bg-[#EBDD80] focus:text-[#101A40] data-[highlighted]:bg-[#EBDD80]"
                            >
                              Usuário
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="admin-user-status"
                          className="text-sm font-medium text-[#30466E]"
                        >
                          Status da conta
                        </label>

                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger
                            id="admin-user-status"
                            className="h-11 w-full rounded-lg border border-[#D1DBE9] bg-[#F3F6FB] text-sm text-[#101A40] shadow-none transition-colors hover:bg-[#EBDD80] focus:border-[#D7BF4D] focus:bg-[#EBDD80] focus:ring-3 focus:ring-[#D7BF4D]/30 data-[popup-open]:bg-[#EBDD80]"
                          >
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent className="bg-white text-[#101A40]">
                            <SelectItem
                              value="Ativo"
                              className="hover:bg-[#EBDD80] focus:bg-[#EBDD80] focus:text-[#101A40] data-[highlighted]:bg-[#EBDD80]"
                            >
                              Ativo
                            </SelectItem>
                            <SelectItem
                              value="Bloqueado"
                              className="hover:bg-[#EBDD80] focus:bg-[#EBDD80] focus:text-[#101A40] data-[highlighted]:bg-[#EBDD80]"
                            >
                              Bloqueado
                            </SelectItem>
                            <SelectItem
                              value="Inativo"
                              className="hover:bg-[#EBDD80] focus:bg-[#EBDD80] focus:text-[#101A40] data-[highlighted]:bg-[#EBDD80]"
                            >
                              Inativo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {mostrarAvisoBloqueio && (
                      <div className="rounded-lg border border-[#EBDD80] bg-[#F3E69A]/35 px-3 py-2 text-sm leading-5 text-[#30466E]">
                        Usuários bloqueados não podem acessar o sistema.
                      </div>
                    )}
                  </section>
                </div>
              </TabsContent>

              <TabsContent
                value="historico"
                className="bg-[#FBF8E9] px-4 py-4 sm:px-7 sm:py-5"
              >
                <section className="rounded-xl border border-[#E5EAF2] bg-white p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#101A40] text-[#EBDD80]">
                      <ShieldCheck aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#101A40]">Histórico de ações</h3>
                      <p className="text-xs text-[#8192B2]">Atividades recentes desta conta</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {historicoAcoes.map((acao, index) => (
                      <div
                        key={`${acao.titulo}-${acao.data}-${acao.hora}`}
                        className="relative rounded-lg border border-[#E5EAF2] bg-white p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-[#526B93] shadow-sm ring-1 ring-[#E5EAF2]">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[13px] font-semibold text-[#101A40]">
                                {acao.titulo}
                              </p>
                              <p className="text-[11px] text-[#6D7E99]">
                                {acao.data} · {acao.hora}
                              </p>
                            </div>
                            <p className="mt-1 text-[12px] leading-5 text-[#5D6F8E]">
                              {acao.descricao}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>
            </Tabs>

            <div className="bg-[#FBF8E9] px-5 py-4 sm:px-7">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={aoFechar}
                  className="h-11 rounded-xl border-[#D7DFEA] bg-white px-6 text-sm font-medium text-[#526B93] shadow-none transition-colors hover:bg-[#EBDD80] hover:text-[#101A40] focus-visible:bg-[#EBDD80] sm:min-w-[132px]"
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  onClick={salvarAlteracoes}
                  className="h-11 rounded-xl bg-[#EBDD80] px-6 text-sm font-semibold text-[#101A40] shadow-sm transition-colors hover:bg-[#D7BF4D] sm:min-w-[190px]"
                >
                  Salvar alterações
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
