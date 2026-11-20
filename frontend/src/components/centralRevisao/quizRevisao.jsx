"use client";

import { Check, X } from "lucide-react";
import styles from "./revisoes.module.css";

export default function QuizRevisao({
  questao,
  modo,
  resposta,
  revelada,
  onResponder,
  onRevelar,
  live = false,
  busy = false,
}) {
  const respondida = resposta !== undefined;
  return (
    <div key={questao.id}>
      <div className={styles.contexto}>
        <span>{live ? "Contexto do conceito" : "Contexto ilustrativo"}</span>
        <h3>{questao.titulo}</h3>
        <p>{questao.contexto}</p>
      </div>
      <h2 className={styles.pergunta}>{questao.pergunta}</h2>
      {modo === "quiz" ? (
        <>
          <div className={styles.opcoes}>
            {questao.opcoes.map((opcao, i) => {
              const selecionada = resposta === i;
              const correta = respondida && i === questao.correta;
              const errada = selecionada && !correta;
              return (
                <button
                  key={opcao}
                  type="button"
                  aria-pressed={selecionada}
                  aria-disabled={respondida || busy}
                  onClick={() => {
                    if (!respondida && !busy) onResponder(i);
                  }}
                  className={`${styles.opcao} ${correta ? styles.correta : ""} ${errada ? styles.errada : ""}`}
                >
                  <span className={styles.letra}>{String.fromCharCode(65 + i)}</span>
                  <span>{opcao}</span>
                  {correta && <Check size={20} aria-label="Alternativa correta" />}
                  {errada && <X size={20} aria-label="Sua resposta está incorreta" />}
                </button>
              );
            })}
          </div>
          {respondida && (
            <div className={styles.explicacao} role="status">
              <strong>
                {resposta === questao.correta ? "Resposta correta!" : "Resposta incorreta."}
              </strong>
              <p>{questao.explicacao}</p>
            </div>
          )}
        </>
      ) : (
        <div className={styles.flashcard}>
          {revelada ? (
            <div role="status">
              <strong>Resposta</strong>
              <p>{questao.explicacao}</p>
            </div>
          ) : (
            <>
              <p>Pense na resposta antes de revelar.</p>
              <button
                data-wisen-hover="preserve"
                className={styles.primario}
                type="button"
                onClick={onRevelar}
                disabled={busy}
              >
                Revelar resposta
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
