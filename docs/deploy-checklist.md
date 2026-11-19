# Entrega de produção — Wisen

Atualizar esta lista com evidências, sem registrar credenciais. Marcar somente trabalho concluído.

## Preservação e integração

- [x] Inspecionar alterações locais, histórico e commits remotos.
- [x] Confirmar acesso administrativo com a conta FefaAlmeida.
- [x] Sincronizar conta, autor e SSH com `gh-use fefa`.
- [x] Criar backup privado dos patches e referência do HEAD original.
- [x] Commitar os 12 arquivos locais antes da integração.
- [x] Integrar os commits remotos sem perder trabalho local.
- [x] Corrigir footer remoto, formatação e referências removidas.
- [x] Validar diff e histórico final; publicar sem force push.

## Revisões reais

- [x] Migration aditiva para sessões e itens, sem alterar migrations anteriores.
- [x] Catálogo real de assuntos/questões e resumo com histórico do usuário.
- [x] Criar, recuperar e concluir sessões privadas e persistentes.
- [x] Corrigir quiz no servidor, sem gabarito antecipado e sem evidências duplicadas.
- [x] Revelar flashcards sem atribuir domínio ou acerto objetivo.
- [x] Integrar painel, seleção, sessão e resultado à interface local.
- [x] Manter demonstração separada; preservar compatibilidade da API existente.
- [x] Tratar reload, retomada, falhas de rede e estados vazios.
- [x] Testar autorização, concorrência, idempotência e persistência.

## Conteúdo e contas

- [x] Preparar seis eventos econômicos reais com fonte, URL e data verificadas.
- [x] Redigir resumos próprios e relacionar 8–12 conceitos.
- [x] Preparar questões objetivas editoriais com explicações.
- [x] Importar conteúdo de forma transacional e idempotente, com procedência.
- [x] Preservar curadoria após ativação da OpenAI.
- [x] Criar banco exclusivo de produção, sem importar contas locais.
- [x] Criar administrador com e-mail e senha atuais, conforme pedido.
- [x] Manter geração pausada sem chave; comunicar indisponibilidade.

## Frontend e imagens

- [x] Criar e publicar favicon minimalista SVG/ICO e ícone Apple, com MIME verificado.

- [x] Medir build de produção antes e depois da otimização.
- [x] Comprimir vídeo e preparar poster sem mudar o visual.
- [x] Otimizar imagens, dimensões, carregamento e cache.
- [x] Suspender animações invisíveis; respeitar movimento reduzido.
- [x] Separar código demonstrativo do carregamento real.
- [x] Manter standalone e identificar versão do deploy.
- [x] Verificar desktop/celular, console, rede, acessibilidade e navegação.

## Containers e infraestrutura

- [x] Separar dependências de runtime das três imagens.
- [x] Converter Compose de produção para imagens imutáveis, sem build no VPS.
- [x] Configurar rede exclusiva, volumes, limites e rotação de logs.
- [x] Expor somente frontend em localhost:7170; banco e API privados.
- [x] Configurar healthchecks e encerramento gracioso.
- [x] Preparar e validar cache persistente do modelo antes do worker.
- [x] Provisionar /opt/wisen sem alterar outros projetos.
- [x] Criar usuário/chave de deploy restritos e helper root validado.
- [x] Fixar host SSH e transportar configuração privada sem logs de valores.

## GitHub Actions e configuração

- [x] CI com Node 24/npm 11, lint, unidade, frontend, integração, E2E e build.
- [x] Build no GitHub com cache e publicação das três imagens no GHCR.
- [x] Actions fixadas por SHA e permissões mínimas por job.
- [x] Criar environment production e variables operacionais.
- [x] Cadastrar secrets criptografados via gh api.
- [x] Preservar token operacional e gerar senha própria do PostgreSQL.
- [x] Deploy apenas do SHA validado pela CI, com exclusão mútua.
- [x] Configuração manual sem rebuild, incluindo futura OPENAI_API_KEY.
- [x] Backup antes de migrations, parada controlada e healthchecks pós-deploy.
- [x] Registrar versões e disponibilizar rollback manual por release.

## Cloudflare e domínio

- [x] Emitir Origin CA e instalar certificado/chave privados no Caddy.
- [x] Validar configuração e recarregar Caddy preservando outros hosts.
- [x] Configurar Full Strict, domínio principal e redirecionamento de www.
- [x] Apontar DNS para VPS somente após validar a origem.
- [x] Retirar wildcard de estacionamento e preservar DNS do Resend.
- [x] Cache apenas de assets apropriados; bypass de API, páginas privadas e RSC.
- [x] Verificar HTTPS, cookies, headers, cache e entrega pública de assets.

## Operação e aceite

- [x] Backup diário com retenção e cópia inicial privada nesta máquina.
- [x] Testar restauração isolada e registrar resultado.
- [x] Validar aplicação real servida pela imagem standalone.
- [x] Testar cadastro, verificação/recuperação, autenticação e autorização.
- [x] Testar notícias, busca semântica, curadoria, salvos e revisões reais.
- [x] Verificar geração pausada sem chamadas externas e preparar ativação posterior.
- [x] Executar carga controlada e observar recursos do VPS e outros serviços.
- [x] Medir frontend público e registrar resultados e limitações.
- [x] Testar caminho de atualização e rollback compatível.
- [x] Documentar operação, secrets, OpenAI, backups e recuperação.
- [x] Entregar domínio, SHA, runs e riscos/pendências reais.

## Evidências anteriores à implementação

