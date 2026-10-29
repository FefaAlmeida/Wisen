import { Bookmark, BrainCircuit, History, Home, Search, Settings, User } from "lucide-react";
import Image from "next/image";

export function ApresentacaoLanding() {
  return (
    <section className="py-12 border-t border-slate-100" id="sobre">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="bg-[#2B333F] rounded-3xl p-3 md:p-4 shadow-2xl border border-slate-800">
            <div className="bg-[#F8FAFC] rounded-2xl overflow-hidden grid grid-cols-12 min-h-[420px] text-xs">
              <div className="col-span-4 bg-[#1E2530] text-slate-300 p-4 space-y-6 hidden sm:block">
                <div className="flex items-center gap-1.5 px-2">
                  <span className="text-base font-black text-white">Wisen</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8E191]" />
                </div>

                <nav className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#2B333F] text-white font-medium">
                    <Home className="w-3.5 h-3.5 text-[#E8E191]" />
                    Início
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Search className="w-3.5 h-3.5" />
                    Buscar
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Bookmark className="w-3.5 h-3.5" />
                    Meu perfil
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <User className="w-3.5 h-3.5" />
                    Meu conhec.
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    Mapas mentais
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <History className="w-3.5 h-3.5" />
                    Leituras recentes
                  </div>
                </nav>

                <div className="pt-6 border-t border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white">
                    <Settings className="w-3.5 h-3.5" />
                    Configurações
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-8 p-4 md:p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar termos, ideias..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1 text-[11px] text-slate-600 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E8E191] flex items-center justify-center text-[10px] font-bold text-[#2B333F]">
                      MA
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#2B333F]">Boa tarde, Maria</h3>
                  <p className="text-[10px] text-slate-400">
                    Aprenda 10m com resumo personalizado.
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop"
                    width={600}
                    height={240}
                    alt="Destaque"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3 bg-white">
                    <h4 className="text-xs font-bold text-[#2B333F] leading-tight">
                      Grandes apostas na redução de emissões nos próximos nove anos
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Uma análise completa sobre os acordos globais no que respeita ao setor nos
                      próximos anos.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sugestões do tempo
                  </span>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium text-[#2B333F]">
                        Impacto econômico
                      </span>
                      <span className="text-[9px] font-bold text-[#2B333F] bg-[#E8E191]/60 px-2 py-0.5 rounded-full">
                        Tendência
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium text-[#2B333F]">
                        Ciências da Saúde
                      </span>
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Em alta
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-medium text-[#2B333F]">
                        Inteligência Artificial
                      </span>
                      <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        Polêmica
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Uma nova forma de aprender
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-[#2B333F] tracking-tight leading-tight">
            Do que acontece no mundo ao que você{" "}
            <span className="border-b-4 border-[#E8E191]">realmente entende.</span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            O Wisen combina inteligência avançada e curadoria de fontes confiáveis para trazer o
            conhecimento certo, na dimensão certa e no momento certo. Conexões mais claras, uma
            visão mais completa e decisões mais conscientes para a sua vida.
          </p>
        </div>
      </div>
    </section>
  );
}
