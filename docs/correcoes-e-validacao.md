# Correções e validação — 12/11/2026

O pacote corrige fluxos existentes e centraliza a configuração. Os testes passaram; isso não estabelece ausência de outros bugs nem entrega as funcionalidades de MVP ainda demonstrativas.

## Correções

| Fluxo | Problema corrigido |
| --- | --- |
| Landing | Ausência de caminhos claros para login, cadastro e plataforma; chamadas sem destino; rodapé apontando para uma rota inexistente. |
| Rodapé público | Atalhos administrativos e formulário de newsletter sem implementação removidos; navegação alinhada ao produto. |
| Início do usuário | “Explorar notícias” e “Ver todas” agora navegam para Explorar. |
| Perfil | “Encerrar sessão” executa logout e apresenta falhas recuperáveis. |
| Foto de perfil | Corpo acima de 16 KiB era rejeitado apesar de estar dentro do limite do avatar; limite ampliado somente nessa rota. |
| Salvamento | Dados pessoais, interesses e notificações agora têm gravações independentes; campos omitidos são preservados. |
| Notificações | Ação explícita de salvar, feedback e indicação de alterações pendentes. |
| Falha de carregamento | Edição bloqueada e retentativa disponível; evita salvar valores vazios após erro inicial. |
| Onboarding | Envia somente interesses; não sobrescreve nome, e-mail e notificações carregados anteriormente. Outros cartões não concluem o onboarding. |
| E-mail | Normalização antes da validação e resposta 409 para conflito de índice único durante atualizações concorrentes. |
| Login | Um destino `next` malformado não interrompe o redirecionamento após autenticação; destinos externos usam o destino interno padrão. |
| Identidade | Menu usa iniciais e avatar do perfil em vez de “NB” fixo. |
| Limite de acesso | Cabeçalhos de IP não são confiáveis por padrão; `TRUST_PROXY` configura os proxies autorizados. |
| Encaminhamento HTTP | Respostas do servidor preservam `Retry-After` e `Allow`. |
| Curadoria demonstrativa | Contagens derivadas dos artigos; transferência valida origem/destino; unificação não duplica artigos; contagem de sugestões considera os eventos restantes. |
| Quiz demonstrativo | Numeração reflete a quantidade de questões disponível; botões anterior/próxima têm nomes acessíveis. |
| Acessibilidade | Rótulos associados aos campos de edição; links de navegação com semântica nativa; gráficos decorativos identificados. |
| Executor E2E | Execução assíncrona permite drenar logs dos servidores durante os testes, evitando bloqueio dos pipes. |
| Testes de frontend | Hooks de preparação deixam de retornar acidentalmente a função mockada como função de limpeza. |

A formatação e a organização de imports foram normalizadas para permitir a verificação global do repositório. Nenhuma dependência foi adicionada.

## Configuração central

- `.env` da raiz contém configuração local, credenciais e token operacional; permanece ignorado pelo Git, excluído do contexto Docker e com permissões locais restritas.
- `.env.example` documenta as chaves; o exemplo duplicado do backend foi removido.
- Compose de desenvolvimento e produção leem as variáveis do arquivo selecionado. Produção força `NODE_ENV=production`.
- Portas internas e publicadas estão explícitas; healthchecks usam as portas configuradas.
- Configuração local preserva o banco existente, incluindo a porta publicada 5438. Nenhum volume foi apagado.
- Integração e E2E leem as opções de portas do arquivo central e continuam usando um banco temporário separado.
- Produção exige arquivo próprio com credenciais, URL pública e proxies confiáveis apropriados; o arquivo local não é uma configuração de deploy.

## Verificações realizadas

Ambiente de validação: Node 24.22.2 e npm 11.13.0.

| Verificação | Resultado |
| --- | --- |
| Unidade | 17 testes passaram |
| Integração com PostgreSQL/pgvector e pg-boss | 12 testes passaram |
| Frontend | 27 testes passaram |
| E2E Chromium | 5 testes passaram, incluindo landing em desktop/celular, cadastro/login, proteção administrativa, perfil e logout |
| `npm test` | Passou: 61 testes |
| `npm run check` | Passou: lint e build de produção |
| `git diff --check` | Passou |
| Compose desenvolvimento/produção | Configuração válida |
| Ambiente local após recriação | Frontend, backend, worker e PostgreSQL saudáveis |

O lint mantém quatro avisos de desempenho por imagens `<img>` nas telas administrativas demonstrativas; nenhum erro. A troca dessas imagens por otimização automática fica fora das correções funcionais.

## Limites e trabalho posterior

- Eventos, grafo, aprendizagem, salvos e partes administrativas ainda contêm dados ou operações demonstrativas. Não foram transformados em integrações reais neste pacote.
- Testes de inferência e processamento usam substitutos controlados do embedder; não medem qualidade semântica nem desempenho do modelo real.
- A fonte externa não foi coletada nesta rodada, para evitar dependência de rede e alteração dos dados de desenvolvimento. Extração e validação foram exercitadas com conteúdo controlado.
- Os cenários de integração verificam concorrência, transações, isolamento de buscas, idempotência e falha de enfileiramento. Não simulam uma interrupção real do processo do worker durante inferência.
- O comportamento de proxies em produção deve ser validado no ambiente de deploy. Por padrão, cabeçalhos encaminhados são ignorados; sem `TRUST_PROXY`, clientes que passam pelo Next compartilham o limite do IP desse servidor.
- Duas abas editando o mesmo bloco ainda seguem a última gravação; blocos independentes não se sobrescrevem.
- O alinhamento de produto/arquitetura e a priorização MoSCoW serão retomados após este pacote.
