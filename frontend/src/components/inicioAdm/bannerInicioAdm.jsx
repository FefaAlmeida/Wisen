import Image from "next/image";

export function BannerInicioAdm() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-r from-[#181F2A] via-[#2B333F] to-[#181F2A] p-8 text-white shadow-xl md:p-10">
      {/* Imagem de Fundo (Globo) */}
      <div className="pointer-events-none absolute top-0 right-0 hidden h-full w-1/2 md:block">
        <Image
          src="/foto_paginaInicialCliente.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 35vw"
          className="object-contain object-right"
        />
      </div>

      <div className="relative z-10 space-y-2 max-w-xl">
        <span className="text-[11px] font-semibold tracking-widest text-[#EBDD80] uppercase">
          PAINEL ADMINISTRATIVO
        </span>
        <h1 className="text-[36px] leading-[1.05] font-medium tracking-tight md:text-[44px]">
          Visão completa do <span className="text-[#EBDD80]">Wisen.</span>
        </h1>
        <p className="max-w-[470px] text-[15px] leading-6 text-slate-300">
          Acompanhe o desempenho dos usuários, gerencie conteúdos e monitore os principais temas do
          momento.
        </p>
      </div>
    </div>
  );
}
