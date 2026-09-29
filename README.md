# Lamitrack-frontend

Lamitrack — front-end: vitrine de eventos de tecnologia e inovação (React + TypeScript)

## Stack

- [React Router](https://reactrouter.com/) 8 em modo framework, com renderização no servidor (SSR)
- React 19, TypeScript e Vite
- Bootstrap 5 + SCSS, com os tokens de cor da LAMIT em `app/styles/app.scss`
- Vitest + Testing Library para testes
- ESLint + Prettier

A decisão de stack e o motivo do SSR estão na [issue #2](https://github.com/LAMIT-UCSAL/Lamitrack-frontend/issues/2).

## Como rodar

Pré-requisito: **Node.js 22.22 ou mais novo** (`node -v` para conferir).

```bash
npm install
npm run dev
```

O app abre em http://localhost:5173.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o app em modo desenvolvimento, recarregando a cada mudança |
| `npm test` | Roda os testes uma vez |
| `npm run lint` | Procura problemas no código (ESLint) |
| `npm run typecheck` | Confere os tipos do TypeScript |
| `npm run format` | Formata o código com o Prettier |
| `npm run build` | Gera a versão de produção em `build/` |
| `npm start` | Serve a versão de produção (rode `npm run build` antes) |

O CI roda `lint`, `typecheck`, `test` e `build` em todo PR. Rode os quatro antes de abrir o seu.

## Estrutura

```
app/
├── root.tsx        # layout base (html, head, body) e tela de erro
├── routes.ts       # lista de rotas
├── routes/         # uma tela por arquivo, com o teste ao lado (*.test.tsx)
└── styles/         # estilos globais e tokens da LAMIT
eve/                # protótipo antigo em Angular, só como referência para o porte
```

Imports dentro de `app/` usam o atalho `~/` (ex.: `import Home from "~/routes/home"`).

## Como contribuir

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir sua primeira PR.
