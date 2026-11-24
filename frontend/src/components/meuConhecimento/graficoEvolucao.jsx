"use client";

import { Info } from "lucide-react";
import { useId, useState } from "react";
import { ExploradorGrafico } from "../ui/exploradorGrafico";
import styles from "./conhecimento.module.css";
import { formatDate, getEvolution, PERIODS } from "./historicoDemo";
import { SeletorSegmentado } from "./seletorSegmentado";

export function GraficoEvolucao() {
  const [period, setPeriod] = useState(30);
  const gradientId = useId();
  const samples = getEvolution(period);
  const first = samples[0];
  const last = samples.at(-1);
  const x = (index) => 36 + (index / (samples.length - 1)) * 644;
  const y = (score) => 190 - score * 1.7;
  const points = samples.map((point, index) => `${x(index)},${y(point.score)}`).join(" ");

  const pontos = samples.map(({ date, score }) => ({
    titulo: formatDate(date, true),
    linhas: [{ rotulo: "Nível estimado", valor: `${score} pontos` }],
  }));

  return (
    <section className={`${styles.panel} ${styles.evolution}`} aria-labelledby="evolution-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="evolution-title">Evolução do conhecimento</h2>
        </div>
        <span
          className={styles.info}
          title="O nível estimado vai de 0 a 100 e considera evidências das revisões. Ler uma notícia ou concluir uma sessão, por si só, não comprova domínio."
        >
          <Info size={16} aria-hidden="true" />
          <span className="sr-only">
            O nível estimado vai de 0 a 100 e considera evidências das revisões. Ler uma notícia ou
            concluir uma sessão, por si só, não comprova domínio.
          </span>
        </span>
      </div>
      <div className={styles.chartToolbar}>
        <SeletorSegmentado
          label="Período da evolução"
          options={PERIODS.map((item) => ({ value: item.days, label: item.label }))}
          value={period}
          onChange={setPeriod}
        />
      </div>
      <div className={styles.chart}>
        <div className={styles.chartReadout}>
          <span>{formatDate(last.date, true)}</span>
          <strong>{last.score} pontos</strong>
        </div>
        <div className={styles.chartPlot}>
          <ExploradorGrafico
            key={period}
            pontos={pontos}
            rotulo="Explorar evolução do conhecimento"
            inicio={36 / 700}
            fim={680 / 700}
          >
            {(inspection) => (
              <>
                <div className={styles.yAxis} aria-hidden="true">
                  {[100, 75, 50, 25, 0].map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
                <svg
                  role="img"
                  aria-label={`Nível estimado nos últimos ${period} dias: de ${first.score} para ${last.score} pontos.`}
                  viewBox="0 0 700 220"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-wisen-destaque)"
                        stopOpacity="0.28"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-wisen-destaque)"
                        stopOpacity="0.01"
                      />
                    </linearGradient>
                  </defs>
                  {[0, 25, 50, 75, 100].map((value) => (
                    <g key={value}>
                      <line
                        x1="36"
                        x2="680"
                        y1={y(value)}
                        y2={y(value)}
                        stroke="var(--color-wisen-borda)"
                        strokeDasharray={value === 0 ? undefined : "3 5"}
                      />
                    </g>
                  ))}
                  <polygon points={`36,190 ${points} 680,190`} fill={`url(#${gradientId})`} />
                  <polyline
                    data-evolution-line
                    points={points}
                    fill="none"
                    stroke="var(--color-wisen-titulo)"
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
                    stroke="var(--color-wisen-texto-suave)"
                    strokeDasharray="3 4"
                  />
                  <circle
                    cx={x(inspection ?? samples.length - 1)}
                    cy={y((samples[inspection] ?? last).score)}
                    r="5"
                    fill="var(--color-wisen-destaque-suave)"
                    stroke="var(--color-wisen-titulo)"
                    strokeWidth="2"
                  />
                </svg>
              </>
            )}
          </ExploradorGrafico>
          <div className={styles.xAxis} aria-hidden="true">
            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
              <span key={fraction}>
                {formatDate(samples[Math.round(fraction * (samples.length - 1))].date)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.chartFooter}>
        <span>
          {formatDate(first.date, true)} a {formatDate(last.date, true)}
        </span>
      </div>
    </section>
  );
}
