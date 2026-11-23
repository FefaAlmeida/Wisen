# Países e estados

Contains information from Countries States Cities Database, which is made available
under the Open Database License (ODbL) v1.0.

Fonte: https://github.com/dr5hn/countries-states-cities-database

O arquivo `data.json` é uma base derivada distribuída sob ODbL 1.0. Os conteúdos
seguem a Database Contents License. Traduções de nomes também incluem dados do
Unicode CLDR sob Unicode License v3. Os avisos e as licenças estão nesta pasta.
Esta licença se aplica à base geográfica, não aos dados pessoais dos usuários.

O snapshot contém somente países/territórios e divisões administrativas de primeiro
nível (`level = 1`), incluindo unidades sem nível definido e sem pai. Não contém
cidades, municípios de segundo nível, coordenadas ou dados de telefone. Divisões de
primeiro nível podem se chamar estados, regiões, províncias ou distritos conforme o
país; alguns países não possuem divisões nesta fonte.

A revisão exata e os hashes SHA-256 dos arquivos originais estão no próprio JSON.
Os nomes usam `pt-BR`, com fallback para `pt` e para o nome original.

## Importação

`npm run db:migrate` cria as tabelas e importa o snapshot automaticamente. Para
reimportar sem aplicar migrations, use `npm run db:seed:locations`. O seed funciona
sem internet, usa transação e upsert, preserva IDs e não remove registros já usados.

## Atualização explícita

Escolha e revise um commit da fonte e execute:

```sh
node backend/src/database/update-location-data.js <sha-do-commit>
npm run db:seed:locations
```

O primeiro comando precisa de internet e atualiza o snapshot e os avisos de licença.
Revise o diff antes de distribuir uma atualização. O aplicativo nunca consulta a
fonte externa para carregar o formulário.
