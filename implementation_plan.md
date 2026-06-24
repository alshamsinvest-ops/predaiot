# PREDAIOT — Implementation Plan

**Economic Decision Intelligence for Energy Assets (Oman / GCC)**
Domain: preda-iot.com · Founder: Chams Eddine Madi · chams@preda-iot.com · +968 7411 4028 · Muscat, Oman

> **Status: DECISIONS LOCKED — awaiting final "go build" approval. No application code written yet.**

---

## 0. Architecture decisions (confirmed by user)

The repository **already contains a working Vite + React 19 + Express SPA** (AI Studio export, ~6,300 lines): `Home`, `AuditPage`, `LeakTestPage`, `PlatformDashboard`, `AboutContact`, `WhitePapers`, `PrivacyPolicy`, `AICopilot`, `Header`. Current Copilot = **Gemini**, WhatsApp = **Twilio**.

**Confirmed choices:**

| Decision | Choice |
|----------|--------|
| Build path | **Path C — Hybrid**: new **Next.js 16 App Router** frontend (all pages, SEO, i18n, Firebase Auth) **+ keep the existing Express `server.ts` as a standalone API backend** |
| Email | **Resend** |
| Booking | **Google Calendar** (real slots; Calendar MCP connected) |
| WhatsApp | **Keep Twilio WhatsApp** (already wired in `server.ts`) — Copilot still migrates **Gemini → Claude `claude-sonnet-4-6`** |

**What Path C means concretely:**
- **Frontend:** new Next.js 16 app (`/app`, `/components`, `/lib`, `/messages`) handling all 16 routes, SSR/SEO, next-intl bilingual, Firebase Auth, the Copilot/WhatsApp/countdown UI widgets.
- **Backend:** the existing **Express `server.ts`** is kept and extended as the API service — endpoints for diagnostic, lead, upload validation, Copilot (Claude), Twilio WhatsApp notify, booking. Next.js calls it via `NEXT_PUBLIC_API_URL` (same-origin in prod via Hosting rewrite, separate port in dev).
- **Two runtimes:** Next.js (web) + Express (api). Deployment §9 reflects this (Firebase Hosting rewrites `/api/**` → the Express Cloud Run/Functions service, or run Express as a Hosting backend). Reusing existing Gemini→Claude swap + Twilio code saves backend rework.
- The Vite-specific files (`vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx` SPA router) are **retired**; the React component bodies in `src/components/*` are **ported** into Next.js client components (copy, design, dashboard SVG/d3 logic reused).

---

## 1. Tech stack (target — Path C hybrid)

**Frontend (new):**
- Next.js 16 (App Router, RSC), TypeScript (strict)
- Tailwind CSS v4, dark-mode-first, CSS-variable palette
- `next-intl` `[locale]` routing (`/en/...`, `/ar/...`), RTL Arabic
- Firebase Auth — Google OAuth2 primary, email/password fallback; session cookies via Firebase Admin
- Firestore (profiles, audit-trail, diagnostic mirror, rate-limit ledger) + Firebase Storage (uploads, locked-down rules)
- SEO: Next.js Metadata API, JSON-LD, `sitemap.ts`/`robots.ts`, hreflang

**Backend (existing Express `server.ts`, extended):**
- AI: Anthropic Claude `claude-sonnet-4-6` via `@anthropic-ai/sdk`, streaming (replaces Gemini)
- WhatsApp: **Twilio** (existing) — diagnostic-result + founder notifications
- CRM: Airtable REST — base `appeUbnHpGamghy8q`, table `tbl6r1kqhvRN4IDgI`
- Email: Resend (`resend` SDK)
- File-upload validation (csv/xlsx, ≤10MB, schema/macro checks)

**Hosting:** Firebase Hosting (Next.js web) + Express API as a Hosting backend / Cloud Run, `/api/**` rewrite.

---

## 2. Design system

- **Colors:** `--primary:#071A2F` · `--secondary:#00B2FF` · `--accent:#00E676`; navy gradients, glassmorphism cards.
- **Type:** Inter Tight (ExtraBold headings) + Inter (body), self-hosted via `next/font`.
- **Aesthetic:** Tesla Energy × Palantir × Stripe — industrial/energy photography (solar fields, BESS containers, control rooms) with dark navy overlay. **No generic SaaS stock.** Placeholders documented in `/public/images/README` until real assets supplied.
- **Imagery pipeline:** WebP/AVIF, `next/image` lazy-loading below fold, bilingual alt text.
- **Components are RTL-aware** (logical CSS properties, `dir` switch on `<html>`).

