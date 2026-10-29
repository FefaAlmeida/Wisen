# Arquitetura da fundação

O Wisen usa um monorepo JavaScript com npm workspaces. A organização segue a documentação acadêmica, com uma mudança deliberada: PostgreSQL também armazena a fila por meio do pg-boss, eliminando Redis e BullMQ nesta etapa.

## Responsabilidades

- **Frontend:** Next App Router preserva rotas e layouts; `components/` mantém componentes por área e UI compartilhada; `hooks/` mantém lógica de interação; `services/` contém fetch e erros HTTP. Dados demonstrativos podem ficar em `data/`. Não criar uma estrutura de features nem misturar consultas SQL nas telas.
- **Backend:** módulos por funcionalidade; controller valida/traduz HTTP, service coordena regras e repository faz SQL. `buildApp` recebe banco e fila, permitindo testar HTTP sem abrir portas.
- **AI:** um processo separado consome tarefas. Coleta e extração são distintas da geração dos embeddings. Um único fluxo de inferência por processo evita carregar várias cópias do modelo ou multiplicar os picos de memória.
- **Database:** conexão, transações, migrations e utilitário para serializar vetores. Os repositories pertencem às aplicações; o pacote não importa backend ou frontend.
- **Queue:** configuração do pg-boss e adaptador de transação. A criação do pedido e sua tarefa acontecem no mesmo commit PostgreSQL.
- **Shared:** schemas, configuração e constantes consumidas por mais de uma aplicação. Não é um depósito de regras de negócio.

## Fluxo entregue

```text
comando collect → tarefa de coleta → RSS de Economia → artigos únicos por URL
                                                    ↓
                                            tarefas por artigo
                                                    ↓
                                  Cheerio → trechos → E5 Small → pgvector

POST /api/search → pedido + tarefa → embedding da consulta → similaridade cosseno
GET /api/search/:id ← estado + artigos distintos com melhor trecho
```

A coleta admite somente a origem e a editoria configuradas; redirecionamentos são rejeitados, downloads têm timeout e limite de tamanho. HTML é tratado como dado e apenas texto extraído é persistido. O worker não usa instruções do conteúdo.

## Embeddings

- Modelo: `Xenova/multilingual-e5-small`, revisão `761b726dd34fb83930e26aab4e9ac3899aa1fa78`, INT8 via Transformers.js/ONNX em CPU.
- Vetores: 384 dimensões, mean pooling, normalização; prefixos `query:` e `passage:` conforme a tarefa.
- Trechos: até 430 tokens de conteúdo, sobreposição de 50; validação final com prefixo e tokens especiais para respeitar 512. O artigo completo permanece salvo.
- Inferência: um trecho por vez, dois threads internos. As buscas e a indexação compartilham a mesma instância de modelo.
- Docker limita o worker a duas CPUs e 1,5 GiB de memória por padrão (`AI_MEMORY_LIMIT` ajustável). Após o preparo, o modelo é aberto pelo caminho do snapshot local, com acesso remoto desabilitado.
- Versão do modelo e do particionamento é persistida nos vetores. Consultas filtram essa versão. Alterar a versão exige preparar o modelo e coletar/reprocessar o conteúdo; não misturar vetores incompatíveis.
- Busca exata por cosseno no início, sem índice aproximado. Cada artigo aparece uma vez, classificado pelo trecho mais semelhante. Criar HNSW depende de medir volume, latência e qualidade depois.

## Persistência e recuperação

A publicação da tarefa compartilha a transação do registro correspondente. Retentativas têm backoff. Artigos concluídos com a mesma versão são ignorados; gravação dos trechos e conclusão do artigo são atômicas. Morte entre commit e confirmação da tarefa não duplica os trechos na reentrega.

Tarefas têm prazo de execução de dez minutos e até três retentativas. O worker reconcilia falhas definitivas da fila com o estado visível dos artigos e buscas, inclusive após encerramento abrupto. Tarefas concluídas/falhas têm retenção limitada; pedidos de busca finalizados são removidos depois de sete dias. Logs usam id de tarefa e fila; erros HTTP não expõem stack ou credenciais.

## Modelagem preparada

Há usuários e preferências, categorias e interesses, fontes, artigos, eventos e associações, conceitos e aliases, entidades, relações conceituais e entre eventos, domínio por usuário, interações, revisões/tentativas, salvos, métricas de IA e curadoria. As conexões automáticas exigem origem, método, confiança e data.

`event_articles.article_id` é chave primária: um artigo só pode pertencer a um evento principal. Artigos podem existir ainda sem evento durante a ingestão. `processed` nesta entrega significa indexação local concluída, sem afirmar conclusão de enriquecimento semântico ou associação a evento. As tabelas do restante do produto não são preenchidas artificialmente.

A evidência de proveniência usa `source_type` e `source_id`: é uma referência polimórfica, cuja existência deverá ser validada pelo service responsável ao implementar curadoria. As FKs das entidades e os limites numéricos são impostos pelo banco.

## Convenções de trabalho

Biome é o linter e formatador único. npm executa checks e testes; a CI usa PostgreSQL real e fixtures de RSS/HTML, sem rede externa para a ingestão e sem baixar modelo durante os testes automatizados. A validação real do modelo e da fonte é um smoke test manual documentado. Não há hook de precommit.

As decisões reaproveitam: comando de desenvolvimento do Fuella/portfolio, separação de responsabilidades do aif-c01, migrations SQL com histórico e padronização de componentes dos projetos patch-careers. O frontend segue a estrutura por responsabilidade escolhida para esta equipe.
