# MVP — decisões e operação

## Decisões de produto

Economia para leigos, cadastro aberto e contas verificadas. Familiaridade autodeclarada em três níveis ajusta linguagem, sem conceder domínio. Conteúdo parte de eventos com artigos, conceitos, entidades, timeline e fontes. Feed prioriza interesses/recência e permite ordem cronológica. Biblioteca, salvos, conhecimento e revisões usam persistência real. Administração opera fontes, curadoria, contas, processamento e custos.

A arquitetura em produção preserva Next.js, Fastify, PostgreSQL/pgvector e pg-boss, com worker separado. Embeddings E5 Small INT8 são locais. Geração usa Responses API com JSON Schema, modelo configurável inicialmente `gpt-6-luna`. Sem Redis, banco de grafos ou Puppeteer. O grafo relacional mantém origem de artigos, método e modelo. A versão inicial de domínio é uma hipótese de engenharia para avaliar no TCC, não uma medida psicométrica validada.

## Configuração e limites

Configuração central na raiz; `.env` é privado. Não copie credenciais para o frontend. `OPENAI_API_KEY` habilita análise e geração; `RESEND_API_KEY` e `EMAIL_FROM` habilitam envio. O remetente deve usar domínio verificado no Resend. Tokens de conta expiram em 24 horas (verificação) ou 30 minutos (recuperação); hashes são persistidos. A fila de e-mail cifra o link com chave derivada de `OPERATIONS_TOKEN`; rotacionar essa chave invalida os e-mails ainda pendentes.

| Configuração                | Padrão                                                 |
| --------------------------- | ------------------------------------------------------ |
| AI_MONTHLY_LIMIT_BRL        | 80                                                     |
| AI_DAILY_USER_LIMIT         | 30                                                     |
| AI_USD_BRL                  | 6 — hipótese conservadora, revisar pelo câmbio efetivo |
| AI_COST_MARGIN              | 1.2                                                    |
| AI_INPUT_USD_PER_MILLION    | 0.10                                                   |
| AI_OUTPUT_USD_PER_MILLION   | 0.50                                                   |
| AI_MAX_OUTPUT_TOKENS        | 4096 — inclui raciocínio faturado                      |
| AI_TIMEOUT_MS               | 90000                                                  |
| COLLECTION_DAILY_LIMIT      | 20, dividido entre fontes habilitadas                  |
| COLLECTION_INTERVAL_MINUTES | 30                                                     |
| EMAIL_DAILY_LIMIT           | 100                                                    |

Não existe divisão financeira por função: todas as chamadas compartilham um orçamento mensal. A reserva transacional inclui limite conservador de entrada, saída máxima, câmbio e margem. Consumo desconhecido retém a reserva e impede repetição automática daquela chamada. Confirmar os tokens no painel do provedor antes da reconciliação administrativa. A contabilidade é uma estimativa de custo em reais, não uma garantia sobre conversão do cartão e taxas. Alterações de preço devem atualizar a configuração antes das chamadas seguintes.

Pausas por orçamento/cota não interrompem leitura e revisão objetiva disponível. A administração pode ampliar cotas individuais para testes do TCC, mantendo o teto global. Cache é isolado por usuário e depende do conteúdo, versão do prompt/modelo e conhecimento. Questões globais são reutilizadas; gabarito e rubrica permanecem no servidor.

## API e regras

Todos os novos recursos exigem sessão; `/api/admin/*` exige administrador. `/api/account/forgot`, `/verify` e `/reset` são públicos com limite de tentativas. `/api/generations` exige e-mail verificado e retorna tarefa consultável, sem manter a conexão HTTP durante inferência. Estados: pending, processing, completed, paused, failed.

- Descoberta: `/api/feed`, `/events/:id`, `/reading/:id`, `/concepts`, `/concepts/:id`, `/discover?q=`; busca vetorial assíncrona existente em `/api/search`.
- Aprendizagem: `/api/knowledge`, `/reviews`, `/reviews/answer`, `/interactions`, `/preferences/familiarity`.
- Conteúdo pessoal: `/api/saved`, `/generations/:id`, `/generations/:id/feedback`.
- Contas: `/api/account/status`, `/verification`, `/verify`, `/forgot`, `/reset`; `DELETE /api/account` exige confirmação explícita.
- Administração: `/api/admin/overview`, listas, `/actions` e `/export/results?dataset=interactions|reviews|knowledge|feedback|generation`.

Não avaliado é diferente de lacuna. “Não sei” zera a pontuação e registra lacuna. Acerto +0,25, resposta parcial +0,10, erro −0,25, com pontuação entre 0 e 1. Domínio exige pelo menos 0,75 e dois acertos. Erro reinicia a sequência. Intervalos: 1, 3, 7, 14, 30 dias. Exposição não aumenta pontuação; revisão vencida indica necessidade de revisão. Idempotência impede reaplicar a mesma interação ou tentativa.