### Shared UI components (`/components/ui` and `/components/layout`)
- `Header` (nav + language toggle + auth state + login modal)
- `Footer` (links, legal, contact, social, Vision 2040 line)
- `LanguageToggle` (EN/AR, persists in cookie)
- `WhatsAppFloat` (persistent floating button, every page)
- `CopilotWidget` (floating AI copilot, every page)
- `Button`, `Card`, `Badge`, `Section`, `Stat`, `Tier/PriceCard`, `Accordion`, `Modal`, `Toast`
- `CountdownTimer` + `ClientCounter` (real countdown + counter logic, not copy)
- `GoogleSignInButton` (Firebase) and `AuthGate` wrapper
- `IndustrialImage` (image + navy overlay wrapper)
- `JsonLd` (renders schema.org per page)
- `IllustrativeBadge` ("illustrative interface" / disclaimer chips)

### Animated dashboard mockup (`/components/dashboard/`)
- `HeroDashboard` — animated Battery SOC gauge, Economic Efficiency Score, Revenue Recovery counter, labeled **"illustrative interface"**. Ported from existing `PlatformDashboard.tsx` logic (d3/motion), simplified for hero.

---

## 3. Routing & pages (App Router, all under `app/[locale]/`)

Clean URLs as required (`/economic-audit`, not query params). EN + AR per route via `next-intl`.

| Route | Page | Key content |
|-------|------|-------------|
| `/` | **Home** | Hero (headline/subhead/2 CTAs + illustrative dashboard), **7-Day Leak Test teaser (prominent)**, problem/solution split, how-it-works, product modules, trust signals (real traction only), final CTA |
| `/economic-audit` | **Audit (flagship)** | **Free 7-Day Leak Test form (above all paid)**, guarantee text, countdown + client counter, result panel + WhatsApp share, "Register via WhatsApp" alt, 3 paid tiers |
| `/bess` | **BESS Optimization** | Economic vs technical dispatch, value levers, illustrative figures |
| `/solar` | **Solar + Storage** | Solar+BESS economic stacking |
| `/technology` | **Architecture** | Shadow economic engine, data pipeline, security; SECONDARY numbers here, clearly labeled |
| `/industries` | **Industries** | 6 verticals: Utilities, Solar, BESS, Industrial, Oil & Gas, Infrastructure |
| `/security` | **Security** | HTTPS, Firebase Auth, encryption, audit trail, file-upload safety |
| `/privacy-policy` | **Privacy** | PDPL (Royal Decree 6/2022) aligned |
| `/cases` | **Cases** | Simulation case study (clearly labeled) + real traction |
| `/papers` | **White papers** | Gated downloads (email/Google capture) |
| `/investors` | **Investors** | Pre-seed, real traction only; gated contact |
| `/pricing` | **Pricing** | Exact figures (OMR primary, USD secondary) |
| `/about` | **About** | Founder profile (Chams Eddine Madi) |
| `/contact` | **Contact** | Working form, Google Calendar booking, WhatsApp CTA + WhatsApp register flow |
| `/portal` | **Client Portal** | Auth-gated (Google sign-in); user dashboard + uploads |
| `/login` | **Auth** | Google primary + email/password fallback |

