"use client";

import { ChevronRight, Lock, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { requisitar } from "@/services/api";

export function SecurityCard() {
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setLogoutError("");
    try {
      await requisitar("/auth/logout", { method: "POST" });
      window.location.assign("/paginaLogin");
    } catch {
      setLogoutError("Não foi possível encerrar a sessão. Tente novamente.");
      setSigningOut(false);
    }
  }

  function handleDialogChange(open) {
    setDialogOpen(open);
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setFeedback(null);
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "A confirmação não corresponde à nova senha." });
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
      setFeedback({ type: "success", text: data.message || "Senha alterada com sucesso." });
      handleDialogChange(false);
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "Não foi possível alterar a senha." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-[#2B333F]">Segurança da conta</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Gerencie sua senha e sessão.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Opção 1 */}
        <button
          type="button"
          onClick={() => {
            setFeedback(null);
            setDialogOpen(true);
          }}
          aria-haspopup="dialog"
          className="w-full flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E8E191] rounded-full text-[#2B333F] shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#2B333F] group-hover:opacity-80 transition-opacity">
                Alterar senha
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Atualize sua senha para manter sua conta segura.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B333F] transition-colors" />
        </button>

        {feedback?.type === "success" && (
          <p role="status" className="text-xs text-green-700">
            {feedback.text}
          </p>
        )}

        <div className="border-t border-slate-100" />

        {/* Opção 2 */}
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="w-full flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E8E191] rounded-full text-[#2B333F] shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-[#2B333F] group-hover:opacity-80 transition-opacity">
                {signingOut ? "Encerrando…" : "Encerrar sessão"}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                Desconecte sua conta deste dispositivo.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B333F] transition-colors" />
        </button>
        {logoutError && (
          <p role="alert" className="text-xs text-red-600">
            {logoutError}
          </p>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <form onSubmit={changePassword} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Alterar senha</DialogTitle>
              <DialogDescription>
                Informe sua senha atual e escolha uma nova senha com pelo menos 8 caracteres.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="senha-atual" className="text-xs font-medium text-[#2B333F]">
                  Senha atual
                </label>
                <Input
                  id="senha-atual"
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="senha-nova" className="text-xs font-medium text-[#2B333F]">
                  Nova senha
                </label>
                <Input
                  id="senha-nova"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmar-senha" className="text-xs font-medium text-[#2B333F]">
                  Confirmar nova senha
                </label>
                <Input
                  id="confirmar-senha"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            {feedback?.type === "error" && (
              <p role="alert" className="text-xs text-red-600">
                {feedback.text}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#E8E191] text-[#2B333F] hover:bg-[#d8d181]"
              >
                {saving ? "Salvando..." : "Salvar senha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
