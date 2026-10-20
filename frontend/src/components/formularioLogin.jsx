
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


export default function FormularioLogin() {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <Card className="w-full max-w-[450px] gap-0 rounded-xl border-0 bg-white py-0 shadow-[0_12px_45px_rgba(37,53,77,0.09)]">
            <CardHeader className="space-y-1 px-8 pt-11 pb-7 sm:px-12">
                <CardTitle className="text-[32px] font-semibold tracking-tight text-[#253452]">
                    Entrar
                </CardTitle>

                <CardDescription className="space-y-1">
                    <span className="block text-sm font-medium text-[#71809C]">
                        Bem-vindo de volta ao Wisen.
                    </span>
                    <span className="block text-xs leading-relaxed text-[#8995AA]">
                        Acesse sua conta para continuar explorando notícias,
                        análises e aprendizado personalizado.
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-11 sm:px-12">
                <form
                    className="space-y-5"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-xs font-semibold text-[#344563]"
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
                                className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9AA7BC]"
                            >
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m3 7 9 6 9-6" />
                            </svg>

                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                autoComplete="email"
                                className="h-11 rounded-md border-[#D9E1ED] bg-white pl-10 text-sm text-[#253452] placeholder:text-[#A7B2C3] focus-visible:ring-[#EEDC84]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="senha"
                            className="text-xs font-semibold text-[#344563]"
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
                                className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9AA7BC]"
                            >
                                <rect x="5" y="10" width="14" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>

                            
                          <Input
                            id="senha"
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            className="h-11 rounded-md border-[#D9E1ED] bg-white pr-12 pl-10 text-sm text-[#253452] placeholder:text-[#A7B2C3] focus-visible:ring-[#EEDC84] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
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

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="lembrar"
                                defaultChecked
                                className="border-[#E4D57E] bg-[#F4E69B] text-[#253452] data-[state=checked]:border-[#E4D57E] data-[state=checked]:bg-[#F4E69B]"
                            />
                            <Label
                                htmlFor="lembrar"
                                className="cursor-pointer text-xs font-normal text-[#71809C]"
                            >
                                Lembrar de mim
                            </Label>
                        </div>

                        <Link
                            href="/recuperarSenha"
                            className="text-xs font-medium text-[#30456D] underline underline-offset-2"
                        >
                            Esqueci minha senha
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 h-11 w-full rounded-md bg-[#F3E69A] font-semibold text-[#273651] shadow-none transition-colors hover:bg-[#EBDD80]"
                    >
                        Entrar
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
                    Ainda não tem conta?{" "}
                    <Link
                        href="/cadastro"
                        className="font-semibold text-[#30456D] underline underline-offset-2"
                    >
                        Criar conta
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
