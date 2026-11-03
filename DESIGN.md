---
name: LAMIT · LamiTrack
description: Vitrine de eventos da LAMIT na identidade do ecossistema — a transmissão de hackathon do site, impressa em papel.
colors:
  paper: "#FBFAF8"
  paper-2: "#F2EFE8"
  surface: "#FFFFFF"
  night: "#081536"
  ink: "#0B0D12"
  ink-muted: "#4A4F57"
  ink-subtle: "#6B6F76"
  cobalt: "#0A3383"
  signal-blue: "#164194"
  signal-orange: "#E84B13"
  orange-ink: "#B83A0C"
  amber: "#C17402"
  gold: "#D7C06B"
  gold-ink: "#7D6310"
  success: "#2E7D32"
  danger: "#C62828"
typography:
  family: "Montserrat (400, 500, 600, 700, 800)"
  h1: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }
  h2: { fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }
  title: { fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", fontWeight: 700, lineHeight: 1.15 }
  body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.65 }
  label: { fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: uppercase }
  kicker: { fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: uppercase }
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  pill: "999px"
---

# Design System: LAMIT · LamiTrack

O LamiTrack usa a **mesma identidade** do site institucional (`Lamit-site`) e da Lamit Store (`lamit-store`). Os tokens têm os mesmos nomes nos três projetos. Quando este arquivo e a loja divergirem, vale a loja (`lamit-store/css/tokens.css`, `base.css`, `components.css`) e a auditoria `lamit-store/docs/audits/2026-10-13-design-alignment-audit.md`.

A paleta do protótipo EVE (azul `#0A69C4`, laranja `#E8722C`, navy `#0E1B27`, Inter) **não é mais a identidade da LAMIT** e não deve voltar. A pasta `eve/` vale só para estrutura, telas, fluxos e regras de negócio.

## Overview

**Conceito: "Broadcast em papel".** O site da LAMIT é uma transmissão de hackathon em fundo preto. Aqui ela vira impresso: o preto vira tinta, o branco vira papel creme, e o gradiente Grainient (cobalto e âmbar) deixa de ser fundo de página para virar **faixa**. O laranja é sinal de interação, nunca decoração.

Onde mora cada coisa:

| Arquivo | O que tem |
|---|---|
| `app/styles/_tokens.scss` | Todos os tokens (`--color-*`, `--font-size-*`, `--radius-*`, `--shadow-*`, movimento). Único lugar com hex. |
| `app/styles/app.scss` | Bootstrap remapeado para a marca (antes do `@import`), depois tokens e base. |
| `app/styles/_base.scss` | Títulos, links, foco, seleção, `.sr-only`, skip link, reduced-motion. |
| `app/components/` | Componentes de marca, cada um com `.tsx`, `.scss` e `.test.tsx`. |

## Colors

| Token | Hex | Uso |
|---|---|---|
| `--color-paper` | `#FBFAF8` | fundo da página |
| `--color-paper-2` | `#F2EFE8` | faixas alternadas, fundo de mídia, trilho de abas, nota |
| `--color-surface` | `#FFFFFF` | cards, chips, campos (e texto branco sobre fundo escuro) |
| `--color-night` | `#081536` | rodapé, faixas escuras, película atrás de texto no gradiente |
| `--color-ink` | `#0B0D12` | texto principal (19:1) |
| `--color-ink-muted` | `#4A4F57` | texto secundário (7.9:1) |
| `--color-ink-subtle` | `#6B6F76` | metadados (4.8:1, nunca abaixo de 12px) |
| `--color-hairline` | `rgba(11,13,18,.16)` | bordas e divisores |
| `--color-cobalt` | `#0A3383` | links, números de destaque, preço |
| `--color-signal-blue` | `#164194` | CTA primário (texto branco, 9.5:1) |
| `--color-signal-orange` | `#E84B13` | **só estados**: hover, foco, sublinhado, item ativo |
| `--color-orange-ink` | `#B83A0C` | laranja como texto sobre papel (5.5:1) |
| `--color-amber` | `#C17402` | **só dentro do gradiente** |
| `--color-gold` | `#D7C06B` | filete do kicker, borda da nota; texto só sobre `night` |
| `--color-gold-ink` | `#7D6310` | ouro como texto sobre papel: kickers, meta do card (5.5:1) |
| `--color-success` | `#2E7D32` | estado funcional ("Gratuito", texto branco 5.1:1) |
| `--color-danger` | `#C62828` | estado funcional (erro, texto branco 5.6:1) |

### Named Rules

- **Nada de hex solto.** Componente usa `var(--…)`. Para transparência, `color-mix(in srgb, var(--token) N%, transparent)`.
- **Branco sobre laranja não passa AA.** No hover do CTA o texto vira `ink`.
- **Ouro sobre papel mede 1.7:1.** Texto dourado no claro é sempre `gold-ink`.
- **Nenhum matiz fora desta tabela.** Exceção: estados funcionais, definidos como token e com AA conferido.
- **Categoria não tem cor.** As 5 categorias (Hackathon, Ideathon, Maratona, Edital, Eventos de Inovação, em `app/lib/categorias.ts`) aparecem como rótulo de meta em `gold-ink`, caixa alta. O nome diferencia, não a cor (decisão da story 5.25).

