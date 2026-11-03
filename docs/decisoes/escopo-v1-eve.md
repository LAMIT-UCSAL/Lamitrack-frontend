# O que do EVE não entra no LamiTrack V1

**Issue:** [#19](https://github.com/LAMIT-UCSAL/Lamitrack-frontend/issues/19) · **Status:** rascunho, aguardando confirmação do time · **Data:** 2026-11-03

O LamiTrack nasceu do porte do protótipo EVE (pasta `eve/`), mas é outro produto. A seção 6 do documento de requisitos diz: *"Não fazem parte do escopo da primeira versão do LamiTrack um marketplace, chat em tempo real, comunidade por evento, feed ou aplicativo mobile."* Este documento registra, tela por tela, o que do EVE fica de fora, para ninguém portar por engano.

A pasta `eve/` continua valendo como referência de **estrutura, telas e fluxos** das partes que entram. Para identidade visual, vale o [DESIGN.md](../../DESIGN.md).

## Decisão: não portar os 6 itens da checklist

| Item do EVE | Decisão | Por quê | Situação no código (2026-11-03) |
|---|---|---|---|
| `/feed` (vídeos verticais, curtir, comentar) | Não portar | Feed está fora do escopo da V1 | Não existe rota, link nem serviço de vídeo |
| `/comunidade` (mural do evento, participantes) | Não portar | Comunidade por evento está fora do escopo | Não existe rota nem link. A palavra "comunidade" aparece só em textos da LAMIT (rodapé, parceiros) |
| Bilheteria (formulário de inscrição, QR code, comissão de 5%, dashboard financeiro) | Não portar | Seria um marketplace. O RF06 só pede o link de inscrição original | O detalhe do evento tem um botão para o `registrationUrl` da fonte ("A inscrição é feita no site do organizador.") |
| `/organizador/checkin` | Não portar | Depende da bilheteria | Não existe |
| Criar e excluir evento pelo painel | Não portar | Os eventos chegam por scraping. O cadastro manual da diretoria fica no back office do repositório back-end (tarefa #17), não no site público | Não existe painel nem link "Para organizadores" |
| Login com papéis (`/entrar`, `/cadastro`, guards) | Não portar | Sem as telas acima, nada no site público exige login. O back office, que exige, fica no back-end | Não existe login nem botão "Entrar" |

## Campos do EVE que o Evento do LamiTrack não tem

O Evento do back-end (`EventResponse`) tem título, descrição, data e hora, local, cidade/UF, coordenadas, link de inscrição, fonte, banner e tags. Os campos da bilheteria do EVE ficaram de fora:

| Campo do EVE | Decisão | Como ficou |
|---|---|---|
| Inscritos, capacidade, ocupação % | Removido | O card e o detalhe não mostram nada disso |
| Preço do ingresso ("Gratuito", "R$ …") | Removido | Volta só se o back-end passar a trazer preço |
| Organizador | Trocado pela fonte | O detalhe mostra de onde o evento veio (ex.: Sympla) |
| Estatísticas da home (inscrições, organizadores, comunidades) | Trocadas | A home mostra o total de eventos e o total por categoria, calculados da API |

## Perguntas que estavam abertas

1. **Categoria × tags.** *Resolvida.* Pelo [catálogo de fontes do back-end](https://github.com/LAMIT-UCSAL/Lamitrack-backend/blob/main/docs/fontes.md) (decisão de 2026-11-03), só entram eventos das 5 categorias, e o scraper grava uma tag com o nome exato da categoria: `Hackathon`, `Ideathon`, `Maratona`, `Edital` ou `Eventos de Inovação`. O front lê a categoria das tags e a mostra como rótulo de meta em `gold-ink`, sem cor por categoria.
2. **Página de privacidade** (`/institucional/privacidade`). *Proposta: não portar agora.* No EVE ela existia por causa do formulário de inscrição (LGPD). O LamiTrack V1 não coleta dado pessoal: não tem formulário, login, cookie nem analytics. Se o deploy (#8) ligar alguma métrica de acesso, a página volta como issue própria, com o texto curto do que for coletado.

## Como confirmar

Quem concordar, marque a checklist da issue #19. Quem discordar de algum item, comente lá ou abra uma issue própria explicando por que portar, como a issue pede. Com a confirmação, este documento passa a **decidido** e a issue é fechada.
