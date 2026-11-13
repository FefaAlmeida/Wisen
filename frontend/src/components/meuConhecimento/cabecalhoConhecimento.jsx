import styles from "./conhecimento.module.css";

export function CabecalhoConhecimento() {
  return (
    <header className={styles.header}>
      <div>
        <h1>Meu conhecimento</h1>
        <div className={styles.headerMeta}>
          <span className={styles.preview}>Prévia</span>
          <span>Dados ilustrativos · 13 nov 2026</span>
        </div>
      </div>
    </header>
  );
}
