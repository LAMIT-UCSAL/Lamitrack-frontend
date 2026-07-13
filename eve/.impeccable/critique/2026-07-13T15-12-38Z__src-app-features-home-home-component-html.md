---
target: Home (/)
total_score: 31
p0_count: 2
p1_count: 3
timestamp: 2026-07-13T15-12-38Z
slug: src-app-features-home-home-component-html
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No loading state for stats on slow connections (low risk, mocked data) |
| 2 | Match System / Real World | 4 | Portuguese copy and category terms match the target audience's vocabulary |
| 3 | User Control and Freedom | 3 | Nothing destructive on this page to flag |
| 4 | Consistency and Standards | 2 | Hero eyebrow pill reuses the Hackathon-Blue category color pair for a non-category tag |
| 5 | Error Prevention | 4 | Empty-category state reads calmly, no destructive actions |
| 6 | Recognition Rather Than Recall | 4 | Category pills always visible with active state |
| 7 | Flexibility and Efficiency | 3 | No search on home itself (lives on /eventos) — acceptable for a landing page |
| 8 | Aesthetic and Minimalist Design | 3 | Clean overall, undercut by two banned scaffolding patterns (see below) |
| 9 | Error Recovery | 3 | Only soft "error" state (empty filter) is handled gracefully |
| 10 | Help and Documentation | 2 | No help affordances beyond a footer privacy link |
| **Total** | | **31/40** | **Good — solid foundation, concrete fixable gaps** |

## Anti-Patterns Verdict

**LLM assessment:** Two explicit self-violations of this project's own DESIGN.md Don'ts, both shipped without an apparent check against the file that bans them:
- `PARCEIROS QUE APOIAM O ECOSSISTEMA EVE` above the partner marquee is a textbook "tiny uppercase tracked eyebrow" — the exact pattern DESIGN.md names and bans.
- The four-number stats strip under the hero is structurally the "hero-metric template" DESIGN.md also names as a rejected SaaS cliché. The *numbers* are legitimately derived from real mock data (never hardcoded, per CLAUDE.md) — the *scaffolding* around them is the generic part.
- Two `.btn-eve-primary` (Spark Orange) buttons appear on the same screen ("Explorar eventos" in the hero, "Criar evento" in the dark CTA banner), breaking DESIGN.md's own "One Spark Rule."

**Deterministic scan:** CLI `detect.mjs` on `home.component.html` returned 2 findings, both **false positives** — `broken-image` on `[src]="p.logo"` bindings in the partner marquee. Confirmed against `home.component.ts`: `parceiros` is a real array, all 8 referenced SVGs exist on disk. The static parser can't evaluate Angular property bindings and pattern-matches them like an empty literal `src=""`.

Live browser-overlay scan (`detect.js` injected into the running page) found 5 additional findings the CLI scan didn't (it only reads markup, not rendered/computed state):
- **low-contrast** (×2): white text on Spark Orange `#E8722C` measures **3.1:1**, below the 4.5:1 AA minimum for normal-weight ~14px text. This lands on the exact two buttons the LLM review flagged for the "two orange CTAs" hierarchy problem — same two elements, two independently-confirmed problems (hierarchy AND accessibility).
- **all-caps-body**: uppercase text-transform on 38 characters of body text — this is the same partner-marquee eyebrow label the LLM review caught independently. Strong convergence between the two assessments.
- **line-length**: ~109 characters/line — the CTA banner paragraph ("Bilheteria digital, comunidade de participantes...") has no width constraint and runs far past DESIGN.md's own documented 65–75ch cap for body text.
- **overused-font** / **single-font**: Inter at 100% — pre-existing, validated brand identity from before this DESIGN.md existed, not new drift. Not actionable.

## Overall Impression

