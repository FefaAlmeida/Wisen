import Image from "next/image";

export function BannerInicioAdm() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#E3E9F1] bg-gradient-to-r from-white via-[#F8FAFD] to-[#EAF0F7] p-8 text-wisen-titulo shadow-sm md:p-10">
      <div className="pointer-events-none absolute -top-[15%] right-0 hidden h-[130%] w-[60%] md:block">
        <Image
          src="/foto_paginaInicialCliente-v1.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 35vw"
          className="object-contain object-right"
        />
      </div>

      <div className="relative z-10 space-y-2 max-w-xl">
        <div className="mb-3 flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#D7BF4D]" />
          <span className="text-[11px] font-semibold tracking-widest text-[#9A7E14] uppercase">
            PAINEL ADMINISTRATIVO
          </span>
        </div>
        <h1 className="text-[36px] leading-[1.05] font-medium tracking-tight text-wisen-titulo md:text-[44px]">
          Visão completa do <span className="text-[#D6B92F]">Wisen.</span>
        </h1>
        <p className="max-w-[470px] text-[15px] leading-6 text-[#7182A1]">
          Acompanhe o desempenho dos usuários, gerencie conteúdos e monitore os principais temas do
          momento.
        </p>
      </div>
    </div>
  );
}
