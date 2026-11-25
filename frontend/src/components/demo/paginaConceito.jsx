"use client";

import { Bookmark, Check, CircleHelp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ConceptDetail, { ConceptPanel } from "@/components/conceito/conceptDetail";
import styles from "@/components/conceito/conceptDetail.module.css";
import Link from "@/components/demo/link";
import { Frame } from "@/components/platform/shared";
import { conceitosDetalhados, demoConceptHref } from "@/data/conceitoDetalhes";
import { useDemoSavedConcepts } from "@/hooks/use-demo-saved-concepts";
import { coresNivelDominio } from "@/lib/coresStatusConceito";
import news from "./newsDetail.module.css";

export default function PaginaConceito() {
  const name = useSearchParams().get("conceito") || "Inflação";
  const concept = conceitosDetalhados.find((item) => item.titulo === name);
  return (
    <Frame active="Conceitos">
      {concept ? (
        <DemoConcept key={name} concept={concept} />
      ) : (
        <ConceptPanel title="Conceito não encontrado">
          <Link href="/paginaBiblioteca" className={styles.secondary}>
            Voltar para a biblioteca
          </Link>
        </ConceptPanel>
      )}
    </Frame>
  );
}

function DemoConcept({ concept }) {
  const savedConcepts = useDemoSavedConcepts();
  const saved = savedConcepts.items.includes(concept.titulo);
  const [gap, setGap] = useState(false);
  const coresDominio = coresNivelDominio(concept.progresso);
  const connections = conceitosDetalhados
    .filter((item) => item.categoria === concept.categoria && item.titulo !== concept.titulo)
    .slice(0, 3)
    .map((item) => ({
      name: item.titulo,
      relation: item.categoria,
      href: demoConceptHref(item.titulo),
    }));

  return (
    <ConceptDetail
      name={concept.titulo}
      category={concept.categoria}
      description={concept.descricao}
      status={gap ? "Lacuna" : concept.status}
      connections={connections}
      actions={
        <>
          <button
            type="button"
            className={`${news.action} ${saved ? news.saved : ""}`}
            aria-pressed={saved}
            disabled={savedConcepts.loading || !savedConcepts.ready}
            onClick={() => savedConcepts.toggle(concept.titulo)}
          >
            {saved ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Bookmark size={16} aria-hidden="true" />
            )}
            {saved ? "Conceito salvo" : "Salvar conceito"}
          </button>
          {savedConcepts.error && (
            <p role="alert" className={styles.feedback}>
              {savedConcepts.error}
            </p>
          )}
        </>
      }
      sidebar={
        <ConceptPanel eyebrow="Seu aprendizado" title="Como você está neste conceito">
          <div
            style={{
              "--mastery-indicator": coresDominio.indicador,
              "--mastery-text": coresDominio.texto,
            }}
          >
            <div className={styles.progressLabel}>
              <span>Nível de domínio</span>
              <strong>{concept.progresso}%</strong>
            </div>
            <progress
              className={styles.progress}
              value={concept.progresso}
              max="100"
              aria-label={`Nível de domínio de ${concept.titulo}`}
            />
          </div>
          <p className={`${styles.muted} mt-3`}>Dados ilustrativos de aprendizado.</p>
          <div className={styles.studyActions}>
            <button
              type="button"
              className={styles.secondary}
              aria-pressed={gap}
              onClick={() => setGap((value) => !value)}
            >
              {gap ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <CircleHelp size={16} aria-hidden="true" />
              )}
              {gap ? "Marcado para revisar" : "Ainda tenho dúvidas"}
            </button>
          </div>
          <p className={styles.feedback} role="status">
            {gap
              ? "Dúvida marcada nesta demonstração. Releia a explicação e o exemplo para retomar o assunto."
              : "Identifique suas dúvidas enquanto explora o conceito."}
          </p>
        </ConceptPanel>
      }
    >
      <section aria-labelledby="definition-title">
        <div className={news.sectionHeading}>
          <h2 id="definition-title">Entenda o conceito</h2>
          <p>O que significa e como funciona.</p>
        </div>
        <div className={news.prose}>
          {concept.explicacao.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className={news.context}>
          <h3>Na prática</h3>
          <p>{concept.exemplo}</p>
        </div>
      </section>
      <section className="mt-8" aria-labelledby="importance-title">
        <div className={news.sectionHeading}>
          <h2 id="importance-title">Por que isso importa?</h2>
        </div>
        <p className={news.prose}>{concept.importancia}</p>
      </section>
    </ConceptDetail>
  );
}
