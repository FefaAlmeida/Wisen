# Wisen

Plataforma de conhecimento baseada em notícias. Esta etapa entrega a fundação técnica e um fluxo real de coleta, embeddings locais e busca semântica. As telas existentes continuam usando dados de demonstração.

## Primeiro uso

Requisitos: Node **24**, npm **11** e Docker com Compose v2. Use `nvm use` se tiver nvm instalado. Toda a aplicação roda em containers; o Node do host executa os comandos de coordenação.

Na raiz:

```sh
cp -n .env.example .env
npm install
npm run setup:model
npm run dev
```

`setup:model` baixa e verifica o E5 Small INT8 uma vez, em um volume persistente. Requer internet. O worker usa esse cache sem downloads durante a execução. Se a versão configurada mudar, execute a preparação novamente.

`dev` constrói a imagem de desenvolvimento, para os apps deste projeto, sincroniza dependências quando o lockfile muda, verifica o modelo, sobe o PostgreSQL, aplica migrations, executa o seed do administrador e inicia frontend, API e worker. Aguarda os healthchecks e retorna ao terminal. Mudanças de código são recarregadas automaticamente.

O frontend usa Next.js 16.4.6 com Turbopack no desenvolvimento, mantendo a atualização automática. Os endereços `localhost` e `127.0.0.1` estão permitidos para a conexão de desenvolvimento.

O seed de desenvolvimento cria o administrador com e-mail `wisenadmin@gmail.com` e senha inicial `AdminWisen@123`. Entre pela tela de login comum para acessar o painel administrativo. O seed pode rodar várias vezes: mantém uma única conta e preserva sua senha, preferências e estado de ativação. Se esse e-mail já existir, a conta recebe o perfil `admin` e mantém a senha existente. O seed não faz parte da inicialização de produção e recusa execução com `NODE_ENV=production`.

| Serviço          | Endereço padrão                  |
| ---------------- | -------------------------------- |
| Frontend         | http://localhost:3000            |
| Swagger          | http://localhost:8080/docs       |
| Saúde da API     | http://localhost:8080/api/health |
| PostgreSQL local | localhost:5432                   |

O `.env` da raiz centraliza a configuração de desenvolvimento: portas, URLs, credenciais do PostgreSQL, token operacional, proxies confiáveis, cache, recursos do worker e opções de testes. O Compose injeta essas variáveis nos serviços; não há um `.env` separado por aplicação. O `.env` não é versionado e `.env.example` documenta todas as chaves.

Se uma porta estiver ocupada, ajuste `FRONTEND_HOST_PORT`, `BACKEND_HOST_PORT` ou `DATABASE_HOST_PORT`. O banco usa sempre 5432 dentro da rede Docker; `DATABASE_URL` aponta para `database:5432`, mesmo quando a porta do host é 5438. `PORT` e `FRONTEND_PORT` são as portas internas da API e do frontend; mantenha `BACKEND_INTERNAL_URL` e `FRONTEND_URL` coerentes com as portas que escolher. As portas de desenvolvimento são publicadas somente no localhost.

`POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` inicializam o banco; `DATABASE_URL` deve usar essas mesmas credenciais. Alterar uma senha no arquivo não modifica um banco já inicializado. O token `OPERATIONS_TOKEN` deve ter ao menos 32 caracteres; substitua o valor de exemplo por um valor aleatório antes de compartilhar o ambiente. `TRUST_PROXY` fica vazio por padrão e só deve conter proxies controlados por você.

Os executores de integração e E2E também leem o `.env` central, usando as portas `TEST_DATABASE_HOST_PORT`, `E2E_BACKEND_PORT` e `E2E_FRONTEND_PORT`. URLs e credenciais temporárias dos testes são geradas pelo executor e não usam o banco de desenvolvimento.

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
| `npm test`            | Unidade, integração, frontend e E2E |
| `npm run lint:fix`    | Aplicar correções seguras do Biome  |

## Testes

`npm test` roda unidades do backend, integração Fastify/PostgreSQL, componentes React e fluxos de navegador com Playwright. A primeira execução E2E precisa de `npx playwright install chromium`. As suítes de integração e E2E usam um PostgreSQL temporário em `127.0.0.1:55439`, aplicam as migrations e removem o container ao terminar; não usam o banco de desenvolvimento. Se a porta estiver ocupada, defina `TEST_DATABASE_HOST_PORT`.

Também é possível rodar cada parte separadamente com `npm run test:unit`, `npm run test:integration`, `npm run test:frontend` e `npm run test:e2e`.

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

A autenticação por sessão já está funcional. O fluxo ativo usa fontes, artigos, trechos e pedidos de busca; as páginas de conteúdo ainda usam dados de demonstração. Eventos automáticos, grafo, explicações e revisão pedagógica seguem fora do escopo funcional, apesar de já haver entidades modeladas. O pg-boss mantém suas tabelas no schema `pgboss`.

