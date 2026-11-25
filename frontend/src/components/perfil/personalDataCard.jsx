"use client";

import { Camera, Loader2, Mail, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ProfileSection,
  profileInput,
  profileInputIcon,
  profileSaveAction,
} from "./profileSection";

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
    <ProfileSection
      icon={UserRound}
      title="Dados pessoais"
      description="Suas informações e sua identidade no Wisen."
    >
      <form onSubmit={onSubmit} aria-label="Dados pessoais" className="space-y-5">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-wisen-borda/70 bg-wisen-superficie/60 p-4">
          <div className="relative shrink-0">
            <Avatar className="size-16 border-4 border-white shadow-sm sm:size-20">
              <AvatarImage src={avatarDataUrl || undefined} alt={name || "Foto de perfil"} />
              <AvatarFallback className="bg-[#E8EFFA] text-xl font-semibold text-wisen-titulo">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => photoInput.current?.click()}
              disabled={loading || saving}
              aria-label="Escolher foto de perfil"
              className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-wisen-destaque-suave text-wisen-titulo shadow-xs transition-colors hover:bg-wisen-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo disabled:opacity-50"
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

          <div className="min-w-0 flex-1 basis-32">
            <p className="text-sm font-semibold text-wisen-titulo">Sua foto de perfil</p>
            <p className="mt-1 text-xs leading-relaxed text-wisen-texto-suave">
              Toque na câmera para escolher uma imagem de até 10 MB.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="perfil-nome" className="font-semibold text-wisen-texto-forte">
              Nome
            </Label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className={`${profileInputIcon} text-wisen-texto-suave`}
              />
              <Input
                id="perfil-nome"
                name="name"
                autoComplete="name"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                disabled={loading || saving}
                required
                minLength={2}
                maxLength={120}
                className={profileInput}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="perfil-email" className="font-semibold text-wisen-texto-forte">
              E-mail
            </Label>
            <div className="relative">
              <Mail aria-hidden="true" className={`${profileInputIcon} text-wisen-texto-suave`} />
              <Input
                id="perfil-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={loading || saving}
                required
                className={profileInput}
              />
            </div>
          </div>
        </div>

        {photoError && (
          <p role="alert" className="text-xs text-red-600">
            {photoError}
          </p>
        )}

        <div className="flex justify-end border-t border-wisen-borda/70 pt-4">
          <Button
            type="submit"
            disabled={loading || saving}
            className={profileSaveAction}
            data-wisen-hover="preserve"
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
    </ProfileSection>
  );
}
