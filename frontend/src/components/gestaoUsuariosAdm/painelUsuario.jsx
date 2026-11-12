"use client";

import { useEffect, useState } from "react";
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
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[600px] gap-0 overflow-y-auto rounded-[18px] border border-[#EAE7D6] bg-white p-0 shadow-[0_20px_50px_rgba(16,26,64,0.12)] sm:max-w-[600px]">
        {usuario && (
          <>
            <DialogHeader className="bg-[#F7F3CD] px-4 pb-3 pt-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#101A40] text-sm font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  {usuario.iniciais}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em] text-[#101A40]">
                      {usuario.nome}
                    </DialogTitle>

                    <Badge
                      className={`gap-1.5 rounded-full border-0 px-2.5 py-1 text-[10px] font-medium shadow-none ${
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

                  <DialogDescription className="mt-1 text-[12.5px] text-[#30466E]">
                    {usuario.email}
                  </DialogDescription>

                  <p className="mt-1 text-[11.5px] text-[#465C7C]">
                    Usuário desde {usuario.dataCadastro}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="informacoes" className="gap-0">
              <TabsList
                variant="line"
                className="h-11 w-full justify-start rounded-none border-0 bg-white px-5 sm:px-6"
              >
                <TabsTrigger
                  value="informacoes"
                  className="h-full rounded-none border-b-[2px] border-transparent px-4 text-[13px] text-[#30466E]/75 shadow-none transition-colors duration-200 data-[state=active]:border-[#E0C43F] data-[state=active]:bg-white data-[state=active]:text-[#101A40] data-[state=active]:font-semibold"
                >
                  Informações
                </TabsTrigger>

                <TabsTrigger
                  value="historico"
                  className="h-full rounded-none border-b-[2px] border-transparent px-4 text-[13px] text-[#30466E]/75 shadow-none transition-colors duration-200 data-[state=active]:border-[#E0C43F] data-[state=active]:bg-white data-[state=active]:text-[#101A40] data-[state=active]:font-semibold"
                >
                  Histórico de ações
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="informacoes"
                className="space-y-6 bg-white px-5 py-5 sm:px-6 sm:py-5"
              >
                <section className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-4 w-[3px] rounded-full bg-[#E8E191]" />
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#101A40]">
                      Informações pessoais
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1 border-b border-[#EAEFF5] pb-2.5">
                        <p className="text-[10.5px] font-medium uppercase tracking-[0.05em] text-[#6A7A96]">
                          Nome completo
                        </p>
                        <p className="text-[13px] font-medium text-[#101A40]">{usuario.nome}</p>
                      </div>

                      <div className="flex flex-col gap-1 border-b border-[#EAEFF5] pb-2.5">
                        <p className="text-[10.5px] font-medium uppercase tracking-[0.05em] text-[#6A7A96]">
                          Data de cadastro
                        </p>
                        <p className="text-[13px] font-medium text-[#101A40]">
                          {usuario.dataCadastro}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 border-b border-[#EAEFF5] pb-2.5">
                      <p className="text-[10.5px] font-medium uppercase tracking-[0.05em] text-[#6A7A96]">
                        E-mail
                      </p>
                      <p className="break-all text-[13px] font-medium text-[#101A40]">
                        {usuario.email}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-4 w-[3px] rounded-full bg-[#E8E191]" />
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#101A40]">
                      Configurações da conta
                    </h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="admin-user-role"
                        className="text-[12px] font-medium text-[#30466E]"
                      >
                        Permissões
                      </label>

                      <Select value={permissao} onValueChange={setPermissao}>
                        <SelectTrigger
                          id="admin-user-role"
                          className="h-10 w-full rounded-[8px] border border-[#DCE3EA] bg-white text-[13px] text-[#101A40] shadow-none transition-colors focus:border-[#E8E191] focus:ring-3 focus:ring-[#E8E191]/25"
                        >
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-white text-[#101A40]">
                          <SelectItem value="Admin">Administrador</SelectItem>
                          <SelectItem value="Usuário">Usuário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="admin-user-status"
                        className="text-[12px] font-medium text-[#30466E]"
                      >
                        Status da conta
                      </label>

                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger
                          id="admin-user-status"
                          className="h-10 w-full rounded-[8px] border border-[#DCE3EA] bg-white text-[13px] text-[#101A40] shadow-none transition-colors focus:border-[#E8E191] focus:ring-3 focus:ring-[#E8E191]/25"
                        >
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-white text-[#101A40]">
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {mostrarAvisoBloqueio && (
                    <div className="rounded-[8px] border border-[#F1EFC9] bg-[#FAF9F1] px-3 py-2 text-[11.5px] leading-5 text-[#4E5E7D]">
                      Usuários bloqueados não podem acessar o sistema.
                    </div>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="historico" className="bg-white px-5 py-5 sm:px-6 sm:py-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="h-4 w-[3px] rounded-full bg-[#E8E191]" />
                  <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#101A40]">
                    Histórico de ações
                  </h3>
                </div>

                <p className="text-[13px] leading-5 text-[#8192B2]">
                  Os registros das ações deste usuário aparecerão aqui quando o sistema de auditoria
                  estiver integrado.
                </p>
              </TabsContent>
            </Tabs>

            <div className="border-t border-[#F0EFC9] bg-white px-5 py-3 sm:px-6">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={aoFechar}
                  className="h-9 rounded-lg border-[#E2E8F0] bg-white text-[12.5px] font-medium text-[#30466E] shadow-none transition-colors hover:bg-[#F8FAFC]"
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  onClick={salvarAlteracoes}
                  className="h-9 rounded-lg bg-[#101A40] text-[12.5px] font-medium text-white shadow-none transition-colors hover:bg-[#30466E]"
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
