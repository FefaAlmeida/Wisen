# Frontend Wisen

Next.js com React, JavaScript, Tailwind e shadcn/Base UI.

Execute `npm run dev` na raiz para iniciar toda a aplicação no Docker. O setup, as portas e os testes estão no [README principal](../../README.md).

Em `src/`, mantenha rotas e layouts em `app/`, componentes por área em `components/`, lógica de interação em `hooks/` e chamadas HTTP em `services/`. Componentes compartilhados ficam em `components/ui/`. As telas ainda usam dados demonstrativos.

`NEXT_PUBLIC_API_URL` é configurada pelo Compose e incorporada durante o build de produção.
