"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function PerguntasFrequentes() {
  const [abertoIndex, setAbertoIndex] = useState(null);

  const faqs = [
    {
      pergunta: "O Wisen é gratuito?",
      resposta:
        "Sim, você pode começar a usar o Wisen gratuitamente com acesso aos principais resumos e funcionalidades básicas.",
    },
    {
      pergunta: "Quais tipos de conteúdo estão disponíveis?",
      resposta:
        "Oferecemos resumos de notícias, análises de mercado, temas de tecnologia, política, economia e saúde com mapas mentais interativos.",
    },
    {
      pergunta: "Como é a curadoria dos conteúdos?",
      resposta:
        "Nossa equipe utiliza algoritmos avançados combinados com revisão humana para garantir fontes confiáveis e informações imparciais.",
    },
    {
      pergunta: "Posso usar a plataforma no celular ou tablet?",
      resposta:
        "Sim! O Wisen é inteiramente responsivo e funciona perfeitamente em qualquer dispositivo móvel, tablet ou computador.",
    },
  ];

  const toggleFaq = (index) => {
    setAbertoIndex(abertoIndex === index ? null : index);
  };

  return (
    <section className="py-6" id="faq">
      <div className="rounded-3xl bg-[#2B333F] text-white p-8 md:p-12 shadow-2xl border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-bold tracking-wider text-[#E8E191] uppercase">
              DÚVIDAS FREQUENTES
            </span>

            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
              Ainda tem
              <br />
              perguntas<span className="text-[#E8E191]">?</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-normal">
              Reunimos aqui as principais dúvidas sobre o funcionamento do Wisen.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-2">
            {faqs.map((item, index) => {
              const estaAberto = abertoIndex === index;
              return (
                <div
                  key={item.pergunta}
                  className="border-b border-slate-700/80 last:border-0 pb-3 pt-1"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-3 text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-[#E8E191] transition-colors pr-4">
                      {item.pergunta}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#E8E191] transition-transform duration-200 shrink-0 ${
                        estaAberto ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {estaAberto && (
                    <div className="pb-3 text-xs text-slate-300 leading-relaxed pt-1">
                      {item.resposta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
