import { notFound } from "next/navigation";
import Artigo from "@/components/demo/artigo";
import { PublicDemoProvider } from "@/components/demo/mode";
import NewsDetail from "@/components/demo/newsDetail";
import Biblioteca from "@/components/demo/paginaBiblioteca";
import Conceito from "@/components/demo/paginaConceito";
import Aprendizado from "@/components/demo/paginaConhecimento";
import Noticias from "@/components/demo/paginaExplorar";
import Salvos from "@/components/demo/paginaGuardados";
import Inicio from "@/components/demo/paginaInicialCliente";
import Revisoes from "@/components/demo/paginaRevisoes";
import PerfilPage from "@/components/perfil/perfilPage";
import { stories } from "@/data/noticiasDemo";

export const metadata = {
  title: "Demonstração do Wisen",
  robots: { index: false, follow: false },
};

const pages = {
  paginaInicialCliente: Inicio,
  paginaExplorar: Noticias,
  paginaBiblioteca: Biblioteca,
  paginaConceito: Conceito,
  paginaConhecimento: Aprendizado,
  paginaGuardados: Salvos,
  paginaPerfil: PerfilPage,
  paginaRevisoes: Revisoes,
  "paginaRevisoes/nova": Revisoes,
  paginaSessaoRevisao: Revisoes,
  paginaEvento: NewsDetail,
  artigo: Artigo,
};

export default async function DemoPage({ params, searchParams }) {
  const [{ pagina }, query] = await Promise.all([params, searchParams]);
  const route = pagina.join("/");
  if (!Object.hasOwn(pages, route)) notFound();
  const Page = pages[route];
  const view = {
    "paginaRevisoes/nova": "nova",
    paginaSessaoRevisao: "sessao",
  }[route];
  const story = stories.find(({ id }) => id === query.id);
  return (
    <PublicDemoProvider>
      <Page
        key={`${route}:${story?.id ?? ""}`}
        view={view}
        initialTemas={typeof query.temas === "string" ? query.temas.split(",") : []}
        initialModo={query.formato}
        story={story}
      />
    </PublicDemoProvider>
  );
}
