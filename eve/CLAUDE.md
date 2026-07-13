# CLAUDE.md

Contexto do projeto EVE para o Claude Code. Leia este arquivo antes de qualquer tarefa neste repositório.

## O que é o projeto

**EVE — Ecossistema Virtual de Eventos.** Projeto de conclusão da trilha de Programação Front-End do programa Ford Enter. Plataforma que centraliza a descoberta de eventos de inovação em Salvador (hackathons, ideathons, maratonas de programação, editais de aceleradoras), com bilheteria digital simplificada e comunidades de networking por evento.

Entrega esperada: **protótipo de front-end completo**, apresentado a uma banca avaliadora em até 30 minutos. Funcionalidades que dependeriam de backend real (pagamento, autenticação, chat em tempo real) são **simuladas** com dados mockados — o foco é a estilização e o escopo funcional da interface, não infraestrutura de backend.

**Público-alvo:** estudantes universitários, empreendedores e apaixonados por inovação.
**Modelo de negócio:** freemium — divulgação de eventos gratuita; comissão de 5% sobre ingressos vendidos pela bilheteria própria (metade do padrão de mercado).

## Stack

Angular 18 (standalone components, sem NgModules) + TypeScript + Bootstrap 5 + SCSS. Lazy loading por feature module. Dados mockados via `HttpClient` lendo JSON de `src/assets/data/`, isolados atrás de services — arquitetura pronta para trocar por uma API real sem refatorar componentes.

Rodar o projeto: `npm install && npm start` (abre em `http://localhost:4200`).

## Design Context (impeccable)

Contexto estratégico e visual gerado pela skill `impeccable`, para manter qualquer trabalho de design/UI consistente:
- **`PRODUCT.md`** — registro (product), plataforma (web), público, propósito, posicionamento, personalidade de marca ("jovem, vibrante, comunidade") e anti-referências.
- **`DESIGN.md`** — sistema visual completo (cores, tipografia, elevação/motion, componentes, do's/don'ts), North Star "The Community Spark". Normativo pra qualquer decisão visual nova.
- **`.impeccable/design.json`** — sidecar com tokens estendidos (rampas tonais, sombras, motion, componentes HTML/CSS de referência) usado pelo modo `live`.
- **`.impeccable/live/config.json`** — já configurado pra `/impeccable live` (injeta em `src/index.html`).

Leia `DESIGN.md` antes de mudanças visuais; ele complementa (não substitui) a seção "Identidade visual" abaixo, que continua sendo a referência pixel-a-pixel validada contra o Figma.

## Identidade visual (não negociável)

Herdada da LAMIT (liga acadêmica que originou o projeto), validada pixel a pixel contra um protótipo de alta fidelidade gerado no Figma Make.

| Token | Hex | Uso |
|---|---|---|
| Azul institucional | `#0A69C4` | Links, ícones, botões outline, elementos de destaque |
| Navy | `#0E1B27` | Texto principal, fundos escuros (banners de CTA/comunidade) |
| Cream | `#FBFAF8` | Fundo geral das páginas |
| Laranja | `#E8722C` | CTA primário único por tela — texto branco. **Nota de acessibilidade:** branco sobre esse laranja mede 3.1:1, abaixo do mínimo de 4.5:1 do WCAG AA (achado real do `/impeccable critique`); a alternativa de maior contraste (texto navy, 5.7:1) foi testada e depois revertida por escolha explícita do usuário. |
| Cinza de borda | `#D3D1C7` | Bordas de cards, divisores |
| Cinza de texto | `#5F5E5A` | Texto secundário |
| Verde | `#2E7D32` / bg `#E8F5E9` | Estados de sucesso, badge "Gratuito" |
| Vermelho | `#C62828` | Erros de validação |

**Cores por categoria de evento** (badges, únicas 5 categorias válidas — nunca inventar novas sem atualizar `evento.model.ts`, o pipe `CategoriaBadgeClassPipe` e a classe `.badge-cat-*` correspondente em `styles.scss`):
- Hackathon: bg `#E6F1FB` / texto `#0C447C`
- Ideathon: bg `#FFF3E0` / texto `#A04010`
- Maratona: bg `#E8F5E9` / texto `#1B5E20`
- Edital: bg `#F3E8FF` / texto `#5B21B6`
- Eventos de Inovação: bg `#FCE4EC` / texto `#AD1457`

