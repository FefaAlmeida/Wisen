"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { mergeEvents, transferArticle } from "@/lib/event-curation";

import CardEvento from "./cardEvento";
import PainelArtigos from "./painelArtigos";

const eventosIniciais = [
  {
    id: 1,
    titulo: "Reunião do Copom e decisão da Selic",
    descricao:
      "Banco Central mantém a taxa Selic em 10,75% ao ano. Decisão reflete cenário de inflação e projeções para o crescimento.",
    resumo:
      "Banco Central mantém a taxa Selic em 10,75% ao ano. Decisão reflete cenário de inflação e projeções para o crescimento econômico.",
    categoria: "Economia",
    data: "23/10/2026",
    identificacao: "hoje",
    status: "Pendente",
    imagem: "/eventos/copom.jpg",
    artigos: [
      {
        id: 101,
        titulo: "Copom mantém Selic em 10,75% ao ano",
        fonte: "G1",
        data: "23/10/2026",
        imagem: "/eventos/copom.jpg",
      },
      {
        id: 102,
        titulo: "Decisão do Copom reforça cautela com inflação",
        fonte: "Valor Econômico",
        data: "23/10/2026",
        imagem: "/eventos/mercado.jpg",
      },
      {
        id: 103,
        titulo: "Mercado reage à manutenção da taxa Selic",
        fonte: "Estadão",
        data: "23/10/2026",
        imagem: "/eventos/copom.jpg",
      },
      {
        id: 104,
        titulo: "Especialistas avaliam próximos passos da política monetária",
        fonte: "BBC News Brasil",
        data: "22/10/2026",
        imagem: "/eventos/vacina.jpg",
      },
      {
        id: 105,
        titulo: "Impacto da Selic no crédito e no consumo",
        fonte: "CNN Brasil",
        data: "22/10/2026",
        imagem: "/eventos/mercado.jpg",
      },
      {
        id: 106,
        titulo: "Selic estável: o que muda para o investidor?",
        fonte: "Folha de S.Paulo",
        data: "22/10/2026",
        imagem: "/eventos/copom.jpg",
      },
    ],
  },
  {
    id: 2,
    titulo: "Novas regras para inteligência artificial no Brasil",
    descricao: "Governo apresenta diretrizes para o uso responsável da IA em setores estratégicos.",
    resumo:
      "O governo apresentou novas diretrizes para ampliar a segurança, a transparência e o uso responsável da inteligência artificial no país.",
    categoria: "Tecnologia",
    data: "23/10/2026",
    identificacao: "hoje",
    status: "Pendente",
    imagem: "/eventos/inteligenciaArtificial.jpg",
    artigos: [
      {
        id: 201,
        titulo: "Novas diretrizes para uso de IA no Brasil",
        fonte: "Agência Brasil",
        data: "23/10/2026",
        imagem: "/eventos/inteligenciaArtificial.jpg",
      },
      {
        id: 202,
        titulo: "Especialistas comentam regulação da IA",
        fonte: "Nexo",
        data: "23/10/2026",
        imagem: "/eventos/inteligenciaArtificial.jpg",
      },
    ],
  },
  {
    id: 3,
    titulo: "Aprovação de novo medicamento para diabetes",
    descricao:
      "Agência reguladora aprova medicamento inovador para o tratamento do diabetes tipo 2.",
    resumo:
      "A agência reguladora anunciou a aprovação de um novo medicamento para diabetes tipo 2, com expectativa de ampliar o acesso ao tratamento.",
    categoria: "Saúde",
    data: "22/10/2026",
    identificacao: "ontem",
    status: "Revisado",
    imagem: "/eventos/medicamento.jpg",
    artigos: [
      {
        id: 301,
        titulo: "Novo tratamento para diabetes é aprovado",
        fonte: "Portal Saúde",
        data: "22/10/2026",
        imagem: "/eventos/medicamento.jpg",
      },
    ],
  },
  {
    id: 4,
    titulo: "Discussões sobre o desmatamento na Amazônia",
    descricao: "Relatório aponta aumento das áreas de desmatamento na região amazônica em 2026.",
    resumo:
      "Relatórios recentes voltaram a chamar atenção para o avanço do desmatamento na Amazônia e para os impactos ambientais associados.",
    categoria: "Meio ambiente",
    data: "22/10/2026",
    identificacao: "ontem",
    status: "Ajustado",
    imagem: "/eventos/amazonia.jpg",
    artigos: [
      {
        id: 401,
        titulo: "Monitoramento mostra avanço do desmatamento",
        fonte: "Agência Brasil",
        data: "22/10/2026",
        imagem: "/eventos/amazonia.jpg",
      },
    ],
  },
  {
    id: 5,
    titulo: "Mercado reage a dados de inflação dos EUA",
    descricao:
      "Bolsas globais apresentam volatilidade após divulgação dos dados de inflação americana.",
    resumo:
      "Os mercados repercutiram a divulgação dos novos dados da inflação dos Estados Unidos, influenciando expectativas econômicas globais.",
    categoria: "Economia",
    data: "21/10/2026",
    identificacao: "em 21/10/2026",
    status: "Pendente",
    imagem: "/eventos/mercado.jpg",
    artigos: [
      {
        id: 501,
        titulo: "Inflação americana influencia bolsas globais",
        fonte: "Valor Econômico",
        data: "21/10/2026",
        imagem: "/eventos/mercado.jpg",
      },
    ],
  },
  {
    id: 6,
    titulo: "Nova campanha de vacinação contra a gripe",
    descricao: "Ministério da Saúde anuncia ampliação da campanha de vacinação para 2026.",
    resumo:
      "O Ministério da Saúde anunciou novas etapas da campanha de vacinação contra a gripe, com expansão do público-alvo e reforço logístico.",
    categoria: "Saúde",
    data: "21/10/2026",
    identificacao: "em 21/10/2026",
    status: "Revisado",
    imagem: "/eventos/vacina.jpg",
    artigos: [
      {
        id: 601,
        titulo: "Campanha de vacinação será ampliada em 2026",
        fonte: "Ministério da Saúde",
        data: "21/10/2026",
        imagem: "/eventos/vacina.jpg",
      },
    ],
  },
];

