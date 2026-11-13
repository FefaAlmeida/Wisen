# Plataforma Adaptativa de Conhecimento Baseada em Eventos

## Arquitetura e Plano de Evolução

> **Decisões do MVP alinhadas em 12/11/2026:** o detalhamento operacional vigente está em [docs/mvp-implementacao.md](docs/mvp-implementacao.md). O MVP entrega o ciclo completo em economia para leigos. A implementação preserva os workspaces `frontend/`, `backend/` e `ai/`, PostgreSQL/pgvector e **pg-boss**, substituindo a proposta inicial de Redis/BullMQ. Geração: OpenAI configurável (`gpt-6-luna` inicialmente), embeddings locais, e-mail via Resend. Teto único de IA de R$ 80/mês e cota inicial de 30 gerações por usuário/dia, ampliável pelo administrador. Onboarding por interesses e familiaridade autodeclarada, sem prova inicial. Publicação automática a partir de duas fontes; curadoria administrativa. O grafo visual avançado permanece para uma versão posterior.

As seções abaixo preservam a visão original de evolução; em divergência de stack e organização de diretórios, prevalecem as decisões acima e o documento operacional.

---

# 1. Proposta

A plataforma utiliza notícias e acontecimentos reais como ponto de partida para aprendizagem contínua.

Notícias frequentemente pressupõem que o leitor já conheça conceitos, instituições, pessoas ou acontecimentos anteriores. Uma matéria sobre uma decisão do COPOM, por exemplo, pode depender da compreensão de Selic, juros, inflação, Banco Central e política monetária.

A plataforma constrói progressivamente um histórico do conhecimento de cada usuário e utiliza esse histórico para adaptar conteúdos futuros.

O sistema procura responder três perguntas:

**O que está acontecendo?**  
Os eventos e notícias respondem.

**O que preciso saber para entender isso?**  
O grafo de conhecimento identifica.

**O que eu ainda preciso aprender ou revisar?**  
O modelo individual do usuário responde.

O objetivo central é fazer com que a plataforma conheça progressivamente melhor o leitor e deixe de explicar o que ele já domina, concentrando-se nas suas lacunas.

---

# 2. Objetivo do projeto

O principal objetivo do projeto é demonstrar que uma plataforma pode adaptar progressivamente a experiência de leitura conforme aprende o que cada usuário já conhece.

O diferencial não está apenas em explicar uma notícia, mas em manter uma representação persistente do conhecimento do leitor e reutilizá-la em conteúdos futuros.

Exemplo:

```text
Primeira notícia

Conceitos:
- COPOM
- Selic
- inflação
- política monetária

Usuário conhece:
- inflação

Sistema explica:
- COPOM
- Selic
- política monetária
```

Depois de novas leituras, interações e revisões:

```text
Nova notícia

Conceitos:
- COPOM
- Selic
- inflação
- câmbio

Usuário já conhece:
- COPOM
- Selic
- inflação

Sistema explica:
- câmbio
```

A plataforma deve demonstrar que sua personalização melhora à medida que o histórico de conhecimento aumenta.

---

# 3. Arquitetura geral

```text
                        INTERNET
                           │
                ┌──────────▼──────────┐
                │   Fontes / RSS      │
                └──────────┬──────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Ingestão    │
                  │ RSS + Cheerio   │
                  │ Puppeteer       │
                  └────────┬────────┘
                           │
                           ▼
                    Redis / BullMQ
                           │
                           ▼
                  ┌─────────────────┐
                  │ Processamento AI│
                  │   JavaScript    │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        PROCESSAMENTO LOCAL       FOUNDATION MODEL
                                     via API
        embeddings               conceitos
        similaridade             entidades
        recuperação              relações
        recomendação             explicações
        mastery                  resumos
              │                         │
              └────────────┬────────────┘
                           ▼
                  PostgreSQL + pgvector
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Artigos        Eventos      Conceitos
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                  Grafo de conhecimento
                           │
                           ▼
                Conhecimento do usuário
                           │
                           ▼
                     Personalização
                           │
                           ▼
                      Fastify API
                           │
                           ▼
                  Next.js + React
                  Tailwind + shadcn
                      + TweakCN
```