## Typography

Montserrat em toda a interface, com `-webkit-font-smoothing: antialiased`.

### Hierarchy

| Papel | Tamanho | Peso | Notas |
|---|---|---|---|
| h1 | `clamp(2rem, 5vw, 3.5rem)` | 800 | `letter-spacing: -0.02em`, `text-wrap: balance` |
| h2 | `clamp(1.75rem, 4vw, 3rem)` | 800 | idem |
| h3 / título | `clamp(1.25rem, 2.4vw, 1.75rem)` | 700 | |
| corpo | `1rem` | 400 | `line-height: 1.65` |
| rótulo de UI | `0.875rem` | 600 | caixa alta, tracking `0.06em` |
| kicker | `0.875rem` | 700 | caixa alta, tracking `0.18em` |

### Named Rules

- **Nada abaixo de 0.875rem (14px).**
- **Caixa alta só** em menu, kickers, rótulos, datas e índices. Títulos e textos seguem a caixa do conteúdo. (A caixa alta global e a BB Manual Mono do site antigo foram descartadas.)
- **Voz do kicker:** frase curta, afirmativa, com ponto final ("Agenda.", "Não espere, construa.").

## Layout

- `.page-container`: largura máxima de 1320px com `padding` lateral `--gutter`. Header, faixas e rodapé ficam fora dele (ocupam a largura toda).
- Espaçamento por tokens: `--space-xs` (0.5rem) a `--space-xl` (4rem) e `--space-section` entre seções.
- Grade de cards (`.event-grid`): 1 coluna, 2 a partir de 600px, 3 a partir de 1024px.
- Sem rolagem horizontal em 375px. O trilho de abas rola sozinho, dentro dele.

## Elevation & Depth

Profundidade leve, só onde ajuda a leitura.

### Named Rules

- **Sombra só em card:** `--shadow-soft` em repouso e `--shadow-lift` no hover/foco. Nada de sombra em botão, campo ou header.
- **Header sólido em papel**, sem borda, blur nem sombra: separa-se do conteúdo pelo tom.
- Num tema escuro futuro, as sombras somem (o site escuro não usa sombra).

## Shapes

| Token | Valor | Onde |
|---|---|---|
| `--radius-sm` | 8px | chips, badges, "Gratuito" |
| `--radius-md` | 12px | botões, campos, miniaturas |
| `--radius-lg` | 20px | cards, fotos, painéis |
| `--radius-pill` | 999px | trilho de abas |

## Motion

- `--ease-broadcast: cubic-bezier(.2,.7,.2,1)`; `--transition-fast` 150ms; `--transition-base` 300ms (sublinhado da nav); `--transition-flip` 500ms (troca de cor do CTA).
- `prefers-reduced-motion: reduce` zera animações e transições, desliga o tilt dos cards e mantém o Grainient no fallback estático.

## Components

### Kicker (`Kicker`)
Abre toda seção. Rótulo em `gold-ink`, caixa alta, tracking largo, com filete dourado de 1.75rem × 3px antes. Dentro de uma faixa escura, o texto vira `gold`.

### Botão (`Button`)
- **Primário:** fundo `signal-blue`, texto branco 700, altura mínima de 54px, raio de 12px, seta `→`. No hover/foco: fundo `signal-orange`, texto `ink`, `translateY(-2px)` e a seta anda 4px. **Um primário por tela.**
- **Secundário:** contorno de 2px em `ink`. No hover/foco inverte para tinta cheia com texto `paper`.
- Com `href` vira `<a>`; sem, `<button type="button">`. Classes `.button`, `.button--primary` e `.button--secondary` (nada de `.btn`, que é do Bootstrap).

### Trilho de filtros (`CategoryTabs`)
Trilho `paper-2` em pílula. Item ativo em `ink` com texto `paper`; hover com sublinhado laranja interno. Cada item é um botão com `aria-pressed`, todos dentro de um `role="group"` rotulado. No celular rola para o lado e a borda direita esmaece enquanto houver itens escondidos. Alvos de 44px.

### Card de evento (`EventCard`) — "ficha de transmissão"
Recebe o evento como a API devolve (`<EventCard evento={evento} />`, tipo `Evento` em `app/lib/evento.ts`). Fundo branco, borda hairline, raio de 20px, `shadow-soft` → `shadow-lift`, tilt 3D sutil (até 6°) só com mouse e sem reduced-motion. Meta "CATEGORIA · DATA" em `gold-ink` (categoria = primeira tag que for uma das 5 válidas; sem ela, só a data), título com link esticado para `/eventos/:id` (o card inteiro é clicável e o foco contorna o card), local (`venue`) em `ink-muted`, rodapé separado por hairline com a cidade/UF (só ali, sem repetir) em `cobalt` 800 e "Ver evento →". Sem preço: a API não tem o dado (`--color-success` fica reservado para quando tiver).

