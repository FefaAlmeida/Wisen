"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requisitar } from "@/services/api";

export default function FormularioLogin({ glass = false }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);
    const form = new FormData(event.currentTarget);
    try {
      await requisitar("/auth/login", {
        method: "POST",
        body: {
          email: form.get("email"),
          password: form.get("password"),
          remember: lembrar,
        },
      });
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const destination = requestedPath ? new URL(requestedPath, window.location.origin) : null;
      window.location.assign(
        destination?.origin === window.location.origin
          ? `${destination.pathname}${destination.search}${destination.hash}`
          : "/paginaInicialCliente",
      );
    } catch (error) {
      setErro(error.message || "Não foi possível entrar. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <Card
      className={`w-full max-w-[450px] gap-0 rounded-2xl border-t-[3px] border-t-wisen-destaque py-0 ${
        glass
          ? "border border-white/25 bg-[#17243A]/75 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_24px_80px_rgba(8,20,38,0.42)] backdrop-blur-2xl backdrop-saturate-150"
          : "border-0 bg-white shadow-[0_20px_60px_rgba(37,53,77,0.14)]"
      }`}
    >
      <CardHeader className="space-y-1 px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-7 lg:px-12">
        <CardTitle
          id="login-title"
          className={`text-[32px] font-semibold tracking-tight ${glass ? "text-white" : "text-wisen-texto-forte"}`}
        >
          Entrar
        </CardTitle>

        <CardDescription className="space-y-1">
          <span
            className={`block text-sm font-medium ${glass ? "text-white/90" : "text-[#71809C]"}`}
          >
            Bem-vindo de volta ao Wisen.
          </span>
          <span
            className={`block text-xs leading-relaxed ${glass ? "text-white/75" : "text-[#8995AA]"}`}
          >
            Acesse sua conta para continuar explorando notícias, análises e aprendizado
            personalizado.
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8 sm:px-10 sm:pb-10 lg:px-12">
        <form aria-labelledby="login-title" className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={`text-xs font-semibold ${glass ? "text-white/90" : "text-[#344563]"}`}
            >
              E-mail
            </Label>

            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
                className={`absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 ${glass ? "text-[#52647D]" : "text-[#9AA7BC]"}`}
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="username"
                required
                disabled={enviando}
                className={`h-11 rounded-lg border-[#D9E1ED] pl-10 text-sm text-wisen-texto-forte placeholder:text-[#71809C] focus-visible:border-[#D6B947] focus-visible:ring-2 focus-visible:ring-[#EEDC84]/70 ${glass ? "bg-[#F1F5FC] text-[#17243A]" : "bg-white"}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="senha"
              className={`text-xs font-semibold ${glass ? "text-white/90" : "text-[#344563]"}`}
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
                className={`absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 ${glass ? "text-[#52647D]" : "text-[#9AA7BC]"}`}
              >
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>

              <Input
                id="senha"
                name="password"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Sua senha"
                autoComplete="current-password"
                required
                disabled={enviando}
                className={`h-11 rounded-lg border-[#D9E1ED] pr-12 pl-10 text-sm text-wisen-texto-forte placeholder:text-[#71809C] focus-visible:border-[#D6B947] focus-visible:ring-2 focus-visible:ring-[#EEDC84]/70 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${glass ? "bg-[#F1F5FC] text-[#17243A]" : "bg-white"}`}
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-pressed={mostrarSenha}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className={`absolute top-1/2 right-3.5 -translate-y-1/2 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B947] hover:text-wisen-texto-forte ${glass ? "text-[#52647D]" : "text-[#98A5BB]"}`}
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="lembrar"
                name="remember"
                value="true"
                checked={lembrar}
                onCheckedChange={(checked) => setLembrar(Boolean(checked))}
                className="border-[#E4D57E] bg-[#F4E69B] text-wisen-texto-forte data-[state=checked]:border-[#E4D57E] data-[state=checked]:bg-[#F4E69B]"
              />
              <Label
                htmlFor="lembrar"
                className={`cursor-pointer text-xs font-normal ${glass ? "text-white/85" : "text-[#71809C]"}`}
              >
                Lembrar de mim
              </Label>
            </div>
          </div>

          {erro && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {erro}
            </p>
          )}

          <Button
            type="submit"
            disabled={enviando}
            className="mt-1 h-11 w-full rounded-md bg-[#F3E69A] font-semibold text-[#273651] shadow-none transition-colors hover:bg-[#EBDD80]"
          >
            {enviando ? "Entrando…" : "Entrar"}
            <span aria-hidden="true" className="ml-2 text-lg">
              →
            </span>
          </Button>
        </form>

        <div className="mt-7 flex items-center gap-3">
          <div className={`h-px flex-1 ${glass ? "bg-white/30" : "bg-[#E4E9F1]"}`} />
          <span className={`text-xs ${glass ? "text-white/70" : "text-[#9BA7B9]"}`}>ou</span>
          <div className={`h-px flex-1 ${glass ? "bg-white/30" : "bg-[#E4E9F1]"}`} />
        </div>

        <p className={`mt-6 text-center text-xs ${glass ? "text-white/80" : "text-[#8390A7]"}`}>
          Ainda não tem conta?{" "}
          <Link
            href="/paginaCadastro"
            className={`rounded-sm font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2DF83] ${glass ? "text-[#F2DF83]" : "text-[#30456D]"}`}
          >
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
