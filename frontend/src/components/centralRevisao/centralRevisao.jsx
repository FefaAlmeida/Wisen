"use client";

import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import NovaRevisao from "./novaRevisao";
import PainelRevisoes from "./painelRevisoes";
import QuizRevisao from "./quizRevisao";
import styles from "./revisoes.module.css";
import { areas, questoes } from "./revisoesDemo";

export default function CentralRevisao({
  view = "painel",
  initialTemas = [],
  initialModo = "quiz",
}) {
  const router = useRouter();
  const [etapa, setEtapa] = useState("sessao");
  const temas = initialTemas;
  const modo = initialModo === "flashcards" ? "flashcards" : "quiz";
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [reveladas, setReveladas] = useState({});
  const [avaliacao, setAvaliacao] = useState("");
  const heading = useRef(null);
  const selecionadas = questoes.filter((q) => temas.includes(q.temaId));
  const atual = selecionadas[indice];
  const feitas = modo === "quiz" ? Object.keys(respostas).length : Object.keys(reveladas).length;
  const acertos = selecionadas.filter((q) => respostas[q.id] === q.correta).length;
  const nomes = areas
    .flatMap((a) => a.temas)
    .filter((t) => temas.includes(t.id))
    .map((t) => t.nome);

  function focar() {
    requestAnimationFrame(() => heading.current?.focus());
  }
  function mudarIndice(novo) {
    setIndice(novo);
    focar();
  }

  if (view === "painel") return <PainelRevisoes />;
  if (view === "nova") return <NovaRevisao />;
  if (!selecionadas.length)
    return (
      <div className={styles.page}>
        <h1 className={styles.pergunta}>Prepare sua revisão primeiro</h1>
        <p className={styles.descricao}>Escolha os assuntos e o formato antes de começar.</p>
        <Link href="/paginaRevisoes/nova" className={styles.primario}>
          Nova revisão
        </Link>
      </div>
    );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 ref={heading} tabIndex={-1}>
          {etapa === "sessao" ? "Sua revisão" : "Revisão concluída"}
        </h1>
        <div className={styles.meta}>
          <span className={styles.badge}>Prévia</span>
          <span>Dados ilustrativos · progresso nesta sessão</span>
        </div>
      </header>
      {etapa === "sessao" ? (
        <section className={`${styles.panel} ${styles.sessao}`} aria-label="Sessão de revisão">
          <div className={styles.sessaoTopo}>
            <span>
              {modo === "quiz" ? "Questão" : "Cartão"} {indice + 1} de {selecionadas.length}
            </span>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                router.push("/paginaRevisoes");
              }}
            >
              Sair da revisão
            </button>
          </div>
          <progress
            className={styles.progresso}
            aria-label="Progresso da revisão"
            max={selecionadas.length}
            value={feitas}
          />
          <QuizRevisao
            questao={atual}
            modo={modo}
            resposta={respostas[atual.id]}
            revelada={reveladas[atual.id]}
            onResponder={(resposta) =>
              setRespostas((r) => (r[atual.id] !== undefined ? r : { ...r, [atual.id]: resposta }))
            }
            onRevelar={() => setReveladas((r) => ({ ...r, [atual.id]: true }))}
          />
          <nav className={styles.navegacao} aria-label="Navegação da revisão">
            <button
              type="button"
              className={styles.secundario}
              disabled={indice === 0}
              onClick={() => mudarIndice(indice - 1)}
            >
              <ArrowLeft size={17} aria-hidden="true" /> Anterior
            </button>
            <button
              type="button"
              className={styles.primario}
              disabled={modo === "quiz" ? respostas[atual.id] === undefined : !reveladas[atual.id]}
              onClick={() => {
                if (indice === selecionadas.length - 1) {
                  setEtapa("resultado");
                  focar();
                } else mudarIndice(indice + 1);
              }}
            >
              {indice === selecionadas.length - 1 ? "Concluir revisão" : "Próxima questão"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </nav>
        </section>
      ) : (
        <section
          className={`${styles.panel} ${styles.resultado}`}
          aria-labelledby="resultado-title"
        >
          <CheckCheck size={36} aria-hidden="true" className={styles.resultadoIcon} />
          <h2 id="resultado-title">Uma etapa a mais no seu aprendizado</h2>
          <p>
            {modo === "quiz"
              ? `${acertos} de ${selecionadas.length} respostas corretas`
              : `${feitas} cartões revisados`}
          </p>
          <p className={styles.descricao}>{nomes.join(", ")}</p>
          <fieldset className={styles.avaliacao}>
            <legend>
              Como foi esta revisão? <small>Opcional</small>
            </legend>
            <div>
              {["Fácil", "Médio", "Difícil"].map((nivel) => (
                <button
                  type="button"
                  className={styles.secundario}
                  key={nivel}
                  aria-pressed={avaliacao === nivel}
                  onClick={() => setAvaliacao(nivel)}
                >
                  {nivel}
                </button>
              ))}
            </div>
            <p className={styles.nota} role="status">
              {avaliacao
                ? `Avaliação da sessão: ${avaliacao.toLowerCase()}.`
                : "Se quiser, registre como se sentiu nesta sessão."}
            </p>
          </fieldset>
          <button
            type="button"
            className={styles.primario}
            onClick={() => {
              router.push("/paginaRevisoes/nova");
            }}
          >
            Preparar outra revisão <ArrowRight size={17} aria-hidden="true" />
          </button>
        </section>
      )}
    </div>
  );
}
