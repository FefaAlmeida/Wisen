"use client";

import { ArrowLeft, Bookmark, Check, ChevronDown, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AppTopBar } from "@/components/app/appTopBar";
import Link from "@/components/demo/link";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import Sidebar from "@/components/sidebar";
import { conceitosDetalhados, demoConceptHref } from "@/data/conceitoDetalhes";
import { useDemoSavedConcepts, useDemoSavedItems } from "@/hooks/use-demo-saved-concepts";
import { toast } from "@/lib/toast";
import { usePublicDemo } from "./mode";
import styles from "./newsDetail.module.css";

const concepts = [
  { title: "Mudanças climáticas", detail: "Em revisão", color: "var(--color-wisen-destaque)" },
  { title: "Gases de efeito estufa", detail: "Lacuna", color: "var(--color-wisen-texto-suave)" },
  { title: "Aquecimento global", detail: "Dominado", color: "#30466e" },
  { title: "Nível do mar", detail: "Em revisão", color: "var(--color-wisen-destaque)" },
  { title: "Calotas polares", detail: "Lacuna", color: "var(--color-wisen-texto-suave)" },
];

const timeline = [
  {
    year: "2026",
    title: "Aceleração do derretimento das geleiras",
    detail: "Nova pesquisa aponta que o derretimento está mais rápido do que o previsto.",
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

export default function NewsDetail({ reading = false, story }) {
  const publicDemo = usePublicDemo();
  const [locallySaved, setSaved] = useState(false);
  const storyId = story?.id ?? "geleiras";
  const savedNews = useDemoSavedItems("news", publicDemo);
  const saved = publicDemo ? savedNews.items.includes(storyId) : locallySaved;
  const savedConcepts = useDemoSavedConcepts();
  const [showSources, setShowSources] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const detailed = !story || story.id === "geleiras";
  const relatedConcepts = detailed
    ? concepts
    : conceitosDetalhados
        .filter(
          ({ titulo, categoria }) =>
            story.concepts.includes(titulo) || categoria === story.category,
        )
        .slice(0, 5)
        .map(({ titulo, status }) => ({
          title: titulo,
          detail: status,
          color: "var(--color-wisen-destaque)",
        }));

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  return (
    <div className="min-h-screen bg-wisen-superficie">
      <Sidebar activeItem="Notícias" />
      <main className="relative isolate min-h-screen min-w-0 pt-[76px] font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground fadeTop={false} />
        <AppTopBar />
        <div className={`wisen-container relative z-10 ${styles.page}`}>
          <nav className={styles.toolbar} aria-label="Ações da notícia">
            <Link
              href={publicDemo ? "/paginaExplorar" : "/paginaInicialCliente"}
              className={styles.back}
            >
              <ArrowLeft size={16} aria-hidden="true" /> Voltar para notícias
            </Link>
            <div className={styles.actions}>
              <button
                type="button"
                aria-pressed={saved}
                disabled={publicDemo && !savedNews.ready}
                onClick={() =>
                  publicDemo ? savedNews.toggle(storyId) : setSaved((current) => !current)
                }
                className={`${styles.action} ${saved ? styles.saved : ""}`}
              >
                {saved ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Bookmark size={16} aria-hidden="true" />
                )}
                {saved ? "Salvo" : "Salvar notícia"}
              </button>
              <button type="button" onClick={handleShare} className={styles.action}>
                <Share2 size={16} aria-hidden="true" /> Compartilhar
              </button>
            </div>
          </nav>

          <div className={styles.grid}>
            <article className={styles.article}>
              <header className={styles.articleHeader}>
                <div className={styles.meta}>
                  <span className={styles.category}>{story?.category ?? "Meio ambiente"}</span>
                  {detailed ? (
                    <time dateTime="2026-10-01">1 de outubro de 2026</time>
                  ) : (
                    <span>{story.age}</span>
                  )}
                </div>
                <h1>
                  {detailed
                    ? "Estudo aponta aceleração do derretimento das geleiras no mundo"
                    : story.title}
                </h1>
                <p className={styles.intro}>
                  {detailed
                    ? "Pesquisa internacional alerta que o derretimento das geleiras está acontecendo mais rápido do que o previsto, com impactos no clima e no aumento do nível do mar."
                    : story.summary}
                </p>
              </header>
              <figure className={styles.cover}>
                <Image
                  src={
                    story?.image ??
                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85"
                  }
                  alt={detailed ? "Montanhas e geleiras cobertas de neve" : ""}
                  width={1400}
                  height={700}
                  sizes="(max-width: 1023px) 100vw, 65vw"
                  loading="eager"
                  className={styles.image}
                />
              </figure>
              {detailed && (
                <section className={styles.reading} aria-labelledby="resumo-title">
                  <div className={styles.sectionHeading}>
                    <h2 id="resumo-title">{reading ? "Leitura da notícia" : "Resumo para você"}</h2>
                    <p>
                      {reading
                        ? "Texto ilustrativo para demonstração"
                        : "Adaptado ao seu conhecimento"}
                    </p>
                  </div>
                  <div className={styles.prose}>
                    <p>
                      Um novo estudo internacional mostrou que as geleiras do planeta estão
                      derretendo mais rápido do que o estimado anteriormente. Esse processo é
                      causado principalmente pelo aumento da temperatura global, resultado das
                      emissões de gases de efeito estufa.
                    </p>
                    <p>
                      O derretimento das geleiras contribui para o aumento do nível do mar, afeta
                      ecossistemas litorâneos e milhões de pessoas ao redor do mundo. Além disso,
                      influencia o clima global, já que as geleiras ajudam a regular a temperatura
                      do planeta.
                    </p>
                  </div>
                  <div className={styles.context}>
                    <h3>Por que isso importa?</h3>
                    <p>
                      O derretimento das geleiras afeta o clima, a biodiversidade e a vida de
                      milhões de pessoas. Entender esse tema ajuda a compreender melhor os debates
                      sobre mudanças climáticas e suas consequências.
                    </p>
                  </div>
                </section>
              )}
              {detailed && (
                <section className={styles.sources} aria-labelledby="sources-title">
                  <h2 id="sources-title">Fontes desta notícia</h2>
                  <div className={styles.sourceLinks}>
                    {[
                      "BBC News",
                      "Reuters",
                      "National Geographic",
                      ...(showSources ? ["G1", "Agência Brasil"] : []),
                    ].map((name) => (
                      <Link href="/artigo" key={name}>
                        {name}
                      </Link>
                    ))}
                    <button
                      type="button"
                      aria-expanded={showSources}
                      aria-controls="sources-list-note"
                      onClick={() => setShowSources((current) => !current)}
                    >
                      {showSources ? "Mostrar menos" : "+2 fontes"}
                    </button>
                  </div>
                  <span id="sources-list-note" className="sr-only">
                    {showSources
                      ? "Todas as cinco fontes exibidas"
                      : "Três de cinco fontes exibidas"}
                  </span>
                </section>
              )}
            </article>

            <aside className={styles.aside}>
              <section className={styles.panel} aria-labelledby="conceitos-title">
                <div className={styles.panelHeading}>
                  <span className={styles.eyebrow}>Seu aprendizado</span>
                  <h2 id="conceitos-title">Conceitos relacionados</h2>
                  <p>Conecte a notícia ao que você está aprendendo.</p>
                </div>
                <div className={styles.concepts}>
                  {relatedConcepts.map(({ title, detail, color }) => {
                    const isSaved = savedConcepts.items.includes(title);
                    return (
                      <div key={title} className={styles.concept}>
                        <span
                          className={styles.dot}
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                        <div className={styles.conceptText}>
                          <Link href={demoConceptHref(title)}>{title}</Link>
                          <p>{detail}</p>
                        </div>
                        <button
                          type="button"
                          aria-label={`${isSaved ? "Remover dos salvos" : "Salvar"} conceito ${title}`}
                          aria-pressed={isSaved}
                          title={isSaved ? "Remover dos salvos" : "Salvar para revisar"}
                          disabled={savedConcepts.loading || !savedConcepts.ready}
                          onClick={() => savedConcepts.toggle(title)}
                          className={`${styles.conceptSave} ${isSaved ? styles.saved : ""}`}
                        >
                          {isSaved ? (
                            <Check size={16} aria-hidden="true" />
                          ) : (
                            <Bookmark size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {savedConcepts.error && (
                  <p role="alert" className={styles.feedback}>
                    {savedConcepts.error}
                  </p>
                )}
              </section>

              {detailed && (
                <section className={styles.panel} aria-labelledby="timeline-title">
                  <button
                    type="button"
                    onClick={() => setShowTimeline((current) => !current)}
                    aria-expanded={showTimeline}
                    aria-controls="timeline-content"
                    className={styles.timelineToggle}
                  >
                    <span>
                      <span className={styles.eyebrow}>Em perspectiva</span>
                      <h2 id="timeline-title">Linha do tempo</h2>
                    </span>
                    <ChevronDown
                      size={17}
                      aria-hidden="true"
                      className={showTimeline ? styles.chevronOpen : styles.chevronClosed}
                    />
                  </button>
                  {showTimeline && (
                    <ol id="timeline-content" className={styles.timeline}>
                      {timeline.map((item, index) => (
                        <li key={item.year}>
                          <div className={styles.timelineMeta}>
                            <span>{item.year}</span>
                            {index === 0 && <span className={styles.latest}>Mais recente</span>}
                          </div>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              )}
            </aside>
          </div>
        </div>
        <Footer variant="cliente" sidebarOffset={false} />
      </main>
    </div>
  );
}
