# Auditoria de responsivo e acessibilidade — 2026-11-03

Issue #6 · story 5.33. Build de produção na máquina local (Windows, Chromium do Playwright, sem GPU).

## Como repetir

```bash
npm run build && npm start          # em outro terminal
npm run test:a11y                   # axe-core + rolagem horizontal + alvos de toque
CHROME_PATH=... npx lighthouse@12 http://localhost:3000/ --form-factor=mobile
```

`npm run test:a11y` visita home, lista, lista vazia, detalhe, detalhe de edital e 404 em 320, 375, 768 e 1440px (24 combinações), roda o axe-core com as regras WCAG 2.2 A/AA e de boas práticas, e falha se houver problema sério ou crítico, rolagem horizontal ou alvo de toque menor que 44px.

## Resultado

| Verificação | Antes | Depois |
|---|---|---|
| axe — problemas sérios/críticos | 4 (404 sem `<title>`, nas 4 larguras) | **0** em 24 combinações |
| Rolagem horizontal (320 a 1440px) | 0 | 0 |
| Alvos de toque < 44px | 0 | 0 |
| Foco visível (Tab em todas as telas) | — | 84 elementos, **todos** com contorno |
| Lighthouse celular — home | Desempenho 72 · A11y 100 · BP 100 · SEO 100 | **Desempenho 96** · 100 · 100 · 100 |
| Lighthouse celular — detalhe | 95 · 100 · 100 · 100 | 93 · 100 · 100 · 100 |
| Lighthouse celular — lista | — | 72 a 92 (varia entre rodadas) · 100 · 100 · 100 |
| CSS principal | 233 kB (32 kB gzip) | **18 kB (5 kB gzip)** |

## O que foi corrigido

1. **Página 404/erro sem `<title>`** (sério, WCAG 2.4.2). Agora tem título na aba, kicker, mensagem clara e os caminhos "Ver eventos" e "Ir para o início".
2. **Home lenta no celular** (tempo de bloqueio 960 ms → 40 ms). A faixa Grainient do fim da página animava em WebGL desde o carregamento; agora só liga quando chega perto da tela.
3. **CSS do Bootstrap inteiro** carregado sem uso. Ficaram só variáveis, `:root` e o reset.
4. **Filete da faixa de números** passava da largura do conteúdo.

## Revisado à mão (o axe marca como "revisar")

- **Texto sobre o gradiente** (carrossel e faixa): branco e `gold` sobre a película `night` — contraste já conferido na story 5.25 (branco 17,9:1, `gold` 9,9:1 sobre `night`).
- **Links do rodapé** sobre `night`: branco 17,9:1.
- **Setas** (`→`, `←`): decorativas, `aria-hidden`.

## Decisões conscientes (não são erro da auditoria, mas ficam registradas)

- **Carrossel e marquee sem botão de pausa** (decisão do time, 2026-11-03). O carrossel para com o mouse e com o foco; o marquee desacelera no hover e para com o foco; com "reduzir movimento" os dois ficam parados. Quem usa só o mouse não tem como parar o marquee: abaixo do que pede o WCAG 2.2.2 (nível A) para movimento contínuo. Revisitar se o projeto buscar conformidade formal.
- **Globo no tablet:** com toque e tela ≥ 768px, arrastar sobre o globo gira o globo em vez de rolar a página (como no EVE).

## O que fica para depois

- **Desempenho da lista (`/eventos`) varia entre 72 e 92** entre rodadas; o custo é a hidratação do React (`entry.client`, ~800 ms com CPU 4× mais lenta e sem GPU). Medir de novo num celular real depois do deploy (#8), de preferência com Lighthouse no CI.
- **Auditoria no CI:** `npm run test:a11y` precisa de navegador instalado no CI; decisão do @devops.
- **Leitores de tela reais** (TalkBack, VoiceOver): a auditoria automática não substitui um teste com pessoas.
