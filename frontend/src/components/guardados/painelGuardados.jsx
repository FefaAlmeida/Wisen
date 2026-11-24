"use client";

import { Bookmark, BookOpen, ListFilter, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardConceitoMarcado from "./cardConceitoMarcado";
import CardEventoSalvo from "./cardEventoSalvo";

const eventosIniciais = [
  {
    id: 1,
    categoria: "Meio ambiente",
    data: "1 out. 2026",
    titulo: "Derretimento das geleiras acelera no mundo",
    descricao:
      "A perda de gelo contribui para a elevação do nível do mar e afeta ecossistemas costeiros.",
    imagem:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    categoria: "Política",
    data: "28 set. 2026",
    titulo: "Novos projetos de reforma tributária avançam no Congresso",
    descricao:
      "Texto prevê mudanças na tributação do consumo e serviços, com impacto direto na economia brasileira.",
    imagem:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    categoria: "Economia",
    data: "25 set. 2026",
    titulo: "Petrobras anuncia nova política de preços dos combustíveis",
    descricao: "Empresa confirma alterações na estratégia de reajustes de gasolina e diesel.",
    imagem:
      "https://images.unsplash.com/photo-1545262810-77515befe149?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    categoria: "Meio ambiente",
    data: "22 set. 2026",
    titulo: "Desmatamento na Amazônia cai pelo segundo ano consecutivo",
    descricao: "Dados de monitoramento revelam uma redução nas áreas afetadas.",
    imagem:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80",
  },
];

const conceitosIniciais = [
  {
    id: 1,
    titulo: "Taxa Selic",
    descricao: "Taxa básica de juros da economia brasileira, definida pelo Banco Central.",
  },
  {
    id: 2,
    titulo: "Gases de efeito estufa",
    descricao: "Gases que retêm calor na atmosfera, como CO₂ e metano.",
  },
  {
    id: 3,
    titulo: "Política monetária",
    descricao: "Conjunto de medidas para controlar a moeda, o crédito e os juros.",
  },
  {
    id: 4,
    titulo: "Aquecimento global",
    descricao: "Aumento da temperatura média do planeta associado ao efeito estufa.",
  },
  {
    id: 5,
    titulo: "Nível do mar",
    descricao: "Altura média da superfície do mar, que pode aumentar com mudanças climáticas.",
  },
];

const estiloAba =
  "h-8 gap-1.5 rounded-md px-2 text-xs font-semibold text-wisen-texto-suave hover:not-data-active:bg-wisen-superficie data-active:bg-wisen-cliente-hover data-active:text-wisen-titulo sm:px-3";

const opcoesOrdenacao = [
  { value: "recentes", label: "Mais recentes" },
  { value: "alfabetica", label: "Ordem alfabética" },
];

function CampoBusca({ valor, aoAlterar, placeholder }) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-wisen-texto-suave"
        aria-hidden="true"
      />

      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={valor}
        onChange={(event) => aoAlterar(event.target.value)}
        className="h-9 border-wisen-borda pl-8 text-wisen-titulo placeholder:text-wisen-texto-suave focus-visible:border-wisen-destaque focus-visible:ring-wisen-destaque/25 md:text-xs"
      />
    </div>
  );
}