---

# 4. Stack tecnológica

## Frontend

- Next.js;
- React;
- JavaScript com JSX;
- Tailwind CSS;
- shadcn/ui;
- TweakCN;
- biblioteca de visualização de grafos na versão sofisticada.

## Backend

- Node.js;
- Fastify;
- JavaScript;
- PostgreSQL;
- pgvector;
- Redis;
- BullMQ;
- API REST;
- autenticação;
- regras de negócio;
- processamento assíncrono.

## Inteligência artificial

- Node.js;
- JavaScript;
- Transformers.js;
- ONNX Runtime;
- embeddings locais;
- foundation model via API;
- gateway próprio para provedores de IA.

## Infraestrutura

```text
VM Debian
12 GB RAM

Docker Compose

├── frontend
├── backend
├── ai
├── PostgreSQL + pgvector
└── Redis
```

A aplicação será desenvolvida para operar dentro desse limite de memória.

---

# 5. Estrutura do monorepo

```text
knowledge-platform/
│
├── apps/
│   │
│   ├── frontend/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── public/
│   │
│   ├── backend/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── users/
│   │       │   ├── sources/
│   │       │   ├── articles/
│   │       │   ├── events/
│   │       │   ├── concepts/
│   │       │   ├── entities/
│   │       │   ├── knowledge/
│   │       │   ├── recommendations/
│   │       │   └── reviews/
│   │       │
│   │       ├── routes/
│   │       ├── jobs/
│   │       └── server.js
│   │
│   └── ai/
│       └── src/
│           ├── embeddings/
│           ├── semantic-analysis/
│           ├── graph/
│           ├── recommendations/
│           ├── personalization/
│           ├── providers/
│           └── workers/
│
├── packages/
│   ├── database/
│   ├── queue/
│   └── shared/
│
├── infra/
│   ├── docker/
│   └── docker-compose.yml
│
├── docs/
│
└── package.json
```

O repositório poderá usar `npm workspaces`.

A estrutura é mantida desde o início para que as versões posteriores expandam o sistema sem exigir reorganização completa.

---

# 6. Divisão das responsabilidades de IA

A arquitetura híbrida terá responsabilidades fixas.

## Processamento local

Responsável por:

- geração de embeddings;
- busca vetorial;
- similaridade semântica;
- recuperação de candidatos;
- comparação entre artigos;
- comparação entre eventos;
- recuperação de conceitos relacionados;
- features para recomendação;
- cálculo do `mastery_score`;
- repetição espaçada;
- recuperação do subgrafo relevante.

Essas operações serão executadas localmente por serem frequentes, previsíveis e reutilizáveis.

## Foundation model

Responsável por:

- identificar conceitos;
- identificar entidades;
- interpretar relações entre conceitos;
- interpretar relações entre entidades e eventos;
- resolver ambiguidades semânticas;
- produzir resumos de eventos;
- gerar explicações adaptativas;
- explicar trechos;
- produzir questões e conteúdos educacionais quando necessário.

A mesma tarefa deverá, sempre que possível, ser tratada pelo mesmo tipo de modelo para manter previsibilidade de qualidade.

---

# 7. Pipeline de processamento

```text
RSS
 ↓
artigo encontrado
 ↓
extração do conteúdo
 ↓
normalização
 ↓
embedding local
 ↓
busca local de:
 • eventos semelhantes
 • conceitos semelhantes
 • entidades conhecidas
 ↓
Foundation Model
 ↓
análise semântica estruturada
 ↓
PostgreSQL + pgvector
 ↓
grafo de conhecimento
```

Sempre que possível, a análise semântica será agrupada em uma única chamada estruturada por artigo.

Exemplo:

```json
{
  "event": {},
  "concepts": [],
  "entities": [],
  "relations": []
}
```

---

# 8. Ingestão de notícias

As notícias serão descobertas principalmente através de RSS.

Fluxo:

```text
RSS
↓
nova publicação
↓
URL já existe?
├── sim → ignora
└── não
     ↓
   extrai página
```

A extração será realizada primeiro com Cheerio.

```text
página
↓
Cheerio
↓
conteúdo suficiente?
├── sim → continua
└── não → Puppeteer
```

Puppeteer será utilizado como fallback para páginas que dependem de JavaScript ou cuja estrutura não permita extração direta.

A plataforma deverá começar com fontes previamente testadas e poderá expandir progressivamente.

---

# 9. Artigos e eventos

Artigo e evento serão entidades diferentes.

**Artigo** representa uma publicação específica.

**Evento** representa o acontecimento descrito por uma ou mais publicações.

Exemplo:

```text
EVENTO

COPOM mantém a Selic

├── Agência Brasil
├── G1
├── Folha
└── CNN
```

O feed poderá priorizar eventos, evitando apresentar diversas matérias praticamente idênticas como itens independentes.

---

# 10. Identificação de eventos

Cada novo artigo terá um embedding gerado localmente.

O sistema buscará eventos recentes semanticamente próximos utilizando:

- similaridade vetorial;
- proximidade temporal;
- título;
- conceitos;
- entidades.

Fluxo:

```text
novo artigo
↓
embedding
↓
eventos semelhantes
↓
candidatos
↓
análise semântica
↓
evento existente
ou
novo evento
```

Casos claramente relacionados poderão ser resolvidos com similaridade e regras.

Casos ambíguos poderão ser resolvidos pelo foundation model.

---

# 11. Eventos completos

Cada evento poderá armazenar:

- título;
- resumo;
- data inicial;
- última atualização;
- artigos relacionados;
- fontes;
- conceitos;
- entidades;
- relações com outros eventos;
- timeline.

Exemplo:

```text
COPOM mantém a Selic

Timeline

09:30
Decisão oficial publicada

10:05
Primeiras análises

11:20
Nova declaração do Banco Central

13:15
Reação do mercado
```

A timeline será formada pelas publicações e atualizações relacionadas ao mesmo acontecimento.

---

# 12. Página de evento

A página de evento poderá apresentar:

```text
Título

Resumo

Timeline

Fontes

Notícias relacionadas

Conceitos principais

Entidades envolvidas

O que você já sabe

O que precisa revisar

O que ainda não conhece

Explicação adaptativa
```

Essa página será uma das interfaces centrais da plataforma.

---

# 13. Grafo de conhecimento

O grafo será armazenado inicialmente no PostgreSQL.

Nós principais:

```text
ARTICLE
EVENT
ENTITY
CONCEPT
USER
```

Exemplos de relações:

```text
ARTICLE
  └─ DESCRIBES → EVENT

ARTICLE
  └─ MENTIONS → ENTITY

ARTICLE
  └─ INVOLVES → CONCEPT

EVENT
  └─ INVOLVES → ENTITY

EVENT
  └─ INVOLVES → CONCEPT

EVENT
  └─ RELATED_TO → EVENT

CONCEPT
  └─ RELATED_TO → CONCEPT

CONCEPT
  └─ REQUIRES → CONCEPT

CONCEPT
  └─ PART_OF → CONCEPT

USER
  └─ KNOWS → CONCEPT
```

---

# 14. Proveniência do grafo

Toda relação automática deverá possuir informações suficientes para indicar sua origem.

Exemplo:

```text
source_type
source_id
method
model
confidence
created_at
```

Assim, uma relação poderá ser rastreada até o artigo, evento ou análise que a originou.

Isso permite:

- corrigir relações;
- reprocessar informações;
- comparar resultados de modelos;
- evitar conhecimento sem origem conhecida.

---

# 15. Conceitos globais