**Regras de forma:** cantos arredondados suaves (`rounded-eve-xl` = 12px em cards, `rounded-eve-lg` = 8px em controles, `rounded-eve-full` em pills). Sem gradientes ou sombras pesadas — só `box-shadow` sutil no hover de cards. Um único botão laranja (CTA primário) por tela; os demais são outline azul (`.btn-eve-outline`) ou texto simples. Tipografia sans-serif (Inter). Todos esses tokens já estão centralizados em `src/styles.scss` como classes utilitárias (`.eve-card`, `.btn-eve-primary`, `.btn-eve-outline`, `.badge-cat-*`, `.pill-filter`, etc.) — reutilize essas classes em vez de estilos inline novos.

## Telas existentes (não remover nem duplicar sem atualizar este arquivo)

| Rota | Componente | O que faz |
|---|---|---|
| `/` | `features/home` | Hero (com estatísticas inline abaixo dos CTAs, calculadas a partir dos dados reais via `EventosService`/`ComunidadeService` — nunca hardcoded, ver nota abaixo), filtro de categorias, grid de eventos em destaque, faixa de logos de parceiros em looping horizontal (puro CSS, sem lib), banner informativo pra organizadores (sem botão — ver seção de autenticação) |
| `/eventos` | `features/eventos/lista-eventos` | Carrossel de "últimos eventos" (auto-avança a cada 4s, ver `shared/components/carrossel-eventos`) + grid completo com busca por texto e filtro de categoria |
| `/eventos/:id` | `features/eventos/detalhe-evento` | Info do evento + card de inscrição (form reativo + consentimento LGPD) → estado de ingresso confirmado com QR code SVG |
| `/comunidade` | `features/comunidade/mural` | Header escuro do evento, mural de avisos com postagem funcional, lista de participantes — protegida por `autenticadoGuard` (qualquer papel logado) |
| `/organizador/dashboard` | `features/organizador/dashboard` | Cards de resumo, mini-gráfico de ocupação, métricas por evento (ocupação %, receita, comissão 5%, líquido), botão "Criar evento" (modal com upload de banner) e botão "Excluir" por card — ambos persistidos via `EventosService`/`localStorage` e refletidos em `/`, `/eventos` e `/eventos/:id` (ver seção "Gerenciamento de eventos" abaixo) — protegida por `organizadorGuard` |
| `/organizador/checkin/:id` | `features/organizador/checkin` | Lista de participantes com toggle de check-in — protegida por `organizadorGuard` |
| `/institucional/privacidade` | `features/institucional/privacidade` | Política de privacidade LGPD com 7 seções numeradas |
| `/feed` | `features/feed` | Feed vertical estilo TikTok com vídeos de chamada dos eventos (scroll-snap, curtir, comentar, ordenar por engajamento) — tela imersiva, rodapé padrão oculto (ver `AppComponent.isImmersiveRoute`) |
| `/entrar` | `features/auth/entrar` | Login por e-mail + senha, validado contra as contas cadastradas no `localStorage` (mock, sem backend) — erro se não bater; redireciona via `redirectTo` ou pro destino padrão do papel da conta |
| `/cadastro` | `features/auth/cadastro` | Cria conta (nome, e-mail, senha, papel participante/organizador), bloqueia e-mail duplicado, loga automaticamente após cadastrar |

## Estrutura de pastas

```
src/app/
├── core/
│   ├── models/       # Evento, Inscricao, Participante, Aviso, Video, ComentarioVideo, UsuarioLogado/ContaCadastrada (com TipoUsuario)
│   ├── services/      # EventosService, InscricoesService, ComunidadeService, VideosService, AuthService
│   └── guards/         # organizadorGuard (protege /organizador/*, exige tipo === 'organizador'), autenticadoGuard (protege /comunidade, qualquer papel)
├── shared/
│   ├── components/    # navbar, evento-card, carrossel-eventos
│   └── pipes/          # CategoriaBadgeClassPipe (categoria -> classe .badge-cat-* segura para CSS)
├── features/           # uma pasta por tela, ver tabela acima (inclui feed/)
└── app.routes.ts       # lazy loading de cada feature
src/assets/data/         # eventos.json, participantes.json, avisos.json, videos.json (mocks)
src/assets/video/        # clipes curtos de exemplo (domínio público) usados no /feed
src/assets/img/           # inclui logos de parceiros (GDG Salvador, GDG Lauro, NXOS, SCUPP, Stem, Rádio, Red Bull, Rocketseat) usados na faixa deslizante da home
src/styles.scss          # tokens de cor, classes utilitárias .eve-*
```