As fontes iniciais são Agência Brasil Economia e Agência Câmara Economia. Não cadastrar URLs arbitrárias: hosts e caminhos são permitidos explicitamente para impedir coleta de redes internas. Matérias sem estrutura esperada falham sem gerar conteúdo fictício. Reprocessamento preserva marcações de curadoria humana.

## Implantação

1. Criar `.env.production` a partir do exemplo; preencher segredos, `PUBLIC_DOMAIN`, `FRONTEND_URL=https://seu-dominio` e `BACKEND_INTERNAL_URL=http://backend:8080/api`.
2. Configurar DNS do domínio e remetente verificado no Resend. Ajustar `TRUST_PROXY` à rede/proxy real; Caddy sobrescreve o endereço encaminhado do cliente. Não expor backend ou banco publicamente.
3. Executar `ENV_FILE=.env.production docker compose --env-file .env.production -f compose.production.yml run --rm prepare-model` e depois `ENV_FILE=.env.production docker compose --env-file .env.production -f compose.production.yml up -d --build --wait`.
4. Criar a primeira conta pelo cadastro. Promovê-la com `ENV_FILE=.env.production docker compose --env-file .env.production -f compose.production.yml exec -T backend node backend/src/cli.js promote-admin email-da-conta`. A promoção é restrita ao operador com acesso ao servidor e fica auditada.
5. Validar cadastro, entrega de e-mail, confirmação, geração, custos, cookies seguros e isolamento entre duas contas.
6. Agendar `ENV_FILE=.env.production scripts/backup.sh` diariamente no cron. Backups são privados e ignorados pelo Git. Copiar para armazenamento externo protegido. Validar um backup com `node scripts/restore-check.js backups/arquivo.sql.gz`, usando Docker e banco temporário isolado.

Migrações são incrementais; não apagar volumes. Executar backup antes de atualizar produção. Em regressão, voltar a imagem anterior; não reverter automaticamente migrações ou apagar dados.

## Avaliação do TCC

Roteiro: dois usuários abrem o mesmo evento; um registra lacuna; completa três questões distintas; abre novamente o evento e compara foco da explicação. Registrar feedback de utilidade/clareza/repetição. Exportações não incluem nomes, e-mails, senhas nem respostas abertas; IDs de participantes são pseudonimizados.

Antes da entrega pública, revisar 30 artigos, 20 conceitos e 30 questões: pelo menos 90% aprovados e nenhum erro factual crítico no roteiro. Testes com provedor substituto validam integração e orçamento, não a qualidade semântica do modelo. A avaliação real depende da chave OpenAI, assim como entrega de e-mails depende do remetente e testes na VM dependem de acesso ao ambiente.

## Validação local executada

- Suíte completa: 74 testes (20 de unidade, 21 de integração, 27 de frontend e 6 E2E), com provedores de IA substituídos por respostas controladas.
- E2E cobre verificação por link, leitura, lacuna, três revisões, mudança de domínio, nova explicação, salvos e seleção de trecho; inclui largura de celular sem rolagem horizontal.
- Interrupção real de subprocesso durante chamada de geração: reserva conservada, sem repetição automática de uma chamada de consumo desconhecido.
- Carga local: 50 usuários, 250 leituras e 50 gerações enfileiradas; zero erros inesperados e p95 de 142 ms nas leituras. Não mede latência da API externa nem desempenho da VM pública.
- RSS e extração reais validados nas duas fontes. Worker local processou artigos com embeddings reais dentro do limite de memória configurado.
- Migração 0009 aplicada no desenvolvimento sem apagar volumes; frontend, backend, worker e banco saudáveis.
- Backup do banco local criado e restaurado com sucesso em PostgreSQL temporário; nove migrações recuperadas.
- Configurações Compose de desenvolvimento/produção validadas. Build e lint passaram; permanecem quatro avisos de imagens em componentes administrativos antigos.

Continuam pendentes a avaliação semântica com OpenAI real, entrega pelo Resend e validação do domínio/HTTPS e carga na VM pública. Esses resultados não são substituídos pelos testes simulados.

## Integração com a main — 13/11/2026

Atualizações remotas incorporadas até `8cac923`. Preservados a landing com vídeo, logo e estilo das sidebars, gestão administrativa de categorias, exigência de dois interesses e busca local com realce. As telas funcionais do MVP usam os componentes visuais compartilhados; filtros de biblioteca e de notícias trabalham sobre dados reais. Os cartões administrativos recebem contagens do banco, sem percentuais demonstrativos.

As migrações `0009_interest_categories.sql` e `0009_mvp.sql` mantêm seus nomes/checksums; a ordenação é por nome completo. `0010_economics_categories.sql` adiciona os assuntos de economia ao catálogo administrável sem excluir categorias existentes. A rota antiga `/paginaSessaoRevisao` continua compatível e a navegação principal usa `/paginaRevisoes`.

Validação da integração: 84 testes passaram (20 unidade, 22 integração, 36 frontend e 6 E2E). Build, lint, configurações Compose e estado saudável dos quatro serviços também verificados. Permanecem quatro avisos de desempenho por imagens nos componentes administrativos antigos. O checkpoint Git anterior ao pull foi preservado em stash.
