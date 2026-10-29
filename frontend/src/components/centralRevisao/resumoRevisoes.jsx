import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ResumoRevisoes({ concluidas = 4, total = 12 }) {
  const percentual = (concluidas / total) * 100;

  return (
    <Card className="grid gap-0 rounded-xl border-0 bg-white p-0 shadow-none md:grid-cols-3">
      <div className="flex items-center gap-5 px-6 py-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFF3B7] text-3xl text-wisen-titulo">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-7 w-7"
          >
            <path d="M7 3h10l3 3v15H4V3h3Z" />
            <path d="M8 9h8M8 13h8M8 17h5" />
          </svg>
        </div>

        <div>
          <p className="text-[25px] font-semibold leading-tight text-wisen-titulo">
            12
            <span className="ml-2 text-[14px] font-normal text-[#7183A6]">questões hoje</span>
          </p>
          <p className="text-[13px] text-[#7183A6]">programadas para você</p>
        </div>
      </div>

      <div className="flex items-center gap-5 border-y border-[#E5EAF3] px-6 py-6 md:border-x md:border-y-0">
        <div className="relative h-[76px] w-[76px] shrink-0">
          <svg aria-hidden="true" viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E6ECFA" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#F0C83C"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentual * 2.136} 213.6`}
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-semibold text-wisen-titulo">
            {concluidas} de {total}
          </p>
          <p className="text-[13px] text-[#7183A6]">concluídas</p>
          <Progress
            value={percentual}
            className="mt-2 h-1.5 bg-[#E6ECFA] [&_[data-slot=progress-indicator]]:bg-[#F0C83C]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 px-6 py-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F0F4FC] text-2xl text-wisen-titulo">
          ◎
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-[#7183A6]">Próximo conceito</p>
          <p className="text-[16px] font-semibold text-wisen-titulo">Política monetária</p>
          <p className="text-[12px] text-[#7183A6]">Com base no seu progresso</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3B7] text-xl text-wisen-titulo">
          →
        </span>
      </div>
    </Card>
  );
}
