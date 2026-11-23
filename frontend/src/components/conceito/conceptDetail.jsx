import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import news from "@/components/demo/newsDetail.module.css";
import { coresStatusConceito } from "@/lib/coresStatusConceito";
import styles from "./conceptDetail.module.css";

export function ConceptPanel({ eyebrow, title, children }) {
  return (
    <section className={news.panel}>
      <div className={news.panelHeading}>
        {eyebrow && <span className={news.eyebrow}>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      <div className={styles.panelContent}>{children}</div>
    </section>
  );
}

export default function ConceptDetail({
  name,
  category,
  description,
  status,
  actions,
  children,
  sidebar,
  connections = [],
  events = [],
}) {
  return (
    <div className={`${news.page} ${styles.page}`}>
      <nav className={news.toolbar} aria-label="Ações do conceito">
        <Link href="/paginaBiblioteca" className={news.back}>
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para conceitos
        </Link>
        <div className={news.actions}>{actions}</div>
      </nav>
      <div className={news.grid}>
        <article className={news.article}>
          <header className={`${news.articleHeader} ${styles.header}`}>
            <div className={news.meta}>
              <span className={news.category}>{category || "Conceito"}</span>
              <span>Biblioteca de conceitos</span>
            </div>
            <h1>{name}</h1>
            <p className={news.intro}>{description}</p>
            <span className={styles.status}>
              <span
                className={news.dot}
                style={{ backgroundColor: coresStatusConceito[status]?.indicador }}
                aria-hidden="true"
              />
              {status || "Ainda não avaliado"}
            </span>
          </header>
          {children && <div className={news.reading}>{children}</div>}
          {events.length > 0 && (
            <section className={news.sources} aria-labelledby="concept-events">
              <div className={news.sectionHeading}>
                <h2 id="concept-events">Este conceito nas notícias</h2>
                <p>Veja como o assunto aparece no mundo real.</p>
              </div>
              <div className={styles.links}>
                {events.map((event) => (
                  <Link key={event.href} href={event.href} className={styles.event}>
                    <span>
                      <strong>{event.title}</strong>
                      {event.detail && <small>{event.detail}</small>}
                    </span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
        <aside className={news.aside} aria-label="Aprendizado e conexões">
          {sidebar}
          {connections.length > 0 && (
            <ConceptPanel eyebrow="Continue explorando" title="Conceitos conectados">
              <p className={styles.muted}>Aprofunde a leitura com assuntos que se relacionam.</p>
              <div className={news.concepts}>
                {connections.map((concept) => (
                  <div key={concept.href} className={news.concept}>
                    <div className={news.conceptText}>
                      <Link href={concept.href}>{concept.name}</Link>
                      <p>{concept.relation}</p>
                    </div>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </div>
                ))}
              </div>
            </ConceptPanel>
          )}
        </aside>
      </div>
    </div>
  );
}