const artigosNaoAssociadosIniciais = [
  {
    id: 701,
    titulo: "Especialistas analisam próximos passos da política monetária",
    fonte: "BBC News Brasil",
    data: "22/10/2026",
    imagem: "/eventos/copom.jpg",
  },
  {
    id: 702,
    titulo: "Novas pesquisas sobre eventos climáticos extremos",
    fonte: "Mongabay",
    data: "22/10/2026",
    imagem: "/eventos/amazonia.jpg",
  },
  {
    id: 703,
    titulo: "Mercado internacional acompanha novos indicadores",
    fonte: "Bloomberg Línea",
    data: "22/10/2026",
    imagem: "/eventos/mercado.jpg",
  },
  {
    id: 704,
    titulo: "Especialistas comentam medicamento recém-aprovado",
    fonte: "Veja Saúde",
    data: "22/10/2026",
    imagem: "/eventos/medicamento.jpg",
  },
  {
    id: 705,
    titulo: "Nova nota técnica sobre inteligência artificial",
    fonte: "Canaltech",
    data: "22/10/2026",
    imagem: "/eventos/inteligenciaArtificial.jpg",
  },
  {
    id: 706,
    titulo: "Campanha de vacinação é ampliada em novos estados",
    fonte: "G1",
    data: "22/10/2026",
    imagem: "/eventos/vacina.jpg",
  },
];

const idsSugeridos = [1, 2, 5];

