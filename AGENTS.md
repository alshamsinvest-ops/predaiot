# AGENTS.md — PREDAIOT

This file briefs future coding agents (any LLM, any session) working on
this repository. Read it before opening any file. It exists because past
work drifted into a "looks like AI creation" pattern that the founder
called out. This document is the guardrail.

## Project identity

PREDAIOT is an Economic Decision Intelligence platform for energy
assets in Oman and the GCC. Domain: BESS + solar + industrial load
dispatch optimization. Public methodology on Oman National Open Data
Portal. Patent application filed.

- Company facts, contact, and links live in `lib/constants.ts` (`COMPANY`).
- Domain (must not use variants): `preda-iot.com` (with dash).
- Founder email: `chams@preda-iot.com` (with dash).

## Content governance — non-negotiable

`lib/constants.ts` is the single source of truth for every economic
number and traction claim on the site. **Never fabricate.**

**Banned everywhere — never generate these anywhere on the site:**

- "10+ Years Operational Data"
- "Millions of Data Points Processed"
- "SOC2 Ready" / any compliance badge not actually held
- "Series A" / any funding claim beyond pre-seed
- Fabricated case-study numbers (no "99.2% availability", no invented uplift %)
- Any pre-filled login field with a real Oman company name
- Any pricing other than the exact figures in `PRICING`

**Rules:**

- Economic numbers pull from `PRIMARY` (homepage, cases, hero) or
  `SECONDARY` (technical pages, always with the disclaimer). Nothing else.
- Traction items come from `REAL_TRACTION`. Adding one? Verify with the
  founder first.
- Industry quotes come from `INDUSTRY_QUOTES` — anonymized, dated. Do not
  add un-anonymized attributions.
- Cite the source on the page the number appears. See `PRIMARY.citation`
  and `PRIMARY.citationLink`.

## Design principles — every visual decision follows these five

1. **Domain-native motion.** Animations echo electricity: pulses,
   waveforms, dispatch ticks. No generic fade-in-slide-up.
2. **Live-feeling surfaces.** Cursor and scroll interact with everything.
3. **Precision over decoration.** Every animation carries data or
   semantic payload. Nothing "for the vibe."
4. **One signature element.** The identity concentrates in a widget you
   can screenshot and know it's PREDAIOT (`EconomicWaveform`).
5. **Access + RTL preserved.** All motion respects
   `prefers-reduced-motion` + the site-wide Motion toggle. Kinetic
   layouts flip cleanly under `dir="rtl"`.

## Kinetic conventions

Primitives live in `components/kinetic/`. Consume the `useMotion()`
hook from `MotionProvider` to check `shouldAnimate` — every kinetic
component short-circuits to a static render when it's false.

Naming pattern:

- `Kinetic*` — motion applied to type or content (KineticTitle)
- `Cursor*` — cursor-aware surfaces
- `Magnetic*` — spring physics attracted to pointer
- `EconomicWaveform` — the signature widget (SVG waveform behind hero)

Motion library: `motion` v12 (framer-motion successor). Already in
`package.json`. Do not add three.js, WebGL, or Lottie.

## Content model

- **Bilingual EN / AR.** Locale routes under `app/[locale]/`.
- **Source of truth:** `messages/{en,ar}.json` — namespaced (`nav`,
  `common`, `hero`, `home`, `audit`, `pricing`, ...).
- **Pattern A** (recommended for new pages): `getTranslations()` in
  server component; consume via `t("namespace.key")`.
- **Pattern B** (existing homepage): inline `const isAr = locale === "ar"`
  ternary for one-off strings. Fine for prose blocks — don't propagate
  to reusable pieces.
- Keys must exist in **both** JSON files. Add to en first, then mirror
  to ar with a proper translation.

## Repo layout

