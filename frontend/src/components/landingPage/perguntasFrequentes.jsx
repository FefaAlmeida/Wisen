"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function PerguntasFrequentes() {
  const [abertoIndex, setAbertoIndex] = useState(null);

  const faqs = [
    {
      pergunta: "O que está incluído nos planos?",
      resposta:
        "Todos os planos dão acesso às notícias explicadas, às conexões entre temas e conceitos e às revisões para retomar o que você aprendeu.",
    },
    {
      pergunta: "Qual é a diferença entre os planos?",
      resposta:
        "Os recursos são os mesmos. Você escolhe pagar por mês, a cada seis meses ou uma vez por ano. Os períodos mais longos têm um custo mensal equivalente menor.",
    },
    {
      pergunta: "Já tenho uma conta. Preciso me cadastrar de novo?",
      resposta:
        "Não. Use o mesmo e-mail e a sua senha para entrar. O cadastro é apenas para quem ainda não tem uma conta no Wisen.",
    },
    {
      pergunta: "As notícias mostram de onde vieram?",
      resposta:
        "Sim. As notícias identificam suas fontes e dão acesso à publicação original para você consultar o conteúdo completo.",
    },
    {
      pergunta: "Preciso instalar um aplicativo?",
      resposta: "Não. O Wisen funciona pelo navegador no celular, tablet ou computador.",
    },
  ];

  const toggleFaq = (index) => {
    setAbertoIndex((anterior) => (anterior === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-titulo"
      className="relative w-screen -mx-[calc(50vw-50%)] mt-0 scroll-mt-24"
    >
      <div className="relative isolate overflow-hidden border-y border-[#293B5C] bg-[#172542] px-6 py-8 text-white sm:px-10 md:px-14 md:py-10">
        <div className="relative z-10 mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-10">
          {/* Introdução */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6 lg:col-span-5 lg:justify-start lg:self-center">
            <h2
              id="faq-titulo"
              className="text-center text-[clamp(1.5rem,6.5vw,1.875rem)] font-bold leading-[1.15] tracking-[-0.045em] text-white sm:text-left sm:text-[clamp(1.875rem,2.8vw,2.5rem)]"
            >
              Ainda tem <br className="hidden sm:block" />
              perguntas<span className="text-[#E8E191]">?</span>
            </h2>
            <Image
              src="/coruja-wisen-faq.png"
              alt=""
              width={367}
              height={384}
              unoptimized
              className="h-auto w-20 shrink-0 sm:w-28 xl:w-32"
            />
          </div>

          {/* Perguntas */}
          <div className="lg:col-span-7">
            {faqs.map((item, index) => {
              const estaAberto = abertoIndex === index;

              return (
                <div key={item.pergunta} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={estaAberto}
                    aria-controls={`faq-resposta-${index}`}
                    className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
                  >
                    <span
                      className={`text-base font-semibold leading-relaxed transition-colors duration-200 ${
                        estaAberto ? "text-[#E8E191]" : "text-white group-hover:text-[#E8E191]"
                      }`}
                    >
                      {item.pergunta}
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-[#E8E191] transition-transform duration-200 motion-reduce:transition-none ${
                        estaAberto ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Resposta com abertura suave */}
                  <div
                    id={`faq-resposta-${index}`}
                    aria-hidden={!estaAberto}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                      estaAberto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-[600px] pb-6 pr-6 text-base leading-[1.8] text-[#BDCADB]">
                        {item.resposta}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
