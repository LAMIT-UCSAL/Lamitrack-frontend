---
name: EVE — Ecossistema Virtual de Eventos
description: Plataforma de descoberta de eventos de inovação em Salvador, com bilheteria digital e comunidades por evento
colors:
  spark-orange: "#E8722C"
  campus-blue: "#0A69C4"
  deep-campus-blue: "#0C447C"
  ink-navy: "#0E1B27"
  warm-paper: "#FBFAF8"
  warm-stone: "#D3D1C7"
  soft-ink: "#5F5E5A"
  confirmation-green: "#2E7D32"
  confirmation-green-bg: "#E8F5E9"
  confirmation-green-deep: "#1B5E20"
  alert-red: "#C62828"
  mist-blue: "#A8B5C2"
  online-green: "#4ADE80"
  feed-black: "#000000"
  hackathon-blue-bg: "#E6F1FB"
  hackathon-blue-text: "#0C447C"
  ideathon-amber-bg: "#FFF3E0"
  ideathon-amber-text: "#A04010"
  maratona-green-bg: "#E8F5E9"
  maratona-green-text: "#1B5E20"
  edital-violet-bg: "#F3E8FF"
  edital-violet-text: "#5B21B6"
  inovacao-pink-bg: "#FCE4EC"
  inovacao-pink-text: "#AD1457"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  lg: "8px"
  xl: "12px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.spark-orange}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "10px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.campus-blue}"
    rounded: "{rounded.lg}"
    padding: "10px 24px"
  button-outline-hover:
    backgroundColor: "{colors.campus-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
  pill-filter:
    backgroundColor: "transparent"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  pill-filter-active:
    backgroundColor: "{colors.campus-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xl}"
    padding: "16px"
  card-hover:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xl}"
  badge-category:
    backgroundColor: "{colors.hackathon-blue-bg}"
    textColor: "{colors.hackathon-blue-text}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  progress-fill:
    backgroundColor: "{colors.campus-blue}"
    rounded: "{rounded.full}"
---

# Design System: EVE — Ecossistema Virtual de Eventos

## 1. Overview

**Creative North Star: "The Community Spark"**

EVE stands on a calm institutional canvas — warm paper, ink navy, soft stone borders — inherited from LAMIT, the academic league that originated the project. Against that canvas, one spark of color per screen (Spark Orange) marks the single action that matters, and five category colors (hackathon blue, ideathon amber, maratona green, edital violet, inovação pink) tag events like pins on a campus bulletin board. The feeling is calm on the outside, vibrant in the details: an institution you trust, animated by the energy of the community events it hosts.

This system explicitly rejects looking like a bureaucratic or dated institutional system — no dense forms, no gray-on-gray officialdom — and rejects generic corporate SaaS clichés (gradients, identical card grids, hero-metric templates). It does not need to chase external references for its palette or type; the identity validated against the original Figma prototype is the anchor, not a starting point to reinvent.

Depth and motion are now a deliberate part of that spark, not an afterthought: surfaces lift and deepen on interaction, grids reveal with a soft staggered entrance, and the whole system reads as alive rather than static — see **Elevation** below. Every one of these movements stays purposeful; nothing moves just to prove it can.

**Key Characteristics:**
- Calm warm-neutral base (paper, navy, stone) that never competes with the one accent doing the talking
- Exactly one Spark Orange call-to-action per screen — its rarity is what makes it read as "the thing to do here"
- Five named category colors used as functional tags, not decoration
- Soft, layered depth: ambient shadows at rest, deeper lift on hover/focus, animated rather than instant
- Motion with intent: staggered entrances, eased lifts, never a bounce, always a reduced-motion fallback

## 2. Colors

The palette reads as one calm institutional base carrying a small number of deliberate, functional accents — never more than one accent color driving action on a given screen.

