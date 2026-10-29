
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function PainelUsuario({
  usuario,
  aberto,
  aoFechar,
  aoSalvar,
}) {
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

  return (
    <Dialog
      open={aberto}
      onOpenChange={(valor) => {
        if (!valor) aoFechar();
      }}
    >
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-xl sm:max-w-[580px]">

        {usuario && (
          <>
            {/* Cabeçalho do usuário */}
            <DialogHeader className="border-b border-[#E8EDF4] bg-[#F8FAFD] px-6 pt-7 pb-5">
              <div className="flex items-center gap-4 pr-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E8EDF8] text-xl font-semibold text-[#30466E]">
                  {usuario.iniciais}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="text-[21px] font-semibold text-[#101A40]">
                      {usuario.nome}
                    </DialogTitle>

                    <Badge
                      className={`gap-1.5 rounded-full border-0 px-3 py-1 text-[11px] font-medium shadow-none ${
                        status === "Ativo"
                          ? "bg-[#E5F5EB] text-[#278453]"
                          : "bg-[#FDEBED] text-[#C34048]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === "Ativo"
                            ? "bg-[#35AE75]"
                            : "bg-[#E24A55]"
                        }`}
                      />
                      {status}
                    </Badge>
                  </div>

                  <DialogDescription className="mt-1 text-[13px] text-[#7183A6]">
                    {usuario.email}
                  </DialogDescription>

                  <p className="mt-1 text-[12px] text-[#91A0B8]">
                    Usuário desde {usuario.dataCadastro}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Abas */}
            <Tabs defaultValue="informacoes" className="gap-0">

              <TabsList className="h-12 w-full justify-start rounded-none border-b border-[#E8EDF4] bg-white px-6">
                <TabsTrigger
                  value="informacoes"
                  className="h-full rounded-none border-b-2 border-transparent px-4 text-[13px] text-[#7183A6] shadow-none data-[state=active]:border-[#E8E191] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
                >
                  Informações
                </TabsTrigger>

                <TabsTrigger
                  value="historico"
                  className="h-full rounded-none border-b-2 border-transparent px-4 text-[13px] text-[#7183A6] shadow-none data-[state=active]:border-[#E8E191] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
                >
                  Histórico de ações
                </TabsTrigger>
              </TabsList>

              {/* Informações */}
              <TabsContent
                value="informacoes"
                className="space-y-6 px-6 py-6"
              >
                <section>
                  <h3 className="mb-3 text-[15px] font-semibold text-[#101A40]">
                    Informações pessoais
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#FAFBFD] p-3">
                      <p className="text-[11px] text-[#8192B2]">
                        Nome completo
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-[#30466E]">
                        {usuario.nome}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#FAFBFD] p-3">
                      <p className="text-[11px] text-[#8192B2]">
                        Data de cadastro
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-[#30466E]">
                        {usuario.dataCadastro}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#FAFBFD] p-3 sm:col-span-2">
                      <p className="text-[11px] text-[#8192B2]">
                        E-mail
                      </p>
                      <p className="mt-1 break-all text-[13px] font-medium text-[#30466E]">
                        {usuario.email}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-[#E8EDF4]" />

                {/* Configurações da conta */}
                <section className="space-y-4">
                  <h3 className="text-[15px] font-semibold text-[#101A40]">
                    Configurações da conta
                  </h3>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#30466E]">
                      Permissões
                    </label>

                    <Select
                      value={permissao}
                      onValueChange={setPermissao}
                    >
                      <SelectTrigger className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-[13px] text-[#30466E] shadow-none">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Admin">
                          Administrador
                        </SelectItem>
                        <SelectItem value="Usuário">
                          Usuário
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#30466E]">
                      Status da conta
                    </label>

                    <Select
                      value={status}
                      onValueChange={setStatus}
                    >
                      <SelectTrigger className="h-10 w-full rounded-lg border-[#DFE6F0] bg-white text-[13px] text-[#30466E] shadow-none">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Ativo">
                          Ativo
                        </SelectItem>
                        <SelectItem value="Bloqueado">
                          Bloqueado
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <p className="text-[11px] text-[#8192B2]">
                      Usuários bloqueados não podem acessar o sistema.
                    </p>
                  </div>
                </section>

                {/* Botões */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#E8EDF4] pt-5 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={aoFechar}
                    className="h-11 flex-1 rounded-lg border-[#DFE6F0] bg-white text-[#30466E] shadow-none"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    onClick={salvarAlteracoes}
                    className="h-11 flex-1 rounded-lg bg-[#E8E191] font-semibold text-[#101A40] shadow-none hover:bg-[#DCD47B]"
                  >
                    Salvar alterações
                  </Button>
                </div>
              </TabsContent>

              {/* Histórico */}
              <TabsContent
                value="historico"
                className="px-6 py-8"
              >
                <h3 className="text-[15px] font-semibold text-[#101A40]">
                  Histórico de ações
                </h3>

                <p className="mt-2 text-[13px] leading-5 text-[#8192B2]">
                  Os registros das ações deste usuário aparecerão
                  aqui quando o sistema de auditoria estiver integrado.
                </p>
              </TabsContent>

            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
