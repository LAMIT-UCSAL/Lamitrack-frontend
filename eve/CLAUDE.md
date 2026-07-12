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

## Identidade visual (não negociável)

Herdada da LAMIT (liga acadêmica que originou o projeto), validada pixel a pixel contra um protótipo de alta fidelidade gerado no Figma Make.

| Token | Hex | Uso |
|---|---|---|
| Azul institucional | `#0A69C4` | Links, ícones, botões outline, elementos de destaque |
| Navy | `#0E1B27` | Texto principal, fundos escuros (banners de CTA/comunidade) |
| Cream | `#FBFAF8` | Fundo geral das páginas |
| Laranja | `#E8722C` | CTA primário único por tela |
| Cinza de borda | `#D3D1C7` | Bordas de cards, divisores |
| Cinza de texto | `#5F5E5A` | Texto secundário |
| Verde | `#2E7D32` / bg `#E8F5E9` | Estados de sucesso, badge "Gratuito" |
| Vermelho | `#C62828` | Erros de validação |

**Cores por categoria de evento** (badges, únicas 4 categorias válidas — nunca inventar novas sem atualizar `evento.model.ts`):
- Hackathon: bg `#E6F1FB` / texto `#0C447C`
- Ideathon: bg `#FFF3E0` / texto `#A04010`
- Maratona: bg `#E8F5E9` / texto `#1B5E20`
- Edital: bg `#F3E8FF` / texto `#5B21B6`

**Regras de forma:** cantos arredondados suaves (`rounded-eve-xl` = 12px em cards, `rounded-eve-lg` = 8px em controles, `rounded-eve-full` em pills). Sem gradientes ou sombras pesadas — só `box-shadow` sutil no hover de cards. Um único botão laranja (CTA primário) por tela; os demais são outline azul (`.btn-eve-outline`) ou texto simples. Tipografia sans-serif (Inter). Todos esses tokens já estão centralizados em `src/styles.scss` como classes utilitárias (`.eve-card`, `.btn-eve-primary`, `.btn-eve-outline`, `.badge-cat-*`, `.pill-filter`, etc.) — reutilize essas classes em vez de estilos inline novos.

## Telas existentes (não remover nem duplicar sem atualizar este arquivo)

| Rota | Componente | O que faz |
|---|---|---|
| `/` | `features/home` | Hero, tira de estatísticas, filtro de categorias, grid de eventos em destaque, banner de CTA |
| `/eventos` | `features/eventos/lista-eventos` | Grid completo com busca por texto + filtro de categoria |
| `/eventos/:id` | `features/eventos/detalhe-evento` | Info do evento + card de inscrição (form reativo + consentimento LGPD) → estado de ingresso confirmado com QR code SVG |
| `/comunidade` | `features/comunidade/mural` | Header escuro do evento, mural de avisos com postagem funcional, lista de participantes |
| `/organizador/dashboard` | `features/organizador/dashboard` | Cards de resumo, mini-gráfico de ocupação, métricas por evento (ocupação %, receita, comissão 5%, líquido) |
| `/organizador/checkin/:id` | `features/organizador/checkin` | Lista de participantes com toggle de check-in |
| `/institucional/privacidade` | `features/institucional/privacidade` | Política de privacidade LGPD com 7 seções numeradas |
| `/feed` | `features/feed` | Feed vertical estilo TikTok com vídeos de chamada dos eventos (scroll-snap, curtir, comentar, ordenar por engajamento) — tela imersiva, rodapé padrão oculto (ver `AppComponent.isImmersiveRoute`) |

## Estrutura de pastas

```
src/app/
├── core/
│   ├── models/       # Evento, Inscricao, Participante, Aviso, Video, ComentarioVideo
│   └── services/      # EventosService, InscricoesService, ComunidadeService, VideosService
├── shared/
│   └── components/    # navbar, evento-card
├── features/           # uma pasta por tela, ver tabela acima (inclui feed/)
└── app.routes.ts       # lazy loading de cada feature
src/assets/data/         # eventos.json, participantes.json, avisos.json, videos.json (mocks)
src/assets/video/        # clipes curtos de exemplo (domínio público) usados no /feed
src/styles.scss          # tokens de cor, classes utilitárias .eve-*
```

## Regras de fundamentos matemáticos (dashboard)

Já implementadas em `EventosService`, não recalcular na mão em componentes:
- Ocupação: `(inscritos / capacidadeTotal) * 100`
- Receita projetada: `inscritos * precoIngresso`
- Comissão da plataforma: `receitaProjetada * 0.05`
- Receita líquida: `receitaProjetada - comissao`

## LGPD

Todo formulário que coleta dados pessoais (inscrição em evento) precisa de: minimização de dados (só nome e e-mail), checkbox de consentimento explícito e obrigatório antes de submeter, e link para `/institucional/privacidade`. Não adicionar campos de dados pessoais além do estritamente necessário sem justificar.

## Backlog e sprints

O backlog completo (épicos, user stories, critérios de aceite, priorização MoSCoW e sprints mapeados aos módulos formativos da trilha) está documentado à parte — se precisar consultar user stories específicas (ex: US07, US11), peça o documento `eve-backlog-arquitetura.md` gerado durante o planejamento, ou reconstrua a lógica a partir das telas já implementadas nesta tabela.

## O que ainda falta (próximos passos conhecidos)

- Testes automatizados (o desafio não exige, mas pode ser um diferencial na apresentação)
- Publicação em GitHub Pages (exigência do desafio final — Passo 4 da Ação 1)
- Revisão de responsividade fina em telas muito pequenas (< 375px)
- Eventual integração de gráfico de biblioteca real (hoje o gráfico de ocupação do dashboard é feito em CSS puro, sem lib externa, para não adicionar dependência pesada)

## Como pedir mudanças de design

Antes de mudar cor, tipografia, ou estrutura de qualquer tela, verifique se a mudança está alinhada aos tokens desta página. Se o pedido for de uma tela nova (não listada acima), está tudo bem propor algo — mas siga os mesmos tokens de cor/forma, e depois volte para atualizar a tabela de telas e o roteamento neste arquivo.