Plus: `app/[locale]/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, localized `not-found`.

---

## 4. API endpoints

Most live in the **Express `server.ts`** backend (Path C). Auth/session lives in Next.js (needs Firebase Admin + cookies). Frontend reaches Express via `NEXT_PUBLIC_API_URL` (prod: Hosting rewrite `/api/**`).

| Endpoint | Host | Purpose |
|----------|------|---------|
| `POST /api/diagnostic` | Express | Validate Leak-Test → rate-limit (1/email/30d, Firestore) → **Airtable** (`tbl6r1kqhvRN4IDgI`: Full Name, Company, Phone, Email, Asset Type, Source="Website Free Diagnostic", Stage="🎯 Target") → **Twilio WhatsApp notify** +968 7411 4028 → **Resend email** → return illustrative/scaled result |
| `POST /api/upload` | Express | Multipart CSV/Excel; **server-side validation** (mime+ext, ≤10MB, schema, macro/`.xlsm` reject, never executes); store in Firebase Storage; audit-log |
| `POST /api/copilot` | Express | Stream Claude `claude-sonnet-4-6` with the **exact brief system prompt**; "Powered by Claude" in UI (replaces current Gemini handler) |
| `POST /api/whatsapp/notify` | Express | Twilio WhatsApp message to founder (internal) |
| `POST /api/lead` | Express | Generic lead/contact/investor/paper-gate capture → Airtable + Resend |
| `POST /api/booking` | Express | Create Google Calendar event (real slot) via Calendar API |
| `GET /api/papers/[slug]` | Express | Serve gated PDF after capture check + audit-log |
| `POST/DELETE /api/auth/session` | **Next.js** | Firebase ID token → httpOnly session cookie (CSRF-safe); first sign-in mirrors `{displayName,email}` to Airtable Prospects |
| `logEvent({userId, action, timestamp})` | lib | Audit-trail helper used across endpoints |

---

## 5. Integrations — library modules (`/lib`)

- `lib/firebase/client.ts` + `lib/firebase/admin.ts` — Auth, Firestore, Storage clients
- `lib/airtable.ts` — typed create/find for leads + prospects (base/table IDs from env)
- `lib/whatsapp.ts` — Twilio send (server) + client-side click-to-chat deep-link builder (pre-filled messages to +968 7411 4028)
- `lib/claude.ts` — Anthropic client + streaming helper + system prompt + suggested prompts
- `lib/email.ts` — Resend send (diagnostic result, lead confirmations, paper delivery)
- `lib/rateLimit.ts` — Firestore-backed 1/email/30d ledger
- `lib/validation.ts` — Zod schemas (forms) + file validation (type/size/schema/macro)
- `lib/auditLog.ts` — `{userId, action, timestamp}` writer
- `lib/value.ts` — value-recovery estimator scaled from **862,903 OMR / 500 MW** benchmark (single source of truth for all numbers)
- `lib/seo.ts` — metadata + JSON-LD builders (Organization/Service/Article), hreflang helper
- `lib/i18n.ts` — next-intl config + message catalogs `messages/en.json`, `messages/ar.json`

---

## 6. Data, numbers & content governance (hard rules baked into a constants file)

`lib/constants.ts` will be the **only** place economic figures live, so banned numbers can't leak:

- **Primary:** 862,903 OMR / 500 MW; 9.1%–15%, zero CAPEX; citation "Published methodology — PREDAIOT, Oman National Open Data Portal, June 2026" + opendata.gov.om link; SMP 9.120 OMR/MWh; Scarcity 4.022 OMR/MWh; subsidy 602.3M OMR (2024).
- **Secondary (technical pages only, labeled "Peak-case internal simulation — smaller asset class"):** up to 25% / ~$108K/yr; 10 MW solar / 15 MWh battery; 8,760 hrs.
- **Pricing constants:** Free 0 OMR (+guarantee); Audit 2,500–3,000 OMR (50% promo → 1,250–1,500, first 10 / 14 days); Pilot from 20,000 OMR; Deployment 40/60 rev-share zero upfront; Enterprise = Contact Sales.
- **Real traction only:** Patent filed (Tunisia); Omantel Accelerator Cohort 7; signed LOI Sunified; methodology on Oman Open Data Portal; OETC LDC dialogue; pre-revenue/pre-seed.
- **Guarantee text (verbatim)** and **promo hook text (verbatim)** stored as constants.
- **BANNED list** documented in the file header so future edits stay compliant (no "10+ years", "millions of data points", "SOC2", "Series A", fabricated availability/efficiency, real-company prefilled logins, off-spec pricing).

---

## 7. Security implementation

- HTTPS enforced (Firebase Hosting), no mixed content; CSP headers in `next.config`.
- Firebase Auth session cookies (httpOnly, SameSite) → CSRF protection on mutating routes.
- **Firestore rules:** users read/write only their own docs; audit-log append-only.
- **Storage rules:** authenticated owner-only read/write; encrypted at rest (default Google-managed; documented).
- **File-upload defense:** type/extension allowlist (csv/xls/xlsx), ≤10MB, header/schema check, reject macro-enabled (`.xlsm`), never parse-execute, store opaque.
- **Audit trail:** every data-access/mutation logs `{userId, action, timestamp}`.
- `/security` and `/privacy-policy` pages document the above; privacy page PDPL-aligned.

---

## 8. SEO (build-time)

- Per-page `generateMetadata` (unique title + description, OG + Twitter Card).
- JSON-LD: Organization (site-wide via root layout), Service (`/economic-audit`, `/bess`, `/pricing`), Article (`/papers`).
- hreflang `ar-OM` / `en` alternates on every route.
- `sitemap.ts` + `robots.ts` auto-generated; clean URLs.
- Images WebP/AVIF, lazy below fold, bilingual alt.
- Keyword targeting woven naturally into copy: economic dispatch Oman, BESS optimization GCC, solar asset economic audit, Oman renewable energy, Vision 2040 energy efficiency.

---

## 9. Config & deployment files

- `firebase.json` (Hosting + framework/functions for Next.js), `.firebaserc`
- `firestore.rules`, `firestore.indexes.json`, `storage.rules`
- `next.config.ts` (i18n via next-intl plugin, image domains, security headers)
- `tailwind.config` / CSS tokens, `tsconfig.json` (strict)
- **Two services:** Firebase Hosting serves Next.js; `firebase.json` rewrites `/api/**` → Express backend (Cloud Run or Hosting backend). `NEXT_PUBLIC_API_URL` set per env.
- `.env.example` (full): `NEXT_PUBLIC_FIREBASE_CONFIG`, `FIREBASE_ADMIN_*`, `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_API_URL`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID=appeUbnHpGamghy8q`, `AIRTABLE_TABLE_ID=tbl6r1kqhvRN4IDgI`, `AIRTABLE_PROSPECTS_TABLE_ID`, `ANTHROPIC_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `WHATSAPP_TO=+96874114028`, `RESEND_API_KEY`, `GOOGLE_CALENDAR_*`
- `README.md` rewritten: setup, env, Firebase init, run/deploy instructions.

---

## 10. Build sequence (after approval)

1. Scaffold Next.js 16 + Tailwind + next-intl + design tokens + fonts; retire Vite SPA files (keep `server.ts`).
2. Layout shell: Header, Footer, LanguageToggle, WhatsAppFloat, CopilotWidget, message catalogs.
3. `lib/constants.ts` (numbers/copy governance) + `lib/value.ts` + SEO/JSON-LD helpers.
4. Home + Audit (flagship) + Leak-Test form + countdown/counter + result + WhatsApp share (ported from existing components).
5. Extend Express `server.ts`: `/api/diagnostic`, `/api/lead`, `/api/upload` + Airtable + Twilio + Resend; swap Gemini→Claude.
6. Firebase Auth (Google + email/password), Next.js session cookies, AuthGate, Prospects mirror, `/portal`, `/login`.
7. Claude Copilot endpoint + widget (streaming, suggested prompts, "Powered by Claude").
8. Remaining pages: bess, solar, technology, industries, security, privacy, cases, papers, investors, pricing, about, contact.
9. Security rules, audit log, file-upload hardening, CSP headers.
10. SEO finalize: metadata, sitemap, robots, hreflang, image optimization.
11. Firebase config (Hosting + `/api/**` rewrite) + README + `.env.example`; `tsc --noEmit` + builds green.
12. Commit + push to `claude/focused-ptolemy-imel68`. (No PR unless you ask.)

---

## 11. Open items

**Resolved:** Path C hybrid · Resend · Google Calendar · Twilio WhatsApp.

**Remaining (won't block build — sensible defaults used):**
1. **Assets:** real industrial photography + final white-paper PDFs — provide later, or I use documented placeholders for now.
2. **Secrets:** I commit `.env.example` only; you supply real keys at deploy time.
3. **Push access:** current GitHub App token returns **403 (no contents-write)**; plan is committed locally but can't be pushed until permissions are granted.

---

*Decisions are locked. Awaiting your "go build" to start writing code.*
