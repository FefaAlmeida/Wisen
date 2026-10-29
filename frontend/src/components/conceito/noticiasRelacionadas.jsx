import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const noticias = [
  {
    titulo: "BC mantém Selic em 10,5% e sinaliza cautela com a inflação",
    fonte: "Valor Econômico",
    data: "20 de mar. de 2024",
    imagem:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
  },
  {
    titulo: "Inflação desacelera em fevereiro, mas alimentos ainda pressionam",
    fonte: "G1",
    data: "12 de mar. de 2024",
    imagem:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
  },
  {
    titulo: "Entenda o que pode influenciar a inflação nos próximos meses",
    fonte: "BBC Brasil",
    data: "5 de mar. de 2024",
    imagem:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=80",
  },
];

export default function NoticiasRelacionadas() {
  return (
    <Card className="gap-0 rounded-xl border-0 bg-white p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8DD]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#17254D"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6 2h9l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
                <path d="M14 2v5h5M8 12h8M8 16h8" />
              </svg>
            </span>

            <div>
              <h2 className="text-[20px] font-semibold text-wisen-titulo">
                Eventos e notícias relacionadas
              </h2>

              <p className="text-[13px] text-wisen-texto-suave">
                Acompanhe conteúdos recentes que abordam este conceito no mundo real.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#DFE6F0] bg-white text-[12px] text-[#344469] shadow-none"
          >
            Ver mais <span className="ml-2">→</span>
          </Button>
        </div>

        <div className="grid gap-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <article
              key={noticia.titulo}
              className="flex min-w-0 gap-3 rounded-xl border border-[#E1E8F2] p-2"
            >
              <img
                src={noticia.imagem}
                alt=""
                className="h-[78px] w-[100px] shrink-0 rounded-lg object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1">
                <h3 className="text-[12px] leading-[16px] font-semibold text-wisen-titulo">
                  {noticia.titulo}
                </h3>

                <div className="flex items-end justify-between gap-1">
                  <p className="text-[10px] leading-4 text-[#8190AD]">
                    {noticia.fonte} · {noticia.data}
                  </p>

                  <span aria-hidden="true" className="shrink-0 text-[#344469]">
                    ↗
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
