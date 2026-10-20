
import { Card, CardContent } from "@/components/ui/card";

export default function CardNoticia({
  imagem,
  categoria,
  tempo,
  titulo,
  descricao,
  conceitos = [],
}) {
  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 shadow-none">
      <img
        src={imagem}
        alt={titulo}
        className="h-28 w-full object-cover"
      />

      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase text-[#30466E]">
            {categoria}
          </span>
          <span className="text-[11px] text-[#94A2B9]">
            {tempo}
          </span>
        </div>

        <h3 className="text-[16px] font-semibold leading-5 text-[#101A40]">
          {titulo}
        </h3>

        <p className="mt-1 text-[13px] leading-[18px] text-[#7483A3]">
          {descricao}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
          {conceitos.map((conceito) => (
            <span
              key={conceito}
              className="rounded-full bg-[#FBF7E5] px-3 py-1 text-[11px] text-[#52617E]"
            >
              {conceito}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
