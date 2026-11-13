"use client";

import { Info } from "lucide-react";
import { useId, useState } from "react";
import styles from "./conhecimento.module.css";
import { formatDate, getEvolution, PERIODS } from "./historicoDemo";
import { SeletorSegmentado } from "./seletorSegmentado";

export function GraficoEvolucao() {
  const [period, setPeriod] = useState(30);
  const [inspection, setInspection] = useState(null);
  const gradientId = useId();
  const samples = getEvolution(period);
  const first = samples[0];
  const last = samples.at(-1);
  const selected = samples[inspection ?? samples.length - 1];
  const x = (index) => 36 + (index / (samples.length - 1)) * 644;
  const y = (score) => 190 - score * 1.7;
  const points = samples.map((point, index) => `${x(index)},${y(point.score)}`).join(" ");

  function inspect(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    setInspection(
      Math.max(0, Math.min(samples.length - 1, Math.round(ratio * (samples.length - 1)))),
    );
  }

  return (
    <section className={`${styles.panel} ${styles.evolution}`} aria-labelledby="evolution-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="evolution-title">Evolução do conhecimento</h2>
        </div>
        <span
          className={styles.info}
          title="O mastery score vai de 0 a 100 e representa seu domínio dos conceitos estudados."
        >
          <Info size={16} aria-hidden="true" />
          <span className="sr-only">
            O mastery score vai de 0 a 100 e representa seu domínio dos conceitos estudados.
          </span>
        </span>
      </div>
      <div className={styles.chartToolbar}>
        <SeletorSegmentado
          label="Período da evolução"
          options={PERIODS.map((item) => ({ value: item.days, label: item.label }))}
          value={period}
          onChange={(days) => {
            setPeriod(days);
            setInspection(null);
          }}
        />
      </div>
      <div className={styles.chart}>
        <div className={styles.chartReadout} aria-live="polite" aria-atomic="true">
          <span>{formatDate(selected.date, true)}</span>
          <strong>{selected.score} pontos</strong>
        </div>
        <div className={styles.chartPlot}>
          <div className={styles.yAxis} aria-hidden="true">
            {[100, 75, 50, 25, 0].map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
          <svg
            role="img"
            aria-label={`Mastery score nos últimos ${period} dias: de ${first.score} para ${last.score} pontos.`}
            viewBox="0 0 700 220"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D8C966" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#D8C966" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line
                  x1="36"
                  x2="680"
                  y1={y(value)}
                  y2={y(value)}
                  stroke="#E5EAF0"
                  strokeDasharray={value === 0 ? undefined : "3 5"}
                />
              </g>
            ))}
            <polygon points={`36,190 ${points} 680,190`} fill={`url(#${gradientId})`} />
            <polyline
              data-evolution-line
              points={points}
              fill="none"
              stroke="#304B5B"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={x(inspection ?? samples.length - 1)}
              x2={x(inspection ?? samples.length - 1)}
              y1="20"
              y2="190"
              stroke="#94A3B8"
              strokeDasharray="3 4"
            />
            <circle
              cx={x(inspection ?? samples.length - 1)}
              cy={y(selected.score)}
              r="5"
              fill="#E8E191"
              stroke="#304B5B"
              strokeWidth="2"
            />
          </svg>
          <div className={styles.xAxis} aria-hidden="true">
            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
              <span key={fraction}>
                {formatDate(samples[Math.round(fraction * (samples.length - 1))].date)}
              </span>
            ))}
          </div>
        </div>
        <input
          className={styles.chartInput}
          type="range"
          min="0"
          max={samples.length - 1}
          value={inspection ?? samples.length - 1}
          aria-label="Explorar pontos do gráfico"
          aria-valuetext={`${formatDate(selected.date, true)}: ${selected.score} pontos`}
          onChange={(event) => setInspection(Number(event.target.value))}
          onPointerMove={(event) => {
            if (event.pointerType === "mouse") inspect(event);
          }}
          onPointerLeave={() => setInspection(null)}
        />
      </div>
      <div className={styles.chartFooter}>
        <span>
          {formatDate(first.date, true)} a {formatDate(last.date, true)}
        </span>
      </div>
    </section>
  );
}