```
app/[locale]/            server components, one per route
  page.tsx               / (home)
  live/page.tsx          Live Platform (SSR-disabled — see PR-A)
  ...
app/api/                 route handlers (nodejs runtime)
  audit/, lead/, copilot/, v1/{ingest,decision,stream,report}/
components/
  ui/                    shared primitives — Card, Section, Kicker, LinkButton, Stat, Dropdown
  layout/                Header, Footer, LanguageToggle
  kinetic/               motion + signature widgets (this session)
  live/                  Live Platform components + zustand consumers
  dashboard/             HeroDashboard (homepage ticker)
  forms/                 GatedForm, LeakTestForm, GoogleSignInButton
lib/
  constants.ts           content governance + PRIMARY / SECONDARY / PRICING
  economic-engine.ts     10-equation math engine
  price-model.ts         Oman 24h price profile
  seo.ts, images.ts, audit/engine.ts, server/backend.ts
store/liveStore.ts       zustand store for /live
types/energy.ts          shared types
messages/{en,ar}.json    i18n source of truth
i18n/                    next-intl config
```

## Do / Don't — quick reference

✅ Reuse `Card`, `Section`, `Kicker`, `LinkButton`, `Stat` from `components/ui/index.tsx`.
✅ Reuse `.surface`, `.grid-bg`, `.glow-secondary`, `.pulse` from `app/globals.css`.
✅ Cite public data on the page it appears. Link to `opendata.gov.om`.
✅ Use logical properties (`ms-`, `me-`, `insetInlineStart`) — RTL-safe.
✅ Wrap client interactivity in `"use client"` at the smallest reasonable boundary.
✅ For the `/live` page: any recharts / heavy client tree loads via `next/dynamic({ ssr: false })`.

❌ Don't add a symmetric 3-column grid for "How it works" or process steps. Asymmetric staircase or offset composition — breaks the AI-templated feel.
❌ Don't use generic fade-up on everything. Motion must feel domain-native (see design principles).
❌ Don't introduce a new color outside the `@theme` block in `app/globals.css`.
❌ Don't add a page-transition wrapper. Kills perceived speed.
❌ Don't wrap the whole live tree with SSR — recharts throws during hydration. Use `next/dynamic({ ssr: false })`.
❌ Don't run `git reset --hard` in the working directory without explicit user authorization.
❌ Don't skip Git hooks (`--no-verify`) or bypass commit signing.
❌ Don't commit secrets. Firebase private key and Twilio auth token belong in Vercel env only.
❌ Don't fabricate numbers, dates, client names, or traction items.

## Verification workflow

Before pushing, always:

1. `npx tsc --noEmit` — must exit 0.
2. `npm run build` — must succeed. Route table should list your new pages under `● (SSG)` or `ƒ (Dynamic)`.
3. For visual changes: `npm run start` locally and check `/en/` + `/ar/` — RTL must not overflow.
4. For motion changes: toggle DevTools → Rendering → `prefers-reduced-motion: reduce` — everything must degrade to static.

## Git workflow

- Every session's development branch is listed in the session's system
  prompt. Develop, commit, and push there.
- Descriptive commit messages. Reference the founder-review bullet or
  the plan-file section that motivated the change.
- Open a PR against `main` (or against the parent stacked branch if
  you're building on unmerged work).
- If a session's branch is behind main after a merge, `git merge origin/main`
  or start a fresh branch from main — never `git reset --hard` without
  the user asking for it.

## Founder acceptance patterns

The founder (Chams) reviews via the deployed URL, not preview links.
Merge to `main` → Vercel auto-deploys → he checks `preda-iot.com`.

His acceptance signals:

- Traction and Pricing pages: currently graded strongest — don't touch without asking.
- Cases page: must never carry the word "Illustrative" as a header — it reads defensive.
- `/live`: the demo signal must be visibly moving within one paint. If it flashes empty states, that's a P0.
- About: personal opener + numbered achievements + GCC vision line is the pattern he likes.

If you're about to break one of these — stop, ask.
