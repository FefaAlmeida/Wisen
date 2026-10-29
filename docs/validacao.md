# Verificação da entrega

Validação local em 27/10/2026. A CI foi configurada; não houve execução remota nem deploy.

## Checks executados

| Verificação                             | Resultado                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Biome                                   | Sem erros; sete avisos de otimização de imagens `<img>` já usadas nas telas                     |
| Testes unitários                        | 4 passaram: URLs permitidas, RSS, extração e validação                                          |
| Integração com PostgreSQL/pg-boss reais | 6 passaram                                                                                      |
| Navegação Chromium                      | 12 passaram: 11 rotas e biblioteca em viewport de 390 px                                        |
| Build Docker do frontend                | Concluído; página servida pela imagem standalone                                                |
| Build Docker do backend/worker          | Concluído; aplicação executada sem root                                                         |
| Configuração Compose de produção        | Validada com valores fictícios                                                                  |
| Modelo sem rede                         | Inferência em container com `--network none`, snapshot somente leitura e vetor de 384 dimensões |
| Particionamento real                    | Texto longo gerou cinco trechos, todos até 512 tokens; final do texto preservado                |
| Legado                                  | 30 arquivos comparados byte a byte com os originais do Git                                      |

A integração verifica concorrência e reexecução de migrations, checksum, rollback, constraints, publicação transacional na fila, deduplicação, reexecução de embeddings, contratos HTTP/Swagger e busca com retentativa real. Em produção, verificou proteção da busca por token e ausência de Swagger.

## Fluxo real

O preparo baixou e executou o Multilingual E5 Small INT8 na CPU. A coleta manual do RSS da Agência Brasil gerou **10 artigos processados e 19 trechos**, com dez registros de execução de embeddings. Uma segunda coleta preservou essas contagens. A consulta `taxa de juros e inflação` retornou cinco artigos via fila e similaridade cosseno.

`npm run dev` foi executado novamente: dependências sincronizadas, nenhuma migration pendente, dados preservados e os quatro serviços saudáveis. O fluxo usa três migrations próprias; o pg-boss gerencia seu schema separadamente.

A API da imagem de produção respondeu ao healthcheck, retornou 404 para Swagger e 401 para busca sem token. O frontend standalone respondeu 200. Esses containers temporários são separados do ambiente de desenvolvimento.

## Memória observada

São amostras desta máquina e desta carga, não um benchmark nem garantia de pico máximo:

- Inferência isolada offline: aproximadamente **488–498 MiB de RSS** nas duas execuções.
- Worker iniciado: aproximadamente **524 MiB de RSS**.
- Após indexar os dez artigos, uma execução anterior observou aproximadamente **745 MiB de RSS**.
- Docker após reinício e busca: aproximadamente **589 MiB** para o worker, **97 MiB** para a API, **1,22 GiB** para o frontend em desenvolvimento e **85 MiB** para PostgreSQL.

RSS do processo e memória reportada pelo Docker são medidas diferentes. O worker tem limite de **1,5 GiB**, configurável por `AI_MEMORY_LIMIT`, e duas CPUs. Logs novos incluem RSS atual e máximo do processo para acompanhar outras cargas. O frontend em desenvolvimento inclui compilação e não representa consumo da imagem de produção.

## Ambiente local e limites

- Frontend: `http://localhost:3000`; Swagger: `http://localhost:8080/docs`.
- PostgreSQL neste computador: `localhost:5438`, porque 5432 já estava ocupada. O ajuste fica no `.env` ignorado pelo Git; o padrão continua sendo 5432.
- Runtime Docker: Node 24. O host estava em Node 26; use `nvm use` para alinhar a ferramenta local ao `.nvmrc`.
- As telas preservam dados demonstrativos. Cadastro/login, personalização, agrupamento de eventos, grafo e revisão pedagógica continuam pendentes.
- Busca validada como fluxo funcional, sem avaliação de relevância com conjunto rotulado.
- CI automatiza fixtures e PostgreSQL; RSS ao vivo e modelo real dependem da validação local descrita acima.
- PDF e DOCX não foram modificados. Não foi feita migração de dados de bases externas.
