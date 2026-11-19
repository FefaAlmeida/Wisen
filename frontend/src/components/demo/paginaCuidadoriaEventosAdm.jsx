import { AdminLayout } from "@/components/admin/adminLayout";
import { BarraBusca } from "@/components/barraBusca";
import CuradoriaEventos from "@/components/cuidadoriaEventosAdm/cuidadoriaEventos";
import MenuPerfil from "@/components/homeCliente/menuPerfil";

export default function PaginaCuradoriaEventos() {
  return (
    <AdminLayout activeItem="Curadoria de eventos">
      <main className="min-h-screen w-full min-w-0 bg-transparent font-[family-name:var(--font-geist-sans)]">
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <header className="sticky top-0 z-50 flex items-center justify-end gap-3 bg-[#F0F4F9]/90 px-5 py-3 backdrop-blur-sm md:px-8">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>
            <MenuPerfil />
          </header>

          <div className="w-full px-5 pt-7 pb-12 md:px-8">
            <header className="mb-6">
              <p className="text-[11px] font-semibold text-[#93A3BE]">ADMINISTRADOR</p>

              <h1 className="mt-4 text-[36px] leading-[1.05] font-medium text-wisen-titulo sm:text-[44px]">
                Curadoria de <span className="text-[#D7BF4D]">eventos e artigos.</span>
              </h1>

              <p className="mt-3 max-w-[650px] text-[15px] leading-6 text-wisen-texto-suave">
                Revise e organize os acontecimentos identificados automaticamente pela inteligência
                artificial.
              </p>
            </header>

            <section className="rounded-2xl border border-wisen-borda bg-wisen-superficie p-4 sm:p-5">
              <CuradoriaEventos />
            </section>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
