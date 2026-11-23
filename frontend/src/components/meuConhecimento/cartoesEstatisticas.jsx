import { Check, Trophy } from "lucide-react";
import { StreakFlame } from "@/components/app/streakFlame";
import styles from "./conhecimento.module.css";
import cards from "./constancia.module.css";
import { DominioAreas } from "./dominioAreas";
import { scoreColor } from "./scoreRing";

const gapTiles = Array.from({ length: 24 }, (_, index) => `gap-${index + 1}`);

export function CartoesEstatisticas() {
  return (
    <section className={`${styles.stats} ${cards.group}`} aria-label="Resumo do aprendizado">
      <div className={cards.card}>
        <div className={cards.heading}>
          <h2>Nível estimado</h2>
        </div>
        <div className={`${cards.body} ${cards.scoreBody}`}>
          <DominioAreas />
        </div>
        <div className={cards.bottomRule} aria-hidden="true" />
      </div>
      <div className={cards.card}>
        <div className={cards.heading}>
          <h2>Conceitos consolidados</h2>
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
            <StreakFlame className={cards.flame} />
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
