import { BookOpen, CheckCircle2, FileText, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HistoricoAtividades() {
  const atividades = [
    {
      id: 1,
      tipo: "Leu uma notícia",
      detalhe: "Copom mantém taxa Selic em 10,50% ao ano",
      categoria: "Economia",
      tempo: "há 2 horas",
      icone: FileText,
      corIcone: "bg-blue-50 text-blue-600",
    },
    {
      id: 2,
      tipo: 'Marcou "Não sei"',
      detalhe: "Inflação de demanda",
      categoria: "Economia",
      tempo: "há 5 horas",
      icone: HelpCircle,
      corIcone: "bg-rose-50 text-rose-500",
    },
    {
      id: 3,
      tipo: "Concluiu uma revisão",
      detalhe: "Política monetária — 8 de 10 acertos",
      categoria: "",
      tempo: "há 1 dia",
      icone: CheckCircle2,
      corIcone: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 4,
      tipo: "Acessou um conceito",
      detalhe: "Efeito estufa",
      categoria: "Meio ambiente",
      tempo: "há 1 dia",
      icone: BookOpen,
      corIcone: "bg-[#E8E191]/30 text-[#2B333F]",
    },
    {
      id: 5,
      tipo: "Leu uma notícia",
      detalhe: "União Europeia aprova novas regras para Inteligência Artificial",
      categoria: "Tecnologia",
      tempo: "há 2 dias",
      icone: FileText,
      corIcone: "bg-blue-50 text-blue-600",
    },
    {
      id: 6,
      tipo: "Concluiu uma revisão",
      detalhe: "Acordo de Paris — 6 de 8 acertos",
      categoria: "",
      tempo: "há 3 dias",
      icone: CheckCircle2,
      corIcone: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2B333F]" />
          <CardTitle className="text-base font-bold text-[#2B333F]">
            Histórico recente de atividades
          </CardTitle>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-slate-500 hover:text-[#2B333F] transition-colors cursor-pointer"
        >
          Ver todas
        </button>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="divide-y divide-slate-100">
          {atividades.map((item) => {
            const IconeComponente = item.icone;
            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-4 first:pt-1 last:pb-1 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 ${item.corIcone}`}>
                    <IconeComponente className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-semibold text-[#2B333F] truncate">{item.tipo}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.detalhe}
                      {item.categoria && (
                        <span className="text-slate-400"> · {item.categoria}</span>
                      )}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                  {item.tempo}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