## Regras de fundamentos matemáticos (dashboard)

Já implementadas em `EventosService`, não recalcular na mão em componentes:
- Ocupação: `(inscritos / capacidadeTotal) * 100`
- Receita projetada: `inscritos * precoIngresso`
- Comissão da plataforma: `receitaProjetada * 0.05`
- Receita líquida: `receitaProjetada - comissao`

## Estatísticas da home (`/`)

Os números são **sempre calculados a partir dos dados mockados**, nunca hardcoded — regra fixada depois de um bug em que os 4 números (18 eventos, 1.053 inscrições, 12 organizadores, 18 comunidades) eram valores inventados que não batiam com o resto do app. Hoje, `HomeComponent.ngOnInit` combina `EventosService.listar()` + `ComunidadeService.listarParticipantes()` via `combineLatest` e deriva: eventos ativos = `eventos.length`; inscrições realizadas = soma de `inscritos` de todos os eventos; organizadores parceiros = `organizador` distintos entre os eventos; comunidades ativas = `eventoId` distintos em `participantes.json`. **Limitação conhecida:** hoje só `participantes.json` do evento 1 está populado (a tela `/comunidade` é única e genérica, não filtrada por evento), então "Comunidades ativas" mostra 1 — número correto dado o estado atual dos dados, mas baixo; se popular `participantes.json` com mais `eventoId`s no futuro, o número sobe automaticamente sem tocar no componente.

Visualmente, os 4 números **não** ficam numa tira/strip separada abaixo do hero — isso foi removido depois de um `/impeccable critique` apontar que era o "hero-metric template" que o próprio `DESIGN.md` bane por nome. Hoje ficam em pares número+rótulo alinhados pela base, logo abaixo dos botões do hero, mas **fora** da coluna estreita de 620px (só o texto do hero — badge/título/parágrafo/botões — fica limitado a 620px; os números ficam num bloco de largura total da tela, irmão daquela coluna dentro da mesma `<section>`). Como 4 pares não cabem numa linha sem quebrar ou encolher a fonte (principalmente no mobile), eles deslizam continuamente num carrossel horizontal de ponta a ponta (`.stats-marquee-viewport`/`.stats-track` em `home.component.scss`) — mesma técnica do carrossel de logos de parceiros (lista duplicada com `margin-right` uniforme pra o loop de `-50%` fechar sem salto, `mask-image` nas bordas, sem pausar no hover, respeitando `prefers-reduced-motion`).

O banner "Organize seu evento com a EVE" segue o mesmo princípio: a `<section>` em si ocupa a largura total da tela (só com as margens `mx-3 mx-md-4` do cartão arredondado), e um `<div style="max-width: 620px">` interno limita só o texto pra manter a linha de leitura confortável (~61 caracteres/linha) sem encolher o card inteiro.

## LGPD

Todo formulário que coleta dados pessoais (inscrição em evento) precisa de: minimização de dados (só nome e e-mail), checkbox de consentimento explícito e obrigatório antes de submeter, e link para `/institucional/privacidade`. Não adicionar campos de dados pessoais além do estritamente necessário sem justificar.

## Autenticação (mockada, com papéis)

Sem backend real, então `AuthService` guarda tudo em `localStorage` com **duas chaves separadas**: `eve_auth_contas` (array de `ContaCadastrada` — nome, e-mail, senha em texto puro, papel; criado em `/cadastro`) e `eve_auth_usuario` (a sessão atual — só nome/e-mail/papel, sem senha). `/entrar` valida e-mail+senha contra `eve_auth_contas`; se não bater, mostra erro e não loga. Cadastro em `/cadastro` bloqueia e-mail duplicado (`AuthService.emailJaCadastrado`) e loga automaticamente após criar a conta. O papel (`TipoUsuario`: `participante` | `organizador`) é escolhido só no cadastro (dois botões estilo `.pill-filter`) — no login não se escolhe papel, ele vem da conta.

