"use client";

import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PersonalDataCard({
  name,
  email,
  onNameChange,
  onEmailChange,
  onSubmit,
  loading,
  saving,
  feedback,
}) {

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NB";

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-[#2B333F]">Dados pessoais</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Atualize suas informações de perfil.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="w-20 h-20 border border-slate-100">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop"
                  alt={name || "Avatar"}
                />
                <AvatarFallback className="bg-[#E8E191] text-[#2B333F] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-[#E8E191] hover:bg-[#d8d181] text-[#2B333F] rounded-full border-2 border-white shadow-xs transition-colors cursor-pointer"
                title="Alterar foto"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <label htmlFor="perfil-nome" className="text-xs font-medium text-[#2B333F]">
                  Nome
                </label>
                <Input
                  id="perfil-nome"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  disabled={loading || saving}
                  required
                  className="h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-[#E8E191] rounded-lg text-[#2B333F]"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="perfil-email" className="text-xs font-medium text-[#2B333F]">
                  E-mail
                </label>
                <Input
                  id="perfil-email"
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  disabled={loading || saving}
                  required
                  className="h-9 text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-[#E8E191] rounded-lg text-[#2B333F]"
                />
              </div>
            </div>
          </div>

          {feedback && (
            <div
              className={`text-xs p-2.5 rounded-lg pl-24 ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="pt-2 pl-24">
            <Button
              type="submit"
              disabled={loading || saving}
              className="bg-[#E8E191] hover:bg-[#d8d181] text-[#2B333F] font-semibold text-xs h-9 px-5 rounded-xl border-none shadow-none transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Salvando...
                </span>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}