
import { Button } from "@/components/ui/button";

const revisoes = [
  {
    conceito: "Taxa Selic",
    categoria: "Economia",
    status: "Revisar hoje",
    cor: "bg-[#E9C75B]",
  },
  {
    conceito: "Política monetária",
    categoria: "Economia",
    status: "Pendente",
    cor: "bg-[#F08A7B]",
  },
  {
    conceito: "Gases de efeito estufa",
    categoria: "Meio ambiente",
    status: "Revisar hoje",
    cor: "bg-[#E9C75B]",
  },
];

export default function PainelRevisoes() {
  return (
    <section className="overflow-hidden rounded-xl bg-[#263343] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-[43%_57%]">

        {/* Resumo das revisões */}
        <div className="flex flex-col justify-center px-7 py-8 lg:px-10 lg:py-10">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F3E69A]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F3E69A]">
              Seu aprendizado
            </span>
          </div>

          <h2 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Revisões de hoje
          </h2>

          <p className="mt-3 max-w-[350px] text-[14px] leading-6 text-[#B9C5D5]">
            Você tem conceitos esperando por uma revisão.
            Continue fortalecendo seu conhecimento com
            pequenas sessões de estudo.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-[52px] font-semibold leading-none text-[#F3E69A]">
              03
            </span>

            <span className="text-[13px] leading-5 text-[#C6D0DD]">
              conceitos para
              <br />
              revisar hoje
            </span>
          </div>

          <Button className="mt-7 h-11 w-fit rounded-lg bg-[#F3E69A] px-6 font-semibold text-[#263343] shadow-none hover:bg-[#EBDD80]">
            Iniciar revisões
            <span aria-hidden="true" className="ml-3 text-lg">
              →
            </span>
          </Button>
        </div>

        {/* Lista de revisões */}
        <div className="border-t border-white/10 bg-white/[0.045] px-6 py-7 lg:border-t-0 lg:border-l lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-white">
              Conceitos para revisar
            </h3>

            <span className="text-[12px] text-[#A9B8CB]">
              Hoje
            </span>
          </div>

          <div className="space-y-3">
            {revisoes.map((revisao) => (
              <div
                key={revisao.conceito}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.065] px-4 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${revisao.cor}`}
                  />

                  <div className="min-w-0">
                    <h4 className="truncate text-[14px] font-semibold text-white">
                      {revisao.conceito}
                    </h4>

                    <p className="mt-1 text-[12px] text-[#A9B8CB]">
                      {revisao.categoria}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-[11px] text-[#D2DCE8]">
                  {revisao.status}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[12px] leading-5 text-[#A9B8CB]">
            Revisar regularmente ajuda a consolidar o que
            você aprendeu.
          </p>
        </div>

      </div>
    </section>
  );
}
