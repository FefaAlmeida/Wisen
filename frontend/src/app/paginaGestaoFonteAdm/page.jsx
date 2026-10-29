
import GestaoFontes from "@/components/gestaoFontesAdm/gestaoFontes";

export default function PaginaFontes() {
  return (
    <main className="min-h-screen w-full min-w-0 bg-[#F1F3F6] font-[family-name:var(--font-geist-sans)]">
      <div className="w-full px-5 pt-9 pb-12 md:px-8">
        <header className="mb-6">
          <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-[#7183A6]">
            PAINEL ADMINISTRATIVO
          </p>

          <h1 className="text-[38px] font-semibold tracking-tight text-[#101A40] md:text-[44px]">
            Gestão de fontes{" "}
            <span className="text-[#E0B522]">(RSS)</span>
          </h1>

          <p className="mt-1 text-[16px] text-[#526584]">
            Cadastre e monitore os veículos integrados à plataforma.
          </p>
        </header>

        <GestaoFontes />
      </div>
    </main>
  );
}
