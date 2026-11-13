import { ArrowRight, ChevronRight, Compass, Cpu, Landmark, Leaf } from "lucide-react";
import Link from "next/link";
import styles from "./conhecimento.module.css";

const topics = [
  {
    name: "Política monetária",
    count: 3,
    icon: Landmark,
    concepts: "Taxa Selic, inflação de demanda e juros reais.",
  },
  {
    name: "Mudanças climáticas",
    count: 4,
    icon: Leaf,
    concepts: "Efeito estufa, emissões de carbono, transição energética e Acordo de Paris.",
  },
  {
    name: "Inteligência artificial",
    count: 3,
    icon: Cpu,
    concepts: "Aprendizado de máquina, redes neurais e IA generativa.",
  },
];

export function CartaoFocoAtual() {
  return (
    <section className={`${styles.panel} ${styles.focus}`} aria-labelledby="focus-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="focus-title">Seu próximo passo</h2>
        </div>
      </div>
      <div className={styles.focusContent}>
        <div className={styles.focusSummary}>
          <Compass size={22} aria-hidden="true" />
          <div>
            <strong>10 conceitos para reforçar</strong>
          </div>
        </div>
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <details className={styles.topic} key={topic.name}>
              <summary>
                <Icon size={17} aria-hidden="true" />
                <span>
                  <strong>{topic.name}</strong>
                  <small>{topic.count} conceitos para revisar</small>
                </span>
                <ChevronRight size={15} aria-hidden="true" />
              </summary>
              <p>{topic.concepts}</p>
            </details>
          );
        })}
      </div>
      <div className={styles.focusAction}>
        <Link href="/paginaRevisoes" className={styles.primaryLink}>
          Ir para minhas revisões <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
