
import { Card, CardContent } from "@/components/ui/card";

export default function CardInteresse({
  imagem,
  titulo,
  porcentagem,
}) {
  return (
    <Card className="flex h-full flex-row items-center gap-0 overflow-hidden rounded-xl border border-[#E3E9F1] bg-white p-0 shadow-none">
      <div className="h-[86px] w-[94px] shrink-0 overflow-hidden">
        <img
          src={imagem}
          alt={titulo}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="flex min-w-0 flex-1 items-center justify-between gap-2 px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-[#101A40]">
            {titulo}
          </h3>

          <p className="mt-1 text-[12px] text-[#8592AB]">
            {porcentagem}% das suas leituras
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3E69A] text-lg text-[#263551]"
        >
          →
        </span>
      </CardContent>
    </Card>
  );
}
