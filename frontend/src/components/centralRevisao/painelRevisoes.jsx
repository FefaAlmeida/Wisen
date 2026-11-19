import { ArrowRight, BookOpen, CheckCheck, Clock3, Flame, Plus, Target } from "lucide-react";
import Link from "next/link";
import styles from "./revisoes.module.css";
import { areas, questoes } from "./revisoesDemo";

const semana = [
  { dia: "Sáb", total: 2 },
  { dia: "Dom", total: 4 },
  { dia: "Seg", total: 0 },
  { dia: "Ter", total: 6 },
  { dia: "Qua", total: 4 },
  { dia: "Qui", total: 2 },
  { dia: "Sex", total: 4 },
];
const historico = [
  { tema: "Política monetária", formato: "Quiz", total: 4, quando: "Hoje, 09:20" },
  { tema: "IA generativa", formato: "Flashcards", total: 2, quando: "Ontem, 18:45" },
  { tema: "Efeito estufa e energia", formato: "Quiz", total: 4, quando: "11 nov, 12:10" },
];
const totalSemana = semana.reduce((total, d) => total + d.total, 0);
const temas = areas.flatMap((a) => a.temas);

export default function PainelRevisoes() {
  return (
    <div className={styles.page}>
      <header className={`${styles.header} ${styles.dashboardHeader}`}>
        <div>
          <h1>Central de revisões</h1>
          <div className={styles.meta}>
            <span className={styles.badge}>Prévia</span>
            <span>Dados ilustrativos · 13 nov 2026</span>
          </div>
        </div>
      </header>
      <Link
        href="/paginaRevisoes/nova"
        className={styles.novaRevisaoCard}
        aria-labelledby="nova-revisao-title"
      >
        <div className={styles.novaRevisaoConteudo}>
          <span className={styles.novaRevisaoIcone} aria-hidden="true">
            <Plus className={styles.novaRevisaoPlus} size={44} strokeWidth={2.5} />
          </span>
          <div className={styles.novaRevisaoTexto}>
            <h2 id="nova-revisao-title">Nova revisão</h2>
            <p>Escolha os assuntos e o formato da sua sessão.</p>
          </div>
        </div>
        <ArrowRight className={styles.novaRevisaoSeta} size={24} aria-hidden="true" />
      </Link>
      <section className={styles.stats} aria-label="Resumo das revisões">
        {[
          {
            titulo: "Para revisar",
            valor: questoes.length,
            unidade: "questões disponíveis",
            detalhe: `${temas.length} temas em ${areas.length} áreas`,
            icon: BookOpen,
          },
          {
            titulo: "Revisadas hoje",
            valor: semana.at(-1).total,
            unidade: "questões concluídas",
            detalhe: "Uma sessão concluída hoje",
            icon: CheckCheck,
          },
          {
            titulo: "Taxa de acerto",
            valor: `${Math.round((17 / totalSemana) * 100)}%`,
            unidade: "nos últimos 7 dias",
            detalhe: `17 acertos em ${totalSemana} questões de quiz`,
            icon: Target,
          },
          {
            titulo: "Constância de revisão",
            valor: 4,
            unidade: "dias seguidos",
            detalhe: "Seu recorde é de 7 dias",
            icon: Flame,
          },
        ].map(({ titulo, valor, unidade, detalhe, icon: Icon }) => (
          <article className={styles.stat} key={titulo}>
            <div className={styles.statHeading}>
              <h2>{titulo}</h2>
              <Icon size={17} aria-hidden="true" />
            </div>
            <div className={styles.statBody}>
              <strong>{valor}</strong>
              <span>{unidade}</span>
            </div>
            <p>{detalhe}</p>
          </article>
        ))}
      </section>
      <div className={styles.dashboardGrid}>
        <section className={styles.panel} aria-labelledby="ritmo-title">
          <div className={styles.panelHeader}>
            <h2 id="ritmo-title">Seu ritmo de revisão</h2>
            <span className={styles.nota}>Últimos 7 dias</span>
          </div>
          <div className={styles.ritmoResumo}>
            <strong>{totalSemana} questões revisadas</strong>
            <span>Um pouco por dia ajuda a consolidar o que você aprendeu.</span>
          </div>
          <div
            className={styles.barras}
            role="img"
            aria-label={semana.map((d) => `${d.dia}: ${d.total} questões`).join("; ")}
          >
            {semana.map((d) => (
              <div className={styles.barraColuna} key={d.dia}>
                <strong>{d.total}</strong>
                <div className={styles.barraTrilho}>
                  <span style={{ height: `${(d.total / 6) * 100}%` }} />
                </div>
                <span>{d.dia}</span>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.panel} aria-labelledby="proxima-title">
          <div className={styles.panelHeader}>
            <h2 id="proxima-title">Sua próxima sessão</h2>
          </div>
          <p className={styles.descricao}>
            Reforce os conceitos que você já encontrou nas notícias. Escolha um assunto ou misture
            áreas para variar a prática.
          </p>
          <dl className={styles.sessaoDados}>
            <div>
              <Clock3 size={18} aria-hidden="true" />
              <dt>Tempo para revisar tudo</dt>
              <dd>~ {questoes.length} min</dd>
            </div>
            <div>
              <BookOpen size={18} aria-hidden="true" />
              <dt>Conceitos disponíveis</dt>
              <dd>{temas.length} temas</dd>
            </div>
          </dl>
          <p className={styles.nota}>
            Quiz ou Flashcards. Você escolhe o formato antes de começar.
          </p>
        </section>
        <section className={styles.panel} aria-labelledby="historico-title">
          <div className={styles.panelHeader}>
            <h2 id="historico-title">Últimas revisões</h2>
          </div>
          <ul className={styles.historico}>
            {historico.map((item) => (
              <li key={item.tema}>
                <CheckCheck size={20} aria-hidden="true" />
                <div>
                  <strong>{item.tema}</strong>
                  <p>
                    {item.formato} · {item.total} {item.formato === "Quiz" ? "questões" : "cartões"}
                  </p>
                </div>
                <span>{item.quando}</span>
              </li>
            ))}
          </ul>
          <p className={styles.nota}>Histórico demonstrativo de sessões concluídas.</p>
        </section>
        <section className={styles.panel} aria-labelledby="areas-title">
          <div className={styles.panelHeader}>
            <h2 id="areas-title">Assuntos para reforçar</h2>
          </div>
          <ul className={styles.listaAreas}>
            {areas.map((area) => (
              <li key={area.id}>
                <div>
                  <strong>{area.nome}</strong>
                  <span>
                    {questoes.filter((q) => area.temas.some((t) => t.id === q.temaId)).length}{" "}
                    questões
                  </span>
                </div>
                <p>{area.temas.map((t) => t.nome).join(" e ")}</p>
              </li>
            ))}
          </ul>
          <Link href="/paginaConhecimento" className={styles.voltar}>
            Ver meu conhecimento <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
