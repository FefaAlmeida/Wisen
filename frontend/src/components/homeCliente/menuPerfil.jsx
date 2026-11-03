
"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import { requisitar } from "@/services/api";

export default function MenuPerfil() {
  const [aberto, setAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  async function sair() {
    if (saindo) return;

    setSaindo(true);
    setErro("");

    try {
      await requisitar("/auth/logout", {
        method: "POST",
      });

      window.location.assign("/paginaLogin");
    } catch (error) {
      console.error("Erro ao sair:", error);
      setErro("Não foi possível sair da conta.");
      setSaindo(false);
    }
  }

  return (
    <div className="relative z-50 shrink-0">
      <button
        type="button"
        onClick={() => setAberto((atual) => !atual)}
        aria-label="Abrir menu do perfil"
        aria-expanded={aberto}
        className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#F3E69A] text-[11px] font-semibold text-[#263551] shadow-sm hover:bg-[#EBDD80]"
      >
        NB
      </button>

      {aberto && (
        <div className="absolute right-0 top-12 z-[100] w-56 rounded-lg border border-[#E1E6EE] bg-white p-2 shadow-xl">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-[#101A40]">
              Minha conta
            </p>
            <p className="text-xs text-[#71809C]">
              Gerencie seu perfil
            </p>
          </div>

          <div className="my-2 h-px bg-[#EEF0F4]" />

          <Link
            href="/paginaPerfil"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#30466E] hover:bg-[#F1F3F6]"
          >
            <UserRound size={16} />
            Meu perfil
          </Link>

          

          <div className="my-2 h-px bg-[#EEF0F4]" />

          <button
            type="button"
            onClick={sair}
            disabled={saindo}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut size={16} />
            {saindo ? "Saindo..." : "Sair da conta"}
          </button>

          {erro && (
            <p role="alert" className="px-3 py-2 text-xs text-red-600">
              {erro}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
