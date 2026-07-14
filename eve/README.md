<img src="src/assets/img/logo-eve.svg" alt="EVE" width="140" />

# EVE — Ecossistema Virtual de Eventos

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?logo=reactivex&logoColor=white)

Projeto de conclusão da trilha de Programação Front-End do **Ford Enter**. A ideia nasceu de um problema bem concreto: os eventos de inovação de Salvador (hackathons, ideathons, maratonas de programação, editais de aceleradoras) estão espalhados entre grupos de WhatsApp, Instagram e formulários soltos, sem um lugar único pra descobrir o que está rolando e garantir presença. A EVE centraliza isso: descoberta de eventos, inscrição com QR code e uma comunidade de participantes por evento.


## Como o fluxo funciona

Existem dois papéis de usuário, escolhidos no cadastro:

- **Participante** navega pelos eventos na home ou em `/eventos` (com busca e filtro por categoria), abre o evento que interessa, preenche nome/e-mail/CPF e confirma o consentimento LGPD pra se inscrever. Depois disso ganha acesso a um ingresso com QR code e à comunidade daquele evento (mural de avisos, lista de participantes). Também acompanha um feed vertical estilo TikTok com os vídeos de chamada dos eventos.
- **Organizador** cai direto num painel com métricas por evento, ocupação, receita projetada, comissão da plataforma (5%, metade do padrão de mercado) e receita líquida. De lá cria eventos novos (com upload de banner), exclui os que não vão mais rolar e faz o check-in dos participantes no dia.

As duas rotas de organizador são protegidas por guard: sem estar logado, redireciona pro login; logado como participante, redireciona pra home. `/comunidade` só pede estar autenticado, não importa o papel.

## Sobre os dados

Não tem backend. O objetivo do projeto era entregar um protótipo de front-end completo. Então tudo que dependeria de infraestrutura real: autenticação, pagamento e persistência é simulado com JSON estático (`src/assets/data`) mais `localStorage`, atrás de services isolados. Criar um evento no painel do organizador, por exemplo, realmente aparece na home e em `/eventos` na hora, porque o `EventosService` mescla o JSON base com o que foi criado/removido localmente. Dá pra trocar por uma API de verdade sem mexer nos componentes.

## Stack

Angular 18 com standalone components (sem NgModule), lazy loading por feature, Bootstrap 5 + SCSS pra estilização e RxJS pros streams de dados mockados. O globo 3D da home usa a lib `cobe` (WebGL puro, sem framework), e os QR codes dos ingressos são gerados com `qrcode`. Nada de UI kit pronto, os componentes (cards, pills, modais, carrossel, marquee) foram construídos na mão pra manter controle total sobre o design system.

## Rodando localmente

```bash
npm install
npm start
```

Abre em `http://localhost:4200`.

```bash
npm run build    # build de produção em dist/eve
npm run test:ci  # suíte de testes (Karma + Jasmine)
```

## Deploy

Publicado na Netlify (`netlify.toml` na raiz do repo).
