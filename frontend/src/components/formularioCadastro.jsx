
"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormularioCadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <Card className="w-full max-w-[450px] gap-0 rounded-lg border-0 bg-white py-0 shadow-[0_12px_45px_rgba(37,53,77,0.09)]">
      <CardHeader className="space-y-1 px-8 pt-10 pb-6 sm:px-12">
        <CardTitle className="text-[32px] font-semibold tracking-tight text-[#253452]">
          Criar conta
        </CardTitle>

        <CardDescription className="space-y-1">
          <span className="block text-sm font-medium text-[#71809C]">
            Bem-vindo ao Wisen.
          </span>

          <span className="block text-xs leading-relaxed text-[#8995AA]">
            Crie sua conta para explorar notícias, análises e
            construir seu conhecimento.
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-10 sm:px-12">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="space-y-2">
            <Label
              htmlFor="nome"
              className="text-xs font-semibold text-[#344563]"
            >
              Nome completo
            </Label>

            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              autoComplete="name"
              required
              className="h-11 rounded-md border-[#D9E1ED] bg-white px-3 text-sm text-[#253452] placeholder:text-[#A7B2C3] focus-visible:ring-[#EEDC84]"
            />
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <Label
              htmlFor="emailCadastro"
              className="text-xs font-semibold text-[#344563]"
            >
              E-mail
            </Label>

            <Input
              id="emailCadastro"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
              className="h-11 rounded-md border-[#D9E1ED] bg-white px-3 text-sm text-[#253452] placeholder:text-[#A7B2C3] focus-visible:ring-[#EEDC84]"
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label
              htmlFor="senhaCadastro"
              className="text-xs font-semibold text-[#344563]"
            >
              Senha
            </Label>

            <div className="relative">
              <Input
                id="senhaCadastro"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Crie uma senha"
                autoComplete="new-password"
                required
                className="h-11 rounded-md border-[#D9E1ED] bg-white pr-20 pl-3 text-sm text-[#253452] placeholder:text-[#A7B2C3] focus-visible:ring-[#EEDC84] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
            />

              <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#98A5BB] transition-colors hover:text-[#253452]"
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

          <Button
            type="submit"
            className="mt-2 h-11 w-full rounded-md bg-[#F3E69A] font-semibold text-[#273651] shadow-none hover:bg-[#EBDD80]"
          >
            Criar conta
            <span aria-hidden="true" className="ml-2 text-lg">
              →
            </span>
          </Button>
        </form>

        <div className="mt-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E4E9F1]" />
          <span className="text-xs text-[#9BA7B9]">ou</span>
          <div className="h-px flex-1 bg-[#E4E9F1]" />
        </div>

        <p className="mt-6 text-center text-xs text-[#8390A7]">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#30456D] underline underline-offset-2"
          >
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
