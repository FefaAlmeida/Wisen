# Diagnóstico e compatibilidade

## O que foi mantido

Next/React, Tailwind, shadcn/Base UI, páginas e URLs em português, componentes por área, Docker multi-stage, Next standalone e o princípio de separar servidor da aplicação testável.

## Conflitos corrigidos

| Antes                                                                                         | Agora                                                                |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| README descrevia uma base sem Tailwind                                                        | Documenta a stack já usada pelas telas                               |
| Runtime Express/MySQL contradizia PDF e DOCX                                                  | Fastify e PostgreSQL + pgvector                                      |
| Instalações/lockfiles separados                                                               | npm workspaces e lockfile único                                      |
| Docker local executava imagens de produção sem recarga                                        | Desenvolvimento com fontes montadas e recarga; produção separada     |
| SQL inicial fixava `app_db`                                                                   | PostgreSQL provisionado pelo container e migrations próprias         |
| Scripts SQL sem executor, com `USE`/`CREATE DATABASE IF NOT EXISTS` de MySQL e DDL PostgreSQL | Migrations PostgreSQL transacionais com histórico e checksums        |
| FKs usavam `usuarios(id)` mas a PK era `id_usuario`                                           | Referências consistentes na modelagem consolidada                    |
| Migration de domínio do usuário sem extensão `.sql`                                           | Numeração e extensão uniformes                                       |
| Código de usuários importava configuração ausente e não era registrado pelo servidor          | Preservado como referência inativa; sem fingir que login já funciona |
| Tokens de fonte autorreferentes e metadados do template                                       | Geist referenciado corretamente, identidade Wisen e `pt-BR`          |
| Cores recorrentes copiadas em várias telas                                                    | Primeiros tokens semânticos centralizados, mantendo valores visuais  |

## Arquivos anteriores

`docs/legado/` preserva o conteúdo original dos controllers, models, middlewares, utilitários e SQL que estavam fora de `backend/src`. A extensão `.txt` deixa explícito que não são módulos executáveis nem migrations ativas. O conteúdo foi recuperado diretamente do commit de origem, sem alterações de formatação.

O antigo `database/jwt.js` e o SQL de inicialização também estão nesse arquivo de referência. A configuração JWT dependia de módulos removidos e não tinha um fluxo de autenticação ativo.

A estrutura nova usa os nomes de entidades do documento de arquitetura (`users`, `articles`, `events`, etc.). Conceitos úteis dos rascunhos, como categorias, interesses ponderados, curadoria e métricas de memória, foram incorporados. Não há conversão automática de bases previamente criadas com os rascunhos: antes de importar dados de uma base externa, será preciso mapear seus campos e validar as constraints.

## Diferenças deliberadas em relação aos documentos acadêmicos

- pg-boss substitui Redis/BullMQ para reduzir serviços operacionais.
- A integração inicial usa somente RSS de Economia da Agência Brasil e Cheerio; não inclui Puppeteer.
- Somente embeddings locais; nenhuma API paga ou extração de conceitos por LLM.
- Schema central preparado, mas autenticação, personalização, eventos automáticos, revisão pedagógica e administração ainda são próximas etapas.
- PDF e DOCX permanecem originais; este diretório registra as decisões técnicas atuais.
