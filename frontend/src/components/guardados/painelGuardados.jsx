
"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CardEventoSalvo from "./cardEventoSalvo";
import CardConceitoMarcado from "./cardConceitoMarcado";

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
    descricao:
      "Empresa confirma alterações na estratégia de reajustes de gasolina e diesel.",
    imagem:
      "https://images.unsplash.com/photo-1545262810-77515befe149?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    categoria: "Meio ambiente",
    data: "22 de set. de 2026",
    titulo: "Desmatamento na Amazônia cai pelo segundo ano consecutivo",
    descricao:
      "Dados de monitoramento revelam uma redução nas áreas afetadas.",
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
    icone: "M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  },
  {
    id: 5,
    titulo: "Nível do mar",
    descricao: "Altura média da superfície do mar, que pode aumentar com mudanças climáticas.",
    status: "Lacuna",
    icone: "M2 13c3-3 5 3 8 0s5-3 8 0 4 0 4 0M2 18c3-3 5 3 8 0s5-3 8 0 4 0 4 0M12 3v7m-3-3 3 3 3-3",
  },
];

function CampoBusca({ valor, aoAlterar, placeholder }) {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8A9BB5]"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>

      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={valor}
        onChange={(event) => aoAlterar(event.target.value)}
        className="h-9 rounded-lg border-[#E2E8F0] bg-white pl-9 text-[12px] text-[#101A40] shadow-none placeholder:text-[#98A5BA] focus-visible:ring-[#EEDC84]"
      />
    </div>
  );
}

function Ordenacao({ valor, aoAlterar }) {
  return (
    <Select value={valor} onValueChange={aoAlterar}>
      <SelectTrigger className="h-9 w-[145px] shrink-0 rounded-lg border-[#E2E8F0] bg-white px-3 text-[11px] text-[#607398] shadow-none">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="recentes">Mais recentes</SelectItem>
        <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
      </SelectContent>
    </Select>
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
        .includes(buscaEventos.toLocaleLowerCase("pt-BR"))
    )
    .sort((a, b) =>
      ordemEventos === "alfabetica"
        ? a.titulo.localeCompare(b.titulo, "pt-BR")
        : a.id - b.id
    );

  const conceitosFiltrados = conceitosIniciais
    .filter((conceito) =>
      `${conceito.titulo} ${conceito.descricao} ${conceito.status}`
        .toLocaleLowerCase("pt-BR")
        .includes(buscaConceitos.toLocaleLowerCase("pt-BR"))
    )
    .sort((a, b) =>
      ordemConceitos === "alfabetica"
        ? a.titulo.localeCompare(b.titulo, "pt-BR")
        : a.id - b.id
    );

  return (
    <Tabs value={aba} onValueChange={setAba} className="w-full gap-3">
      <TabsList className="h-auto w-fit max-w-full justify-start gap-1 rounded-xl bg-[#E9EEF6] p-1">
        <TabsTrigger
          value="eventos"
          className="min-h-9 rounded-lg px-4 text-[12px] font-medium text-[#66799B] data-[state=active]:bg-[#26364D] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Eventos salvos
          <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
            {eventosIniciais.length}
          </span>
        </TabsTrigger>

        <TabsTrigger
          value="conceitos"
          className="min-h-9 rounded-lg px-4 text-[12px] font-medium text-[#66799B] data-[state=active]:bg-[#26364D] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Conceitos marcados
          <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
            {conceitosIniciais.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="eventos" className="mt-0">
        <Card className="gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[19px] font-semibold text-[#101A40]">
                Eventos salvos
              </h2>
              <p className="text-[12px] text-[#8A99B3]">
                Notícias que você salvou para ler ou revisar mais tarde.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <div className="min-w-[180px] flex-1 sm:w-[250px]">
                <CampoBusca
                  valor={buscaEventos}
                  aoAlterar={setBuscaEventos}
                  placeholder="Buscar nos seus eventos..."
                />
              </div>
              <Ordenacao
                valor={ordemEventos}
                aoAlterar={setOrdemEventos}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {eventosFiltrados.map((evento) => (
              <CardEventoSalvo key={evento.id} evento={evento} />
            ))}

            {eventosFiltrados.length === 0 && (
              <p className="py-10 text-center text-sm text-[#8392AD]">
                Nenhum evento encontrado.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="conceitos" className="mt-0">
        <Card className="gap-0 rounded-xl border-0 bg-white p-4 shadow-none md:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[19px] font-semibold text-[#101A40]">
                Conceitos marcados
              </h2>
              <p className="text-[12px] text-[#8A99B3]">
                Temas que você marcou para estudar depois.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <div className="min-w-[180px] flex-1 sm:w-[250px]">
                <CampoBusca
                  valor={buscaConceitos}
                  aoAlterar={setBuscaConceitos}
                  placeholder="Buscar nos seus conceitos..."
                />
              </div>
              <Ordenacao
                valor={ordemConceitos}
                aoAlterar={setOrdemConceitos}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {conceitosFiltrados.map((conceito) => (
              <CardConceitoMarcado
                key={conceito.id}
                conceito={conceito}
              />
            ))}

            {conceitosFiltrados.length === 0 && (
              <p className="py-10 text-center text-sm text-[#8392AD]">
                Nenhum conceito encontrado.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