`organizadorGuard` (`CanActivateFn`) protege `/organizador/dashboard` e `/organizador/checkin/:id` em duas etapas: não autenticado → redireciona para `/entrar?redirectTo=<rota original>`; autenticado mas com papel `participante` → redireciona pra home (`/`) — só `organizador` passa. `autenticadoGuard` protege `/comunidade` de forma mais simples — qualquer papel autenticado passa, senão redireciona pra `/entrar?redirectTo=/comunidade`. As páginas de login/cadastro leem `redirectTo` e voltam pra rota pretendida após autenticar; sem esse parâmetro, o destino padrão depende do papel da conta (`organizador` → `/organizador/dashboard`, `participante` → `/`).

O botão "Para organizadores" do hero da home (`HomeComponent.irParaOrganizadores`) navega para `/organizador/dashboard` — o `organizadorGuard` cuida do resto (login se deslogado, nega e volta pra home se for participante). Esse botão fica oculto quando logado como `participante` (mesma regra do link "Painel" do navbar). O `CadastroComponent` também aceita um query param `?tipo=organizador` (usado por outros fluxos de redirecionamento) que pré-seleciona o pill "Organizador" no formulário e mostra um aviso contextual.

O banner de CTA escuro da home ("Organize seu evento com a EVE") é só informativo, **sem botão** — removido depois de uma crítica de design (`/impeccable critique`) apontar que ele criava um segundo CTA laranja competindo com "Explorar eventos" na mesma tela, violando a regra de "um único Spark Orange por tela" do `DESIGN.md`. O acesso a "criar evento" pra quem está na home continua só pelo botão "Para organizadores" do hero e pelo link "Painel" do navbar.

## Gerenciamento de eventos (criar/excluir, persistido)

Diferente da V2 inicial (onde "Criar evento" era só uma representação visual local ao dashboard), `EventosService` agora é a **única fonte de verdade** para a lista de eventos em todo o app, combinando o `eventos.json` estático com o estado local salvo no `localStorage`:
- `eve_eventos_criados` — array de `Evento` completos criados via o modal do painel do organizador.
- `eve_eventos_removidos` — array de ids ocultados (funciona tanto pra eventos do `eventos.json` quanto pra eventos criados).

`EventosService.listar()` sempre busca o JSON base e mescla com esse estado local (`criados` na frente, menos os `removidos`) antes de emitir — por isso um evento criado ou excluído no painel aparece/desaparece automaticamente em `/`, `/eventos`, `/eventos/:id` e no carrossel da home, sem precisar sincronizar nada manualmente em cada componente (todos já chamam `listar()` no próprio `ngOnInit`). `EventosService.criar(evento)` grava em `eve_eventos_criados`; `EventosService.remover(id)` grava o id em `eve_eventos_removidos` e também tira o evento de `eve_eventos_criados` se for o caso (evita lixo acumulado pra eventos criados-e-depois-excluídos).

No modal de criação (`DashboardComponent`), o campo "Banner do evento" é um `<input type="file" accept="image/*">` lido via `FileReader.readAsDataURL` — a imagem vira uma data URL guardada direto no campo `imagemUrl` do evento (sem upload/backend real). Limite de 2MB por arquivo (senão estoura o `localStorage`); sem banner selecionado, cai no placeholder padrão (`assets/img/abertura-lamit.png`).

Cada card do painel tem um botão "Excluir" (com `window.confirm` antes de remover) que chama `EventosService.remover` e recarrega a lista — essa exclusão é **global**: remove o evento de todas as telas do sistema, não só do painel, já que não existe modelo de "dono do evento" separado por conta de organizador (todas as contas organizador compartilham o mesmo catálogo mockado).

**Interações que exigem login** (além das rotas protegidas por guard acima): curtir e comentar no `/feed` (`FeedComponent.exigirLogin()` redireciona via `Router.navigate` antes de aplicar a ação — ver comentários continua público, só curtir/postar exige sessão) e se inscrever em um evento em `/eventos/:id` (o formulário de inscrição só renderiza se `estaAutenticado`; deslogado, mostra um CTA "Entrar para se inscrever" no lugar — a página do evento em si continua pública). Quando autenticado, o formulário de inscrição já vem com nome/e-mail pré-preenchidos a partir da sessão.

O navbar reflete o estado lendo `AuthService.usuarioAtual` diretamente (sem observable/async pipe, já que a app roda com change detection padrão do zone.js): mostra nome + papel + "Sair" quando logado, ou "Entrar" quando não. **O link "Painel" (desktop e mobile) fica oculto quando logado como `participante`** — continua visível pra visitante anônimo e pra quem está logado como `organizador`.

