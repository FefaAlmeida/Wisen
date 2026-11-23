"use client";

import { Bookmark, BookOpen, ListFilter, Search } from "lucide-react";
import { useState } from "react";

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
    data: "1 de out. de 2026",
    titulo: "Estudo aponta aceleração do derretimento das geleiras no mundo",
    descricao:
      "Pesquisa internacional alerta que o derretimento das geleiras está acelerando nas últimas décadas.",
    imagem:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    categoria: "Política",
    data: "28 de set. de 2026",
    titulo: "Novos projetos de reforma tributária avançam no Congresso",
    descricao:
      "Texto prevê mudanças na tributação do consumo e serviços, com impacto direto na economia brasileira.",
    imagem:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    categoria: "Economia",
    data: "25 de set. de 2026",
    titulo: "Petrobras anuncia nova política de preços dos combustíveis",
    descricao: "Empresa confirma alterações na estratégia de reajustes de gasolina e diesel.",
    imagem:
      "https://images.unsplash.com/photo-1545262810-77515befe149?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    categoria: "Meio ambiente",
    data: "22 de set. de 2026",
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
    status: "Em revisão",
    icone: "M4 19h16M6 16V9m4 7V5m4 11v-6m4 6V7",
  },
  {
    id: 2,
    titulo: "Gases de efeito estufa",
    descricao: "Gases que retêm calor na atmosfera, como CO₂ e metano.",
    status: "Lacuna",
    icone: "M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16ZM5 20c3-6 7-9 12-12",
  },
  {
    id: 3,
    titulo: "Política monetária",
    descricao: "Conjunto de medidas para controlar a moeda, o crédito e os juros.",
    status: "Dominado",
    icone: "M3 21h18M5 21V9l7-5 7 5v12M9 12v5m6-5v5",
  },
  {
    id: 4,
    titulo: "Aquecimento global",
    descricao: "Aumento da temperatura média do planeta associado ao efeito estufa.",
    status: "Em revisão",
    icone:
      "M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  },
  {
    id: 5,
    titulo: "Nível do mar",
    descricao: "Altura média da superfície do mar, que pode aumentar com mudanças climáticas.",
    status: "Lacuna",
    icone: "M2 13c3-3 5 3 8 0s5-3 8 0 4 0 4 0M2 18c3-3 5 3 8 0s5-3 8 0 4 0 4 0M12 3v7m-3-3 3 3 3-3",
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

function SecaoGuardados({ titulo, descricao, busca, ordenacao, children }) {
  return (
    <Card className="gap-0 rounded-xl border-wisen-borda bg-white p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
        <div>
          <h2 className="text-base font-semibold text-wisen-titulo">{titulo}</h2>
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
  const [buscaEventos, setBuscaEventos] = useState("");
  const [buscaConceitos, setBuscaConceitos] = useState("");
  const [ordemEventos, setOrdemEventos] = useState("recentes");
  const [ordemConceitos, setOrdemConceitos] = useState("recentes");

  const eventosFiltrados = eventosIniciais
    .filter((evento) =>
      `${evento.titulo} ${evento.categoria} ${evento.descricao}`
        .toLocaleLowerCase("pt-BR")
        .includes(buscaEventos.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      ordemEventos === "alfabetica" ? a.titulo.localeCompare(b.titulo, "pt-BR") : a.id - b.id,
    );

  const conceitosFiltrados = conceitosIniciais
    .filter((conceito) =>
      `${conceito.titulo} ${conceito.descricao} ${conceito.status}`
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
          Eventos salvos
          <span className="rounded-full bg-wisen-superficie px-1.5 py-0.5 text-[11px] text-wisen-texto-forte">
            {eventosIniciais.length}
          </span>
        </TabsTrigger>

        <TabsTrigger value="conceitos" className={estiloAba}>
          <BookOpen className="hidden size-3.5 sm:block" aria-hidden="true" />
          Conceitos marcados
          <span className="rounded-full bg-wisen-superficie px-1.5 py-0.5 text-[11px] text-wisen-texto-forte">
            {conceitosIniciais.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="eventos" className="mt-0">
        <SecaoGuardados
          titulo="Eventos salvos"
          descricao="Notícias que você salvou para ler ou revisar mais tarde."
          busca={{ valor: buscaEventos, aoAlterar: setBuscaEventos, placeholder: "Buscar eventos" }}
          ordenacao={{ valor: ordemEventos, aoAlterar: setOrdemEventos }}
        >
          {eventosFiltrados.map((evento) => (
            <CardEventoSalvo key={evento.id} evento={evento} />
          ))}

          {eventosFiltrados.length === 0 && (
            <p role="status" className="py-6 text-center text-xs text-wisen-texto-suave">
              Nenhum evento encontrado.
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
          {conceitosFiltrados.map((conceito) => (
            <CardConceitoMarcado key={conceito.id} conceito={conceito} />
          ))}

          {conceitosFiltrados.length === 0 && (
            <p role="status" className="py-6 text-center text-xs text-wisen-texto-suave">
              Nenhum conceito encontrado.
            </p>
          )}
        </SecaoGuardados>
      </TabsContent>
    </Tabs>
  );
}
