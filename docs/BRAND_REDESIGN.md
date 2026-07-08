# PREDAIOT — Enterprise Repositioning & Brand System

**Category:** Economic Decision Intelligence for the Energy Sector
**Positioning shift:** from a BESS/Solar product site → an enterprise AI decision layer for the *entire* energy value chain. BESS and Solar are two examples of fifteen sectors, never the identity.

This document is the design-agency deliverable that accompanies the code
changes. It is the source of truth for imagery, palette, type, motion, SEO and
conversion. Future agents: read `AGENTS.md` first, then this.

---

## 1. Brand north star

When a GM at OETC, a CTO at an IPP, or a procurement lead at a national
utility opens the site, the first impression must be:

> "This is a mature industrial-AI company capable of serving Shell, Aramco,
> ADNOC, Siemens, GE Vernova, Schneider Electric, ABB and National Grid."

Reference tier for craft: **Palantir · NVIDIA Enterprise · Siemens
Xcelerator · ABB Ability · GE Vernova · Stripe · Apple · Azure AI.**

Visual adjectives: clean · premium · futuristic · minimal · cinematic ·
engineering-driven · enterprise-grade.

**Governance guardrail (non-negotiable):** the site may *look* capable of
serving those firms and may list all fifteen sectors as the addressable
market, but it must **never imply any named company is a client** or fabricate
logos, case studies, or metrics. Real traction (`REAL_TRACTION` in
`lib/constants.ts`) stays the only trust anchor. This is what separates
"enterprise-grade" from "AI slop."

---

## 2. Color palette

The existing palette is correct and stays — the problem was composition and
motion, not chroma. Tokens live in `app/globals.css` `@theme`.

| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#060B18` | Navy background — deep, cinematic base |
| `--color-primary-50` | `#0D1628` | Elevated surface / card fill |
| `--color-primary-900` | `#04081A` | Deepest black-navy (body) |
| `--color-secondary` | `#00CFFF` | Teal — data, intelligence, primary accent & CTAs |
| `--color-accent` | `#FF6630` | Orange — energy, generation, attention |
| `--color-positive` | `#00CC66` | Green — recovery, gain, charge |
| `--color-negative` | `#FF4455` | Red — loss, leak, critical |
| `--color-gold` | `#FFB800` | Gold — excellence / confidence highlights |
| `--color-forecast` | `#8B5CF6` | Purple — forecast, uncertainty bands |
| `--color-ink` | `#F0F4FF` | Primary text |
| `--color-ink-muted` | `#6B7A99` | Secondary text |

**Usage discipline:** teal = intelligence/data, orange = physical energy,
green = economic gain, red = economic loss. One accent per surface. Large
navy fields + generous negative space = the "expensive" enterprise feel.

---

## 3. Typography system

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / headlines / KPI values | **Syne** | 700–900 | Tight `-0.02em` tracking, extrabold. The signature voice. |
| Body / long-form | **Inter** | 400–600 | Maximum readability; never Syne for paragraphs. |
| Data / prices / code / UI chrome | **DM Mono** | 300–500 | Timestamps, OMR figures, endpoints, kickers. |

Scale (fluid): hero `text-4xl → text-6xl`, section `text-3xl`, card `text-lg`,
body `text-base/text-sm`, chrome `text-[10px]–text-xs` uppercase `tracking-wider`.

RTL: Arabic renders in the same families with `dir="rtl"`; numbers stay LTR.

---

## 4. Icon system

**Library:** `lucide-react` — single, consistent stroke weight, engineering
feel, tree-shakeable. No mixed icon sets, no emoji in enterprise surfaces
(emoji remain only in `REAL_TRACTION` chips where the human tone helps).

**Sector icon map** (source of truth: `SECTORS` in `lib/constants.ts`,
resolved in `components/SectorGrid.tsx`):

| Sector | Icon |
|---|---|
| Oil & Gas | `Fuel` |
| Power Generation | `Zap` |
| Utilities | `Building2` |
| Renewable Energy | `Leaf` |
| Solar *(example)* | `Sun` |
| Wind | `Wind` |
| Battery Storage *(example)* | `BatteryCharging` |
| Transmission & Distribution | `Cable` |
| Smart Grid | `Waypoints` |
| Industrial Energy | `Factory` |
| Water & Energy Infrastructure | `Droplets` |
| Hydrogen | `Atom` |
| Data Centers | `Server` |
| Microgrids | `Grid3x3` |
| Virtual Power Plants | `Boxes` |