function Ordenacao({ valor, aoAlterar }) {
  return (
    <Select items={opcoesOrdenacao} value={valor} onValueChange={aoAlterar}>
      <SelectTrigger
        aria-label="Ordenar resultados"
        className="w-full cursor-pointer border-wisen-borda text-xs font-medium text-wisen-texto-forte select-none hover:bg-wisen-superficie focus-visible:border-wisen-destaque focus-visible:ring-wisen-destaque/25 data-[size=default]:h-9 sm:w-[165px]"
      >
        <ListFilter className="size-3.5 text-wisen-texto-suave" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>

      <SelectContent align="end" alignItemWithTrigger={false} className="rounded-lg p-1">
        {opcoesOrdenacao.map(({ value, label }) => (
          <SelectItem key={value} value={value} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AvisoRemocao({ mensagem, aoDesfazer }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-wisen-borda bg-white px-3 py-1 text-xs text-wisen-texto-forte">
      <span role="status">{mensagem}</span>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="cursor-pointer text-xs font-semibold text-wisen-titulo"
        onClick={aoDesfazer}
      >
        Desfazer
      </Button>
    </div>
  );
}

function SecaoGuardados({ titulo, descricao, busca, ordenacao, children }) {
  return (
    <Card className="gap-0 rounded-xl border-wisen-borda bg-white p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
        <div>
          <h2 className="text-base font-semibold text-wisen-titulo">{titulo}</h2>
          <span
            aria-hidden="true"
            className="mt-2 block h-0.5 w-8 rounded-full bg-wisen-destaque"
          />
          <p className="mt-0.5 text-xs leading-5 text-wisen-texto-suave">{descricao}</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-96">
          <CampoBusca {...busca} />
          <Ordenacao {...ordenacao} />
        </div>
      </div>

      <div className="space-y-2 border-t border-wisen-borda bg-wisen-superficie/60 p-2 sm:p-3">
        {children}
      </div>
    </Card>
  );
}

export default function PainelGuardados() {
  const [aba, setAba] = useState("eventos");
  const [idsEventosRemovidos, setIdsEventosRemovidos] = useState([]);
  const [idsConceitosRemovidos, setIdsConceitosRemovidos] = useState([]);
  const [buscaEventos, setBuscaEventos] = useState("");
  const [buscaConceitos, setBuscaConceitos] = useState("");
  const [ordemEventos, setOrdemEventos] = useState("recentes");
  const [ordemConceitos, setOrdemConceitos] = useState("recentes");

  function removerEvento(id) {
    setIdsEventosRemovidos((ids) => [...ids, id]);
  }

  const eventosSalvos = eventosIniciais.filter(
    (evento) => !idsEventosRemovidos.includes(evento.id),
  );
  const eventosFiltrados = eventosSalvos
    .filter((evento) =>
      `${evento.titulo} ${evento.categoria} ${evento.descricao}`
        .toLocaleLowerCase("pt-BR")
        .includes(buscaEventos.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      ordemEventos === "alfabetica" ? a.titulo.localeCompare(b.titulo, "pt-BR") : a.id - b.id,
    );

  const conceitosSalvos = conceitosIniciais.filter(
    (conceito) => !idsConceitosRemovidos.includes(conceito.id),
  );
  const conceitosFiltrados = conceitosSalvos
    .filter((conceito) =>
      `${conceito.titulo} ${conceito.descricao}`
        .toLocaleLowerCase("pt-BR")
        .includes(buscaConceitos.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      ordemConceitos === "alfabetica" ? a.titulo.localeCompare(b.titulo, "pt-BR") : a.id - b.id,
    );

  return (
    <Tabs value={aba} onValueChange={setAba} className="w-full gap-3">
      <TabsList className="max-w-full flex-wrap justify-start gap-1 border border-wisen-borda bg-white group-data-horizontal/tabs:h-auto">
        <TabsTrigger value="eventos" className={estiloAba}>
          <Bookmark className="hidden size-3.5 sm:block" aria-hidden="true" />
          Notícias salvas
          <span className="rounded-full bg-wisen-superficie px-1.5 py-0.5 text-[11px] text-wisen-texto-forte">
            {eventosSalvos.length}
          </span>
        </TabsTrigger>

        <TabsTrigger value="conceitos" className={estiloAba}>
          <BookOpen className="hidden size-3.5 sm:block" aria-hidden="true" />
          Conceitos marcados
          <span className="rounded-full bg-wisen-superficie px-1.5 py-0.5 text-[11px] text-wisen-texto-forte">
            {conceitosSalvos.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="eventos" className="mt-0">
        <SecaoGuardados
          titulo="Notícias salvas"
          descricao="Notícias que você salvou para ler ou revisar mais tarde."
          busca={{
            valor: buscaEventos,
            aoAlterar: setBuscaEventos,
            placeholder: "Buscar notícias",
          }}
          ordenacao={{ valor: ordemEventos, aoAlterar: setOrdemEventos }}
        >
          {idsEventosRemovidos.length > 0 && (
            <AvisoRemocao
              mensagem="Notícia removida dos salvos."
              aoDesfazer={() => setIdsEventosRemovidos((ids) => ids.slice(0, -1))}
            />
          )}

          {eventosFiltrados.map((evento) => (
            <CardEventoSalvo
              key={evento.id}
              evento={evento}
              aoRemover={() => removerEvento(evento.id)}
            />
          ))}

          {eventosFiltrados.length === 0 && (
            <p role="status" className="py-6 text-center text-xs text-wisen-texto-suave">
              {eventosSalvos.length === 0
                ? "Nenhuma notícia salva."
                : "Nenhuma notícia encontrada."}
            </p>
          )}
        </SecaoGuardados>
      </TabsContent>

      <TabsContent value="conceitos" className="mt-0">
        <SecaoGuardados
          titulo="Conceitos marcados"
          descricao="Temas que você marcou para estudar depois."
          busca={{
            valor: buscaConceitos,
            aoAlterar: setBuscaConceitos,
            placeholder: "Buscar conceitos",
          }}
          ordenacao={{ valor: ordemConceitos, aoAlterar: setOrdemConceitos }}
        >
          {idsConceitosRemovidos.length > 0 && (
            <AvisoRemocao
              mensagem="Conceito removido dos salvos."
              aoDesfazer={() => setIdsConceitosRemovidos((ids) => ids.slice(0, -1))}
            />
          )}

          {conceitosFiltrados.map((conceito) => (
            <CardConceitoMarcado
              key={conceito.id}
              conceito={conceito}
              aoRemover={() => setIdsConceitosRemovidos((ids) => [...ids, conceito.id])}
            />
          ))}

          {conceitosFiltrados.length === 0 && (
            <p role="status" className="py-6 text-center text-xs text-wisen-texto-suave">
              {conceitosSalvos.length === 0
                ? "Nenhum conceito marcado."
                : "Nenhum conceito encontrado."}
            </p>
          )}
        </SecaoGuardados>
      </TabsContent>
    </Tabs>
  );
}