Não use `docker compose down -v` para atualizar tabelas: esse comando apaga volumes. A configuração nova usa volume PostgreSQL próprio e não converte nem apaga bases MySQL externas.

## API disponível

| Método | Rota                            | Comportamento                                               |
| ------ | ------------------------------- | ----------------------------------------------------------- |
| GET    | `/api/health`                   | Verifica API e banco                                        |
| POST   | `/api/auth/register`            | Cria conta e inicia sessão                                  |
| POST   | `/api/auth/login`               | Inicia sessão                                               |
| GET    | `/api/auth/session`             | Consulta sessão atual                                       |
| POST   | `/api/auth/logout`              | Encerra sessão                                              |
| GET    | `/api/categories`               | Lista assuntos habilitados para as preferências             |
| GET    | `/api/admin/categories`         | Lista assuntos e disponibilidade (admin)                    |
| PUT    | `/api/admin/categories`         | Atualiza disponibilidade dos assuntos (admin)               |
| GET    | `/api/articles?page=1&limit=10` | Lista artigos coletados                                     |
| GET    | `/api/articles/:id`             | Consulta artigo                                             |
| POST   | `/api/search`                   | Recebe `{ "query": "juros", "limit": 5 }`; retorna 202 e id |
| GET    | `/api/search/:id`               | Estado e resultados da busca                                |

A sessão usa cookie `httpOnly` e as páginas da área do usuário redirecionam ao login quando ela não existe. A busca é assíncrona para manter o modelo no worker. Estados: `pending`, `processing`, `completed`, `failed`. Há até três retentativas, com intervalo crescente; falhas transitórias não concluem o pedido prematuramente. Pedidos concluídos ou falhos expiram após sete dias. Swagger expõe os contratos em `/docs/json`, somente fora de produção.

A tela administrativa **Gestão de categorias** controla quais assuntos aparecem nas preferências dos usuários. A lista é carregada do banco, e o sistema mantém pelo menos duas categorias disponíveis para atender ao mínimo exigido no onboarding.

## Produção

A configuração está preparada, mas nenhum deploy é realizado pelos comandos de desenvolvimento. Use `compose.production.yml`, com volumes separados e um proxy HTTPS à frente das portas locais. Configure o proxy de borda para sobrescrever `X-Forwarded-For` com o IP de origem, sem aceitar o valor enviado pelo cliente. Defina `TRUST_PROXY` com os IPs/CIDRs dos proxies confiáveis entre o cliente e a API (incluindo o servidor Next). A API ignora cabeçalhos de origem de conexões não confiáveis por padrão; sem essa configuração, o limite de requisições é compartilhado pelo IP do servidor Next. Não use uma faixa que inclua clientes não confiáveis. PostgreSQL não tem porta publicada nessa configuração.

Crie `.env.production` a partir de `.env.example`, fora do Git, e ajuste `NODE_ENV=production`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`, `FRONTEND_URL`, `BACKEND_INTERNAL_URL`, `OPERATIONS_TOKEN` e `TRUST_PROXY` para o servidor. O Compose de produção força `NODE_ENV=production`. Gere senha e token com valores aleatórios; uma senha hexadecimal evita caracteres reservados na URL de conexão. O token deve ter pelo menos 32 caracteres. O arquivo local de desenvolvimento não substitui a configuração de produção.

```sh
docker compose --env-file .env.production -f compose.production.yml build
docker compose --env-file .env.production -f compose.production.yml run --rm prepare-model
docker compose --env-file .env.production -f compose.production.yml up -d
```

As migrations são um serviço de execução única antes da API e do worker. Os processos de aplicação usam usuário sem privilégios. O preparo do modelo ajusta a propriedade do volume para esse usuário. O frontend encaminha as chamadas para a API pelo próprio servidor, usando `BACKEND_INTERNAL_URL` na rede Docker.

A busca de uma pessoa autenticada fica vinculada à sua conta. O comando de busca pelo terminal usa `Authorization: Bearer <OPERATIONS_TOKEN>`. Esse token é operacional e não deve ser enviado ao navegador. Swagger fica desabilitado em produção.

Os documentos acadêmicos originais ficam na raiz e não fazem parte do runtime da aplicação.

## MVP adaptativo

As páginas de eventos, conceitos, biblioteca, conhecimento, revisões, salvos e administração agora integram a API e o PostgreSQL. A geração assíncrona usa OpenAI e orçamento transacional; os embeddings continuam locais. Sem chave de IA configurada, a busca local e as funções disponíveis continuam operando, enquanto novas gerações ficam pausadas. E-mail depende de `RESEND_API_KEY` e `EMAIL_FROM` verificado.

Leia [decisões, configuração e operação do MVP](docs/mvp-implementacao.md). O documento registra também as validações externas pendentes e os critérios de qualidade do TCC. `npm run test:load` valida 50 usuários em banco temporário; `npm run backup` cria um backup privado e `npm run backup:verify -- arquivo.sql.gz` testa a restauração em banco isolado. Produção usa o Caddy para HTTPS e exige domínio e segredos próprios.
