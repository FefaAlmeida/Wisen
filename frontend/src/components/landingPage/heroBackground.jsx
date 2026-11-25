import styles from "./heroBackground.module.css";

export default function HeroBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.approach}>
        {/* biome-ignore lint/performance/noImgElement: Serve the fixed-resolution WebP directly. */}
        <img
          src="/globoWisen-landing-2048.webp"
          alt=""
          width={2048}
          height={1467}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-top"
        />
      </div>
    </div>
  );
}