### Carrossel de eventos (`EventCarousel`)
Recebe `eventos: Evento[]` e um `label`. Slides em faixa escura (raio de 20px): banner do evento ou o fundo estático do Grainient (mixin `grainient-fallback`), película `night` de baixo para cima, meta em `gold` e título branco com link para `/eventos/:id`. Avança a cada 4 s e para com o mouse em cima ou com o foco dentro; com reduced-motion não se move sozinho. Não tem botão de pausa (decisão do time, 2026-11-03). Controles de 44px em `paper` com hover/foco `signal-orange` + `ink`; dot atual em `signal-orange` com `aria-current`. Segue o padrão de carrossel do WAI-ARIA: região com `aria-roledescription="carrossel"`, slides "N de total", só o visível no Tab (`inert`) e `aria-live` só quando parado. No celular, os dots descem para uma linha própria.

### Faixa deslizante (`Marquee`)
Genérica: recebe `items`, `renderItem`, `getKey` e um `label`. Anda com `requestAnimationFrame` a 40 px/s, desacelera para 14 px/s no hover sem parar e tem blur progressivo nas bordas (6 camadas de `backdrop-filter`). Opções: `dividers` (filetes `hairline`), `compact` e `baseline` (número + rótulo). Neutra de cor, serve sobre papel ou `night`. Para com o foco de teclado dentro; com reduced-motion fica parada e rolável. Não tem botão de pausa (decisão do time, 2026-11-03). A cópia usada no loop fica `aria-hidden` e `inert`.

### Globo (`Globe`)
Globo 3D do hero (lib `cobe`, WebGL), até 340px, com Salvador marcado por padrão (`markers`). Base em `paper`, marcadores em `cobalt` e brilho em `paper-2`, lidos dos tokens por `corDoToken` (`app/lib/cores.ts`). Gira sozinho, é arrastável com qualquer ponteiro e entra com fade. Com reduced-motion não gira sozinho; abaixo de 768px fica oculto e o WebGL nem é criado. O canvas é uma imagem com nome ("Globo terrestre com Salvador marcado").

### Faixa Grainient (`BroadcastBand` + `Grainient`)
Gradiente cobalto e âmbar animado em WebGL2 (`ogl`), **contido em faixas**, com texto branco centralizado sobre uma película `night`. O HTML do servidor já traz o fallback em CSS (radiais âmbar sobre cobalto). O canvas só monta no cliente, com WebGL2 e sem reduced-motion, e entra com fade. As cores vêm dos tokens. A variante `thin` (6px, estática) abre o rodapé.

### Nota informativa
Borda esquerda dourada de 3px sobre `paper-2`, texto `ink-muted` (ex.: filtro sem resultados, `.home-note`).

### Header (`SiteHeader`)
Sticky, em papel. Escudo + wordmark "**LAMIT** Track" em caixa alta. Nav com sublinhado laranja de 2px que cresce do centro (300ms), também marcando `aria-current="page"`; o link externo "LAMIT ↗" fica num bloco `paper-2`. Abaixo de 820px, botão hambúrguer de 44px e menu em overlay de papel na tela toda: foco no primeiro link, Esc fecha e devolve o foco, e o resto da página fica `inert`.

### Rodapé (`SiteFooter`)
Fundo `night`, faixa Grainient fina no topo, logo horizontal branca, tagline "Inovação, tecnologia e comunidade.", redes em círculos de 44px que ficam laranja no hover, colunas com título em `gold`, "© 2026 LAMIT", "Não espere, construa." e o link de volta para `lamitsite.com.br`.

### Logos
No fundo claro: escudo (`public/brand/escudo.webp`) + wordmark em texto (não existe logo horizontal em tinta escura). No fundo escuro: `public/brand/logo-horizontal-white.svg`.

## Accessibility

- Foco visível em todo interativo: `outline: 2px solid var(--color-signal-orange); outline-offset: 3px`.
- Seleção de texto: fundo `gold`, texto `ink`.
- Link "Pular para o conteúdo" leva ao `<main id="conteudo">`.
- Alvos de toque de pelo menos 44px.
- Links que abrem em nova aba avisam isso ao leitor de tela.

## Do's and Don'ts

### Do:
- Abrir seção com kicker + título.
- Usar papéis (`--color-paper`, `--color-ink`…) e não cores brutas, para um tema escuro futuro (modelo do site: `:root[data-theme]`).
- Conferir o contraste AA de todo par novo de texto e fundo.
- Reaproveitar os componentes de `app/components/` antes de criar estilo novo.

### Don't:
- Usar laranja como decoração ou fundo de bloco.
- Pôr o Grainient como fundo de página.
- Colorir categorias com tons próprios.
- Usar classes `eve-*`, a Inter ou a paleta do EVE.
- Pôr sombra em botão, campo ou header.
