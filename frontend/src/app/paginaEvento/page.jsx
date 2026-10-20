"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  GraduationCap,
  Home,
  Lightbulb,
  Link2,
  Newspaper,
  Search,
  Settings,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { label: "Início", icon: Home },
  { label: "Explorar", icon: Compass },
  { label: "Revisões", icon: Clock3 },
  { label: "Meu conhecimento", icon: GraduationCap },
  { label: "Notícias", icon: Newspaper, active: true },
  { label: "Conexões", icon: Link2 },
  { label: "Aprendizado", icon: GraduationCap },
];

const concepts = [
  { title: "Mudanças climáticas", detail: "Em revisão", color: "bg-amber-400" },
  { title: "Gases de efeito estufa", detail: "Lacuna", color: "bg-rose-400" },
  { title: "Aquecimento global", detail: "Dominado", color: "bg-emerald-500" },
  { title: "Nível do mar", detail: "Em revisão", color: "bg-yellow-400" },
  { title: "Calotas polares", detail: "Lacuna", color: "bg-red-400" },
];

const timeline = [
  {
    year: "2026 · Estudo mais recente",
    title: "Aceleração do derretimento das geleiras",
    detail: "Nova pesquisa aponta que o derretimento está mais rápido do que o previsto.",
    active: true,
  },
  {
    year: "2024",
    title: "Recorde de perda de gelo na Antártida",
    detail: "Dados mostram o menor nível de gelo registrado na região.",
  },
  {
    year: "2022",
    title: "Relatório da ONU sobre mudanças climáticas",
    detail: "Alerta para o impacto do derretimento das geleiras no nível do mar.",
  },
  {
    year: "2020",
    title: "Estudo já indicava aceleração",
    detail: "Pesquisadores apontavam sinais de aumento na taxa de derretimento.",
  },
];

