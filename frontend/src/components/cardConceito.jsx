import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const imagens = {
  "Taxa Selic":
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  Inflação:
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
  "Política monetária":
    "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=80",
  "Gases de efeito estufa":
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  "Aquecimento global":
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
  "Aprendizado de máquina":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  "Regulação de IA":
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
  "Comércio internacional":
    "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=800&q=80",
};

const progresso = {
  "Taxa Selic": 60,
  Inflação: 85,
  "Política monetária": 25,
  "Gases de efeito estufa": 55,
  "Aquecimento global": 90,
  "Aprendizado de máquina": 65,
  "Regulação de IA": 30,
  "Comércio internacional": 80,
};

function getStatusStyles(status) {
  if (status === "Dominado") {
    return {
      badge: "border-emerald-200 bg-white text-slate-700",
      ponto: "bg-emerald-500",
      porcentagem: "text-emerald-600",
      barra: "bg-emerald-500",
    };
  }

  if (status === "Lacuna") {
    return {
      badge: "border-red-200 bg-white text-slate-700",
      ponto: "bg-red-500",
      porcentagem: "text-red-500",
      barra: "bg-red-500",
    };
  }

  return {
    badge: "border-amber-200 bg-white text-slate-700",
    ponto: "bg-amber-400",
    porcentagem: "text-amber-500",
    barra: "bg-amber-400",
  };
}


export function CardConceito({
  titulo,
  categoria,
  descricao,
  status,
  progresso = 0,
}) {
  const percentual = Math.min(100, Math.max(0, progresso));
  const estilos = getStatusStyles(status);

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-sm">

      {/* Imagem do conceito */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <img
          src={imagens[titulo]}
          alt={titulo}
          className="h-full w-full object-cover"
        />

        <Badge
          className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-[11px] font-medium shadow-sm ${estilos.badge}`}
        >
          <span
            className={`mr-1.5 h-2 w-2 rounded-full ${estilos.ponto}`}
          />
          {status}
        </Badge>
      </div>

      {/* Informações do conceito */}
      <CardContent className="flex flex-1 flex-col p-4">

        <h3 className="text-[18px] leading-6 font-semibold tracking-tight text-[#101A40]">
          {titulo}
        </h3>

        <p className="mt-2 text-[14px] leading-[18px] text-[#7483A3]">
          {descricao}
        </p>

        {/* Progresso e última revisão */}
        <div className="mt-auto pt-5">

          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] text-[#7483A3]">
              Seu nível de domínio
            </span>

            <span className="text-[13px] font-semibold text-[#101A40]">
              {percentual}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E9EDF3]">
            <div
              className={`h-full rounded-full ${estilos.barra}`}
              style={{ width: `${percentual}%` }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-[#E8ECF2] pt-3 text-[12px] text-[#7483A3]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>

            <span>Última revisão: há 2 dias</span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