- Unidade: 26 testes; frontend: 78; integração: 27; E2E: 8 — aprovados.
- Unidade, frontend e build repetidos em Node 24.22.2 — aprovados.
- Carga local: 50 usuários, 250 leituras, nenhum erro inesperado, p95 184 ms.
- Modelo: 384 dimensões, 435 MiB RSS, inicialização 3,4 s sob 0,75 CPU.
- Duas fontes RSS e seis extrações reais verificadas; Resend com domínio verificado.
- VPS: Alpine, duas vCPUs, aproximadamente 8 GB RAM, Caddy no host.

## Validação da implementação

- 29 testes de integração aprovados, incluindo sessões e bootstrap editorial.
- 26 testes unitários e 78 de frontend aprovados.
- 8 testes E2E aprovados usando o servidor standalone de produção.
- Lint sem erros; quatro avisos anteriores de imagens administrativas ainda usam img.
- Vídeo principal: 7,5 MiB → 1,5 MiB; imagens da aplicação convertidas para WebP versionado.
- Medição local com CPU 4x e rede limitada: LCP próximo de 1,2 s, CLS zero; pequenas variações de tempo entre execuções, sem afirmar ganho de LCP.
- Chave restrita validada por SSH; certificado instalado e Caddy recarregado.

- Imagem backend construída e imports do runtime aprovados.
- Primeiro run remoto bloqueou erro de escopo antes do deploy; correção repetida com oito E2E aprovados.
- Comando SSH fora da lista permitida recusado com status 64.
- Fuella web e API permanecem saudáveis na origem após inclusão do Wisen no Caddy.

- A imagem de frontend foi construída separadamente e respondeu HTTP 200.
- O vídeo agora pausa fora da tela e em aba inativa; oito E2E aprovados novamente.
- O ONNX foi validado sem downloads CUDA: imagem do worker passou de 470 MB para 247 MB e manteve embeddings com 384 dimensões.
- Cache do modelo transferido ao volume exclusivo no VPS; o deploy ainda fará a verificação do modelo.
- Cache e Full Strict preparados na Cloudflare; DNS permanece no estacionamento até healthchecks da origem.

## Aceite em produção

- Site e API publicados em HTTPS; quatro serviços saudáveis.
- Release inicial validada nos fluxos completos: e78a146b8f7ca8d0d9b2918310c35e3fd976d728.
- CI: https://github.com/FefaAlmeida/Wisen/actions/runs/44467120137
- Deploy: https://github.com/FefaAlmeida/Wisen/actions/runs/44467319851
- Rollback compatível aprovado: https://github.com/FefaAlmeida/Wisen/actions/runs/44468209085
- Reaplicação da versão mais recente: https://github.com/FefaAlmeida/Wisen/actions/runs/44468406420
- Resend confirmou entrega ao endereço oficial de teste; conta temporária excluída.
- Busca semântica retornou cinco resultados; geração pausada e nenhuma cobrança registrada.
- Carga pública: 25 leituras, concorrência cinco, zero erros, p95 164 ms.
- Restauração externa isolada aprovada: 12 migrations, seis eventos e 12 conceitos.
- Cópia privada inicial em ~/.local/state/wisen-deploy/backups/wisen-first-production.dump.
- Header de cache corrigido para evitar duplicação com o Next; asset retornou CF-Cache-Status HIT.
- Pedido adicional: favicon minimalista SVG/ICO e ícone Apple publicados e verificados em HTTPS.

## Fechamento técnico

- 30 testes de integração aprovados; proteção de evidências compartilhada entre sessões, API legada e correção aberta.
- Flashcards não bloqueiam a primeira avaliação objetiva; regressão coberta por teste.
- Código demonstrativo das 13 rotas restantes passou a carregar sob demanda; build, oito E2E e 78 testes de frontend aprovados.
- Swagger UI preservado no desenvolvimento e excluído das imagens de produção; runtime sem a dependência validado.
- Auditoria das dependências de produção: zero vulnerabilidades após a separação.
- Medição pública com CPU 4x e rede limitada a 1,6 Mbps/150 ms: celular LCP 1.696 ms, CLS 0,00115, bloqueio 168 ms; desktop LCP 1.708 ms, CLS 0,00097, bloqueio 150 ms.
- São medições sintéticas de laboratório; INP de usuários reais ainda não é conhecido.
- Sem overflow horizontal ou erros de JavaScript nos dois tamanhos testados.

- Swagger UI retirado das dependências de runtime sem mudar versões; documentação de desenvolvimento preservada e imagem de produção testada sem o pacote.
- Auditoria final das dependências de produção: zero vulnerabilidades.

## Versão entregue

- Aplicação: https://gowisen.app — favicon minimalista publicado e links de ícone verificados.
- Release final: `78488c79a701e0a6beafdbac72294777689da57c`.
- CI final aprovada: https://github.com/FefaAlmeida/Wisen/actions/runs/44470804263
- Deploy final aprovado: https://github.com/FefaAlmeida/Wisen/actions/runs/44471182064
- Quatro serviços saudáveis; API responde `status=ok`, `database=ok`.
- 142 testes na suíte: 26 unitários, 78 de frontend, 30 de integração e oito E2E.
- Validação pública final percorreu seis rotas de cliente e quatro administrativas; nenhum erro JavaScript e nenhum overflow no celular.
- Conta temporária removida; apenas o administrador solicitado permanece; zero cobranças de geração.
- Backup externo final privado: `~/.local/state/wisen-deploy/backups/wisen-final-production.dump`; restauração isolada aprovada.
- Código e dependências de produção publicados por digest; documentação final registrada separadamente, sem reconstruir imagens.
- Integração explicitamente adiada: adicionar `OPENAI_API_KEY` e executar `Deploy → configure` para a release publicada. O modelo e as taxas atuais estão documentados; o acesso da conta será validado na ativação.
- Backups diários ficam no VPS; a cópia externa desta entrega foi manual. R2 e coleta de métricas de usuários reais ficam fora desta entrega, conforme as decisões registradas.