export default function PaginaEvento() {
  const [saved, setSaved] = useState(false);
  const [savedConcepts, setSavedConcepts] = useState([]);
  const [search, setSearch] = useState("");

  function toggleConcept(title) {
    setSavedConcepts((current) =>
      current.includes(title)
        ? current.filter((concept) => concept !== title)
        : [...current, title],
    );
  }

  return (
    <main
      className="min-h-screen bg-[#f1f3f6] text-[#202a3b]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[128px] flex-col bg-[#202d3a] px-2.5 py-5 text-white sm:flex lg:w-[220px] lg:px-4">
        <a href="#" className="mb-8 px-1 text-[20px] font-bold tracking-tight lg:text-[24px]">
          Wisen<span className="align-top text-[9px] text-[#f3d96b]">•</span>
        </a>

        <nav aria-label="Navegação principal" className="flex flex-col gap-1.5">
          {navigation.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              className={`flex h-10 items-center gap-2 rounded-md px-2 text-[10px] transition-colors lg:gap-3 lg:px-2.5 lg:text-[12px] ${
                active
                  ? "bg-[#fff2bc] font-semibold text-[#25303c]"
                  : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <a
          href="#"
          className="mt-auto flex h-10 items-center gap-2 rounded-md px-2 text-[10px] text-[#c5ced8] hover:bg-white/10 hover:text-white lg:gap-3 lg:px-2.5 lg:text-[12px]"
        >
          <Settings size={17} strokeWidth={1.8} />
          <span>Configurações</span>
        </a>
      </aside>

      <div className="min-h-screen sm:ml-[128px] lg:ml-[220px]">
        <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b border-[#e5e8ed] bg-[#f5f6f8]/95 px-4 backdrop-blur sm:px-5 lg:px-7">
          <div className="flex w-full max-w-[420px] items-center gap-2.5">
            <Search className="absolute ml-3 text-[#9099a6]" size={17} />
            <Input
              aria-label="Buscar"
              placeholder="Buscar por notícias, conceitos ou temas..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 border-[#e2e5e9] bg-white pl-10 text-[13px] shadow-none placeholder:text-[#9aa2ad]"
            />
            <kbd className="hidden shrink-0 rounded border border-[#e0e3e7] bg-white px-2 py-1.5 text-[10px] text-[#818a97] md:block">
              Ctrl K
            </kbd>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Notificações"
              className="relative text-[#536071]"
            >
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#e5c844]" />
            </Button>
            <button
              type="button"
              aria-label="Perfil de NB"
              className="grid size-9 place-items-center rounded-full bg-[#f1e7b9] text-[12px] font-semibold text-[#576071]"
            >
              NB
            </button>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1330px] grid-cols-1 gap-5 px-4 py-5 sm:px-5 md:grid-cols-[minmax(0,1.85fr)_minmax(210px,0.95fr)] md:gap-4 lg:px-7 lg:py-6">
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[13px] text-[#707b89] hover:text-[#263448]"
              >
                <ArrowLeft size={16} />
                Voltar para notícias
              </a>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaved((current) => !current)}
                  className={`h-9 gap-2 px-3 text-[13px] ${
                    saved ? "text-[#ad8e19]" : "text-[#5e6876]"
                  }`}
                >
                  {saved ? <Check size={16} /> : <Bookmark size={16} />}
                  {saved ? "Salvo" : "Salvar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 px-3 text-[13px] text-[#5e6876]"
                >
                  <Share2 size={16} />
                  Compartilhar
                </Button>
              </div>
            </div>

            <article className="overflow-hidden rounded-lg border border-[#e4e7eb] bg-white shadow-[0_2px_8px_rgba(30,42,56,0.025)]">
              <div className="relative h-[190px] overflow-hidden bg-[#8b9da6] md:h-[170px] lg:h-[210px]">
                <div
                  role="img"
                  aria-label="Geleira e montanhas cobertas de neve ao amanhecer"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg,rgba(18,35,48,.03) 45%,rgba(18,35,48,.48) 100%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85')",
                  }}
                />
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full bg-[#263c4dcc] px-3 py-1.5 text-[11px] text-white">
                  <Sparkles size={13} />
                  Meio ambiente
                </div>
                <span className="absolute bottom-3 right-4 rounded-full bg-[#263c4dcc] px-3 py-1.5 text-[11px] text-white">
                  1 de outubro de 2026
                </span>
              </div>

              <div className="px-5 pb-5 pt-4 sm:px-6">
                <h1 className="max-w-[720px] text-[25px] leading-[1.16] font-bold tracking-[-0.04em] text-[#172338] sm:text-[30px]">
                  Estudo aponta aceleração do derretimento das geleiras no mundo
                </h1>
                <p className="mt-2 max-w-[720px] text-[14px] leading-[1.55] text-[#687382]">
                  Pesquisa internacional alerta que o derretimento das geleiras
                  está acontecendo mais rápido do que o previsto, com impactos
                  no clima e no aumento do nível do mar.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#75808c]">
                  <span className="mr-0.5">Fontes originais:</span>
                  {[
                    ["BBC News", "bg-[#c43a3a]"],
                    ["Reuters", "bg-[#e79d57]"],
                    ["National Geographic", "bg-[#e4c840]"],
                  ].map(([source, color]) => (
                    <span
                      key={source}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#e9ebed] px-2.5 py-1.5"
                    >
                      <span className={`size-2.5 rounded-[3px] ${color}`} />
                      {source}
                      <ChevronRight size={12} />
                    </span>
                  ))}
                  <button
                    type="button"
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#e9ebed] px-2.5 py-1.5 hover:bg-[#f7f8f9]"
                  >
                    +2 fontes <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            </article>

            <section className="relative mt-4 rounded-lg border border-[#e4e7eb] bg-white px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2.5 text-[16px] font-semibold text-[#263246]">
                  <Sparkles size={18} className="text-[#dbbd43]" />
                  Resumo para você
                </h2>
                <span className="hidden text-[11px] text-[#9099a3] sm:inline">
                  Adaptado ao seu nível de conhecimento
                </span>
              </div>

              <p className="mt-3 text-[14px] leading-[1.65] text-[#697482]">
                Um novo estudo internacional mostrou que as geleiras do planeta
                estão derretendo mais rápido do que o estimado anteriormente.
                Esse processo é causado principalmente pelo aumento da
                temperatura global, resultado das emissões de gases de efeito
                estufa.
              </p>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#697482]">
                O derretimento das geleiras contribui para o aumento do nível do
                mar, afeta ecossistemas litorâneos e milhões de pessoas ao redor
                do mundo. Além disso, influencia o clima global, já que as
                geleiras ajudam a regular a temperatura do planeta.
              </p>

              <Separator className="my-4 bg-[#edf0f2]" />

              <div className="flex gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fff8d9] text-[#d7b92e]">
                  <Lightbulb size={17} />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-[#384354]">
                    Por que isso importa?
                  </h3>
                  <p className="mt-1 text-[13px] leading-[1.55] text-[#7b8490]">
                    O derretimento das geleiras afeta o clima, a biodiversidade
                    e a vida de milhões de pessoas. Entender esse tema ajuda a
                    compreender melhor os debates sobre mudanças climáticas e
                    suas consequências.
                  </p>
                </div>
              </div>

            </section>
          </section>

          <aside className="flex min-w-0 flex-col gap-4">
            <section className="rounded-lg border border-[#e4e7eb] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#303b4c]">
                  Conceitos relacionados
                </h2>
                <CircleHelp size={15} className="text-[#a0a8b1]" />
              </div>
              <div className="flex flex-col">
                {concepts.map(({ title, detail, color }) => {
                  const isSaved = savedConcepts.includes(title);

                  return (
                    <div
                      key={title}
                      className="flex min-h-[48px] items-center gap-2.5 border-b border-[#f0f1f3] last:border-0"
                    >
                      <span className={`size-2 shrink-0 rounded-full ${color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-medium text-[#3e4858]">
                          {title}
                        </p>
                        <p className="text-[11px] leading-4 text-[#929aa4]">
                          {detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleConcept(title)}
                        aria-label={`${isSaved ? "Remover" : "Adicionar"} ${title} ${
                          isSaved ? "dos salvos" : "aos salvos"
                        }`}
                        className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2 text-[10px] transition-colors ${
                          isSaved
                            ? "border-[#e5d78c] bg-[#fff9df] text-[#8d7414]"
                            : "border-[#e7e9ec] text-[#727c89] hover:bg-[#f7f8f9]"
                        }`}
                      >
                        {isSaved ? <Check size={12} /> : <Bookmark size={12} />}
                        {isSaved ? "Salvo" : "Revisar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleConcept(title)}
                        aria-label={`Salvar conceito: ${title}`}
                        className="grid size-8 shrink-0 place-items-center text-[#a0a8b1] hover:text-[#8d7414]"
                      >
                        {isSaved ? (
                          <Check size={15} className="text-[#ad8e19]" />
                        ) : (
                          <Bookmark size={15} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-[#e4e7eb] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#303b4c]">
                  Linha do tempo do evento
                </h2>
                <ChevronDown size={16} className="text-[#8d96a1]" />
              </div>
              <div className="relative ml-1.5">
                <span className="absolute bottom-2 left-[3px] top-2 w-px bg-[#e6e9ec]" />
                {timeline.map((item) => (
                  <article
                    key={item.year}
                    className="relative flex gap-3 pb-4 last:pb-0"
                  >
                    <span
                      className={`relative z-[1] mt-1 size-[7px] shrink-0 rounded-full border-2 border-white ${
                        item.active ? "bg-[#d7bd46]" : "bg-[#9ca5af]"
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-[11px] ${
                          item.active
                            ? "font-medium text-[#a68e24]"
                            : "text-[#858e99]"
                        }`}
                      >
                        {item.year}
                      </p>
                      <h3 className="mt-1 text-[12px] leading-[1.4] font-semibold text-[#424d5c]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] leading-[1.45] text-[#858e99]">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {search && (
          <div className="fixed inset-x-4 top-[68px] z-30 mx-auto flex max-w-[420px] items-center justify-between rounded-md border border-[#e2e5e9] bg-white px-4 py-3 text-[13px] text-[#687382] shadow-md sm:left-[calc(50%+64px)] sm:right-auto sm:-translate-x-1/2 lg:left-[calc(50%+110px)]">
            <span>
              Buscando por <strong className="text-[#303b4c]">{search}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpar busca"
              className="ml-3 text-[#9099a3] hover:text-[#303b4c]"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}