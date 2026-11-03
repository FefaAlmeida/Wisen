"use client";

import { ArrowLeft, Check, ChevronRight, CircleX, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const questions = [
  {
    topic: "Economia · Taxa Selic",
    question: "Qual é o principal objetivo da taxa Selic na economia brasileira?",
    options: [
      "Controlar a inflação e influenciar o nível de atividade econômica.",
      "Definir a taxa de câmbio do real em relação ao dólar.",
      "Financiar diretamente os gastos do governo federal.",
      "Determinar o valor dos impostos sobre o consumo.",
    ],
    answer: 0,
    explanation:
      "A Selic é a taxa básica de juros e um dos principais instrumentos da política monetária para controlar a inflação.",
  },
  {
    topic: "Economia · Política monetária",
    question: "O que tende a acontecer com o crédito quando a taxa Selic aumenta?",
    options: [
      "Os empréstimos ficam gratuitos para consumidores e empresas.",
      "O crédito tende a ficar mais caro.",
      "A inflação desaparece imediatamente.",
      "Os impostos sobre produtos são reduzidos automaticamente.",
    ],
    answer: 1,
    explanation:
      "Com a Selic mais alta, o custo do dinheiro tende a subir e os empréstimos ficam mais caros.",
  },
  {
    topic: "Meio ambiente · Gases de efeito estufa",
    question: "Como os gases de efeito estufa influenciam a temperatura do planeta?",
    options: [
      "Refletem toda a luz solar de volta para o espaço.",
      "Impedem que a atmosfera receba qualquer energia do Sol.",
      "Retêm parte do calor na atmosfera.",
      "Reduzem a temperatura dos oceanos de forma direta.",
    ],
    answer: 2,
    explanation:
      "Esses gases retêm parte do calor irradiado pela superfície terrestre. O aumento de sua concentração intensifica o aquecimento global.",
  },
];

const optionLetters = ["A", "B", "C", "D"];

export default function PaginaSessaoRevisao() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const question = questions[questionIndex];
  const selectedAnswer = answers[questionIndex];
  const correctAnswers = Object.entries(answers).filter(
    ([index, answer]) => questions[Number(index)].answer === answer,
  ).length;
  const progress = finished ? 100 : ((questionIndex + 1) / questions.length) * 100;

  function selectAnswer(optionIndex) {
    if (selectedAnswer !== undefined) return;
    setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
  }

  function continueSession() {
    if (selectedAnswer === undefined) return;
    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
  }

  function restartSession() {
    setAnswers({});
    setQuestionIndex(0);
    setFinished(false);
  }

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Revisões" />
      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_65%_0%,#E3EAF4_0%,#F0F4F9_58%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] text-wisen-titulo sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-4 pb-12 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4 py-4">
            <Link
              href="/paginaInicialCliente"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#7182A1] transition-colors hover:text-wisen-titulo"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Voltar ao início</span>
            </Link>
            <MenuPerfil />
          </header>

          <div className="mx-auto mt-8 max-w-[760px]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold text-[#93A3BE]">SESSÃO DE REVISÃO</p>
                <h1 className="mt-1 text-[28px] font-semibold sm:text-[34px]">
                  {finished ? "Revisão concluída" : "Fortaleça seu conhecimento"}
                </h1>
              </div>
              {!finished && (
                <span className="shrink-0 text-sm font-medium text-[#7182A1]">
                  {questionIndex + 1} <span className="text-[#AAB5C6">/ {questions.length}</span>
                </span>
              )}
            </div>

            <div
              className="mb-6 h-1.5 overflow-hidden rounded-full bg-[#DFE6EF]"
              role="progressbar"
              aria-label="Progresso da revisão"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#D7BF4D] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {finished ? (
              <Card className="rounded-xl border-[#E1E7F0] bg-white/95 shadow-sm">
                <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#FFF5C9] text-[#C3A72F]">
                    <Trophy size={25} />
                  </span>
                  <h2 className="mt-5 text-xl font-semibold">Boa revisão!</h2>
                  <p className="mt-2 text-sm text-[#7182A1]">
                    Você acertou {correctAnswers} de {questions.length} questões.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button
                      type="button"
                      onClick={restartSession}
                      variant="outline"
                      className="rounded-lg border-[#DCE5F2]"
                    >
                      <RotateCcw size={15} />
                      Refazer sessão
                    </Button>
                    <Button
                      render={<Link href="/paginaInicialCliente" />}
                      className="rounded-lg bg-[#F3E69A] text-[#263343] shadow-none hover:bg-[#EBDD80]"
                    >
                      Voltar ao início
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-xl border-[#E1E7F0] bg-white/95 shadow-sm">
                <CardContent className="px-5 py-6 sm:px-8 sm:py-8">
                  <p className="text-xs font-medium text-[#93A3BE]">{question.topic}</p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug sm:text-2xl">
                    {question.question}
                  </h2>

                  <div className="mt-6 space-y-3">
                    {question.options.map((option, index) => {
                      const selected = selectedAnswer === index;
                      const isCorrect = question.answer === index;
                      const showCorrect = selectedAnswer !== undefined && isCorrect;
                      const showIncorrect = selected && !isCorrect;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectAnswer(index)}
                          disabled={selectedAnswer !== undefined}
                          aria-pressed={selected}
                          className={`flex min-h-[58px] w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors disabled:cursor-default ${
                            showCorrect
                              ? "border-emerald-300 bg-emerald-50"
                              : showIncorrect
                                ? "border-rose-300 bg-rose-50"
                                : "border-[#DEE6F2] bg-white hover:bg-[#F6F8FC]"
                          }`}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2F9] text-sm font-semibold text-wisen-titulo">
                            {optionLetters[index]}
                          </span>
                          <span className="flex-1 text-sm leading-5 text-[#52658C]">{option}</span>
                          {showCorrect && <Check size={17} className="shrink-0 text-emerald-600" />}
                          {showIncorrect && <CircleX size={17} className="shrink-0 text-rose-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer !== undefined && (
                    <div
                      role="status"
                      className={`mt-5 rounded-lg px-4 py-3 text-sm leading-5 ${
                        selectedAnswer === question.answer
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      <p className="font-semibold">
                        {selectedAnswer === question.answer ? "Resposta correta" : "Não foi dessa vez"}
                      </p>
                      <p className="mt-1">{question.explanation}</p>
                    </div>
                  )}

                  <div className="mt-7 flex items-center justify-between border-t border-[#E8EDF2] pt-5">
                    <p className="text-xs text-[#8A99B5]">
                      {correctAnswers} {correctAnswers === 1 ? "acerto" : "acertos"} até agora
                    </p>
                    <Button
                      type="button"
                      onClick={continueSession}
                      disabled={selectedAnswer === undefined}
                      className="rounded-lg bg-[#F3E69A] px-5 text-[#263343] shadow-none hover:bg-[#EBDD80]"
                    >
                      {questionIndex === questions.length - 1 ? "Ver resultado" : "Continuar"}
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <Footer variant="cliente" />
        </div>
      </main>
    </div>
  );
}