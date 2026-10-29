import { Card, CardContent } from "@/components/ui/card";

export default function DicaEstudo() {
  return (
    <Card className="gap-0 rounded-xl border-0 bg-white p-2 shadow-none">
      <CardContent className="flex items-start gap-4 rounded-xl bg-[#FFFAE9] px-4 py-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF0AF] text-2xl">
          💡
        </span>

        <div>
          <h3 className="text-[17px] font-semibold text-[#263343]">Dica de estudo</h3>

          <p className="mt-2 text-[13px] leading-5 text-[#7183A6]">
            Ao revisar, tente explicar o conceito com suas próprias palavras. Isso ajuda a fixar o
            conteúdo no longo prazo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
