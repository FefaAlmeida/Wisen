# Envio de e-mail

O Wisen usa Resend, com o remetente `Wisen <nao-responda@gowisen.app>` e o domínio administrado na Cloudflare. O worker `ai` envia os e-mails de confirmação de conta e recuperação de senha pela fila `send-account-mail`.

No arquivo de ambiente usado pela API e pelo worker, configure:

```dotenv
RESEND_API_KEY=<chave do Resend>
EMAIL_FROM="Wisen <nao-responda@gowisen.app>"
EMAIL_DAILY_LIMIT=100
```

`OPERATIONS_TOKEN` protege os corpos dos e-mails pendentes no banco. Preserve seu valor entre reinicializações. `FRONTEND_URL` define o destino dos links de confirmação e recuperação: no desenvolvimento, use a URL local; em produção, use a URL pública da aplicação.

Os registros de autenticação do Resend estão na zona `gowisen.app`:

| Tipo | Nome | Valor |
| --- | --- | --- |
| TXT | `resend._domainkey` | Chave pública DKIM fornecida pelo Resend |
| MX | `send` | `feedback-smtp.sa-east-1.amazonses.com`, prioridade 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| CNAME | `rsend` | `send.forge.rmta.net`, proxy desativado |

Consulte o domínio no painel do Resend para conferir a verificação e obter a chave pública DKIM completa. A chave da Cloudflare serve para administrar DNS; ela não substitui `RESEND_API_KEY` e não precisa estar no ambiente da aplicação.

Depois de alterar o ambiente local, recrie os processos:

```sh
docker compose up -d --no-deps backend ai
```

Em produção, use o arquivo de ambiente e o Compose de produção correspondentes. O repositório não versiona chaves nem arquivos `.env`.

Para validar o envio, o Resend oferece o destinatário de teste `delivered@resend.dev`. O estado `sent` na tabela `mail_outbox` significa que o provedor aceitou a mensagem; a entrega deve ser conferida no Resend. Veja a [documentação de testes](https://resend.com/docs/dashboard/emails/send-test-emails).