Conceitos serão reutilizados entre notícias e eventos.

Exemplo:

```text
Taxa Selic

aliases:
- Selic
- taxa básica de juros
- taxa básica da economia
```

Embeddings serão utilizados para recuperar conceitos candidatos semanticamente próximos.

O embedding não será tratado como decisão final de equivalência.

Fluxo:

```text
"taxa básica de juros"
↓
embedding
↓
conceitos candidatos
↓
análise
↓
alias de "Taxa Selic"
```

Isso reduz duplicações no grafo.

---

# 16. Conhecimento do usuário

Cada usuário possuirá um histórico próprio para os conceitos com os quais interagir.

Internamente:

```text
mastery_score
last_exposure
last_review
next_review
successful_reviews
failed_reviews
```

O `mastery_score` varia entre:

```text
0.0 → 1.0
```

Na interface, ele será simplificado em três estados:

```text
Lacuna
Em revisão
Dominado
```

---

# 17. Evidências de conhecimento

A simples leitura de um conteúdo não será considerada prova definitiva de domínio.

Interações diferentes fornecerão evidências diferentes.

```text
visualizou conceito
      ↓
evidência pequena

leu conteúdo
      ↓
exposição

clicou "Não sei"
      ↓
forte evidência de lacuna

solicitou explicação
      ↓
possível dificuldade

acertou revisão
      ↓
forte evidência positiva

errou revisão
      ↓
forte evidência negativa
```

Essas evidências serão utilizadas para atualizar o `mastery_score`.

---

# 18. Personalização educacional

Quando o usuário acessa um evento ou notícia:

```text
conceitos necessários
          ↓
grafo
          ↓
user_concepts
          ↓
conceitos conhecidos
+
conceitos em revisão
+
lacunas
          ↓
contexto personalizado
          ↓
foundation model
          ↓
explicação
```

Exemplo:

```text
Evento:
COPOM mantém Selic

Usuário conhece:
- inflação
- juros
- Banco Central

Usuário não conhece:
- COPOM
- política monetária

Usuário precisa revisar:
- Selic
```

A explicação deve focar em COPOM, política monetária e uma breve revisão de Selic, sem repetir conceitos já dominados.

---

# 19. Botão "Não sei"

Durante a leitura, o usuário poderá marcar um conceito como desconhecido.

Fluxo:

```text
Não sei
↓
conceito marcado como lacuna
↓
mastery atualizado
↓
explicação imediata
↓
conceito entra no sistema de revisão
```

Esse feedback explícito terá peso importante no modelo individual.

---

# 20. Explicação de trecho

O usuário poderá selecionar uma parte da notícia e solicitar uma explicação.

A geração poderá considerar:

- trecho selecionado;
- contexto do artigo;
- evento relacionado;
- conceitos envolvidos;
- conhecimentos já dominados pelo usuário.

O objetivo será explicar o trecho sem repetir contexto desnecessário.

---

# 21. Revisões e repetição espaçada

A decisão de quando revisar será controlada pela própria aplicação.

Ela poderá considerar:

```text
mastery
tempo desde último contato
último desempenho
erros
número de revisões
```

Exemplo:

```text
mastery alto
→ revisão distante

mastery médio
→ revisão intermediária

mastery baixo
→ revisão próxima
```

O foundation model poderá produzir perguntas ou explicações, mas não será responsável por decidir quando uma revisão deverá acontecer.

---

# 22. Tipos de revisão

Inicialmente, poderão existir formatos simples.

## Recordação

```text
O que é COPOM?
```

## Reconhecimento

```text
Qual instituição está relacionada à definição da meta da Selic?
```

## Explicação

O usuário explica um conceito com suas próprias palavras e recebe feedback.

Formatos mais sofisticados poderão ser introduzidos posteriormente.

---

# 23. Sistema de recomendação

A arquitetura já será preparada para recomendação desde o início.

Uma versão inicial poderá utilizar:

