
import { Card, CardContent } from "@/components/ui/card";

export default function CardInteresse({
  imagem,
  titulo,
  porcentagem,
}) {
  return (
    <Card className="group flex h-full min-h-[108px] flex-row items-stretch gap-0 overflow-hidden rounded-lg border border-[#E3E9F1] bg-white p-0 shadow-none transition-shadow hover:shadow-md">
      <div className="w-[100px] shrink-0 self-stretch overflow-hidden sm:w-[108px]">
        <img
          src={imagem}
          alt={titulo}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="flex min-w-0 flex-1 flex-row items-center gap-2 px-3 py-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-[#101A40]">
            {titulo}
          </h3>

          <p className="mt-1 text-[12px] text-[#8592AB]">
            {porcentagem}% das suas leituras
          </p>
        </div>

        <span
          aria-hidden="true"
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3E69A] text-lg text-[#263551] transition-all group-hover:translate-x-1 group-hover:bg-[#EBDD80]"
        >
          →
        </span>
      </CardContent>
    </Card>
  );
}
