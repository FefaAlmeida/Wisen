# Wisen

Plataforma de conhecimento baseada em notícias. Esta etapa entrega a fundação técnica e um fluxo real de coleta, embeddings locais e busca semântica. As telas existentes continuam usando dados de demonstração.

## Primeiro uso

Requisitos: Node **24**, npm **11** e Docker com Compose v2. Use `nvm use` se tiver nvm instalado. Toda a aplicação roda em containers; o Node do host executa os comandos de coordenação.

Na raiz:

```sh
npm install
npm run setup:model
npm run dev
```

`setup:model` baixa e verifica o E5 Small INT8 uma vez, em um volume persistente. Requer internet. O worker usa esse cache sem downloads durante a execução. Se a versão configurada mudar, execute a preparação novamente.

`dev` constrói a imagem de desenvolvimento, para os apps deste projeto, sincroniza dependências quando o lockfile muda, verifica o modelo, sobe o PostgreSQL, aplica migrations e inicia frontend, API e worker. Aguarda os healthchecks e retorna ao terminal. Mudanças de código são recarregadas automaticamente.

| Serviço          | Endereço padrão                  |
| ---------------- | -------------------------------- |
| Frontend         | http://localhost:3000            |
| Swagger          | http://localhost:8080/docs       |
| Saúde da API     | http://localhost:8080/api/health |
| PostgreSQL local | localhost:5432                   |

Se uma porta já estiver ocupada, copie `.env.example` para `.env` e ajuste `FRONTEND_HOST_PORT`, `BACKEND_HOST_PORT` ou `DATABASE_HOST_PORT`. O banco usa sempre 5432 dentro da rede Docker. As portas de desenvolvimento são publicadas somente no localhost.

## Coletar e buscar

Com o ambiente iniciado:

```sh
npm run collect
npm run dev:logs
npm run search -- taxa de juros e inflação
```

A coleta é **manual** e usa exclusivamente o RSS de Economia da Agência Brasil. O comando agenda o trabalho e retorna; aguarde as mensagens `job-completed` no worker antes de buscar. Cada rodada lê até 20 itens do feed, ignora URLs externas e não duplica artigos já processados. Conteúdo é extraído com Cheerio; mudança na estrutura da fonte gera erro e retentativa, sem fallback de navegador nesta etapa.

A busca usa os trechos já indexados e retorna até cinco artigos por padrão. O resultado é similaridade semântica, não uma medida de confiabilidade da notícia nem um agrupamento automático em eventos.

## Comandos

| Comando               | Uso                                 |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Iniciar/recriar o ambiente completo |
| `npm run dev:logs`    | Acompanhar logs                     |
| `npm run dev:status`  | Conferir containers e saúde         |
| `npm run dev:down`    | Parar sem apagar volumes            |
| `npm run db:migrate`  | Aplicar migrations pendentes        |
| `npm run setup:model` | Preparar o modelo local             |
| `npm run check`       | Biome e build do frontend           |
| `npm run build`       | Build de produção do frontend       |
| `npm run lint:fix`    | Aplicar correções seguras do Biome  |

## Estrutura

```text
frontend/src/      app/, components/, hooks/, services/, lib/, data/
backend/
  migrations/      migrations do PostgreSQL
  src/modules/     módulos da API por funcionalidade
  src/database/    pool, transações e executor de migrations
  src/queue/       pg-boss e publicação transacional
  src/shared.js    configuração, schemas e constantes comuns
ai/src/            worker, coleta, extração e embeddings
scripts/           coordenação do ambiente
```

As três aplicações ficam direto na raiz. `backend/` centraliza banco, fila e configuração usados pela API e pelo worker; `ai/` mantém o processo separado para isolar a inferência. Não há uma camada `apps/` nem diretório `packages/`.

O frontend mantém Next, React, Tailwind e shadcn/Base UI. `services/` concentra HTTP com fetch; `hooks/` concentra lógica de interação. Não há TanStack Query nesta etapa. Os nomes e URLs existentes foram preservados. A interface usa tokens semânticos do Wisen para cores recorrentes, sem mudar o desenho das telas.

O backend usa Fastify e SQL parametrizado com `pg`. Cada módulo separa HTTP, regras e consultas. O worker roda em outro processo, usando **pg-boss no PostgreSQL**, sem Redis/BullMQ. Nenhum modelo externo pago é chamado.

## Banco e migrations

Os arquivos em `backend/migrations/` são aplicados em ordem, cada um em uma transação. `schema_migrations` guarda nome, checksum e data. Um advisory lock impede execuções concorrentes. Uma migration já aplicada não deve ser editada: crie um novo arquivo numerado.

O schema inclui as entidades centrais do produto, mas cadastro/login, eventos automáticos, grafo, explicações e revisão pedagógica ainda não estão implementados como funcionalidades. O fluxo ativo usa fontes, artigos, trechos e pedidos de busca. O pg-boss mantém suas tabelas no schema `pgboss`.

Não use `docker compose down -v` para atualizar tabelas: esse comando apaga volumes. A configuração nova usa volume PostgreSQL próprio e não converte nem apaga bases MySQL externas.

## API disponível

| Método | Rota                            | Comportamento                                               |
| ------ | ------------------------------- | ----------------------------------------------------------- |
| GET    | `/api/health`                   | Verifica API e banco                                        |
| GET    | `/api/articles?page=1&limit=10` | Lista artigos coletados                                     |
| GET    | `/api/articles/:id`             | Consulta artigo                                             |
| POST   | `/api/search`                   | Recebe `{ "query": "juros", "limit": 5 }`; retorna 202 e id |
| GET    | `/api/search/:id`               | Estado e resultados da busca                                |

A busca é assíncrona para manter o modelo no worker. Estados: `pending`, `processing`, `completed`, `failed`. Há até três retentativas, com intervalo crescente; falhas transitórias não concluem o pedido prematuramente. Pedidos concluídos ou falhos expiram após sete dias. Swagger expõe os contratos em `/docs/json`, somente fora de produção.

## Produção

A configuração está preparada, mas nenhum deploy é realizado pelos comandos de desenvolvimento. Use `compose.production.yml`, com volumes separados e um proxy HTTPS à frente das portas locais. PostgreSQL não tem porta publicada nessa configuração.

Crie `.env.production` fora do Git com `POSTGRES_PASSWORD`, `FRONTEND_URL`, `NEXT_PUBLIC_API_URL` e `OPERATIONS_TOKEN`. Gere senha e token com valores aleatórios; uma senha hexadecimal evita caracteres reservados na URL de conexão. O token deve ter pelo menos 32 caracteres.

```sh
docker compose --env-file .env.production -f compose.production.yml build
docker compose --env-file .env.production -f compose.production.yml run --rm prepare-model
docker compose --env-file .env.production -f compose.production.yml up -d
```

As migrations são um serviço de execução única antes da API e do worker. Os processos de aplicação usam usuário sem privilégios. O preparo do modelo ajusta a propriedade do volume para esse usuário. `NEXT_PUBLIC_API_URL` é incorporada no build do frontend: trocar essa URL exige reconstruí-lo.

Até existir autenticação de usuários, a busca em produção exige `Authorization: Bearer <OPERATIONS_TOKEN>`. Esse token é operacional e não deve ser enviado ao navegador. Swagger fica desabilitado. A integração pública da busca com as telas dependerá da autenticação futura.

Os documentos acadêmicos originais ficam na raiz e não fazem parte do runtime da aplicação.
