import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PainelArtigos({
  evento,
  aoFechar,
  aoEditar,
  aoMover,
  buscaArtigo,
  setBuscaArtigo,
}) {
  if (!evento) return null;

  const artigosFiltrados = evento.artigos.filter((artigo) => {
    const texto = `${artigo.titulo} ${artigo.fonte}`.toLowerCase();
    return texto.includes(buscaArtigo.toLowerCase());
  });

  return (
    <Card className="gap-0 rounded-[22px] border border-[#E4EAF3] bg-white p-5 shadow-none">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="h-[96px] w-[92px] shrink-0 overflow-hidden rounded-[14px] bg-[#EEF3FA]">
            {evento.imagem && (
              <img
                src={evento.imagem}
                alt={evento.titulo}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="min-w-0 pt-1">
            <h2 className="text-[18px] font-semibold leading-8 text-[#101A40]">
              {evento.titulo}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[#8192B2]">
              <Badge className="rounded-full border-0 bg-[#EEF3FB] px-3 py-1 text-[11px] font-medium text-[#4A628E] shadow-none">
                {evento.categoria}
              </Badge>

              <span>·</span>
              <span>{evento.quantidadeArtigos} artigos</span>
              <span>·</span>
              <span>{evento.data}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={aoFechar}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#60789F] transition-colors hover:bg-[#F5F8FC]"
          aria-label="Fechar painel"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => aoEditar(evento)}
          className="h-10 rounded-[12px] border-[#E1E7F0] bg-[#F3F6FB] px-4 text-[13px] font-medium text-[#30466E] shadow-none hover:bg-[#EAF0F8]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16 4l4 4-11 11-5 1 1-5L16 4Z" />
          </svg>
          Editar
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-8 border-b border-[#E7ECF4]">
        <button
          type="button"
          className="border-b-2 border-[#E3C84E] pb-3 text-[15px] font-semibold text-[#101A40]"
        >
          Artigos ({evento.quantidadeArtigos})
        </button>

        <button
          type="button"
          className="pb-3 text-[15px] font-medium text-[#6C7F9F]"
        >
          Resumo do evento
        </button>
      </div>

      <p className="mb-5 text-[13px] leading-7 text-[#6E809F]">
        {evento.resumo}
      </p>

      <div className="relative mb-5">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#7D8FAE]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>

        <Input
          value={buscaArtigo}
          onChange={(e) => setBuscaArtigo(e.target.value)}
          placeholder="Buscar artigo..."
          className="h-11 rounded-[12px] border-[#DCE4F0] bg-white pl-10 text-[13px] text-[#30466E] placeholder:text-[#90A0BA]"
        />
      </div>

      <div className="space-y-1">
        {artigosFiltrados.map((artigo) => (
          <div
            key={artigo.id}
            className="flex items-center gap-3 rounded-[14px] px-1 py-2 transition-colors hover:bg-[#FAFCFF]"
          >
            <div className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[12px] bg-[#EEF3FA]">
              {artigo.imagem && (
                <img
                  src={artigo.imagem}
                  alt={artigo.titulo}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-[12px] font-semibold leading-5 text-[#101A40]">
                {artigo.titulo}
              </h4>

              <p className="mt-1 text-[12px] text-[#8394B0]">
                {artigo.fonte} · {artigo.data}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => aoMover(artigo)}
              className="h-9 rounded-[12px] border-[#E3E9F3] bg-[#F4F7FC] px-3 text-[12px] font-medium text-[#30466E] shadow-none hover:bg-[#EAF0F8]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5 h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
              Mover
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-5 h-12 w-full rounded-[14px] border-[#E2E8F2] bg-[#F4F7FC] text-[14px] font-medium text-[#30466E] shadow-none hover:bg-[#EAF0F8]"
      >
        <span className="mr-2 text-[18px]">＋</span>
        Adicionar artigo manualmente
      </Button>
    </Card>
  );
}