```text
interesses explícitos
+
recência
+
eventos relacionados
+
conhecimento do usuário
```

Posteriormente, o ranking poderá considerar:

```text
interesses
+
recência
+
similaridade semântica
+
continuidade de eventos
+
mastery
+
lacunas
+
diversidade temática
+
diversidade de fontes
+
interações anteriores
```

A recomendação poderá equilibrar dois objetivos:

```text
o que o usuário quer acompanhar
+
o que pode gerar uma oportunidade relevante de aprendizado
```

---

# 24. Busca

A busca poderá encontrar:

- eventos;
- artigos;
- conceitos;
- entidades.

Ela poderá combinar:

```text
PostgreSQL Full Text Search
+
pgvector
```

Isso permitirá resultados por palavras exatas e também por significado.

---

# 25. Biblioteca de conceitos

Cada conceito poderá apresentar:

```text
nome

descrição

aliases

seu domínio

conceitos relacionados

pré-requisitos

eventos recentes

notícias relacionadas

histórico do usuário
```

Exemplo:

```text
Taxa Selic

Seu domínio
████████░░ 0.82

Relacionados:
→ COPOM
→ juros
→ inflação
→ política monetária

Eventos recentes:
→ COPOM mantém Selic
→ Mercado reage à decisão
```

---

# 26. Área "Meu conhecimento"

A área poderá mostrar:

```text
conceitos dominados

conceitos em revisão

lacunas

revisões pendentes
```

Indicadores simples:

```text
128 conceitos encontrados

67 dominados

39 em revisão

22 lacunas
```

O objetivo será mostrar a evolução do conhecimento sem transformar a área em um dashboard excessivamente complexo.

---

# 27. Notícias e eventos salvos

O usuário poderá salvar conteúdos para acesso posterior.

Serão suportados:

- artigos salvos;
- eventos salvos.

Essa funcionalidade será independente do `mastery_score`.

---

# 28. Área administrativa

O administrador poderá visualizar:

- fontes;
- artigos;
- eventos;
- conceitos;
- entidades;
- usuários;
- erros de processamento;
- custos de IA.

Ações possíveis:

```text
corrigir conceito

corrigir alias

editar relação

unir eventos

separar artigo de evento

remover conteúdo problemático

reprocessar artigo

ativar/desativar fonte
```

A administração deverá ser funcional, mas não será o centro do produto.

---

# 29. Modelo de dados resumido

Principais estruturas:

```text
users

user_preferences

sources

articles

events

event_articles

concepts

concept_aliases

entities

article_concepts

event_concepts

event_entities

concept_relations

event_relations

user_concepts

user_interactions

reviews

review_attempts

ai_runs

jobs
```

---

# 30. Entidades principais

## Article

```text
id
source_id
title
url
content
published_at
embedding
processing_status
```

## Event

```text
id
title
summary
started_at
updated_at
embedding
status
```

## Concept

```text
id
name
description
embedding
```

## Entity

```text
id
name
type
```

## UserConcept

```text
user_id
concept_id

mastery_score
status

last_exposure
last_review
next_review
```

## AIRun

```text
provider
model
operation
input_tokens
output_tokens
estimated_cost
latency
status
```

---

# 31. Pipeline assíncrona

Redis + BullMQ será responsável pelos jobs de processamento.

Exemplos:

```text
collectFeed

fetchArticle

processArticle

generateEmbedding

resolveEvent

extractKnowledge

updateEvent

generateExplanation
```

O backend HTTP não deverá bloquear uma requisição esperando processamento pesado.

---

# 32. Idempotência e retentativas

Cada etapa importante deverá ser segura para reexecução.

Exemplo:

```text
generateEmbedding

chave:
article_id + model_version
```

Se um worker falhar depois de realizar parcialmente uma operação, uma nova tentativa não deverá duplicar dados.

Falhas temporárias poderão utilizar backoff.

Exemplo:

```text
tentativa 1

↓ espera

tentativa 2

↓ espera maior

tentativa 3
```

