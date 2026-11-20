import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/adminPageHeader";

export function BannerInicioAdm() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#E3E9F1] bg-gradient-to-r from-white via-[#F8FAFD] to-[#EAF0F7] p-5 text-wisen-titulo shadow-sm sm:p-8 xl:p-10">
      <div className="pointer-events-none absolute -top-[15%] right-0 hidden h-[130%] w-[50%] lg:block">
        <Image
          src="/foto_paginaInicialCliente-v1.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 35vw"
          className="object-contain object-right"
        />
      </div>

      <AdminPageHeader
        title="Visão geral do"
        highlight="Wisen."
        description="Acompanhe o desempenho dos usuários, os conteúdos publicados e as atividades da plataforma."
        className="relative z-10 max-w-xl lg:max-w-[55%]"
      />
    </div>
  );
}
