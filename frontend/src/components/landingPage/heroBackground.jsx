import Image from "next/image";
import styles from "./heroBackground.module.css";

export default function HeroBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.approach}>
        <Image
          src="/globoWisen-landing-hd.png"
          alt=""
          fill
          sizes="100vw"
          preload
          unoptimized
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
