"use client";

import { History } from "lucide-react";
import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { UserStatus } from "./tabelaUsuarios";

const control =
  "mt-2 h-11 w-full min-w-0 rounded-lg border border-wisen-borda bg-white px-3 text-sm text-[#30466E] outline-none hover:bg-wisen-admin-control-hover focus-visible:ring-2 focus-visible:ring-[#D7BF4D]/40";
export default function PainelUsuario({
  usuario,
  aberto,
  aoFechar,
  aoSalvar,
  aoHistorico,
  focoAoFechar,
  busy,
  demo,
}) {
  const [permissao, setPermissao] = useState("Usuário");
  const [status, setStatus] = useState("Ativo");
  const [limite, setLimite] = useState(30);
  useEffect(() => {
    if (usuario && aberto) {
      setPermissao(usuario.permissao);
      setStatus(usuario.status);
      setLimite(usuario.limite ?? 30);
    }
  }, [usuario, aberto]);
  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (!open && !busy) aoFechar();
      }}
    >
      <DialogContent data-wisen-area="admin" finalFocus={focoAoFechar}>
        {usuario && (
          <>
            <DialogHeader eyebrow="Conta de usuário">
              <DialogTitle>{usuario.nome}</DialogTitle>
              <DialogDescription className="break-all">{usuario.email}</DialogDescription>
            </DialogHeader>
            <DialogForm
              onSubmit={(event) => {
                event.preventDefault();
                aoSalvar(usuario.id, { permissao, status, limite: Number(limite) });
              }}
            >
              <DialogBody className="space-y-5">
                <div className="admin-dialog-panel flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#7182A1]">
                    Cadastrado em {usuario.dataCadastro}
                  </span>
                  <UserStatus status={usuario.status} />
                </div>
                <section
                  className="admin-dialog-panel space-y-4"
                  aria-label="Configurações de acesso"
                >
                  <h3 className="text-sm font-medium text-wisen-titulo">Configurações de acesso</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {demo || usuario.permissao !== "Admin" ? (
                      <label className="text-xs font-medium text-[#7182A1]">
                        Perfil
                        <select
                          aria-label="Perfil da conta"
                          value={permissao}
                          onChange={(event) => setPermissao(event.target.value)}
                          disabled={busy}
                          className={control}
                        >
                          <option value="Admin">Administrador</option>
                          <option value="Usuário">Usuário</option>
                        </select>
                      </label>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-[#7182A1]">Perfil</p>
                        <p className="mt-2 flex min-h-11 items-center text-sm text-[#30466E]">
                          {permissao === "Admin" ? "Administrador" : "Usuário"}
                        </p>
                      </div>
                    )}
                    <label className="text-xs font-medium text-[#7182A1]">
                      Acesso à plataforma
                      <select
                        aria-label="Acesso à plataforma"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className={control}
                      >
                        <option>Ativo</option>
                        <option>Bloqueado</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs font-medium text-[#7182A1]">
                    Limite diário de gerações
                    <input
                      aria-label="Limite diário de gerações"
                      type="number"
                      min={1}
                      max={10000}
                      required
                      value={limite}
                      onChange={(event) => setLimite(event.target.value)}
                      className={control}
                    />
                  </label>
                </section>
                {status === "Bloqueado" && (
                  <p className="rounded-lg border border-[#E8DDA4] bg-[#FBF7E5] p-3 text-sm leading-6 text-[#866D16]">
                    Bloquear impede o acesso à plataforma e encerra as sessões ativas desta conta.
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => aoHistorico(usuario)}
                  className="px-0 text-xs text-[#526584] hover:bg-wisen-admin-control-hover"
                >
                  <History className="size-4" />
                  Ver histórico desta conta
                </Button>
              </DialogBody>
              <DialogFooter>
                <Button type="submit" disabled={busy} className={dialogPrimaryAction}>
                  {busy ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </DialogForm>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
