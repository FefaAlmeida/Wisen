import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PainelAprendizado() {
  const dominio = 68;

  return (
    <Card className="h-full gap-0 rounded-xl border-0 bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF8DD] text-xl text-wisen-titulo">
            ⚡
          </span>
          <h2 className="flex-1 text-[19px] font-semibold text-wisen-titulo">Seu aprendizado</h2>
          <span className="text-[#344469]">›</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative flex h-[110px] w-[110px] shrink-0 items-center justify-center">
            <svg aria-hidden="true" viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#EBEFF6" strokeWidth="11" />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#35B47A"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={`${dominio * 3.016} 301.6`}
              />
            </svg>

            <span className="absolute text-[23px] font-semibold text-wisen-titulo">0,68</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-3 text-[13px] text-[#617398]">Nível de domínio ⓘ</p>

            <div className="flex items-center gap-3">
              <Progress
                value={dominio}
                className="h-2 flex-1 bg-[#E9EEF5] [&_[data-slot=progress-indicator]]:bg-[#35B47A]"
              />
              <span className="text-[14px] font-semibold text-wisen-titulo">{dominio}%</span>
            </div>
          </div>
        </div>

        <div className="mt-5 divide-y divide-[#E8EDF4] border-t border-[#E8EDF4]">
          <div className="flex items-center justify-between gap-3 py-3 text-[13px]">
            <span className="text-[#617398]">▣ &nbsp; Próxima revisão</span>
            <strong className="text-wisen-titulo">em 5 dias</strong>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 text-[13px]">
            <span className="text-[#617398]">▣ &nbsp; Última revisão</span>
            <strong className="text-wisen-titulo">há 2 dias</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
