
import { Button } from "@/components/ui/button";

export default function HeroHome() {
  return (
    <section className="relative min-h-[310px] overflow-hidden px-6 pt-10 pb-8 md:px-12 md:pt-12">
      <div className="relative z-10 max-w-[650px]">
        <p className="mb-5 text-[11px] font-semibold tracking-[0.25em] text-[#93A3BE]">
          BOM DIA, NATALIA ☀️
        </p>

        <h1 className="text-[36px] leading-[1.05] font-medium tracking-[-1.5px] text-[#101A40] sm:text-[44px] lg:text-[50px]">
          Suas notícias.
          <span className="block text-[#D7BF4D]">
            Seu aprendizado.
          </span>
          <span className="block">
            Um mundo de conexões.
          </span>
        </h1>

        <p className="mt-3 max-w-[470px] text-[15px] leading-6 text-[#7182A1]">
          Acompanhe os acontecimentos reais do mundo
          <br className="hidden sm:block" />
          e evolua seu conhecimento de forma personalizada.
        </p>

        <Button className="mt-5 h-10 rounded-lg bg-[#F3E69A] px-6 font-semibold text-[#192344] shadow-none hover:bg-[#EBDD80]">
          Explorar notícias
          <span className="ml-3 text-lg" aria-hidden="true">
            →
          </span>
        </Button>
      </div>
    </section>
  );
}
