"use client";

import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import CheckoutPlanos from "@/components/checkoutPlanos";
import { InitialInterestDialog } from "@/components/homeCliente/initialInterestDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginDestination } from "@/lib/auth";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";
import styles from "./authForm.module.css";
import FormularioRecuperacao from "./formularioRecuperacao";

export default function FormularioAuth({
  glass = false,
  initialAction = null,
  resetToken = "",
  initialOnboarding = false,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState(initialAction);
  const busy = useRef(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(
    initialOnboarding ? { role: "user" } : null,
  );
  const [onboardingReady, setOnboardingReady] = useState(initialOnboarding);
  const showOnboarding = authenticatedUser && (onboardingReady || mode === "register");
  const waiting = enviando || Boolean(authenticatedUser);
  const startOnboarding = useCallback(() => {
    const url = new URL("/onboarding", window.location.origin);
    const requestedPath = new URLSearchParams(window.location.search).get("next");
    if (requestedPath) url.searchParams.set("next", requestedPath);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    setOnboardingReady(true);
  }, []);
  const finishAuth = useCallback(() => {
    const requestedPath = new URLSearchParams(window.location.search).get("next");
    window.location.assign(
      loginDestination(requestedPath, window.location.origin, authenticatedUser.role),
    );
  }, [authenticatedUser]);
  const recovery = mode === "forgot" || mode === "reset";
  const recoveryTitle = mode === "reset" ? "Crie sua nova senha." : "Recupere seu acesso.";
  const choosing = mode === "choose";

  function showPasswordStep(nextMode) {
    setMode(nextMode);
    requestAnimationFrame(() => passwordRef.current?.focus());
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy.current || choosing) return;
    busy.current = true;
    setEnviando(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      if (mode === null) {
        const { exists } = await requisitar("/auth/check-email", {
          method: "POST",
          body: { email: normalizedEmail },
        });
        setEmail(normalizedEmail);
        if (exists) {
          showPasswordStep("login");
        } else {
          setMode("plans");
        }
        return;
      }
      const { user } = await requisitar(`/auth/${mode}`, {
        method: "POST",
        body: {
          email: normalizedEmail,
          password,
          ...(mode === "login" ? { remember: lembrar } : {}),
        },
      });
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      if (user.role === "admin") {
        window.location.assign(loginDestination(requestedPath, window.location.origin, user.role));
      } else if (mode === "login") {
        window.location.assign(loginDestination(requestedPath, window.location.origin, user.role));
      } else {
        setPassword("");
        setAuthenticatedUser(user);
      }
    } catch (error) {
      if (mode === "register" && error.status === 409) {
        setMode("login");
        setPassword("");
        toast.error("Este e-mail já está cadastrado. Entre com sua senha.");
        requestAnimationFrame(() => passwordRef.current?.focus());
      } else {
        toast.error(error.message || "Não foi possível continuar. Tente novamente.");
      }
    } finally {
      busy.current = false;
      setEnviando(false);
    }
  }

  return (
    <Card
      className={`w-full max-w-[450px] gap-0 rounded-2xl border-t-[3px] border-t-wisen-destaque py-0 ${
        glass
          ? `${styles.glass} ${showOnboarding ? styles.onboardingStep : mode !== null ? styles.passwordStep : ""}`
          : "border-0 bg-white shadow-[0_20px_60px_rgba(37,53,77,0.14)]"
      }`}
    >
      {glass && (
        <div className={styles.topbar}>
          <Link href="/" aria-label="Wisen, página inicial" className={styles.brand}>
            <Image src="/logoWisen-simbolo-transparente.png" alt="" width={48} height={48} />
            <span>Wisen</span>
          </Link>
          {!showOnboarding && (
            <Link href="/" aria-label="Fechar e voltar ao início" className={styles.close}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </Link>
          )}
        </div>
      )}
      {authenticatedUser && (
        <div hidden={!showOnboarding} className={styles.onboardingEntrance}>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-7">
            <InitialInterestDialog embedded onComplete={finishAuth} onReady={startOnboarding} />
          </CardContent>
        </div>
      )}
      {!showOnboarding && (
        <>
          <CardHeader className="space-y-1 px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
            <CardTitle
              id="login-title"
              className={`text-[32px] font-semibold tracking-tight ${glass ? "text-[#F2DF73]" : "text-wisen-texto-forte"}`}
            >
              {glass ? (
                <h1 className={`${styles.headline} ${mode !== null ? styles.stepHeadline : ""}`}>
                  {recovery ? (
                    recoveryTitle
                  ) : choosing ? (
                    "E-mail não encontrado."
                  ) : mode === "login" ? (
                    "Que bom te ver de novo."
                  ) : mode === "register" ? (
                    "Prazer em te conhecer."
                  ) : mode === "plans" ? (
                    "Escolha seu plano."
                  ) : (
                    <>
                      Seu próximo capítulo <span>começa aqui.</span>
                    </>
                  )}
                </h1>
              ) : recovery ? (
                recoveryTitle
              ) : choosing ? (
                "E-mail não encontrado."
              ) : mode === "login" ? (
                "Que bom te ver de novo."
              ) : mode === "register" ? (
                "Prazer em te conhecer."
              ) : mode === "plans" ? (
                "Escolha seu plano."
              ) : (
                "Entrar"
              )}
            </CardTitle>

            {mode === null && (
              <CardDescription>
                <span
                  className={`block text-sm leading-relaxed ${glass ? "text-white/75" : "text-[#71809C]"}`}
                >
                  {glass
                    ? "Entre ou crie sua conta usando seu e-mail."
                    : "Use seu e-mail para entrar ou criar sua conta."}
                </span>
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-7">
            {recovery ? (
              <FormularioRecuperacao
                key={mode}
                action={mode}
                token={resetToken}
                initialEmail={email}
                onBack={(nextMode) => {
                  setMode(nextMode);
                  setPassword("");
                  setMostrarSenha(false);
                  const url = new URL(window.location.href);
                  url.searchParams.delete("token");
                  url.searchParams.delete("action");
                  if (nextMode) url.searchParams.set("action", nextMode);
                  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
                }}
              />
            ) : (
              <form aria-labelledby="login-title" className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={`text-sm font-semibold ${glass ? (mode === null ? "sr-only" : styles.fieldLabel) : "text-[#344563]"}`}
                  >
                    E-mail
                  </Label>

                  <div className={`relative ${mode !== null ? styles.confirmedEmail : ""}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 ${glass ? "text-[#A6B5CC]" : "text-[#9AA7BC]"}`}
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>

                    <Input
                      id="email"
                      name="email"
                      ref={emailRef}
                      readOnly={mode !== null}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setMode(null);
                        setPassword("");
                        setMostrarSenha(false);
                      }}
                      type="email"
                      placeholder={glass ? "voce@exemplo.com" : "seu@email.com"}
                      autoComplete="username"
                      required
                      disabled={enviando}
                      className={`h-11 rounded-lg pl-10 text-base focus-visible:border-[#D6B947] focus-visible:ring-2 focus-visible:ring-[#EEDC84]/40 ${glass ? `${styles.darkInput} border-white/20 bg-[#25354E] text-[#F4F6FA] placeholder:text-[#A6B5CC]` : "border-[#D9E1ED] bg-white text-wisen-texto-forte placeholder:text-[#71809C]"}`}
                    />
                    {mode !== null && (
                      <button
                        type="button"
                        className={styles.changeEmail}
                        disabled={enviando}
                        onClick={() => {
                          setMode(null);
                          setPassword("");
                          setMostrarSenha(false);
                          setLembrar(false);
                          requestAnimationFrame(() => {
                            emailRef.current?.focus();
                            emailRef.current?.select();
                          });
                        }}
                      >
                        trocar
                      </button>
                    )}
                  </div>
                </div>

                {mode === "plans" && <CheckoutPlanos />}

                {choosing && (
                  <div className="grid gap-2">
                    <Button type="button" onClick={() => showPasswordStep("login")}>
                      Já tenho conta
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => showPasswordStep("register")}
                    >
                      Quero criar uma conta
                    </Button>
                  </div>
                )}

                {(mode === "login" || mode === "register") && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="senha"
                        className={`text-sm font-semibold ${glass ? styles.fieldLabel : "text-[#344563]"}`}
                      >
                        Senha
                      </Label>

                      <div className="relative">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          aria-hidden="true"
                          className={`pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 ${glass ? "text-[#A6B5CC]" : "text-[#9AA7BC]"}`}
                        >
                          <rect x="5" y="10" width="14" height="11" rx="2" />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>

                        <Input
                          id="senha"
                          name="password"
                          type={mostrarSenha ? "text" : "password"}
                          placeholder="Sua senha"
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          ref={passwordRef}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          minLength={mode === "register" ? 8 : undefined}
                          maxLength={128}
                          aria-describedby={mode === "register" ? "password-hint" : undefined}
                          required
                          disabled={enviando}
                          className={`h-11 rounded-lg pr-12 pl-10 text-base focus-visible:border-[#D6B947] focus-visible:ring-2 focus-visible:ring-[#EEDC84]/40 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${glass ? `${styles.darkInput} border-white/20 bg-[#25354E] text-[#F4F6FA] placeholder:text-[#A6B5CC]` : "border-[#D9E1ED] bg-white text-wisen-texto-forte placeholder:text-[#71809C]"}`}
                        />

                        <button
                          type="button"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                          aria-pressed={mostrarSenha}
                          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                          className={`absolute top-1/2 right-3.5 -translate-y-1/2 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B947] ${glass ? "text-[#A6B5CC] hover:text-white" : "text-[#98A5BB] hover:text-wisen-texto-forte"}`}
                        >
                          {mostrarSenha ? (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              aria-hidden="true"
                              className="h-4 w-4"
                            >
                              <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                              <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c5 0 9 7 9 7a15 15 0 0 1-3.1 3.5M6.1 6.1C3.8 7.6 3 12 3 12s4 7 9 7a9.6 9.6 0 0 0 4-.9" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              aria-hidden="true"
                              className="h-4 w-4"
                            >
                              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {mode === "register" && (
                      <p
                        id="password-hint"
                        className={glass ? "text-xs text-white/75" : "text-xs text-[#71809C]"}
                      >
                        Use pelo menos 8 caracteres.
                      </p>
                    )}
                    {mode === "login" && (
                      <div className={styles.loginOptions}>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="lembrar"
                            name="remember"
                            value="true"
                            checked={lembrar}
                            onCheckedChange={(checked) => setLembrar(Boolean(checked))}
                            className="border-[#F2DF73] bg-transparent text-[#F2DF73] data-unchecked:border-[#F2DF73] data-unchecked:bg-transparent focus-visible:border-[#F2DF73] group-has-[:focus-visible]/field-label:not-data-checked:border-[#F2DF73] data-checked:border-[#F2DF73] data-checked:bg-transparent data-checked:text-[#F2DF73]"
                          />
                          <Label
                            htmlFor="lembrar"
                            className={`cursor-pointer text-sm font-normal ${glass ? "text-white/85" : "text-[#71809C]"}`}
                          >
                            Lembrar de mim
                          </Label>
                        </div>
                        <button
                          type="button"
                          className={styles.forgotPassword}
                          disabled={enviando}
                          onClick={() => {
                            setPassword("");
                            setMostrarSenha(false);
                            setMode("forgot");
                          }}
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                    )}
                  </>
                )}

                {!choosing && mode !== "plans" && (
                  <Button
                    type="submit"
                    disabled={waiting}
                    className="mt-1 h-11 w-full rounded-md bg-[#F3E69A] font-semibold text-[#273651] shadow-none transition-colors hover:bg-[#EBDD80]"
                  >
                    {waiting
                      ? "Aguarde…"
                      : mode === null
                        ? "Continuar"
                        : mode === "login"
                          ? "Entrar"
                          : "Criar conta"}
                    {waiting ? (
                      <LoaderCircle aria-hidden="true" className="ml-2 motion-safe:animate-spin" />
                    ) : (
                      <span aria-hidden="true" className="ml-2 text-lg">
                        {glass ? "↗" : "→"}
                      </span>
                    )}
                  </Button>
                )}
              </form>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
