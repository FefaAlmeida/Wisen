import styles from "./conhecimento.module.css";
import { categories } from "./historicoDemo";

export function DistribuicaoCategorias() {
  let offset = 0;
  return (
    <section className={`${styles.panel} ${styles.categories}`} aria-labelledby="categories-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="categories-title">Conceitos dominados por categoria</h2>
        </div>
      </div>
      <div className={styles.donut}>
        <svg
          role="img"
          aria-label="128 conceitos dominados: Economia 41, Política 31, Meio ambiente 23, Tecnologia 19, Sociedade 14."
          viewBox="0 0 160 160"
        >
          {categories.map((category) => {
            const percent = (category.count / 128) * 100;
            const start = offset;
            offset += percent;
            return (
              <circle
                key={category.name}
                cx="80"
                cy="80"
                r="65"
                pathLength="100"
                fill="none"
                stroke={category.color}
                strokeWidth="15"
                strokeDasharray={`${percent - 1.5} ${100 - percent + 1.5}`}
                strokeDashoffset={-start}
                transform="rotate(-90 80 80)"
              >
                <title>{`${category.name}: ${category.count} conceitos (${Math.round(percent)}%)`}</title>
              </circle>
            );
          })}
        </svg>
        <div>
          <strong>128</strong>
        </div>
      </div>
      <ul className={styles.donutLegend}>
        {categories.map((category) => (
          <li key={category.name}>
            <span>
              <i style={{ background: category.color }} />
              <span>{category.name}</span>
              <small>{category.count}</small>
            </span>
            <strong>{Math.round((category.count / 128) * 100)}%</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
