import { Cpu, HeartPulse, Leaf, Newspaper, TrendingUp } from "lucide-react";

const estilosCategoria = {
  Economia: {
    icone: TrendingUp,
    fundo: "bg-gradient-to-br from-[#FFF8DC] to-[#F3E69A]",
    cor: "text-[#9A7E14]",
  },
  Tecnologia: {
    icone: Cpu,
    fundo: "bg-gradient-to-br from-[#ECF2FC] to-[#DCE7F7]",
    cor: "text-[#476B9E]",
  },
  Saúde: {
    icone: HeartPulse,
    fundo: "bg-gradient-to-br from-[#ECF7EF] to-[#D5ECDE]",
    cor: "text-[#3E7A56]",
  },
  "Meio ambiente": {
    icone: Leaf,
    fundo: "bg-gradient-to-br from-[#EAF5E9] to-[#D2E8D0]",
    cor: "text-[#4A7950]",
  },
};

export default function MiniaturaCuradoria({ categoria, titulo, className = "" }) {
  const estilo = estilosCategoria[categoria] ?? {
    icone: Newspaper,
    fundo: "bg-gradient-to-br from-[#EEF3FA] to-[#DCE5F1]",
    cor: "text-[#546987]",
  };
  const Icone = estilo.icone;

  return (
    <div
      role="img"
      aria-label={`Ilustração: ${titulo}`}
      className={`relative isolate flex shrink-0 items-center justify-center overflow-hidden rounded-lg ${estilo.fundo} ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-white/35"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-4 -left-2 h-10 w-10 rounded-full bg-white/40"
      />
      <Icone aria-hidden="true" className={`relative h-6 w-6 ${estilo.cor}`} strokeWidth={1.7} />
    </div>
  );
}
