"use client";

import { ArrowLeft, ArrowRight, Check, Layers, ListChecks } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./revisoes.module.css";

export default function NovaRevisao({ areas = [], questoes = [], onStart, busy = false }) {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [temas, setTemas] = useState([]);
  const [modo, setModo] = useState("quiz");
  const heading = useRef(null);
  const wizard = useRef(null);
  const selecionadas = questoes.filter((q) => temas.includes(q.temaId));
  const nomes = areas
    .flatMap((a) => a.temas)
    .filter((t) => temas.includes(t.id))
    .map((t) => t.nome);
  function mudarPasso(novo) {
    setPasso(novo);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      wizard.current?.scrollIntoView?.({ block: "start", behavior: "instant" });
    });
  }
  function alternar(ids) {
    setTemas((anterior) =>
      ids.every((id) => anterior.includes(id))
        ? anterior.filter((id) => !ids.includes(id))
        : [...new Set([...anterior, ...ids])],
    );
  }
  return (
    <div className={styles.page}>
      <Link href="/paginaRevisoes" className={styles.voltar}>
        <ArrowLeft size={16} aria-hidden="true" /> Central de revisões
      </Link>
      <header className={styles.header}>
        <h1>Nova revisão</h1>
        <p className={styles.descricao}>
          Monte uma sessão no seu ritmo, com os assuntos que fazem sentido agora.
        </p>
      </header>
      <div className={styles.wizard} ref={wizard}>
        <nav aria-label="Etapas da nova revisão">
          <ol className={styles.steps}>
            {["Assuntos", "Formato", "Conferência"].map((nome, i) => (
              <li
                key={nome}
                aria-current={passo === i + 1 ? "step" : undefined}
                data-complete={passo > i + 1}
              >
                <span>{passo > i + 1 ? <Check size={16} aria-hidden="true" /> : i + 1}</span>
                {nome}
              </li>
            ))}
          </ol>
        </nav>
        <h2 ref={heading} tabIndex={-1} className={styles.srOnly}>
          Passo {passo} de 3: {["Assuntos", "Formato", "Conferência"][passo - 1]}
        </h2>
        {passo === 1 ? (
          <section className={styles.panel} aria-labelledby="assuntos-title">
            <div className={styles.panelHeader}>
              <h2 id="assuntos-title">O que você quer revisar?</h2>
            </div>
            <p className={styles.descricao}>
              Escolha uma área inteira ou combine os temas que quer reforçar.
            </p>
            <div className={styles.areas}>
              {areas.map((area) => {
                const ids = area.temas.map((t) => t.id);
                const marcados = ids.filter((id) => temas.includes(id)).length;
                return (
                  <fieldset key={area.id} className={styles.area}>
                    <legend className={styles.srOnly}>{area.nome}</legend>
                    <label className={styles.areaTitulo}>
                      <input
                        type="checkbox"
                        checked={marcados === ids.length}
                        ref={(node) => {
                          if (node) node.indeterminate = marcados > 0 && marcados < ids.length;
                        }}
                        onChange={() => alternar(ids)}
                      />
                      <strong>{area.nome}</strong>
                      <span>{questoes.filter((q) => ids.includes(q.temaId)).length} questões</span>
                    </label>
                    <div className={styles.temas}>
                      {area.temas.map((tema) => (
                        <label key={tema.id} className={styles.tema}>
                          <input
                            type="checkbox"
                            checked={temas.includes(tema.id)}
                            onChange={() => alternar([tema.id])}
                          />
                          <span>{tema.nome}</span>
                          <small>
                            {questoes.filter((q) => q.temaId === tema.id).length} questões
                          </small>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </section>
        ) : passo === 2 ? (
          <section className={styles.panel} aria-labelledby="formato-title">
            <div className={styles.panelHeader}>
              <h2 id="formato-title">Em qual formato você quer revisar?</h2>
            </div>
            <p className={styles.descricao}>Escolha como prefere praticar nesta sessão.</p>
            <fieldset className={styles.formatos}>
              <legend className={styles.srOnly}>Formato da revisão</legend>
              {[
                {
                  id: "quiz",
                  nome: "Quiz",
                  texto:
                    "Responda questões de múltipla escolha e confira a explicação de cada resposta.",
                  icon: ListChecks,
                },
                {
                  id: "flashcards",
                  nome: "Flashcards",
                  texto:
                    "Tente lembrar a resposta, revele o cartão e reforce os conceitos no seu ritmo.",
                  icon: Layers,
                },
              ].map(({ id, nome, texto, icon: Icon }) => (
                <label className={styles.formatoOpcao} key={id} data-selected={modo === id}>
                  <input
                    type="radio"
                    name="formato"
                    value={id}
                    checked={modo === id}
                    onChange={() => setModo(id)}
                  />
                  <Icon size={25} aria-hidden="true" />
                  <strong>{nome}</strong>
                  <span>{texto}</span>
                </label>
              ))}
            </fieldset>
          </section>
        ) : (
          <section className={styles.panel} aria-labelledby="conferencia-title">
            <div className={styles.panelHeader}>
              <h2 id="conferencia-title">Tudo pronto para começar?</h2>
            </div>
            <p className={styles.descricao}>
              Confira sua sessão. Você pode voltar para ajustar qualquer escolha.
            </p>
            <dl className={styles.conferencia}>
              <div>
                <dt>Assuntos escolhidos</dt>
                <dd>{nomes.join(", ")}</dd>
              </div>
              <div>
                <dt>Formato</dt>
                <dd>{modo === "quiz" ? "Quiz" : "Flashcards"}</dd>
              </div>
              <div>
                <dt>{modo === "quiz" ? "Questões" : "Cartões"}</dt>
                <dd>{selecionadas.length}</dd>
              </div>
              <div>
                <dt>Tempo estimado</dt>
                <dd>Cerca de {selecionadas.length} minutos</dd>
              </div>
            </dl>
            <p className={styles.nota}>
              A avaliação de dificuldade é opcional e aparece só no final.
            </p>
          </section>
        )}
        <div className={styles.wizardFooter}>
          {passo > 1 ? (
            <button
              className={styles.secundario}
              type="button"
              onClick={() => mudarPasso(passo - 1)}
            >
              <ArrowLeft size={16} aria-hidden="true" /> Voltar
            </button>
          ) : (
            <Link href="/paginaRevisoes" className={styles.secundario}>
              Cancelar
            </Link>
          )}
          <span className={styles.selecaoResumo} aria-live="polite">
            {selecionadas.length}{" "}
            {modo === "quiz" ? "questões selecionadas" : "cartões selecionados"}
          </span>
          <button
            type="button"
            data-wisen-hover="preserve"
            className={styles.primario}
            disabled={!selecionadas.length || busy}
            onClick={() => {
              if (passo < 3) mudarPasso(passo + 1);
              else if (onStart) onStart(temas, modo);
              else
                router.push(
                  `/paginaSessaoRevisao?${new URLSearchParams({ temas: temas.join(","), formato: modo })}`,
                );
            }}
          >
            {passo === 3 ? "Iniciar revisão" : "Continuar"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
