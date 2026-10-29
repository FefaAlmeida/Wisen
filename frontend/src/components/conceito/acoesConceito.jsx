import { Card, CardContent } from "@/components/ui/card";

const acoes = [
  {
    titulo: "Não sei",
    descricao: "Marque se ainda tem dúvidas sobre este conceito.",
    icone: "?",
    destaque: false,
  },
  {
    titulo: "Praticar conceito",
    descricao: "Resolva questões e reforce o seu aprendizado.",
    icone: "▷",
    destaque: true,
  },
];

export default function AcoesConceito() {
  return (
    <Card className="h-full gap-0 rounded-xl border-0 bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8DD] text-2xl text-wisen-titulo">
            ⚡
          </span>

          <div>
            <h2 className="text-[20px] font-semibold text-wisen-titulo">Ações rápidas</h2>
            <p className="text-[13px] text-[#7889A8]">
              Teste seu conhecimento ou pratique este conceito.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {acoes.map((acao) => (
            <div
              key={acao.titulo}
              className={`flex min-h-[170px] flex-col rounded-xl border p-4 ${
                acao.destaque ? "border-[#F5E5A0] bg-[#FFFAE6]" : "border-[#E1E8F2] bg-white"
              }`}
            >
              <span
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-wisen-titulo ${
                  acao.destaque ? "bg-[#FFED9E]" : "bg-[#EDF2F9]"
                }`}
              >
                {acao.icone}
              </span>

              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[17px] font-semibold text-wisen-titulo">{acao.titulo}</h3>
                <span aria-hidden="true" className="text-xl text-wisen-titulo">
                  →
                </span>
              </div>

              <p className="mt-1 text-[13px] leading-5 text-wisen-texto-suave">{acao.descricao}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
