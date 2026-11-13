import { Check, Trophy } from "lucide-react";
import styles from "./conhecimento.module.css";
import cards from "./constancia.module.css";
import { DominioAreas } from "./dominioAreas";
import { scoreColor } from "./scoreRing";

const gapTiles = Array.from({ length: 24 }, (_, index) => `gap-${index + 1}`);

function Chama() {
  return (
    <svg viewBox="0 0 80 90" fill="none" aria-hidden="true" className={cards.flame}>
      <path
        d="M43 4C48 23 65 25 62 43C69 40 70 34 70 34C83 59 68 83 43 84C17 86 4 68 10 49C12 42 17 37 22 33C20 46 27 48 29 43C36 31 29 18 43 4Z"
        fill="#ff7438"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M40 43C45 53 55 55 55 65C55 76 47 81 38 79C25 77 23 65 29 58C29 66 34 65 35 61C38 54 35 50 40 43Z"
        fill="#ffe899"
      />
      <ellipse cx="30" cy="48" rx="3" ry="4.5" fill="currentColor" />
      <ellipse cx="51" cy="48" rx="3" ry="4.5" fill="currentColor" />
      <path d="M36 57Q41 62 46 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M7 18V25M3.5 21.5H10.5M68 9V16M64.5 12.5H71.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartoesEstatisticas() {
  return (
    <section className={`${styles.stats} ${cards.group}`} aria-label="Resumo do aprendizado">
      <div className={cards.card}>
        <div className={cards.heading}>
          <h2>Domínio geral</h2>
        </div>
        <div className={`${cards.body} ${cards.scoreBody}`}>
          <DominioAreas />
        </div>
        <div className={cards.bottomRule} aria-hidden="true" />
      </div>
      <div className={cards.card}>
        <div className={cards.heading}>
          <h2>Conceitos dominados</h2>
        </div>
        <div className={cards.masteredBody}>
          <div className={cards.masteredValue}>
            <strong>128</strong>
            <span>de 212 conceitos</span>
          </div>
          <div className={cards.masteredProgress}>
            <div
              className={cards.progress}
              role="progressbar"
              aria-label="Conceitos dominados"
              aria-valuenow={128}
              aria-valuemin={0}
              aria-valuemax={212}
            >
              <span
                style={{
                  width: `${(128 / 212) * 100}%`,
                  background: scoreColor((128 / 212) * 100),
                }}
              />
            </div>
            <span className={cards.masteredPercent}>60%</span>
          </div>
        </div>
        <div className={cards.bottomRule} aria-hidden="true" />
      </div>
      <div className={cards.card}>
        <div className={cards.heading}>
          <h2>Lacunas superadas</h2>
        </div>
        <div className={cards.body}>
          <div className={`${cards.value} ${cards.gapValue}`}>
            <strong>24</strong>
            <span>neste mês</span>
          </div>
        </div>
        <div className={cards.support}>
          <div
            className={cards.mosaic}
            role="img"
            aria-label="24 quadrados: um para cada lacuna superada neste mês"
          >
            {gapTiles.map((id) => (
              <span key={id} />
            ))}
          </div>
        </div>
        <div className={cards.bottomRule} aria-hidden="true" />
      </div>
      <div className={`${cards.card} ${cards.reading}`}>
        <div className={cards.heading}>
          <h2>Constância de leitura</h2>
          <span className={cards.record} title="Recorde de leitura: 12 dias">
            <Trophy size={13} aria-hidden="true" />
            12 dias
          </span>
        </div>
        <div className={`${cards.body} ${cards.streakBody}`}>
          <div className={`${cards.value} ${cards.streakValue}`}>
            <Chama />
            <strong>
              7<span className={cards.streakUnit}>dias</span>
              <span className="sr-only"> seguidos</span>
            </strong>
          </div>
        </div>
        <div
          className={`${cards.support} ${cards.week}`}
          role="img"
          aria-label="Leitura realizada nos últimos sete dias. Recorde: 12 dias."
        >
          {["Sábado", "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map(
            (day, index) => (
              <span
                className={`${cards.day} ${index === 6 ? cards.today : ""}`}
                key={day}
                title={`${day}: leitura realizada${index === 6 ? " (hoje)" : ""}`}
              >
                <span>{day[0]}</span>
                <span className={cards.check}>
                  <Check size={11} strokeWidth={3} aria-hidden="true" />
                </span>
              </span>
            ),
          )}
        </div>
        <div className={cards.bottomRule} aria-hidden="true" />
      </div>
    </section>
  );
}