export default function CuradoriaEventos() {
  const [eventos, setEventos] = useState(eventosIniciais);
  const [artigosNaoAssociados, setArtigosNaoAssociados] = useState(artigosNaoAssociadosIniciais);
  const [aba, setAba] = useState("eventos");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [ordem, setOrdem] = useState("recentes");

  const [selecionados, setSelecionados] = useState([1, 2]);
  const [eventoAbertoId, setEventoAbertoId] = useState(1);

  const [modal, setModal] = useState(null);
  const [eventoEditandoId, setEventoEditandoId] = useState(null);
  const [dadosEdicao, setDadosEdicao] = useState(null);

  const [artigoMovendo, setArtigoMovendo] = useState(null);
  const [eventoOrigemId, setEventoOrigemId] = useState(null);
  const [destinoId, setDestinoId] = useState("");

  const [buscaArtigo, setBuscaArtigo] = useState("");

  const eventoAberto = eventos.find((evento) => evento.id === eventoAbertoId);

  const eventosFiltrados = useMemo(() => {
    let lista = [...eventos];

    if (aba === "sugeridos") {
      lista = lista.filter((evento) => idsSugeridos.includes(evento.id));
    }

    if (busca.trim()) {
      lista = lista.filter((evento) => {
        const texto = `${evento.titulo} ${evento.descricao}`.toLowerCase();
        return texto.includes(busca.toLowerCase());
      });
    }

    if (categoria !== "todas") {
      lista = lista.filter((evento) => evento.categoria === categoria);
    }

    if (status !== "todos") {
      lista = lista.filter((evento) => evento.status === status);
    }

    if (ordem === "alfabetica") {
      lista.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    }

    return lista;
  }, [eventos, aba, busca, categoria, status, ordem]);

  function selecionarEvento(id, valor) {
    if (valor) {
      setSelecionados((anterior) => [...new Set([...anterior, id])]);
      return;
    }

    setSelecionados((anterior) => anterior.filter((item) => item !== id));
  }

  function limparSelecionados() {
    setSelecionados([]);
  }

  function abrirEdicao(evento) {
    setEventoEditandoId(evento.id);
    setDadosEdicao({
      titulo: evento.titulo,
      descricao: evento.descricao,
      resumo: evento.resumo,
      categoria: evento.categoria,
      status: evento.status,
    });
    setModal("editar");
  }

  function salvarEdicao(e) {
    e.preventDefault();

    setEventos((anterior) =>
      anterior.map((evento) =>
        evento.id === eventoEditandoId
          ? {
              ...evento,
              ...dadosEdicao,
            }
          : evento,
      ),
    );

    setModal(null);
  }

  function abrirMover(artigo) {
    setArtigoMovendo(artigo);
    setEventoOrigemId(eventoAbertoId);
    setDestinoId("");
    setModal("mover");
  }

  function moverArtigo() {
    if (!artigoMovendo || !destinoId) return;

    const nextEvents = transferArticle(eventos, artigoMovendo, eventoOrigemId, Number(destinoId));
    if (nextEvents === eventos) return;
    setEventos(nextEvents);
    if (eventoOrigemId === null) {
      setArtigosNaoAssociados((anterior) =>
        anterior.filter((artigo) => artigo.id !== artigoMovendo.id),
      );
    }

    setModal(null);
    setArtigoMovendo(null);
  }

  function unificarEventos() {
    if (selecionados.length !== 2) return;

    const [primeiroId, segundoId] = selecionados;
    const nextEvents = mergeEvents(eventos, primeiroId, segundoId);
    if (nextEvents === eventos) return;
    setEventos(nextEvents);

    setEventoAbertoId(primeiroId);
    setSelecionados([]);
    setModal(null);
  }

  return (
    <div className="w-full">
      <Tabs value={aba} onValueChange={setAba} className="w-full">
        <TabsList className="mb-4 h-auto w-full justify-start gap-7 rounded-none border-b border-[#DEE6F1] bg-transparent p-0">
          <TabsTrigger
            value="eventos"
            className="relative h-12 rounded-none border-b-2 border-transparent px-2 text-[13px] font-medium text-[#63789B] shadow-none data-[state=active]:border-[#E0C43F] data-[state=active]:bg-transparent data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
          >
            Eventos recentes
          </TabsTrigger>

          <TabsTrigger
            value="naoAssociados"
            className="relative h-12 rounded-none border-b-2 border-transparent px-2 text-[13px] font-medium text-[#63789B] shadow-none data-[state=active]:border-[#E0C43F] data-[state=active]:bg-transparent data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
          >
            Artigos não associados
            <span className="ml-2 rounded-full bg-[#F1DF8B] px-2 py-0.5 text-[11px] font-semibold text-[#5A4A14]">
              {artigosNaoAssociados.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="sugeridos"
            className="relative h-12 rounded-none border-b-2 border-transparent px-2 text-[13px] font-medium text-[#63789B] shadow-none data-[state=active]:border-[#E0C43F] data-[state=active]:bg-transparent data-[state=active]:text-[#101A40] data-[state=active]:shadow-none"
          >
            Duplicados sugeridos
            <span className="ml-2 rounded-full bg-[#F1DF8B] px-2 py-0.5 text-[11px] font-semibold text-[#5A4A14]">
              {eventos.filter((evento) => idsSugeridos.includes(evento.id)).length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {aba === "naoAssociados" ? (
        <Card className="rounded-[22px] border border-[#E4EAF3] bg-white p-5 shadow-none">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-semibold text-[#101A40]">Artigos não associados</h2>
              <p className="mt-1 text-[13px] text-[#7B8BA8]">
                Associe manualmente artigos a um evento existente.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {artigosNaoAssociados.map((artigo) => (
              <div
                key={artigo.id}
                className="flex items-center justify-between gap-3 rounded-[16px] border border-[#E6EBF3] bg-[#FCFDFF] p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[12px] bg-[#EEF3FA]">
                    {artigo.imagem && (
                      <img
                        src={artigo.imagem}
                        alt={artigo.titulo}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#101A40]">{artigo.titulo}</h3>
                    <p className="mt-1 text-[12px] text-[#8A9AB5]">
                      {artigo.fonte} · {artigo.data}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setArtigoMovendo(artigo);
                    setEventoOrigemId(null);
                    setDestinoId("");
                    setModal("mover");
                  }}
                  className="h-10 rounded-[12px] border-[#E3E9F3] bg-[#F4F7FC] px-4 text-[#30466E] shadow-none hover:bg-[#EAF0F8]"
                >
                  Associar
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div
          className={`grid items-start gap-4 ${
            eventoAberto ? "xl:grid-cols-[minmax(0,1fr)_420px]" : "grid-cols-1"
          }`}
        >
          <Card className="rounded-[22px] border border-[#E4EAF3] bg-white p-4 shadow-none">
            <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_170px_170px_145px_46px]">
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#7C8EAE]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </span>

                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar eventos..."
                  className="h-11 rounded-[14px] border-[#DCE4F0] bg-white pl-10 text-[13px] text-[#30466E] placeholder:text-[#90A0BA]"
                />
              </div>

              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="h-11 rounded-[14px] border-[#DCE4F0] bg-white text-[13px] text-[#30466E] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  <SelectItem value="Economia">Economia</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Meio ambiente">Meio ambiente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 rounded-[14px] border-[#DCE4F0] bg-white text-[13px] text-[#30466E] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Revisado">Revisado</SelectItem>
                  <SelectItem value="Ajustado">Ajustado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ordem} onValueChange={setOrdem}>
                <SelectTrigger className="h-11 rounded-[14px] border-[#DCE4F0] bg-white text-[13px] text-[#30466E] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Mais recentes</SelectItem>
                  <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-[14px] border-[#DCE4F0] bg-white p-0 text-[#5D7398] shadow-none hover:bg-[#F5F8FC]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M4 21v-7" />
                  <path d="M4 10V3" />
                  <path d="M12 21v-9" />
                  <path d="M12 8V3" />
                  <path d="M20 21v-4" />
                  <path d="M20 13V3" />
                  <path d="M1 14h6" />
                  <path d="M9 8h6" />
                  <path d="M17 17h6" />
                </svg>
              </Button>
            </div>

            {selecionados.length > 0 && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-[16px] bg-[#F3F6FB] px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#30466E] text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-[#101A40]">
                      {selecionados.length} eventos selecionados
                    </p>
                    <p className="text-[12px] text-[#7A8BA8]">
                      Você pode unificar dois eventos que representam o mesmo acontecimento.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setModal("unificar")}
                    disabled={selecionados.length !== 2}
                    className="h-11 rounded-[14px] bg-[#F1DD7F] px-5 text-[14px] font-semibold text-[#101A40] shadow-none hover:bg-[#E9D36C] disabled:opacity-50"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M17 7 7 17" />
                      <path d="M7 11H4v9h9v-3" />
                    </svg>
                    Unificar eventos
                  </Button>

                  <button
                    type="button"
                    onClick={limparSelecionados}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#60789F] hover:bg-[#EAF0F7]"
                    aria-label="Limpar seleção"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {eventosFiltrados.map((evento) => (
                <CardEvento
                  key={evento.id}
                  evento={evento}
                  selecionado={selecionados.includes(evento.id)}
                  ativo={eventoAbertoId === evento.id}
                  aoSelecionar={selecionarEvento}
                  aoVerArtigos={(item) => {
                    setEventoAbertoId(item.id);
                    setBuscaArtigo("");
                  }}
                  aoEditar={abrirEdicao}
                />
              ))}
            </div>
          </Card>

          {eventoAberto && (
            <PainelArtigos
              evento={eventoAberto}
              aoFechar={() => setEventoAbertoId(null)}
              aoEditar={abrirEdicao}
              aoMover={abrirMover}
              buscaArtigo={buscaArtigo}
              setBuscaArtigo={setBuscaArtigo}
            />
          )}
        </div>
      )}

      <Dialog open={modal === "unificar"} onOpenChange={(aberto) => !aberto && setModal(null)}>
        <DialogContent className="rounded-[22px] border-[#E4EAF3] bg-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[#101A40]">
              Unificar eventos
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#7C8EAE]">
              Os dois eventos selecionados serão consolidados em um único registro.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-[16px] bg-[#F5F8FC] p-4">
            {selecionados.map((id) => {
              const evento = eventos.find((item) => item.id === id);
              return (
                <p key={id} className="py-1 text-[14px] font-medium text-[#30466E]">
                  {evento?.titulo}
                </p>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModal(null)}
              className="rounded-[12px] border-[#DCE4F0] text-[#30466E]"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={unificarEventos}
              className="rounded-[12px] bg-[#E8E191] text-[#101A40] hover:bg-[#DDD581]"
            >
              Confirmar unificação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "editar"} onOpenChange={(aberto) => !aberto && setModal(null)}>
        <DialogContent className="rounded-[22px] border-[#E4EAF3] bg-white sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[#101A40]">
              Editar evento
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#7C8EAE]">
              Atualize as informações do evento e mantenha a curadoria organizada.
            </DialogDescription>
          </DialogHeader>

          {dadosEdicao && (
            <form onSubmit={salvarEdicao} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="editar-evento-titulo"
                  className="text-[12px] font-medium text-[#30466E]"
                >
                  Título
                </label>
                <Input
                  id="editar-evento-titulo"
                  value={dadosEdicao.titulo}
                  onChange={(e) => setDadosEdicao({ ...dadosEdicao, titulo: e.target.value })}
                  className="h-11 rounded-[14px] border-[#DCE4F0]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="editar-evento-descricao"
                  className="text-[12px] font-medium text-[#30466E]"
                >
                  Descrição
                </label>
                <textarea
                  rows={3}
                  id="editar-evento-descricao"
                  value={dadosEdicao.descricao}
                  onChange={(e) => setDadosEdicao({ ...dadosEdicao, descricao: e.target.value })}
                  className="w-full rounded-[14px] border border-[#DCE4F0] bg-white px-4 py-3 text-[13px] text-[#30466E] outline-none focus:border-[#E0C43F]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="editar-evento-resumo"
                  className="text-[12px] font-medium text-[#30466E]"
                >
                  Resumo do evento
                </label>
                <textarea
                  rows={4}
                  id="editar-evento-resumo"
                  value={dadosEdicao.resumo}
                  onChange={(e) => setDadosEdicao({ ...dadosEdicao, resumo: e.target.value })}
                  className="w-full rounded-[14px] border border-[#DCE4F0] bg-white px-4 py-3 text-[13px] text-[#30466E] outline-none focus:border-[#E0C43F]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="editar-evento-categoria"
                    className="text-[12px] font-medium text-[#30466E]"
                  >
                    Categoria
                  </label>
                  <Select
                    value={dadosEdicao.categoria}
                    onValueChange={(valor) => setDadosEdicao({ ...dadosEdicao, categoria: valor })}
                  >
                    <SelectTrigger
                      id="editar-evento-categoria"
                      className="h-11 rounded-[14px] border-[#DCE4F0]"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Economia">Economia</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Meio ambiente">Meio ambiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="editar-evento-status"
                    className="text-[12px] font-medium text-[#30466E]"
                  >
                    Status
                  </label>
                  <Select
                    value={dadosEdicao.status}
                    onValueChange={(valor) => setDadosEdicao({ ...dadosEdicao, status: valor })}
                  >
                    <SelectTrigger
                      id="editar-evento-status"
                      className="h-11 rounded-[14px] border-[#DCE4F0]"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Revisado">Revisado</SelectItem>
                      <SelectItem value="Ajustado">Ajustado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModal(null)}
                  className="rounded-[12px] border-[#DCE4F0] text-[#30466E]"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="rounded-[12px] bg-[#E8E191] text-[#101A40] hover:bg-[#DDD581]"
                >
                  Salvar alterações
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "mover"} onOpenChange={(aberto) => !aberto && setModal(null)}>
        <DialogContent className="rounded-[22px] border-[#E4EAF3] bg-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[#101A40]">
              Mover artigo
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#7C8EAE]">
              Selecione o evento de destino para este artigo.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-[16px] bg-[#F5F8FC] p-4 text-[13px] text-[#30466E]">
            {artigoMovendo?.titulo}
          </div>

          <Select value={destinoId} onValueChange={setDestinoId}>
            <SelectTrigger className="h-11 rounded-[14px] border-[#DCE4F0]">
              <SelectValue placeholder="Selecionar evento" />
            </SelectTrigger>

            <SelectContent>
              {eventos
                .filter((evento) => evento.id !== eventoOrigemId)
                .map((evento) => (
                  <SelectItem key={evento.id} value={String(evento.id)}>
                    {evento.titulo}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModal(null)}
              className="rounded-[12px] border-[#DCE4F0] text-[#30466E]"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              disabled={!destinoId}
              onClick={moverArtigo}
              className="rounded-[12px] bg-[#E8E191] text-[#101A40] hover:bg-[#DDD581]"
            >
              Confirmar transferência
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