---

## 5. AI image prompts (8K, ultra-real, cinematic)

Generate with Midjourney v6 / Flux / DALL·E 3 / SDXL / Leonardo. Keep a
**consistent look** across all: cold blue-hour lighting, teal data-accent,
volumetric haze, shot on a cinema prime, magazine-grade. Never cartoon,
illustration, or obvious-AI. Save into `public/brand/hero/` and swap the
Unsplash placeholders in `lib/images.ts`.

**Global style suffix (append to every prompt):**
`--ar 16:9 --style raw --v 6.1` (MJ) · or `8k, ultra realistic, cinematic
lighting, industrial realism, magazine quality, shot on ARRI Alexa, 35mm,
volumetric fog, no text, no watermark, no people faces` (Flux/SDXL).

### 5.1 Hero — the whole energy ecosystem (the money shot)
> A sweeping cinematic aerial at blue hour of an integrated energy landscape:
> an oil refinery and gas-processing plant on the left, a combined-cycle power
> station center, wind turbines and a utility-scale solar farm on the right,
> high-voltage transmission lines and an electrical substation threading
> between them, faint glowing teal data-network lines and energy-flow arcs
> overlaid connecting every facility, thin holographic economic-optimization
> HUD graphs floating subtly above the grid, deep navy sky, cold cyan rim
> light, volumetric haze, ultra-realistic, 8k, engineering-grade, no text.

### 5.2 Oil & Gas
> Cinematic dusk shot of a modern gas-processing plant, stainless steel
> pipework and flare stacks, cold blue lighting with warm sodium highlights,
> faint teal data overlay tracing pipelines, deep depth of field, 8k,
> industrial realism, no people.

### 5.3 Power generation
> Interior of a spotless combined-cycle turbine hall, massive GE-class gas
> turbine, engineered lighting, subtle cyan telemetry HUD hovering over the
> machine, cinematic, ultra-detailed, 8k.

### 5.4 Transmission & substation
> Wide low-angle blue-hour photograph of a high-voltage substation, lattice
> towers and transformers, glowing teal current-flow lines animated along the
> conductors, long-exposure sky, cinematic, 8k, no text.

### 5.5 Wind + solar (renewables, together)
> Aerial magazine shot of an offshore-style wind farm meeting a desert
> utility-scale solar field on the horizon, golden-to-blue gradient sky, faint
> data lattice overlay, ultra-real, 8k, cinematic.

### 5.6 Hydrogen
> Sleek green-hydrogen electrolyzer facility, rows of stacks, clean white and
> steel, cold cyan accent lighting, subtle molecular H₂ motif in the glass
> reflection, futuristic, 8k, industrial realism.

### 5.7 Data center (AI-scale power)
> Cinematic cold-aisle of a hyperscale data center, endless server racks with
> cyan indicator light, faint power-flow arcs overlaid, deep perspective,
> volumetric haze, 8k, enterprise.

### 5.8 Control room / decision intelligence
> A darkened enterprise energy-operations control room, large curved video
> wall showing economic-optimization dashboards in teal and orange, a single
> silhouetted operator, cinematic, moody, 8k — dashboards abstract, no legible
> fake data.

### 5.9 Microgrid / VPP (abstract network)
> Abstract 3D visualization of distributed energy assets — small solar,
> batteries, turbines — connected by glowing teal nodes into one intelligent
> network over a dark topographic map, premium, minimal, 8k render.

---

## 6. Homepage information architecture

Repositioned flow (implemented in `app/[locale]/page.tsx`):

1. **Hero** — cross-sector headline + live Economic Engine widget + signature `EconomicWaveform`.
2. **Industries We Serve** — the 15-sector `SectorGrid` (BESS/Solar chipped "Example"). *Establishes cross-sector identity immediately after the fold.*
3. **Free diagnostic teaser** — low-friction entry, written guarantee.
4. **The Economic Decision Gap** (Problem / Solution) — leak-vs-recovery storytelling visual.
5. **Built for the enterprise** — three pillars: Transparent & auditable · Scientific foundation · Cross-sector by design.
6. **How it works** — 3 steps, spotlight cards.
7. **What happens after you click** — 5-step process.
8. **Real traction** — verified milestones only + benchmark stats (count-up).
9. **Final CTA** — diagnostic + pricing.

