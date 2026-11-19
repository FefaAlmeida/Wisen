# Produção do Wisen

O site e o painel usam `https://gowisen.app`. `www` redireciona para o domínio principal. A geração fica pausada até configurar OpenAI; notícias, conteúdo editorial, busca local e quizzes continuam disponíveis.

## Publicação

Use a conta `FefaAlmeida` (`gh-use fefa` no shell interativo). Push na `main` executa CI; somente o commit aprovado dispara o deploy. O GitHub constrói três imagens no GHCR. O VPS recebe imagens por digest, sem construir a aplicação.

O environment `production` contém as configurações operacionais. Secrets privados são `WISEN_DEPLOY_SSH_KEY`, `WISEN_DEPLOY_KNOWN_HOSTS`, `WISEN_POSTGRES_PASSWORD`, `WISEN_OPERATIONS_TOKEN`, `RESEND_API_KEY`, `WISEN_ADMIN_EMAIL` e `WISEN_ADMIN_PASSWORD`. `OPENAI_API_KEY` é opcional no primeiro deploy. O token Cloudflare é usado no provisionamento e não entra no runtime nem nas imagens.

O usuário `deploy-wisen` só aceita deploy, configuração, rollback e validação de argumentos. A chave administrativa do VPS permanece fora do GitHub. Helpers e configuração são controlados por root em `/opt/wisen` e `/usr/local/lib/wisen`.

Cada release é identificada pelo SHA completo e registrada em `/opt/wisen/releases`. Para consultar o estado:

```sh
ssh -i ~/.ssh/vm62-security-admin security-admin@62.72.9.20
# No VPS:
doas cat /opt/wisen/.release
doas docker compose --project-directory /opt/wisen --env-file /opt/wisen/.env.production --env-file /opt/wisen/.images.env -f /opt/wisen/compose.production.yml ps
```

Para consultar logs, acrescente `logs --tail 100 backend ai frontend` ao mesmo comando Compose. Não execute `config` sem `--quiet`: a saída pode conter valores privados.

## Configuração e OpenAI

Depois de cadastrar ou alterar secrets, execute o workflow `Deploy`, operação `configure`, passando em `release` o SHA instalado. Isso reaplica o ambiente e recria os processos necessários sem construir imagens.

Antes de ativar OpenAI, confirme o acesso ao modelo escolhido, seus preços e o orçamento. Configure `OPENAI_API_KEY` e ajuste `AI_MODEL`, taxas, câmbio e limites nas variables do environment. Depois execute `configure`. O worker retoma tarefas pausadas pelo agendador; o conteúdo editorial continua marcado como curado.

```sh
gh workflow run deploy.yml -R FefaAlmeida/Wisen -f operation=configure -f release=SHA_COMPLETO
```

O banco e o token operacional têm continuidade entre versões. Alterá-los exige migração própria; o helper rejeita uma troca acidental. As credenciais administrativas só criam a conta inicial; deploys posteriores preservam senha e preferências já salvas.

## Backup e restauração

O VPS faz backup diário em `/opt/wisen/backups/daily`, com retenção de 14 dias. Antes de migrations, pausa os processos da aplicação e cria dump em `backups/predeploy`, mantendo sete dias e preservando o mais recente. Dumps e configurações são privados.

Para gerar outro backup: `doas /usr/local/sbin/backup-wisen`. Copie o arquivo via conta administrativa, mantendo permissão local 600. Confira uma restauração em container descartável na máquina local:

```sh
bash deploy/restore-check.sh /caminho/privado/backup.dump
```

O verificador cria um banco isolado e remove o container ao terminar; não conecta ao banco de produção. A cópia externa inicial fica no diretório privado `~/.local/state/wisen-deploy/backups`. A cópia diária externa ainda não é automática; o R2 está fora desta entrega.

## Rollback e falhas

O workflow `Deploy`, operação `rollback`, recebe o SHA completo de uma release já instalada:

```sh
gh workflow run deploy.yml -R FefaAlmeida/Wisen -f operation=rollback -f release=SHA_ANTERIOR
```

O rollback usa os digests registrados e não desfaz migrations. Verifique compatibilidade do schema antes de voltar a aplicação. Uma restauração de banco é uma operação administrativa separada: pausar os serviços da aplicação, preservar um dump do estado atual, restaurar o backup escolhido e iniciar as imagens compatíveis. Não restaure um banco antigo automaticamente após erro de deploy.

Deploys são serializados. Se uma migration ou healthcheck falhar, o Actions falha e preserva logs, backups e a última release saudável. A aplicação pode permanecer parada até a recuperação; pausas curtas durante atualizações fazem parte deste modelo de disponibilidade.

## Rede e cache

O Caddy do host é a entrada HTTPS. Apenas o frontend publica `127.0.0.1:7170`; API e PostgreSQL ficam na rede Docker exclusiva. O backend confia apenas no IP fixo do proxy Next. O Caddy aceita este domínio através da Cloudflare, que valida o certificado Origin CA em Full Strict.

Assets com nomes versionados podem ser armazenados em cache; API, sessões, páginas privadas e respostas RSC não devem entrar em cache compartilhado. Preserve os registros de e-mail do Resend ao alterar DNS. Atualizações do helper, Compose ou Caddy exigem sincronização administrativa dos arquivos em `deploy/` e validação antes de recarregar o Caddy com `caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile`.
