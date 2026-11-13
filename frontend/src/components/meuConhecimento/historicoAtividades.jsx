"use client";

import { BookOpen, CheckCircle2, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./conhecimento.module.css";
import { SeletorSegmentado } from "./seletorSegmentado";

const activities = [
  {
    id: 1,
    type: "Leu uma notícia",
    detail: "Copom mantém taxa Selic em 10,50% ao ano",
    category: "Economia",
    time: "há 2 horas",
    icon: FileText,
    color: "#41667F",
    bg: "#EDF3F7",
    filter: "Leituras",
    href: "/artigo",
  },
  {
    id: 2,
    type: "Identificou uma lacuna",
    detail: "Inflação de demanda",
    category: "Economia",
    time: "há 5 horas",
    icon: HelpCircle,
    color: "#9B5C51",
    bg: "#FAF0EE",
    filter: "Conceitos",
    href: "/paginaConceito",
  },
  {
    id: 3,
    type: "Concluiu uma revisão",
    detail: "Política monetária — 8 de 10 acertos",
    time: "há 1 dia",
    icon: CheckCircle2,
    color: "#38765F",
    bg: "#EEF6F1",
    filter: "Revisões",
    href: "/paginaRevisoes",
  },
  {
    id: 4,
    type: "Explorou um conceito",
    detail: "Efeito estufa",
    category: "Meio ambiente",
    time: "há 1 dia",
    icon: BookOpen,
    color: "#7B7136",
    bg: "#F6F3E5",
    filter: "Conceitos",
    href: "/paginaConceito",
  },
  {
    id: 5,
    type: "Leu uma notícia",
    detail: "União Europeia aprova novas regras para Inteligência Artificial",
    category: "Tecnologia",
    time: "há 2 dias",
    icon: FileText,
    color: "#41667F",
    bg: "#EDF3F7",
    filter: "Leituras",
    href: "/artigo",
  },
  {
    id: 6,
    type: "Concluiu uma revisão",
    detail: "Acordo de Paris — 6 de 8 acertos",
    time: "há 3 dias",
    icon: CheckCircle2,
    color: "#38765F",
    bg: "#EEF6F1",
    filter: "Revisões",
    href: "/paginaRevisoes",
  },
];

export function HistoricoAtividades() {
  const [filter, setFilter] = useState("Todas");
  const [expanded, setExpanded] = useState(false);
  const filtered = activities.filter((item) => filter === "Todas" || item.filter === filter);
  const visible = expanded ? filtered : filtered.slice(0, 4);
  return (
    <section className={`${styles.panel} ${styles.history}`} aria-labelledby="history-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="history-title">Seu aprendizado em movimento</h2>
        </div>
      </div>
      <SeletorSegmentado
        label="Filtrar atividades"
        className={styles.activityFilters}
        options={["Todas", "Leituras", "Revisões", "Conceitos"].map((label) => ({
          value: label,
          label,
        }))}
        value={filter}
        onChange={(value) => {
          setFilter(value);
          setExpanded(false);
        }}
      />
      <div className={styles.activityList} aria-live="polite">
        {visible.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} className={styles.activity} key={item.id}>
              <span
                className={styles.activityIcon}
                style={{ color: item.color, background: item.bg }}
              >
                <Icon size={16} aria-hidden="true" />
              </span>
              <div className={styles.activityText}>
                <strong>{item.type}</strong>
                <p title={item.detail}>
                  {item.detail}
                  {item.category ? ` · ${item.category}` : ""}
                </p>
              </div>
              <span className={styles.activityTime}>{item.time}</span>
            </Link>
          );
        })}
      </div>
      <div className={styles.historyFooter}>
        <span>
          {visible.length} de {filtered.length} atividades
        </span>
        {filtered.length > 4 && (
          <button
            type="button"
            className={styles.textButton}
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Mostrar menos" : "Ver todas as atividades"}
          </button>
        )}
      </div>
    </section>
  );
}