---

# 33. Estados de processamento

Artigos e eventos poderão possuir estados como:

```text
pending

processing

processed

pending_enrichment

failed
```

Isso permitirá saber exatamente até onde cada item avançou na pipeline.

---

# 34. Falha de serviços externos

A indisponibilidade da API de IA não deverá causar perda de artigos.

Exemplo:

```text
artigo recebido
↓
extração concluída
↓
embedding local concluído
↓
API indisponível
↓
pending_enrichment
↓
nova tentativa posterior
```

O conteúdo permanece registrado até o processamento ser concluído.

---

# 35. Orçamento de IA

Será definido um teto operacional de:

**R$ 100 por mês**

para APIs de inteligência artificial.

Cada chamada deverá registrar:

```text
provider
model
operação
tokens de entrada
tokens de saída
custo estimado
latência
```

Prioridade de uso do orçamento:

```text
1. processamento semântico de artigos novos

2. explicações solicitadas pelo usuário

3. revisões e recursos educacionais

4. enriquecimentos opcionais
```

Estratégias para redução de custo:

- embeddings locais;
- processamento único por artigo;
- reutilização por evento;
- cache;
- contexto mínimo;
- saídas estruturadas;
- chamadas agrupadas;
- reaproveitamento de conceitos já existentes.

---

# 36. Segurança e privacidade

Controles mínimos:

- autenticação segura;
- senhas armazenadas somente com hash adequado;
- secrets e chaves de API fora do código;
- HTTPS;
- banco e Redis não expostos diretamente à internet;
- validação das entradas;
- autorização por usuário;
- logs sem senhas, tokens ou conteúdo sensível desnecessário.

O texto das notícias será tratado como dado externo e nunca como instrução para o sistema.

Saídas estruturadas de IA serão validadas antes da persistência.

---

# 37. Princípio de evolução

O projeto será desenvolvido em versões cumulativas.

```text
VERSÃO INICIAL
      ↓
MVP
      ↓
VERSÃO SOFISTICADA
      ↓
VERSÃO COMPLETA
```

Nenhuma versão deverá exigir reconstruir aquilo que já foi implementado.

A base nasce desde cedo com:

```text
Article
Event
Concept
Entity
User
UserConcept
Relation
```

Mesmo que algumas estruturas sejam utilizadas de maneira mais simples inicialmente.

O mesmo princípio vale para:

```text
frontend
backend
AI
banco
filas
embeddings
gateway de LLM
```

---

# 38. Versão inicial

Objetivo:

> provar toda a cadeia técnica básica da plataforma.

## Plataforma

- landing page;
- cadastro;
- login;
- feed básico;
- página de notícia;
- perfil simples.

## Fontes

- cadastro de fontes;
- RSS;
- Cheerio;
- conjunto inicial de fontes testadas;
- armazenamento de artigos.

## IA

- embeddings locais;
- pgvector;
- integração com foundation model;
- conceitos;
- entidades;
- relações básicas.

## Conhecimento

- conceitos globais;
- aliases;
- `article_concepts`;
- `user_concepts`;
- Lacuna;
- Em revisão;
- Dominado;
- `mastery_score`.

## Infraestrutura

- VM;
- Docker Compose;
- PostgreSQL;
- pgvector;
- Redis;
- BullMQ;
- monorepo definitivo.

## Resultado esperado

```text
notícia
↓
conceitos
↓
usuário
↓
lacunas
↓
explicação personalizada
```

---

# 39. MVP

Objetivo:

> entregar o principal valor do produto de ponta a ponta.

## Eventos

- separação entre Article e Event;
- agrupamento de matérias;
- múltiplas fontes;
- resumo;
- timeline;
- página própria;
- atualização de eventos existentes.

## Grafo

- artigos;
- eventos;
- conceitos;
- entidades;
- usuários;
- relações entre esses elementos;
- proveniência;
- recuperação das conexões relevantes.

