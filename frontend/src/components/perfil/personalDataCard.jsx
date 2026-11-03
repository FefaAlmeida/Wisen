"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PersonalDataCard({
  name,
  email,
  avatarDataUrl,
  onAvatarUpload,
  onNameChange,
  onEmailChange,
  onSubmit,
  loading,
  saving,
  feedback,
}) {
  const photoInput = useRef(null);
  const [photoError, setPhotoError] = useState("");

  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toLocaleUpperCase("pt-BR") || "?";

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoError("");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Escolha um arquivo de imagem.");
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 10 MB.");
      }

      const image = await createImageBitmap(file);
      const scale = Math.min(1, 384 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Não foi possível processar a imagem.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
      if (!blob) throw new Error("Não foi possível processar a imagem.");

      const photoDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
        reader.readAsDataURL(blob);
      });
      if (photoDataUrl.length > 800_000) {
        throw new Error("A imagem ficou muito grande. Escolha outra foto.");
      }
      await onAvatarUpload(photoDataUrl);
    } catch (error) {
      setPhotoError(error.message || "Não foi possível atualizar a foto.");
    }
  }

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
                <AvatarImage src={avatarDataUrl || undefined} alt={name || "Foto de perfil"} />
                <AvatarFallback className="bg-[#E8E191] text-[#2B333F] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                disabled={loading || saving}
                aria-label="Escolher foto de perfil"
                className="absolute bottom-0 right-0 p-1.5 bg-[#E8E191] hover:bg-[#d8d181] text-[#2B333F] rounded-full border-2 border-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Alterar foto"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
                tabIndex={-1}
              />
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

          {photoError && (
            <p role="alert" className="pl-24 text-xs text-red-600">
              {photoError}
            </p>
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