import { AdminLayout } from "@/components/admin/adminLayout";
import CuradoriaEventos from "@/components/cuidadoriaEventosAdm/cuidadoriaEventos";

export default function PaginaCuradoriaEventos() {
  return (
    <AdminLayout activeItem="Curadoria de eventos">
      <main className="min-h-screen w-full min-w-0 bg-[radial-gradient(ellipse_at_55%_0%,#E6EEF6_0%,#F1F3F6_65%,#F1F3F6_100%)] font-[family-name:var(--font-geist-sans)]">
        <div className="w-full px-5 pt-8 pb-12 md:px-8">
          <header className="mb-6">
            <p className="mb-1 text-sm text-[#7183A6]">Administrador</p>

            <h1 className="text-[36px] leading-[1.05] font-medium tracking-tight text-[#101A40] md:text-[44px]">
              Curadoria de Eventos e Artigos
            </h1>

            <p className="mt-2 text-base leading-6 text-[#7183A6]">
              Revise e organize os acontecimentos identificados automaticamente pela inteligência
              artificial.
            </p>
          </header>

          <CuradoriaEventos />
        </div>
      </main>
    </AdminLayout>
  );
}
