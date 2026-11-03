"use client";

import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  CircleHelp,
  Lightbulb,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const concepts = [
  { title: "Mudanças climáticas", detail: "Em revisão", color: "bg-amber-400" },
  { title: "Gases de efeito estufa", detail: "Lacuna", color: "bg-rose-400" },
  { title: "Aquecimento global", detail: "Dominado", color: "bg-emerald-500" },
  { title: "Nível do mar", detail: "Em revisão", color: "bg-yellow-400" },
  { title: "Calotas polares", detail: "Lacuna", color: "bg-red-400" },
];

const timeline = [
  { year: "2026 · Estudo mais recente", title: "Aceleração do derretimento das geleiras", detail: "Nova pesquisa aponta que o derretimento está mais rápido do que o previsto.", active: true },
  { year: "2024", title: "Recorde de perda de gelo na Antártida", detail: "Dados mostram o menor nível de gelo registrado na região." },
  { year: "2022", title: "Relatório da ONU sobre mudanças climáticas", detail: "Alerta para o impacto do derretimento das geleiras no nível do mar." },
  { year: "2020", title: "Estudo já indicava aceleração", detail: "Pesquisadores apontavam sinais de aumento na taxa de derretimento." },
];

const sources = [
  { name: "BBC News", color: "bg-[#C43A3A]" },
  { name: "Reuters", color: "bg-[#E79D57]" },
  { name: "National Geographic", color: "bg-[#E4C840]" },
];

