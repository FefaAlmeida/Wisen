import cards from "./constancia.module.css";

const thresholds = [
  { below: 20, color: "#d94a45", label: "vermelho" },
  { below: 40, color: "#db7b25", label: "laranja" },
  { below: 60, color: "#d4ad2b", label: "amarelo" },
  { below: 80, color: "#79b84a", label: "verde-claro" },
  { below: 101, color: "#13833e", label: "verde" },
];

export function scoreColor(value) {
  return thresholds.find((item) => value < item.below)?.color ?? thresholds.at(-1).color;
}

export function ScoreRing({ value }) {
  const score = Math.max(0, Math.min(100, value));
  const threshold = thresholds.find((item) => score < item.below);
  return (
    <div
      className={cards.scoreRing}
      role="progressbar"
      aria-label="Domínio geral"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      aria-valuetext={`${score} de 100 pontos; faixa ${threshold.label}`}
      title="0–19: vermelho; 20–39: laranja; 40–59: amarelo; 60–79: verde-claro; 80–100: verde"
    >
      <svg viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <circle cx="44" cy="44" r="37" stroke="#e8e9df" strokeWidth="6" />
        <circle
          cx="44"
          cy="44"
          r="37"
          pathLength="100"
          stroke={threshold.color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity={score === 0 ? 0 : 1}
          strokeDasharray={`${score} 100`}
        />
      </svg>
      <span aria-hidden="true">
        <strong>{score}</strong>
        <small>/ 100</small>
      </span>
    </div>
  );
}
