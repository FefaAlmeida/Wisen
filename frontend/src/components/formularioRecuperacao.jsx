"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requisitar } from "@/services/api";
import styles from "./authForm.module.css";

export default function FormularioRecuperacao({ action, token, initialEmail, onBack }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [invalidLink, setInvalidLink] = useState(false);
  const reset = action === "reset";
  const missingToken = reset && !/^[A-Za-z0-9_-]{32,100}$/.test(token);

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    if (reset && password !== confirmation) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      await requisitar(`/account/${reset ? "reset" : "forgot"}`, {
        method: "POST",
        body: reset ? { token, password } : { email: email.trim().toLowerCase() },
      });
      setPassword("");
      setConfirmation("");
      setDone(true);
      if (reset) {
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState(null, "", `${url.pathname}${url.search}`);
      }
    } catch (err) {
      if (reset && err.status === 400) setInvalidLink(true);
      else setError(err.message || "Não foi possível continuar. Tente novamente.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <div className={styles.recovery}>
      {done ? (
        <p role="status" className={styles.recoveryMessage}>
          {reset
            ? "Senha redefinida. Entre com sua nova senha."
            : "Se a conta existir, enviaremos um link para redefinir a senha. Confira também a caixa de spam. O link é válido por 30 minutos."}
        </p>
      ) : missingToken || invalidLink ? (
        <>
          <p role="alert" className={styles.recoveryMessage}>
            Este link é inválido, expirou ou já foi usado. Solicite um novo link para continuar.
          </p>
          <Button type="button" onClick={() => onBack("forgot")}>
            Solicitar novo link
          </Button>
        </>
      ) : (
        <form aria-labelledby="login-title" onSubmit={submit}>
          <p className={styles.recoveryMessage}>
            {reset
              ? "Escolha uma nova senha para sua conta."
              : "Informe seu e-mail e enviaremos um link para você criar uma nova senha."}
          </p>
          {reset ? (
            <>
              <div>
                <Label htmlFor="new-password" className={styles.fieldLabel}>
                  Nova senha
                </Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  disabled={busy}
                  aria-describedby="reset-hint"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className={styles.fieldLabel}>
                  Confirmar nova senha
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  disabled={busy}
                />
              </div>
              <p id="reset-hint" className={styles.recoveryMessage}>
                Use pelo menos 8 caracteres.
              </p>
            </>
          ) : (
            <div>
              <Label htmlFor="recovery-email" className={styles.fieldLabel}>
                E-mail
              </Label>
              <Input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={busy}
              />
            </div>
          )}
          {error && (
            <p role="alert" className={styles.recoveryMessage}>
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? "Aguarde…" : reset ? "Salvar nova senha" : "Enviar link de recuperação"}
            <span aria-hidden="true">↗</span>
          </Button>
        </form>
      )}
      <button
        type="button"
        className={styles.backToLogin}
        disabled={busy}
        onClick={() => onBack(null)}
      >
        Voltar para entrar
      </button>
    </div>
  );
}