## Backlog e sprints

O backlog completo (épicos, user stories, critérios de aceite, priorização MoSCoW e sprints mapeados aos módulos formativos da trilha) está documentado à parte — se precisar consultar user stories específicas (ex: US07, US11), peça o documento `eve-backlog-arquitetura.md` gerado durante o planejamento, ou reconstrua a lógica a partir das telas já implementadas nesta tabela.

## O que ainda falta (próximos passos conhecidos)

- ~~Testes automatizados~~ — feito: 57 testes (`core/services`, `core/guards`, `features/auth`, `features/eventos/detalhe-evento`, `features/feed`, `features/organizador/dashboard`, `shared/components/carrossel-eventos`).
- Publicação — decisão trocada de GitHub Pages para **Netlify** (`netlify.toml` já configurado na raiz do repo). Falta só o passo manual de conectar o repositório pela interface da Netlify.
- ~~Revisão de responsividade fina em telas muito pequenas (< 375px)~~ — testada e corrigida em várias telas ao longo do desenvolvimento (mural, feed, navbar mobile).
- Eventual integração de gráfico de biblioteca real (hoje o gráfico de ocupação do dashboard é feito em CSS puro, sem lib externa, para não adicionar dependência pesada) — decisão consciente, não é uma falha.
- **Limitação de dados conhecida e aceita:** nenhum dos 5 eventos mockados atuais usa as categorias "Hackathon" ou "Ideathon" (todos foram substituídos por eventos reais da LAMIT: "Eventos de Inovação", "Maratona", "Edital"). Os pills de filtro dessas duas categorias continuam existindo na UI, mas retornam lista vazia — mantido assim por decisão do time, não corrigir sem pedido explícito.

## Audit técnico (`/impeccable audit`, app inteiro)

Rodado uma vez no app inteiro (10 telas, 3 sub-agentes paralelos): nota **14/20**. Corrigido depois via `harden`→`adapt`→`optimize`→`document`→`polish`:
- **Harden:** modal "Criar evento" agora move foco, prende Tab e fecha com Escape; labels de formulário associadas via `id`/`for` em `/entrar`, `/cadastro` e no modal; heading hierarchy corrigida em `/eventos`; foco visível no hamburguer mobile (único elemento sem anel de foco no app); `text-shadow` de reforço na legenda do feed.
- **Adapt:** alvos de toque `min-height: 44px` via `@media (pointer: coarse)` (só afeta touch, não mexe na densidade do mouse) em botões/pills/hamburguer/fechar-modal; setas do carrossel 44×44; dots do carrossel e curtir/comentar do feed com área de toque invisível maior sem mudar o visual; overflow horizontal de 24px no dashboard mobile corrigido (gráfico de ocupação agora rola dentro do próprio card).
- **Optimize:** as 5 imagens de evento (`abertura-lamit.png`, `imersao-lamit.jpg`, `codeBa.png`, `aceleraSalvador.png`, `ford-day-sympla.jpg`) redimensionadas pra 1280px máx + recompressão — de ~8.6MB total pra ~1.6MB (~81% menor), sem perda visível.
- **Document:** `DESIGN.md` ganhou os tokens "Online Green" (`#4ADE80`, status conectado no mural) e "Feed Black" (`#000000`, fundo do player imersivo) e uma nota sobre a escala tipográfica compacta (avatares/legendas/ícones) que já existia no código mas não estava registrada.

**Decisão consciente do usuário, não revertida pelo audit:** contraste do texto branco sobre laranja (`#E8722C`) nos botões primários mede 3.05:1, abaixo do mínimo 4.5:1 do WCAG AA — usuário testou a alternativa de maior contraste (texto navy, 5.7:1) e pediu explicitamente pra voltar ao branco. Ver nota na tabela de identidade visual acima.

## Como pedir mudanças de design

Antes de mudar cor, tipografia, ou estrutura de qualquer tela, verifique se a mudança está alinhada aos tokens desta página. Se o pedido for de uma tela nova (não listada acima), está tudo bem propor algo — mas siga os mesmos tokens de cor/forma, e depois volte para atualizar a tabela de telas e o roteamento neste arquivo.
