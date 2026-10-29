import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CabecalhoConceito() {
  return (
    <section className="relative flex min-h-[235px] items-start overflow-hidden">
      <div className="relative z-10 max-w-[620px] pt-2">
        <nav className="mb-6 flex flex-wrap items-center gap-3 text-[13px] text-[#617398]">
          <Link href="/biblioteca" className="hover:text-wisen-titulo">
            ←<span className="ml-3">Biblioteca de conceitos</span>
          </Link>
          <span>/</span>
          <span>Economia</span>
        </nav>

        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-[44px] font-semibold leading-tight tracking-[-2px] text-wisen-titulo md:text-[54px]">
            Inflação
          </h1>

          <Badge className="gap-2 rounded-full border border-[#F1E4AA] bg-[#FFF9DE] px-4 py-2 text-xs font-medium text-[#273451] shadow-none">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F4CE2F]" />
            Em revisão
          </Badge>
        </div>

        <p className="mt-2 max-w-[570px] text-[17px] leading-6 text-[#617398]">
          Aumento generalizado e contínuo dos preços de bens e serviços em uma economia ao longo do
          tempo.
        </p>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[235px] w-[44%] lg:block">
        <Image
          src="/foto_paginaConceito.png"
          alt="Ilustração de crescimento dos preços"
          fill
          sizes="(max-width: 1400px) 35vw, 450px"
          className="object-contain object-right-bottom"
        />
      </div>
    </section>
  );
}