## Personalização

- explicação adaptativa;
- botão "Não sei";
- explicação de conceito;
- explicação de trecho;
- atualização de mastery;
- revisões;
- repetição espaçada.

## Produto

- feed personalizado;
- busca;
- biblioteca;
- página de conceito;
- área "Meu conhecimento";
- revisões;
- salvos;
- perfil;
- administração básica.

## Recomendação

Primeira versão baseada em:

```text
interesses
+
recência
+
conhecimento
+
eventos relacionados
```

## Resultado esperado

```text
mesmo evento
+
usuários diferentes
=
experiências diferentes
```

---

# 40. Versão sofisticada

Objetivo:

> transformar o MVP em um sistema de conhecimento mais amplo e navegável.

## Dezenas de fontes

A plataforma passa a trabalhar com um número maior de portais.

Cada fonte poderá possuir:

```text
RSS
parser
estado
última coleta
erros
qualidade
```

Também poderão existir métricas de saúde das fontes.

## Recomendação avançada

O ranking poderá utilizar:

```text
interesses explícitos

interações anteriores

similaridade semântica

mastery

lacunas

continuidade de eventos

recência

popularidade

diversidade temática

diversidade de fontes
```

## Mapa visual do conhecimento

Será introduzida uma interface navegável do grafo.

Exemplo:

```text
            inflação
                │
         política monetária
          /             \
       Selic           juros
         │
       COPOM
         │
    Banco Central
```

O usuário poderá navegar entre:

- conceitos;
- entidades;
- eventos;
- notícias.

Filtros poderão limitar profundidade, assunto e tipos de relação.

## GraphRAG

A recuperação de contexto poderá utilizar explicitamente o grafo.

```text
evento
 ↓
conceitos centrais
 ↓
pré-requisitos
 ↓
entidades relacionadas
 ↓
conhecimento do usuário
 ↓
subgrafo relevante
 ↓
Foundation Model
```

## Timeline avançada

Eventos poderão possuir relações temporais.

```text
evento principal
│
├── antecedente
├── atualização
├── reação
└── consequência
```

## Administração avançada

- revisão de baixa confiança;
- mesclagem de conceitos;
- mesclagem de eventos;
- controle de fontes;
- custo de IA;
- reprocessamento;
- auditoria de relações.

---

# 41. Versão completa

Objetivo:

> explorar o máximo potencial da arquitetura.

## GraphRAG avançado

Recuperação multi-hop considerando:

- distância no grafo;
- relevância;
- confiança;
- temporalidade;
- conhecimento do usuário;
- evidências;
- origem da relação.

O sistema deverá montar o menor contexto necessário para uma explicação.

## Grafo temporal

As relações poderão carregar validade temporal.

O sistema passa a representar:

```text
A esteve relacionado a B
durante determinado período
com determinada evidência
```

Isso permite representar conhecimento que muda com acontecimentos atuais.

## Recomendação adaptativa avançada

O sistema poderá equilibrar:

```text
o que o usuário quer consumir
+
o que pode ser útil aprender
```

Também poderão existir mecanismos de exploração para evitar repetição excessiva de temas.

## Personalização educacional avançada

O conhecimento poderá considerar mais fatores:

```text
retenção
confiança
dificuldade
número de exposições
acertos
erros
tempo
contexto
```

## Preferências de explicação

A plataforma poderá aprender preferências como:

```text
explicações curtas

explicações aprofundadas

analogias

exemplos

contexto histórico

relações visuais
```

## Fine-tuning

Se houver dados suficientes e qualidade adequada, poderão ser avaliados ajustes específicos para:

- classificação de artigos;
- identificação de relações;
- matching entre artigos e eventos;
- reranking;
- extração de conceitos.

O fine-tuning será uma evolução sobre um sistema já funcional e não uma dependência da arquitetura.

---

# 42. Experimento principal

A pergunta principal será:

