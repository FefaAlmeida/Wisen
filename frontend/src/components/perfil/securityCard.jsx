"use client";

import { ChevronRight, Eye, EyeOff, Lock, LogOut, ShieldCheck, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";
import styles from "../authForm.module.css";
import { ProfileSection, profileInputIcon } from "./profileSection";

const securityAction =
  "group flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
const defaultSecurityAction = `${securityAction} border-wisen-borda/70 hover:bg-wisen-superficie focus-visible:outline-wisen-titulo`;

export function SecurityCard({ admin = false, showDeleteAccount = false }) {
  const [signingOut, setSigningOut] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [canDeleteAccount, setCanDeleteAccount] = useState(null);

  useEffect(() => {
    if (!admin) return;
    const controller = new AbortController();
    requisitar("/account/status", { signal: controller.signal })
      .then(({ user }) => {
        if (!controller.signal.aborted) setCanDeleteAccount(user.can_delete_account);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          toast.error("Não foi possível verificar se a conta pode ser excluída.");
      });
    return () => controller.abort();
  }, [admin]);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await requisitar("/auth/logout", { method: "POST" });
      window.location.assign("/auth");
    } catch {
      toast.error("Não foi possível encerrar a sessão. Tente novamente.");
      setSigningOut(false);
    }
  }

  function handleDialogChange(open) {
    setDialogOpen(open);
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setVisiblePassword(null);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setValidationError("");
    if (newPassword !== confirmPassword) {
      setValidationError("A confirmação não corresponde à nova senha.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }
      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.map((item) => item.message || item).join(", ")
          : data.message || data.error || `Erro HTTP ${response.status}`;
        throw new Error(message);
      }
      toast.success(data.message || "Senha alterada com sucesso.");
      handleDialogChange(false);
    } catch (error) {
      toast.error(error.message || "Não foi possível alterar a senha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProfileSection
      icon={ShieldCheck}
      title="Segurança da conta"
      description="Cuide do acesso à sua conta."
    >
      <div className="space-y-4">
        {/* Opção 1 */}
        <button
          type="button"
          onClick={() => {
            setValidationError("");
            setDialogOpen(true);
          }}
          aria-haspopup="dialog"
          className={defaultSecurityAction}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wisen-superficie text-wisen-texto-suave">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-wisen-titulo transition-opacity group-hover:opacity-80">
              Alterar senha
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B333F] transition-colors" />
        </button>

        {/* Opção 2 */}
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className={defaultSecurityAction}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wisen-superficie text-wisen-texto-suave">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-wisen-titulo transition-opacity group-hover:opacity-80">
              {signingOut ? "Encerrando…" : "Encerrar sessão"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B333F] transition-colors" />
        </button>

        {admin && canDeleteAccount === false && (
          <p className="text-sm text-wisen-texto-suave">
            Para excluir sua conta, é preciso ter outro administrador ativo.
          </p>
        )}
        {(admin ? canDeleteAccount === true : showDeleteAccount) && (
          <button
            type="button"
            onClick={() => window.location.assign("/conta?action=delete")}
            className={`${securityAction} cursor-pointer border-transparent bg-red-100 text-wisen-titulo hover:border-red-700 hover:bg-wisen-card hover:text-red-700 focus-visible:outline-red-700`}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center">
                <Trash2
                  aria-hidden="true"
                  className="size-4 transition-colors group-hover:text-red-700"
                />
              </div>
              <span className="text-sm font-medium transition-colors group-hover:text-red-700">
                Excluir minha conta
              </span>
            </div>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
          </button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent
          className={styles.authDialog}
          size="sm"
          data-wisen-area={admin ? "admin" : undefined}
        >
          <DialogHeader eyebrow={null} className="pr-14 pb-1">
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>
              Informe sua senha atual e escolha uma nova senha com pelo menos 8 caracteres.
            </DialogDescription>
          </DialogHeader>
          <DialogForm onSubmit={changePassword}>
            <DialogBody className="space-y-5">
              {[
                [
                  "senha-atual",
                  "Senha atual",
                  "current-password",
                  currentPassword,
                  setCurrentPassword,
                ],
                ["senha-nova", "Nova senha", "new-password", newPassword, setNewPassword],
                [
                  "confirmar-senha",
                  "Confirmar nova senha",
                  "new-password",
                  confirmPassword,
                  setConfirmPassword,
                ],
              ].map(([id, label, autoComplete, value, setValue]) => {
                const visible = visiblePassword === id;
                const VisibilityIcon = visible ? EyeOff : Eye;
                return (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <div className="relative">
                      <Lock aria-hidden="true" className={`${profileInputIcon} text-[#B0BED1]`} />
                      <Input
                        id={id}
                        name={id}
                        type={visible ? "text" : "password"}
                        autoComplete={autoComplete}
                        minLength={8}
                        maxLength={128}
                        required
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        disabled={saving}
                        className={`${styles.dialogInput} ${styles.darkInput} [&::-ms-reveal]:hidden`}
                      />
                      <button
                        type="button"
                        aria-label={visible ? `Ocultar: ${label}` : `Mostrar: ${label}`}
                        aria-pressed={visible}
                        disabled={saving}
                        onClick={() => setVisiblePassword(visible ? null : id)}
                        className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#B0BED1] hover:text-white focus-visible:outline-2 focus-visible:outline-[#F2DF73]"
                      >
                        <VisibilityIcon aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {validationError && (
                <p role="alert" className="rounded-md bg-red-950/55 px-3 py-2 text-sm text-red-200">
                  {validationError}
                </p>
              )}
            </DialogBody>
            <DialogFooter className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <Button
                type="button"
                variant="outline"
                className={`h-11 min-w-0 rounded-[10px] ${styles.dialogSecondaryAction}`}
                onClick={() => handleDialogChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className={`h-11 min-w-0 rounded-[10px] ${styles.dialogPrimaryAction}`}
              >
                {saving ? "Salvando..." : "Salvar senha"}
              </Button>
            </DialogFooter>
          </DialogForm>
        </DialogContent>
      </Dialog>
    </ProfileSection>
  );
}