export default function PaginaEvento() {
  const [saved, setSaved] = useState(false);
  const [savedConcepts, setSavedConcepts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSources, setShowSources] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [shareFeedback, setShareFeedback] = useState("");

  function toggleConcept(title) {
    setSavedConcepts((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareFeedback("Link copiado!");
    } catch {
      setShareFeedback("Não foi possível copiar o link.");
    }
  }

  return (
    <main className="relative isolate min-h-screen bg-[#F1F3F6] font-[family-name:var(--font-geist-sans)] text-[#101A40]">
      <ConnectionsBackground />
      <Sidebar activeItem="Notícias" />

      <div className="relative z-10 min-h-screen sm:ml-[128px] lg:ml-[220px]">
        {/* Barra global: mantém busca e perfil fora da matéria */}
        <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-end gap-3 px-4 pt-4 sm:px-5 lg:px-7">
          <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
            <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]" />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar notícias, conceitos ou temas"
              placeholder="Pesquise por notícias, conceitos ou temas..."
              className="h-9 rounded-full border-[#E2E7EE] bg-white pl-9 text-xs shadow-sm placeholder:text-[#8794AA]"
            />
          </div>
          <MenuPerfil />
        </header>

        <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-5 sm:px-5 lg:px-7 lg:pt-6">
          {/* Um único container para TODO o conteúdo deste evento */}
          <div className="overflow-hidden rounded-[16px] border border-[#DEE5ED] bg-white shadow-[0_8px_30px_rgba(16,26,64,0.035)]">
            {/* Ações pertencem ao mesmo container, não flutuam acima dos cards */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EDF2] px-5 py-3 sm:px-7">
              <Link
                href="/paginaInicialCliente"
                className="inline-flex items-center gap-2 rounded-md px-1 py-1.5 text-[12px] font-medium text-[#748198] transition-colors hover:text-[#101A40]"
              >
                <ArrowLeft size={15} />
                Voltar para notícias
              </Link>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={saved}
                  onClick={() => setSaved((current) => !current)}
                  className={`h-8 gap-1.5 rounded-lg px-2.5 text-[12px] sm:px-3 ${saved ? "bg-[#FFF9DF] text-[#967A19] hover:bg-[#FFF3C6]" : "text-[#65748B] hover:bg-[#F4F6F9] hover:text-[#101A40]"}`}
                >
                  {saved ? <Check size={15} /> : <Bookmark size={15} />}
                  {saved ? "Salvo" : "Salvar"}
                </Button>
                <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-[#E5EAF0]" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 gap-1.5 rounded-lg px-2.5 text-[12px] text-[#65748B] hover:bg-[#F4F6F9] hover:text-[#101A40] sm:px-3"
                >
                  <Share2 size={15} /> Compartilhar
                </Button>
              </div>
            </div>

            {shareFeedback && (
              <p role="status" className="border-b border-[#E8EDF2] bg-[#FAFBFD] px-7 py-2 text-right text-xs text-[#30466E]">
                {shareFeedback}
              </p>
            )}

            {/* Duas colunas DENTRO da mesma superfície branca */}
            <div className="grid grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1.85fr)_minmax(300px,0.95fr)]">
              <div className="min-w-0">
                <article>
                  <div className="relative h-[210px] overflow-hidden bg-[#8B9DA6] sm:h-[255px] lg:h-[230px] xl:h-[270px]">
                    <div
                      role="img"
                      aria-label="Geleira e montanhas cobertas de neve"
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: "linear-gradient(180deg,rgba(18,35,48,.03) 45%,rgba(18,35,48,.48) 100%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85')" }}
                    />
                    <span className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 rounded-full bg-[#263C4DCC] px-3 py-1.5 text-[11px] text-white sm:left-7">
                      <Sparkles size={13} /> Meio ambiente
                    </span>
                    <span className="absolute bottom-4 right-5 rounded-full bg-[#263C4DCC] px-3 py-1.5 text-[11px] text-white sm:right-7">
                      1 de outubro de 2026
                    </span>
                  </div>

                  <div className="px-5 pb-7 pt-6 sm:px-7">
                    <h1 className="max-w-[820px] text-[25px] font-bold leading-[1.2] tracking-[-0.035em] text-[#101A40] sm:text-[30px]">
                      Estudo aponta aceleração do derretimento das geleiras no mundo
                    </h1>
                    <p className="mt-3 max-w-[820px] text-[14px] leading-[1.7] text-[#68778D]">
                      Pesquisa internacional alerta que o derretimento das geleiras está acontecendo mais rápido do que o previsto, com impactos no clima e no aumento do nível do mar.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-[#75839A]">
                      <span className="mr-1">Fontes originais:</span>
                      {sources.map((source) => (
                        <span key={source.name} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#E6EBF0] bg-[#FAFBFD] px-2.5 py-1.5">
                          <span className={`size-2.5 rounded-[3px] ${source.color}`} />
                          {source.name}
                        </span>
                      ))}
                      <button
                        type="button"
                        aria-expanded={showSources}
                        onClick={() => setShowSources((current) => !current)}
                        className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#E6EBF0] px-2.5 py-1.5 transition hover:bg-[#F7F9FC]"
                      >
                        +2 fontes <ChevronDown size={12} className={`transition-transform ${showSources ? "rotate-180" : ""}`} />
                      </button>
                      {showSources && <span className="w-full text-xs text-[#71809A]">Outras duas fontes ainda não foram cadastradas.</span>}
                    </div>
                  </div>
                </article>

                <section aria-labelledby="resumo-title" className="border-t border-[#E8EDF2] px-5 py-7 sm:px-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 id="resumo-title" className="flex items-center gap-2.5 text-[16px] font-semibold text-[#101A40]">
                      <Sparkles size={18} className="text-[#D6B92F]" /> Resumo para você
                    </h2>
                    <span className="text-[11px] text-[#8996AA]">Adaptado ao seu nível de conhecimento</span>
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.8] text-[#65748B]">
                    Um novo estudo internacional mostrou que as geleiras do planeta estão derretendo mais rápido do que o estimado anteriormente. Esse processo é causado principalmente pelo aumento da temperatura global, resultado das emissões de gases de efeito estufa.
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.8] text-[#65748B]">
                    O derretimento das geleiras contribui para o aumento do nível do mar, afeta ecossistemas litorâneos e milhões de pessoas ao redor do mundo. Além disso, influencia o clima global, já que as geleiras ajudam a regular a temperatura do planeta.
                  </p>
                  <Separator className="my-5 bg-[#E8EDF2]" />
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF8D9] text-[#D2B52B]">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-[#101A40]">Por que isso importa?</h3>
                      <p className="mt-1 text-[13px] leading-[1.7] text-[#748198]">
                        O derretimento das geleiras afeta o clima, a biodiversidade e a vida de milhões de pessoas. Entender esse tema ajuda a compreender melhor os debates sobre mudanças climáticas e suas consequências.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Painel relacionado, sem card próprio: integra o mesmo container */}
              <aside className="min-w-0 border-t border-[#E8EDF2] bg-[#FCFDFE] lg:border-l lg:border-t-0">
                <section aria-labelledby="conceitos-title" className="px-5 py-6 sm:px-6">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 id="conceitos-title" className="text-[15px] font-semibold text-[#101A40]">Conceitos relacionados</h2>
                    <CircleHelp size={15} className="text-[#9AA6B8]" aria-label="Conceitos associados à notícia" />
                  </div>
                  <div>
                    {concepts.map(({ title, detail, color }) => {
                      const isSaved = savedConcepts.includes(title);
                      return (
                        <div key={title} className="flex min-h-[58px] items-center gap-2.5 border-b border-[#EDF0F4] py-2 last:border-0">
                          <span className={`size-2 shrink-0 rounded-full ${color}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium leading-4 text-[#263654]">{title}</p>
                            <p className="mt-0.5 text-[11px] leading-4 text-[#909BAD]">{detail}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleConcept(title)}
                            aria-label={`${isSaved ? "Remover dos salvos" : "Salvar"} conceito ${title}`}
                            aria-pressed={isSaved}
                            className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] transition-colors ${isSaved ? "border-[#E5D78C] bg-[#FFF9DF] text-[#8D7414]" : "border-[#E5EAF0] bg-white text-[#71809A] hover:bg-[#F7F9FC]"}`}
                          >
                            {isSaved ? <Check size={12} /> : <Bookmark size={12} />}
                            {isSaved ? "Salvo" : "Revisar"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section aria-labelledby="timeline-title" className="border-t border-[#E8EDF2] px-5 py-6 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setShowTimeline((current) => !current)}
                    aria-expanded={showTimeline}
                    aria-controls="timeline-content"
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <h2 id="timeline-title" className="text-[15px] font-semibold text-[#101A40]">Linha do tempo do evento</h2>
                    <ChevronDown size={16} className={`shrink-0 text-[#8D96A1] transition-transform ${showTimeline ? "" : "-rotate-90"}`} />
                  </button>
                  {showTimeline && (
                    <div id="timeline-content" className="relative ml-1.5 mt-5">
                      <span aria-hidden="true" className="absolute bottom-2 left-[3px] top-2 w-px bg-[#E6EAF0]" />
                      {timeline.map((item) => (
                        <article key={item.year} className="relative flex gap-3 pb-5 last:pb-0">
                          <span className={`relative z-[1] mt-1 size-[7px] shrink-0 rounded-full border-2 border-[#FCFDFE] ${item.active ? "bg-[#D7BD46]" : "bg-[#9CA5AF]"}`} />
                          <div className="min-w-0">
                            <p className={`text-[11px] ${item.active ? "font-medium text-[#A68E24]" : "text-[#858E99]"}`}>{item.year}</p>
                            <h3 className="mt-1 text-[12px] font-semibold leading-[1.5] text-[#263654]">{item.title}</h3>
                            <p className="mt-1 text-[11px] leading-[1.5] text-[#858E99]">{item.detail}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </aside>
            </div>
          </div>
        </div>

        {search && (
          <div className="fixed inset-x-4 top-[70px] z-30 mx-auto flex max-w-[420px] items-center justify-between rounded-md border border-[#E2E5E9] bg-white px-4 py-3 text-[13px] text-[#687382] shadow-md">
            <span>Buscando por <strong className="text-[#303B4C]">{search}</strong></span>
            <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca" className="ml-3 text-[#9099A3] hover:text-[#303B4C]">
              <X size={16} />
            </button>
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}
