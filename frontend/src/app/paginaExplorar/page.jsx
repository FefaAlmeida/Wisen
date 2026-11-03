"use client";

import { ArrowDownWideNarrow, ArrowUpRight, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stories = [
  {
    id: "selic",
    category: "Economia",
    source: "Economia",
    age: "há 2 horas",
    minutes: 120,
    title: "Copom mantém taxa Selic em 10,50% ao ano",
    summary: "Decisão impacta crédito, inflação e crescimento econômico no país.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=85",
    concepts: ["Selic", "Inflação", "Política monetária"],
  },
  {
    id: "geleiras",
    category: "Meio ambiente",
    source: "Meio ambiente",
    age: "há 5 horas",
    minutes: 300,
    title: "Estudo aponta aceleração do derretimento das geleiras",
    summary: "Pesquisadores alertam para impactos globais nas próximas décadas.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
    concepts: ["Clima", "Geleiras", "Aquecimento global"],
  },
  {
    id: "ia-educacao",
    category: "Tecnologia",
    source: "Tecnologia",
    age: "há 8 horas",
    minutes: 480,
    title: "Inteligência artificial ganha espaço na educação",
    summary: "Ferramentas de IA estão transformando a forma de ensinar e aprender.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=85",
    concepts: ["Inteligência artificial", "Educação", "Tecnologia"],
  },
  {
    id: "acesso-informacao",
    category: "Tecnologia",
    source: "Tecnologia",
    age: "há 1 dia",
    minutes: 1440,
    title: "Novas tecnologias ampliam o acesso à informação",
    summary: "Ferramentas digitais transformam a maneira como as pessoas consomem notícias.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85",
    concepts: ["Tecnologia", "Informação", "Inclusão digital"],
  },
  {
    id: "clima-global",
    category: "Meio ambiente",
    source: "Meio ambiente",
    age: "há 1 dia",
    minutes: 1500,
    title: "Pesquisadores analisam mudanças no clima global",
    summary: "Estudos reforçam a importância de compreender os impactos ambientais.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=85",
    concepts: ["Clima", "Sustentabilidade", "Aquecimento global"],
  },
  {
    id: "mercado",
    category: "Economia",
    source: "Economia",
    age: "há 2 dias",
    minutes: 2880,
    title: "Cenário econômico influencia decisões do mercado",
    summary: "Indicadores ajudam a compreender tendências e movimentos da economia.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    concepts: ["Mercado", "Economia", "Indicadores"],
  },
];

const topics = ["Economia", "Meio ambiente", "Tecnologia"];

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesInterests(story, interests) {
  const storyTopics = [story.category, ...story.concepts].map(normalize);
  return interests.some((interest) => {
    const normalizedInterest = normalize(interest);
    return storyTopics.some(
      (topic) => topic.includes(normalizedInterest) || normalizedInterest.includes(topic),
    );
  });
}

export default function PaginaExplorar() {
  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [view, setView] = useState("Para você");
  const [topic, setTopic] = useState("Todos os assuntos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevantes");

  useEffect(() => {
    async function loadInterests() {
      try {
        const response = await fetch("/api/auth/profile");
        if (!response.ok) return;
        const profile = await response.json();
        setInterests(profile.preferences?.interests ?? []);
      } catch {
        setInterests([]);
      } finally {
        setLoadingInterests(false);
      }
    }
    loadInterests();
  }, []);

  const personalizedStories = interests.length
    ? stories.filter((story) => matchesInterests(story, interests))
    : stories;
  const sourceStories = view === "Para você" ? personalizedStories : stories;
  const filteredStories = sourceStories.filter((story) => {
    const matchesTopic = topic === "Todos os assuntos" || story.category === topic;
    const searchText = normalize(`${story.title} ${story.summary} ${story.category} ${story.concepts.join(" ")}`);
    return matchesTopic && searchText.includes(normalize(search));
  });
  const visibleStories = [...filteredStories].sort((first, second) =>
    sort === "recentes" ? first.minutes - second.minutes : 0,
  );

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Explorar" />
      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_70%_0%,#E3EAF4_0%,#F0F4F9_55%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <header className="relative z-50 flex items-center justify-end gap-3 px-4 pt-3 sm:px-5 lg:px-7">
            <search className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]"
                size={16}
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Buscar notícias e conceitos"
                placeholder="Buscar notícias, temas ou conceitos..."
                className="h-9 rounded-full border-wisen-borda bg-white/90 pl-9 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
              />
            </search>
            <MenuPerfil />
          </header>

          <div className="space-y-7 px-4 pb-12 pt-7 sm:px-5 lg:px-7">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-semibold text-[#93A3BE]">DESCOBERTA</p>
                <h1 className="mt-2 text-[34px] font-semibold leading-tight text-wisen-titulo sm:text-[40px]">
                  Explore notícias
                </h1>
                <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#7182A1]">
                  Descubra histórias relacionadas aos temas e conceitos que você acompanha.
                </p>
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-[170px] rounded-full border-wisen-borda bg-white/85 text-xs text-[#344469]">
                  <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="size-3.5" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevantes">Mais relevantes</SelectItem>
                  <SelectItem value="recentes">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <section className="flex flex-col gap-3 rounded-lg border border-[#E1E7F0] bg-white/85 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-[#D1B83F]" />
                <div>
                  <h2 className="text-sm font-semibold text-wisen-titulo">Seus temas</h2>
                  <p className="mt-1 text-xs text-[#7182A1]">
                    {loadingInterests
                      ? "Carregando seus interesses..."
                      : interests.length
                        ? "As recomendações consideram os assuntos e conceitos do seu perfil."
                        : "Adicione interesses no perfil para personalizar suas recomendações."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(interests.length ? interests : topics).map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-[#E8E1B7] bg-[#FBF7E5] px-3 py-1 text-[11px] text-[#52617E]"
                  >
                    {interest}
                  </span>
                ))}
                {!interests.length && !loadingInterests && (
                  <Link href="/paginaPerfil" className="text-[11px] font-medium text-[#30466E] underline underline-offset-2">
                    Ajustar perfil
                  </Link>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <fieldset className="flex flex-wrap gap-2">
                  <legend className="sr-only">Filtrar recomendações</legend>
                  {[
                    { label: "Para você", value: "Para você" },
                    { label: "Todas", value: "Todas" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      size="sm"
                      variant={view === option.value ? "default" : "outline"}
                      onClick={() => setView(option.value)}
                      className={view === option.value
                        ? "h-9 rounded-full border-0 bg-wisen-destaque-suave px-4 text-xs text-wisen-texto shadow-none hover:bg-[#F1E18A]"
                        : "h-9 rounded-full border-wisen-borda bg-white/85 px-4 text-xs text-[#607092] shadow-none"}
                    >
                      {option.label}
                    </Button>
                  ))}
                </fieldset>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="h-9 w-[190px] rounded-full border-wisen-borda bg-white/85 text-xs text-[#344469]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos os assuntos">Todos os assuntos</SelectItem>
                    {topics.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-3 flex items-center justify-between text-xs text-[#8290A8]">
                <span>{visibleStories.length} notícias</span>
                {view === "Para você" && interests.length > 0 && <span>Relacionadas aos seus interesses</span>}
              </div>

              {visibleStories.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleStories.map((story) => (
                    <article key={story.id} className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E1E7F0] bg-white/95 shadow-sm">
                      <div className="relative h-40 shrink-0 overflow-hidden">
                        <Image src={story.image} alt={story.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-[#30466E]">
                          {story.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] text-[#94A2B9]">
                          <span>{story.source}</span>
                          <span>{story.age}</span>
                        </div>
                        <h2 className="text-base font-semibold leading-5 text-wisen-titulo">{story.title}</h2>
                        <p className="mt-2 line-clamp-3 text-[13px] leading-[18px] text-wisen-texto-suave">{story.summary}</p>
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                          {story.concepts.map((concept) => (
                            <span key={concept} className="rounded-full bg-[#FBF7E5] px-2.5 py-1 text-[10px] text-[#52617E]">{concept}</span>
                          ))}
                        </div>
                        <Link href="/paginaEvento" className="mt-4 inline-flex items-center gap-1.5 border-t border-[#E8ECF2] pt-3 text-xs font-semibold text-[#30466E] hover:text-[#172338]">
                          Ler notícia <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[#CFD8E5] bg-white/75 px-5 py-12 text-center">
                  <p className="text-sm font-semibold text-wisen-titulo">Nenhuma notícia encontrada</p>
                  <p className="mt-1 text-xs text-[#7182A1]">Tente outro termo ou escolha um assunto diferente.</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => { setSearch(""); setTopic("Todos os assuntos"); }} className="mt-4 rounded-full">
                    Limpar filtros
                  </Button>
                </div>
              )}
            </section>
          </div>
          <Footer variant="cliente" />
        </div>
      </main>
    </div>
  );
}