The page has a genuinely well-crafted interaction layer — hover-lift, the partner marquee's motion and reduced-motion handling, the empty-category state — sitting on top of a handful of self-inflicted violations of the project's *own*, just-written DESIGN.md, plus one real pre-existing accessibility bug that reaches beyond this page (the primary button's contrast affects every `.btn-eve-primary` sitewide). The single biggest opportunity: fix the "One Spark Rule" violation and the contrast bug on the same two buttons, then clean up the two banned scaffolding patterns that both assessments converged on independently.

## What's Working

1. **Card hover-lift** (`evento-card.component.html`, `.eve-card-hover`) — verified via before/after screenshot: cards visibly rise with a deepened shadow on hover, exactly matching DESIGN.md's `hover-lift` token (translateY(-3px), 225ms ease-out-quart).
2. **Partner marquee** (`home.component.scss`) — continuous, ambient, edge-masked with a gradient fade, correct `aria-hidden` on the duplicated loop set, and a `prefers-reduced-motion` fallback. Careful craft on a component many teams get sloppy with.
3. **Empty-category state** ("Nenhum evento encontrado para esta categoria.") — calm, centered, non-alarming copy instead of a blank grid or an error-toned message.

## Priority Issues

**[P0] `.btn-eve-primary` fails WCAG AA contrast sitewide**
Why it matters: white text on Spark Orange measures 3.1:1 against the required 4.5:1 for this text size/weight — a real accessibility failure on the app's single most-used interactive element, not just this page.
Fix: darken the orange used behind white text (or switch to a dark-ink text color on the current orange), verified to ≥4.5:1, applied at the token level so every primary button sitewide inherits the fix.
Suggested command: `/impeccable audit`

**[P0] Two Spark-Orange CTAs compete on one screen**
Why it matters: breaks DESIGN.md's own "One Spark Rule" ("if a screen has two orange elements, one must change") and leaves a first-time visitor with no clear signal of which action is actually theirs — "Criar evento" reads as equally important as "Explorar eventos" to a participant who isn't an organizer.
Fix: demote the CTA banner's "Criar evento" to `.btn-eve-outline` — it already sits in a high-contrast dark navy section and doesn't need orange to stand out. Reserve Spark Orange exclusively for "Explorar eventos" on this page.
Suggested command: `/impeccable colorize`

**[P1] Banned uppercase-tracked eyebrow label**
Why it matters: `PARCEIROS QUE APOIAM O ECOSSISTEMA EVE` is the exact "tiny uppercase tracked eyebrow" pattern DESIGN.md names and bans — confirmed independently by both the design review and the deterministic detector's `all-caps-body` finding.
Fix: drop the uppercase/letter-spacing treatment; use a normal-case Body or Label-weight line consistent with the rest of the type system.
Suggested command: `/impeccable typeset`

**[P1] Stats strip reads as the banned "hero-metric template"**
Why it matters: DESIGN.md explicitly rejects this exact generic pattern even though the underlying data is legitimately derived (never hardcoded). The data integrity is right; the visual scaffolding is the generic part.
Fix: integrate the stats into a less "stock landing page" layout — vary sizing, pair each stat with something visually EVE-specific, or fold into the hero composition instead of a boxed strip.
Suggested command: `/impeccable adapt`

**[P1] CTA banner paragraph overruns line-length**
Why it matters: ~109 characters/line, detector-confirmed, versus DESIGN.md's own documented 65–75ch cap for body text — the same rule this project wrote for itself.
Fix: constrain the CTA banner's text column with a max-width (e.g. ~65ch) instead of letting it span the full flex container.
Suggested command: `/impeccable layout`

**[P2] Hero eyebrow pill reuses a category color**
Why it matters: the "Salvador, Bahia · Ecossistema de Inovação" pill uses the exact Hackathon-Blue bg/text pair. DESIGN.md states category-tag colors are "functional tags, not decoration" — reusing the pair elsewhere teaches users the wrong association before they even reach the event cards.
Fix: give the hero eyebrow a neutral treatment (e.g. Warm-Stone border + Campus Blue text) distinct from the five category pairs.
Suggested command: `/impeccable colorize`

**[P3] Mobile stats labels shrink to ~10px**
Why it matters: below comfortable minimum caption size; four stats forced into one row on a 375px screen get cramped, especially "Organizadores parceiros."
Fix: consider a 2×2 grid at the smallest breakpoint instead of forcing a single row.
Suggested command: `/impeccable layout`

## Persona Red Flags

**Jordan (confused first-timer)**
- Sees the blue hero eyebrow pill, then later sees similarly-colored category badges on event cards — may momentarily read the hero badge as a filter or category rather than a location tag.
- The hero copy says "Hackathons, ideathons..." but the "Hackathon" and "Ideathon" filter pills return empty on every load (known, accepted data limitation) — Jordan takes the hero copy at face value, clicks the term just used to sell the product, and hits nothing.
- With two identically-styled orange buttons, nothing visually signals "Criar evento" is an organizer-only action — no cue that "this one's not for you."

**Casey (distracted mobile user, thumb-only, interrupted)**
- On mobile, the cramped stats row sits between the hero and the actual event cards — pure scroll-cost with no scannable value for someone trying to just find an event fast.
- Category pills + "Todos" push the real content (event grid) further down the mobile scroll before Casey reaches anything actionable.
- Nothing on any card signals urgency ("poucas vagas," "inscrições encerram em breve") — if Casey gets pulled away mid-scroll, there's no visual hook pulling them back to a specific card.

## Minor Observations

- Event card title has no line-clamp; current mock titles are short, but a longer organizer-submitted title (now possible since event creation persists) has nothing preventing 3–4 line wrap and uneven card heights across the grid.
- Focus-ring CSS (`:focus-visible` + Campus Blue glow) is correctly implemented in `styles.scss` for buttons — not visually re-verified via live keyboard tab in this pass, but present in source.
- Price/status badges sit on top of busy banner artwork but have their own solid-fill background, so legibility holds regardless of the image underneath.
- The event card is fully clickable via `routerLink` on the wrapping `<article>` *and* contains its own "Ver detalhes" button — a slightly redundant tap target, low severity.
- Both `broken-image` detector findings on the partner marquee are false positives (static analysis can't evaluate Angular property bindings); no action needed.

## Questions to Consider

1. DESIGN.md explicitly bans "hero-metric templates" and "uppercase tracked eyebrows" by name — was the home page checked against its own Don'ts list before being called done?
2. Is "Criar evento" really the second-most-important action for a page whose primary persona is a participant scanning for events — or would the organizer CTA be better placed off the participant-facing home page entirely?
3. Given "Hackathon" and "Ideathon" reliably return empty everywhere, and the hero copy uses those exact words to sell the product — what happens to a banca evaluator's trust in the "real data, never hardcoded" principle the moment they click one of those pills?
