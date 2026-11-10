
import {
  Bookmark,
  BrainCircuit,
  History,
  Home,
  Search,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";

export function ApresentacaoLanding() {
  return (
    <section
      id="sobre"
      className="scroll-mt-24"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">

        {/* Prévia da plataforma */}
        <div className="relative lg:col-span-7">

          {/* Camada de profundidade */}
          <div className="pointer-events-none absolute -inset-2 rotate-[2deg] rounded-[30px] border border-[#DDDCA9]/70 bg-[#E8E191]/35 sm:-inset-3" />

          <div className="pointer-events-none absolute -bottom-6 left-[10%] right-[10%] h-16 rounded-full bg-[#30466E]/10 blur-3xl" />

          {/* Moldura */}
          <div className="relative rounded-[25px] border border-[#D5DEE9] bg-gradient-to-br from-white to-[#E7EDF4] p-2.5 shadow-[0_22px_55px_-29px_rgba(16,26,64,0.35)] sm:p-3">

            <div className="grid min-h-[440px] grid-cols-12 overflow-hidden rounded-[17px] border border-[#DFE6EF] bg-white text-xs">

              {/* Sidebar */}
              <div className="hidden space-y-7 border-r border-white/10 bg-[#172542] p-4 text-slate-300 sm:col-span-4 sm:block lg:p-5">

                <div className="flex items-center gap-1.5 px-2">
                  <span className="text-[19px] font-bold tracking-tight text-white">
                    Wisen
                  </span>

                  <span className="h-2 w-2 rounded-full bg-[#E8E191]" />
                </div>

                <nav className="space-y-1 text-[11px]">

                  <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/10 px-3 py-2.5 font-semibold text-white">
                    <Home className="h-3.5 w-3.5 shrink-0 text-[#E8E191]" />
                    Início
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[#B8C3D3] transition-colors hover:bg-white/5 hover:text-white">
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    Buscar
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[#B8C3D3] transition-colors hover:bg-white/5 hover:text-white">
                    <Bookmark className="h-3.5 w-3.5 shrink-0" />
                    Meu perfil
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[#B8C3D3] transition-colors hover:bg-white/5 hover:text-white">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    Meu conhec.
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[#B8C3D3] transition-colors hover:bg-white/5 hover:text-white">
                    <BrainCircuit className="h-3.5 w-3.5 shrink-0" />
                    Mapas mentais
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[#B8C3D3] transition-colors hover:bg-white/5 hover:text-white">
                    <History className="h-3.5 w-3.5 shrink-0" />
                    Leituras recentes
                  </div>

                </nav>

                <div className="border-t border-white/10 pt-5 text-[11px]">
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[#B8C3D3] transition-colors hover:bg-white/5 hover:text-white">
                    <Settings className="h-3.5 w-3.5 shrink-0" />
                    Configurações
                  </div>
                </div>

              </div>

              {/* Conteúdo interno */}
              <div className="col-span-12 space-y-5 bg-[#FFFFFF] p-4 sm:col-span-8 sm:p-5">

                {/* Barra superior */}
                <div className="flex items-center justify-between gap-3 border-b border-[#EBEFF4] pb-4">

                  <div className="relative w-full max-w-[220px]">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8997A9]" />

                    <input
                      type="text"
                      placeholder="Buscar termos, ideias..."
                      readOnly
                      className="h-9 w-full rounded-full border border-[#E2E8F0] bg-[#F6F8FB] pl-9 pr-3 text-[11px] text-[#526175] outline-none placeholder:text-[#9AA6B6]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8E191] text-[10px] font-bold text-[#101A40]">
                      MA
                    </div>
                  </div>

                </div>

                {/* Saudação */}
                <div className="space-y-1">
                  <h3 className="text-[15px] font-bold tracking-tight text-[#101A40]">
                    Boa tarde, Maria
                  </h3>

                  <p className="text-[11px] text-[#8996A8]">
                    Aprenda 10m com resumo personalizado.
                  </p>
                </div>

                {/* Card de notícia */}
                <div className="group overflow-hidden rounded-xl border border-[#E4EAF1] bg-white shadow-[0_8px_20px_-14px_rgba(16,26,64,0.25)] transition-shadow duration-300 hover:shadow-md">

                  <div className="overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop"
                      width={600}
                      height={240}
                      alt="Destaque"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-32 w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] sm:h-36"
                    />
                  </div>

                  <div className="space-y-2 p-3.5">
                    <h4 className="text-[12px] font-bold leading-relaxed text-[#101A40]">
                      Grandes apostas na redução de emissões nos próximos nove anos
                    </h4>

                    <p className="line-clamp-2 text-[10px] leading-relaxed text-[#8996A8]">
                      Uma análise completa sobre os acordos globais no que respeita ao setor nos próximos anos.
                    </p>
                  </div>

                </div>

                {/* Sugestões */}
                <div className="space-y-3 pt-1">

                  <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8996A8]">
                    Sugestões do tempo
                  </span>

                  <div className="space-y-2">

                    <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E8EDF3] bg-[#F7F9FC] px-3 py-2.5 transition-colors hover:bg-[#EFF3F8]">
                      <span className="text-[11px] font-medium text-[#2B333F]">
                        Impacto econômico
                      </span>

                      <span className="shrink-0 rounded-full bg-[#E8E191]/70 px-2 py-1 text-[9px] font-bold text-[#776925]">
                        Tendência
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E8EDF3] bg-[#F7F9FC] px-3 py-2.5 transition-colors hover:bg-[#EFF3F8]">
                      <span className="text-[11px] font-medium text-[#2B333F]">
                        Ciências da Saúde
                      </span>

                      <span className="shrink-0 rounded-full bg-[#F7EBCF] px-2 py-1 text-[9px] font-bold text-[#967436]">
                        Em alta
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E8EDF3] bg-[#F7F9FC] px-3 py-2.5 transition-colors hover:bg-[#EFF3F8]">
                      <span className="text-[11px] font-medium text-[#2B333F]">
                        Inteligência Artificial
                      </span>

                      <span className="shrink-0 rounded-full bg-[#F7E5E7] px-2 py-1 text-[9px] font-bold text-[#A35D67]">
                        Polêmica
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Texto da apresentação */}
        <div className="space-y-6 lg:col-span-5 lg:pl-3">

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8491A3]">
            Uma nova forma de aprender
          </span>

          <h2 className="max-w-[480px] text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.19] tracking-[-0.045em] text-[#101A40]">
            Do que acontece no mundo ao que você{" "}
            <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
              realmente entende.
            </span>
          </h2>

          <p className="max-w-[460px] text-[15px] leading-[1.9] text-[#647184]">
            O Wisen combina inteligência avançada e curadoria de fontes
            confiáveis para trazer o conhecimento certo, na dimensão
            certa e no momento certo. Conexões mais claras, uma visão
            mais completa e decisões mais conscientes para a sua vida.
          </p>

        </div>

      </div>
    </section>
  );
}
