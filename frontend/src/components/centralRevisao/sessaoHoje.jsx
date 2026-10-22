
import { Card, CardContent } from "@/components/ui/card";

const conceitos = [
  { nome: "Política monetária", questoes: 4, cor: "bg-[#EFC735]" },
  { nome: "Inflação", questoes: 3, cor: "bg-[#55AD71]" },
  { nome: "Crescimento econômico", questoes: 2, cor: "bg-[#438AF0]" },
  { nome: "Mercado financeiro", questoes: 2, cor: "bg-[#8293B5]" },
];

export default function SessaoHoje() {
  return (
    <Card className="gap-0 rounded-xl border-0 bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-[2px] w-6 bg-[#E8C637]" />
          <h2 className="text-[19px] font-semibold text-[#101A40]">
            Sua sessão de hoje
          </h2>
        </div>

        <div className="space-y-5">
          {[
            { icone: "◷", titulo: "Tempo estimado", valor: "~ 15 minutos" },
            { icone: "◎", titulo: "Questões restantes", valor: "8 de 12" },
            { icone: "▥", titulo: "Conceitos em revisão", valor: "4 temas" },
          ].map((item) => (
            <div key={item.titulo} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0F4FC] text-2xl text-[#101A40]">
                {item.icone}
              </span>
              <div>
                <p className="text-[12px] text-[#8192B2]">{item.titulo}</p>
                <p className="text-[15px] font-semibold text-[#101A40]">
                  {item.valor}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-[#E1E8F2] pt-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-6 bg-[#E8C637]" />
              <h3 className="text-[17px] font-semibold text-[#101A40]">
                Conceitos de hoje
              </h3>
            </div>
            <span className="text-[12px] text-[#344469]">
              Ver todos →
            </span>
          </div>

          <div>
            {conceitos.map((conceito, index) => (
              <div
                key={conceito.nome}
                className={`flex items-center gap-3 py-3 ${
                  index !== conceitos.length - 1
                    ? "border-b border-[#E6ECF4]"
                    : ""
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0F4FA]">
                  <span className={`h-3 w-3 rounded-full ${conceito.cor}`} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#253B71]">
                    {conceito.nome}
                  </p>
                  <p className="text-[12px] text-[#91A0BA]">
                    {conceito.questoes} questões
                  </p>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF7D8] text-[#101A40]">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