Deeper pages: `/industries` (all 15), `/technology` (scientific foundation +
data quality), `/live` (signature product), `/cases`, `/about`.

---

## 7. Animation plan

Foundation already shipped (`components/kinetic/*`, `motion` v12). All motion
honors `MotionProvider` (Auto/On/Off) + `prefers-reduced-motion`.

| Effect | Component | Where |
|---|---|---|
| Signature price waveform | `EconomicWaveform` | Home + About hero |
| Split-word headline reveal | `KineticTitle` | Hero H1s |
| Scroll reveals (staggered) | `Reveal` / `RevealGroup` / `RevealItem` | Every section incl. `SectorGrid` |
| Cursor spotlight on cards | `CursorSurface` | Sector cards, pillars, steps, traction |
| Magnetic primary CTA | `MagneticButton` | Hero |
| CTA shine sweep + pulse | `.cta-shine` / `.cta-pulse` | Accent buttons |
| Count-up KPIs | `CountUp` via `Stat` | Benchmark stats, hero dashboard |
| Self-drawing sparkline | `HeroDashboard` | Hero widget |
| Leak-vs-recovery curves | `LeakRecoveryVisual` | Problem/Solution split |
| Hero parallax | `Parallax` | Hero background photo |
| Scroll-reactive nav blur | `Header` | Global |

**Restraint rule:** one hero-grade motion per viewport; everything else is
sub-300ms micro-interaction. Never animate `width`/`top` — only `transform`
and CSS custom properties (keeps 60fps, protects Lighthouse).

---

## 8. Performance (Lighthouse ≥ 95)

- No three.js / WebGL — all visuals are SVG + CSS + `motion`.
- `next/image` for all photography; hero `priority`, everything else lazy.
- `/live` is `ssr:false` dynamic import so recharts never blocks first paint.
- Static-render the marketing shell; kinetic mounts post-hydration.
- Fonts: `next/font` with `display: swap`.
- Swap Unsplash placeholders for optimized local `public/brand/hero/*.webp`
  once the AI imagery is generated (biggest remaining LCP win).

---

## 9. SEO improvements

- Organization JSON-LD now carries `knowsAbout: [all 15 sectors]` +
  `POSITIONING.oneLiner` (`lib/seo.ts`) — strong cross-sector entity signal.
- Hero + `/industries` meta rewritten to the full value chain (not BESS/Solar).
- hreflang `en` / `ar-OM` alternates already emitted per page.
- Per-sector landing pages are the recommended next SEO expansion: one indexed
  route per sector (`/industries/[sector]`) each targeting
  "economic dispatch optimization for {sector}".
- Keep `sitemap.xml` / `robots.txt` (already present) in sync as routes grow.

---

## 10. Conversion improvements

- **Single primary action** everywhere: *Start a free 7-day diagnostic* (magnetic + shine + pulse) — one loud CTA, one quiet secondary.
- **Written guarantee** repeated at each decision point (de-risks the ask).
- **"Don't see your sector?"** CTA on `/industries` converts the long tail.
- **Cross-sector proof** up front lets a non-BESS operator self-identify in 5 seconds instead of bouncing because "this is just batteries."
- **Investor gate** is email-first (reliable) with real PDFs delivered on submit.
- Next: add a 2-field "estimate my sector's gap" interactive on `/industries`.

---

## 11. What shipped in code vs. what's next

**Shipped (this PR):** 15-sector `SECTORS` spine · repositioned hero/meta/JSON-LD ·
homepage Industries band + enterprise pillars · full `/industries` rebuild ·
nav/footer reframe (Industries elevated, BESS/Solar demoted to examples) ·
this deliverable doc.

**Next (needs founder assets / decisions):**
1. Generate the 9 hero images above, drop into `public/brand/hero/`, swap `lib/images.ts`.
2. Per-sector landing routes `/industries/[sector]` for SEO.
3. Sector-picker interactive gap estimator.
4. Replace remaining BESS/Solar-centric body copy on `/technology` and `/about` with sector-neutral framing where it still leans single-technology.
