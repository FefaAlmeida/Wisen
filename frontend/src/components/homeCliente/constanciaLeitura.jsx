import { Check, Trophy } from "lucide-react";
import { StreakFlame } from "@/components/app/streakFlame";
import cards from "@/components/meuConhecimento/constancia.module.css";

export function ConstanciaLeitura() {
  return (
    <div className={`${cards.card} ${cards.reading}`}>
      <div className={cards.heading}>
        <h2>Constância de leitura</h2>
        <span className={cards.record} title="Recorde de leitura: 12 dias">
          <Trophy size={13} aria-hidden="true" />
          12 dias
        </span>
      </div>
      <p className="mt-3 text-xs text-wisen-texto-suave">Prévia · dados ilustrativos</p>
      <div className={`${cards.body} ${cards.streakBody}`}>
        <div className={`${cards.value} ${cards.streakValue}`}>
          <StreakFlame className={cards.flame} />
          <strong>
            7<span className={cards.streakUnit}>dias</span>
            <span className="sr-only"> seguidos</span>
          </strong>
        </div>
      </div>
      <p className={cards.streakMessage}>A Zuzu está orgulhosa de você!</p>
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
  );
}
