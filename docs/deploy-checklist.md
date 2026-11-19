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
- [ ] Validar diff e histórico final; publicar sem force push.

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
- [ ] Preservar curadoria após ativação da OpenAI.
- [ ] Criar banco exclusivo de produção, sem importar contas locais.
- [ ] Criar administrador com e-mail e senha atuais, conforme pedido.
- [x] Manter geração pausada sem chave; comunicar indisponibilidade.

## Frontend e imagens

- [x] Medir build de produção antes e depois da otimização.
- [x] Comprimir vídeo e preparar poster sem mudar o visual.
- [x] Otimizar imagens, dimensões, carregamento e cache.
- [x] Suspender animações invisíveis; respeitar movimento reduzido.
- [ ] Separar código demonstrativo do carregamento real.
- [x] Manter standalone e identificar versão do deploy.
- [ ] Verificar desktop/celular, console, rede, acessibilidade e navegação.

## Containers e infraestrutura

- [x] Separar dependências de runtime das três imagens.
- [x] Converter Compose de produção para imagens imutáveis, sem build no VPS.
- [x] Configurar rede exclusiva, volumes, limites e rotação de logs.
- [x] Expor somente frontend em localhost:7170; banco e API privados.
- [x] Configurar healthchecks e encerramento gracioso.
- [ ] Preparar e validar cache persistente do modelo antes do worker.
- [x] Provisionar /opt/wisen sem alterar outros projetos.
- [x] Criar usuário/chave de deploy restritos e helper root validado.
- [x] Fixar host SSH e transportar configuração privada sem logs de valores.

## GitHub Actions e configuração

- [ ] CI com Node 24/npm 11, lint, unidade, frontend, integração, E2E e build.
- [ ] Build no GitHub com cache e publicação das três imagens no GHCR.
- [ ] Actions fixadas por SHA e permissões mínimas por job.
- [x] Criar environment production e variables operacionais.
- [x] Cadastrar secrets criptografados via gh api.
- [x] Preservar token operacional e gerar senha própria do PostgreSQL.
- [ ] Deploy apenas do SHA validado pela CI, com exclusão mútua.
- [ ] Configuração manual sem rebuild, incluindo futura OPENAI_API_KEY.
- [ ] Backup antes de migrations, parada controlada e healthchecks pós-deploy.
- [ ] Registrar versões e disponibilizar rollback manual por release.

## Cloudflare e domínio

- [x] Emitir Origin CA e instalar certificado/chave privados no Caddy.
- [x] Validar configuração e recarregar Caddy preservando outros hosts.
- [ ] Configurar Full Strict, domínio principal e redirecionamento de www.
- [ ] Apontar DNS para VPS somente após validar a origem.
- [ ] Retirar wildcard de estacionamento e preservar DNS do Resend.
- [ ] Cache apenas de assets apropriados; bypass de API, páginas privadas e RSC.
- [ ] Verificar HTTPS, cookies, headers, cache e entrega pública de assets.

## Operação e aceite

- [ ] Backup diário com retenção e cópia inicial privada nesta máquina.
- [ ] Testar restauração isolada e registrar resultado.
- [ ] Validar aplicação real servida pela imagem standalone.
- [ ] Testar cadastro, verificação/recuperação, autenticação e autorização.
- [ ] Testar notícias, busca semântica, curadoria, salvos e revisões reais.
- [ ] Verificar geração pausada sem chamadas externas e preparar ativação posterior.
- [ ] Executar carga controlada e observar recursos do VPS e outros serviços.
- [ ] Medir frontend público e registrar resultados e limitações.
- [ ] Testar caminho de atualização e rollback compatível.
- [ ] Documentar operação, secrets, OpenAI, backups e recuperação.
- [ ] Entregar domínio, SHA, runs e riscos/pendências reais.

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