> **A plataforma consegue adaptar melhor a informação conforme aprende o que cada usuário conhece?**

Exemplo:

```text
USUÁRIO — PRIMEIRO CONTATO

notícia possui:
COPOM
Selic
inflação
juros
política monetária

sistema conhece pouco sobre o usuário

→ explica quatro conceitos
```

Depois:

```text
USUÁRIO — APÓS INTERAÇÕES

notícia possui:
COPOM
Selic
câmbio
inflação

sistema já possui histórico

COPOM ✓
Selic ✓
inflação ✓

câmbio ?

→ explica somente câmbio
```

A avaliação deverá verificar se as explicações ficam progressivamente mais adequadas ao conhecimento individual.

---

# 43. Métricas principais

## Personalização

- conceitos considerados conhecidos;
- conceitos realmente conhecidos;
- lacunas detectadas;
- explicações desnecessárias;
- explicações úteis;
- revisões necessárias.

## Evolução

- mudança do `mastery_score`;
- conceitos dominados;
- conceitos esquecidos;
- conceitos recuperados por revisão.

## Percepção do usuário

Perguntas possíveis:

```text
A explicação foi necessária?

Ela ajudou a entender o conteúdo?

O sistema explicou algo que você já sabia?

A explicação estava adequada ao seu conhecimento?
```

---

# 44. Avaliação técnica secundária

Também poderão ser registrados:

- operações locais;
- chamadas externas;
- tokens;
- custo;
- latência;
- consumo de memória;
- quantidade de artigos;
- quantidade de eventos;
- quantidade de conceitos reutilizados.

Isso permitirá avaliar o comportamento da arquitetura híbrida sem transformar essa comparação no objetivo principal do trabalho.

---

# 45. Critérios de entrega

O produto deverá demonstrar o seguinte fluxo:

```text
1.
portal publica uma notícia

2.
RSS detecta

3.
sistema extrai o conteúdo

4.
artigo é processado

5.
artigo é relacionado a um evento

6.
IA identifica conceitos e entidades

7.
conhecimento é adicionado ao grafo

8.
usuário abre o conteúdo

9.
sistema consulta seu conhecimento

10.
detecta lacunas e revisões

11.
gera explicação adaptativa

12.
usuário interage

13.
mastery é atualizado

14.
conceito entra em revisão quando necessário

15.
usuário acessa novo conteúdo

16.
nova experiência considera o histórico anterior
```

---

# 46. Arquitetura final

```text
                           FONTES
                             │
                 dezenas de portais / RSS
                             │
                             ▼
                    Pipeline de ingestão
                             │
                             ▼
                     Artigos normalizados
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
         IA LOCAL                    FOUNDATION MODEL
              │                             │
        embeddings                    interpretação
        recuperação                   enriquecimento
        ranking                       explicações
        recomendação                  relações
              │                             │
              └──────────────┬──────────────┘
                             ▼
                    GRAFO DE CONHECIMENTO
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
        Eventos           Conceitos          Entidades
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    Grafo temporal / GraphRAG
                             │
                             ▼
                  MODELO INDIVIDUAL DO USUÁRIO
                             │
               mastery + histórico + interesses
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Personalização   Recomendação    Revisões
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                       EXPERIÊNCIA WEB
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
       Feed               Eventos            Grafo visual
                            │
                      Biblioteca / Busca
```

---

# 47. Resultado pretendido

A plataforma funcionará como uma camada entre acontecimentos e conhecimento.

```text
MUNDO
 ↓
notícias
 ↓
eventos
 ↓
conceitos + entidades
 ↓
grafo de conhecimento
 ↓
modelo individual
 ↓
conteúdo adaptado
 ↓
aprendizado
 ↓
modelo individual atualizado
```

Quanto mais o usuário utiliza a plataforma, menos ela deve explicar aquilo que ele já domina e melhor deve identificar aquilo que realmente exige contexto, aprendizado ou revisão.

Essa adaptação progressiva é o centro do produto.