### Primary
- **Spark Orange** (#E8722C): the single primary call-to-action color. Exactly one per screen — "Explorar eventos", "Criar evento", "Confirmar inscrição". Its scarcity is the point; if two elements compete for Spark Orange, one of them is wrong.

### Secondary
- **Campus Blue** (#0A69C4): links, icons, outline-button borders/text, active filter pills, progress fill. The everyday interactive color — present almost everywhere a click is possible, but never shouting.
- **Deep Campus Blue** (#0C447C): the darker step of Campus Blue, used as the text color inside the Hackathon Blue category tag and anywhere Campus Blue needs to sit on a light tinted background at readable contrast.

### Tertiary — Category Tags
A five-color qualitative set, one per event category. Always paired background+text, always at the same pill shape — the color is the only thing that changes.
- **Hackathon Blue** (bg #E6F1FB / text #0C447C)
- **Ideathon Amber** (bg #FFF3E0 / text #A04010)
- **Maratona Green** (bg #E8F5E9 / text #1B5E20)
- **Edital Violet** (bg #F3E8FF / text #5B21B6)
- **Inovação Pink** (bg #FCE4EC / text #AD1457)

### Neutral
- **Warm Paper** (#FBFAF8): the body background everywhere. Warm without tipping into the generic cream/sand AI default — it is the LAMIT-inherited canvas, not a trend follow.
- **Ink Navy** (#0E1B27): primary text color, and the fill for the dark CTA banner ("Organize seu evento com a EVE") and the community mural's dark header.
- **Warm Stone** (#D3D1C7): borders, dividers, card outlines.
- **Soft Ink** (#5F5E5A): secondary/muted text — labels, captions, helper copy.
- **Confirmation Green** (#2E7D32 / bg #E8F5E9 / deep #1B5E20): success states, the "free ticket" badge, confirmed check-ins.
- **Alert Red** (#C62828): validation errors only. Never decorative.
- **Mist Blue** (#A8B5C2): secondary/muted text on top of Ink Navy dark surfaces (the "Organize seu evento" CTA banner, the community mural's dark header) — Soft Ink doesn't have enough contrast there, so this is the dark-surface equivalent of Soft Ink.
- **Online Green** (#4ADE80): a live/connected-status dot only (the "N participantes conectados" pill in the community mural header). Distinct from Confirmation Green — needs to be brighter/more saturated to read as a tiny dot on a dark translucent pill, where the darker Confirmation Green would disappear.
- **Feed Black** (#000000): the Feed's immersive video-player background only (behind vertical videos, letterboxing). Deliberately pure black, not Ink Navy — standard convention for full-bleed video players (matches TikTok/Reels/YouTube), and the one surface in the app that isn't on the Warm Paper/Ink Navy institutional canvas.

### Named Rules
**The One Spark Rule.** Spark Orange appears once per screen as the primary call-to-action. Every other actionable element is Campus Blue (outline/link) or plain text. If a screen has two orange elements, one must change.

## 3. Typography

**Display/Body/Label Font:** Inter (with `system-ui, -apple-system, sans-serif` fallback) — one family throughout, differentiated by size and weight rather than by pairing a second typeface.

**Character:** A single confident grotesque doing every job — hero headline, card title, form label, category badge — so the type never distracts from the calm-canvas-plus-one-accent color story above it.

### Hierarchy
- **Display** (700, 2.75rem, line-height 1.15, letter-spacing -0.02em): the home hero headline only. Never used twice on one page.
- **Headline** (700, 2rem, line-height 1.2): page/section titles — event title on the detail page, "Próximos eventos", dashboard page title.
- **Title** (700, 1.25rem, line-height 1.3): card and modal headers — "Criar evento" modal title, dashboard summary card labels, community mural headers.
- **Body** (400, 0.875rem, line-height 1.5, cap line length ~70ch): paragraph copy, form labels, nav links, descriptions.
- **Label** (600, 0.75rem, letter-spacing 0.02em): category badges, status pills ("Gratuito", ticket number), stat captions.

**Compact-UI sub-scale (documented, not a violation):** dense contexts that predate this file — avatar-circle initials (0.7–0.8rem), the Feed's organizer/view-count lines (0.8–0.85rem), section icons like the carousel arrows and dashboard chart headers (1.1–1.5rem) — sit between the five named steps above. These aren't drift; they're real, working sizes for small/dense UI (avatars, captions, icons) that the five-role narrative scale was never meant to cover 1:1. Snap to a named step when touching these areas, but don't force every micro-size into the five-role scale just to satisfy the ramp.

### Named Rules
**The One Voice Rule.** Every weight and size traces back to this single Inter stack. A second typeface is never the answer to a hierarchy problem — size, weight, and color do that work first.

## 4. Elevation

EVE's depth is layered and animated, not flat: surfaces carry a soft ambient shadow at rest and visibly lift with a deeper shadow on hover or focus, and grids of cards/events reveal with a gentle staggered entrance rather than snapping into place. Depth is part of "The Community Spark" — it's what makes the interface feel alive and responsive to touch, not just a static institutional page.

### Shadow Vocabulary
- **ambient-card** (`box-shadow: 0 2px 10px rgba(14, 27, 39, 0.06)`): default resting shadow on every `.eve-card` surface — a soft lift off Warm Paper, always present, never dramatic.
- **hover-lift** (`box-shadow: 0 12px 28px rgba(14, 27, 39, 0.14); transform: translateY(-3px)`): cards, buttons, and pills deepen and rise on hover/focus. Pairs with a 200–250ms ease-out-quart transition — never instant, never bouncy.
- **modal** (`box-shadow: 0 24px 56px rgba(14, 27, 39, 0.20)`): the "Criar evento" modal and any overlay surface — the deepest shadow in the system, reserved for content floating above everything else.
- **focus-ring** (`box-shadow: 0 0 0 3px rgba(10, 105, 196, 0.18)`): every focusable input/button gets this Campus Blue glow — accessibility and "alive" read as the same thing here.

### Motion
- **Entrance:** grids (events grid, dashboard metric cards, partner-logo marquee excluded) reveal with a staggered fade + slide-up (`opacity 0→1`, `translateY(12px→0)`, 300–380ms, ease-out-quart, ~40–60ms stagger between siblings). The reveal enhances content that is already present in the DOM — never gates visibility behind the animation.
- **Interaction:** hover-lift transitions run at 200–250ms, ease-out-quart. No spring, no bounce, ever.
- **Continuous motion** (the partner-logo marquee, the "últimos eventos" carousel auto-advance, the hero globe's idle rotation): keeps its existing linear, uninterrupted pace — these are ambient, not interactive, so they don't get the hover-lift treatment. The globe is the one exception that's also directly interactive: it's draggable, and dragging pauses the idle rotation until release.
- **Reduced motion:** every entrance and hover-lift animation has a `@media (prefers-reduced-motion: reduce)` fallback that swaps to an instant or crossfade transition. Continuous motion (marquee, carousel, globe) pauses or slows under reduced motion rather than stopping content from ever being reachable — the globe specifically stops its idle spin but stays draggable.

### Named Rules
**The Alive-on-Touch Rule.** Every interactive surface (card, button, pill, input) must visibly respond within 200–250ms of hover or focus — deepen the shadow, lift 2–3px, or both. Nothing interactive sits inert. Ambient/ornamental motion (marquee, carousel) is exempt — it never needs a touch to justify its movement.

## 5. Components

### Buttons
- **Shape:** 8px radius (`rounded.lg`) on every button, no exceptions.
- **Primary:** Spark Orange fill, white text, 600 weight, 10px/24px padding. Hover: shadow deepens (hover-lift). Exactly one per screen. **Known tradeoff:** white-on-orange measures 3.1:1, below the 4.5:1 WCAG AA minimum — flagged by `/impeccable critique`, reverted back to white by explicit user choice over the higher-contrast Ink Navy alternative (5.7:1).
- **Outline:** transparent background, 1px Campus Blue border and text. Hover: fills solid Campus Blue with white text — the fill itself is the state change, no shadow needed on this one since the color inversion already reads as "activated."
- **Ghost/Link:** plain Campus Blue text, no border, underline optional. Used for tertiary actions ("Ver comunidade →", "Ver todos →").

### Chips / Pills
- **Filter pills:** full radius, Warm Stone border, Soft Ink text at rest; Campus Blue fill + white text when active. No shadow at rest; a subtle hover-lift only in the inactive state to invite the click.
- **Category badges:** full radius, 2px/10px padding, Label typography, one of the five Tertiary category color pairs. Never any other shape — the pill *is* the category system's visual language.
- **Status badges** (Gratuito / Ingresso pago): same pill shape, Confirmation Green or Ink Navy fill depending on price.

### Cards / Containers
- **Corner Style:** 12px radius (`rounded.xl`), the largest radius in the system — reserved for containers, never for buttons/pills.
- **Background:** solid white, always on the Warm Paper page background so the card reads as a distinct surface.
- **Shadow Strategy:** ambient-card at rest, hover-lift on hover/focus (see Elevation). This is a change from the previous flat-until-hover model — cards now always carry a soft presence, then visibly rise further on interaction.
- **Border:** 1px Warm Stone, kept even with the new ambient shadow — the border defines the edge, the shadow defines the depth.
- **Internal Padding:** 16–24px depending on density (`spacing.md`–`spacing.lg`).

### Inputs / Fields
- **Style:** 8px radius, 1px Warm Stone border, white background.
- **Focus:** focus-ring (Campus Blue glow) plus a subtle border color shift to Campus Blue — never just a browser default outline.
- **Error:** border and helper text switch to Alert Red; the error message appears immediately below the field, never as a toast alone.

### Navigation
- **Style:** fixed Warm Paper header, 1px Warm Stone bottom border, no shadow (the border is enough separation for a surface that's always visible, never appearing/disappearing).
- **Typography:** Body-weight links, Campus Blue when active/current route.
- **Mobile:** taller header (72px vs. 56px desktop) and a larger logo/hamburger glyph — mobile gets more breathing room, not a cramped shrink of the desktop bar.

### Hero Globe (signature component)
- **What it is:** an interactive WebGL globe (via `cobe`) next to the hero headline on desktop, centered on Salvador with a single marker, spinning slowly and continuously; draggable to rotate manually, pausing the idle spin while dragging.
- **Color:** neutral light base, Campus Blue marker and location badge — never the generic multi-color travel-pin palette of a stock globe demo.
- **Label:** one static pill badge ("📍 Salvador, Bahia"), not per-marker floating tooltips — CSS Anchor Positioning (used in some off-the-shelf globe demos) is out of scope here since it's unsupported outside Chromium.
- **Placement:** desktop/tablet only (`≥768px`); hidden on mobile rather than shrunk, so it never competes with the hero text for space at small widths.
- **Motion:** treated as continuous/ambient motion (see Elevation → Motion), with the one exception that it also responds directly to drag input.

### Progress & Status (signature component)
- **Occupancy bars** (event capacity, dashboard metrics): Warm-Stone-toned track, Campus Blue fill, full radius, animated width transition (0.3s ease) whenever the underlying number changes.
- **Check-in toggle switch:** full-radius track, white thumb with a minimal `0 1px 2px rgba(0,0,0,0.2)` shadow for physical affordance — the one shadow in the system that isn't about elevation, but about making a toggle read as a real, grabbable object.

## 6. Do's and Don'ts

### Do:
- **Do** use exactly one Spark Orange (#E8722C) primary action per screen — everything else actionable is Campus Blue outline/link or plain text.
- **Do** give every `.eve-card` an ambient-card shadow at rest and a hover-lift (deeper shadow + 2–3px rise) on hover/focus, eased at 200–250ms with ease-out-quart.
- **Do** stagger grid/list entrances (fade + slide-up, ~40–60ms between siblings) so content feels alive without gating visibility on the animation.
- **Do** keep every category tag to the five defined Tertiary color pairs, in the same pill shape — never invent a sixth without updating this file.
- **Do** provide a `prefers-reduced-motion` fallback for every entrance and hover-lift animation.
- **Do** keep LGPD-relevant forms minimal (only the fields the flow needs) with a required, explicit consent step before submission.

### Don't:
- **Don't** use more than one Spark Orange element on the same screen.
- **Don't** add heavy or dark dramatic shadows, gradients, or glassmorphism — depth stays soft and warm (rgba over Ink Navy, never black, never above ~0.20 alpha).
- **Don't** use bounce/elastic easing anywhere; ease-out-quart only.
- **Don't** use `border-left`/`border-right` as a colored accent stripe on cards or list items.
- **Don't** apply gradient text (`background-clip: text` + gradient).
- **Don't** let the interface read as a bureaucratic, dated institutional system (dense gray forms, no warmth) or as a generic corporate SaaS clone (identical card grids, hero-metric template, tiny uppercase tracked eyebrows on every section).
