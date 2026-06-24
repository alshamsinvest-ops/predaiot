# PREDAIOT — Implementation Plan

**Economic Decision Intelligence for Energy Assets (Oman / GCC)**
Domain: preda-iot.com · Founder: Chams Eddine Madi · chams@preda-iot.com · +968 7411 4028 · Muscat, Oman

> **Status: AWAITING APPROVAL — no application code will be written until this plan is approved.**

---

## 0. Key decision to confirm before any code (please read first)

The repository **already contains a working Vite + React 19 + Express SPA** (AI Studio export, ~6,300 lines) with these components already drafted: `Home`, `AuditPage`, `LeakTestPage`, `PlatformDashboard`, `AboutContact`, `WhitePapers`, `PrivacyPolicy`, `AICopilot`, `Header`. The current AI Copilot runs on **Gemini** (`@google/genai`) and WhatsApp uses **Twilio**.

Your brief specifies a **different stack**: **Next.js 16 App Router + TypeScript + Tailwind + Firebase (Auth/Firestore/Hosting) + next-intl + Anthropic Claude Copilot + Airtable + WhatsApp Business API + Resend**.

There are three viable paths. I recommend **Path A**.

| Path | What it means | Trade-off |
|------|----------------|-----------|
| **A — Fresh Next.js 16 build (recommended)** | New Next.js 16 App Router project built to spec. Reuse copy, design tokens, SVG/dashboard logic, and the numbers/disclaimers from the existing components, but re-author as server/client components. Old Vite files removed. | Cleanest match to brief, best SEO (SSR/metadata, sitemap, hreflang), Firebase Hosting ready. Most work. |
| **B — Keep Vite SPA, bolt on the missing integrations** | Stay on Vite/Express; swap Gemini→Claude, Twilio→WhatsApp Business API, add Airtable + Firebase Auth. | Faster, but **loses SSR SEO** (schema.org, per-page metadata, hreflang are weak in a client-only SPA) — and the brief makes SEO a build-time hard requirement. Not recommended. |
| **C — Hybrid** | Next.js front, keep Express server as a separate API. | Two runtimes to deploy; more ops overhead. Not recommended. |

**Decision needed:** confirm **Path A** (assumed below), or tell me to use B/C.
Two sub-questions that also affect the plan:
1. **Email provider:** Resend (recommended — simplest API) vs Nodemailer/SMTP?
2. **Booking:** Google Calendar embed (the MCP Google Calendar tools are available, so real slot creation is possible) vs Calendly embed?

Everything below assumes **Path A + Resend + Google Calendar**.

---

## 1. Tech stack (target)

- **Framework:** Next.js 16 (App Router, React Server Components, Route Handlers), TypeScript (strict)
- **Styling:** Tailwind CSS v4, dark-mode-first, CSS variables for the palette
- **i18n:** `next-intl` with `[locale]` segment routing (`/en/...`, `/ar/...`), RTL for Arabic
- **Auth:** Firebase Auth — Google OAuth2 primary, email/password fallback; session cookies via Firebase Admin
- **DB:** Firestore (user profiles, audit-trail, diagnostic submissions mirror, rate-limit ledger)
- **Storage:** Firebase Storage (uploaded CSV/Excel, encrypted at rest, locked-down rules)
- **CRM:** Airtable REST API — base `appeUbnHpGamghy8q`, table `tbl6r1kqhvRN4IDgI`
- **AI:** Anthropic Claude `claude-sonnet-4-6` via `@anthropic-ai/sdk` (server-side route handler, streaming)
- **WhatsApp:** WhatsApp Business Cloud API (Graph API) — notifications + click-to-chat deep links
- **Email:** Resend (`resend` SDK)
- **Hosting:** Firebase Hosting + Cloud Functions / Web Frameworks for the Next.js server runtime
- **SEO:** Next.js Metadata API, JSON-LD, `next-sitemap` (or App Router `sitemap.ts`/`robots.ts`), hreflang

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

## 4. API route handlers (`app/api/`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/diagnostic` | POST | Validate Leak-Test submission → rate-limit (1/email/30d via Firestore) → write to **Airtable** (`tbl6r1kqhvRN4IDgI`, fields: Full Name, Company, Phone, Email, Asset Type, Source="Website Free Diagnostic", Stage="🎯 Target") → **WhatsApp notify** +968 7411 4028 → **email** confirmation → return illustrative/scaled result |
| `/api/upload` | POST | Multipart CSV/Excel; **server-side validation**: mime+extension, ≤10MB, schema check, macro/`.xlsm` rejection, never executes; store in Firebase Storage; audit-log entry |
| `/api/copilot` | POST | Streams Claude `claude-sonnet-4-6` with the **exact system prompt** from brief; "Powered by Claude" disclosed in UI |
| `/api/whatsapp/notify` | POST (internal) | Send WhatsApp Business API template/message to founder |
| `/api/whatsapp/webhook` | GET/POST | Verify + receive inbound WhatsApp (register-via-WhatsApp flow → same Airtable pipeline) |
| `/api/lead` | POST | Generic lead/contact/investor/paper-gate capture → Airtable + email |
| `/api/auth/session` | POST/DELETE | Exchange Firebase ID token → httpOnly session cookie (CSRF-safe); on first sign-in mirror `{displayName,email}` to Airtable Prospects |
| `/api/booking` | POST | Create Google Calendar event (real slot) / or proxy to Calendly |
| `/api/papers/[slug]` | GET | Serve gated PDF after capture check + audit-log |
| `/api/audit-log` | (lib, not public) | `logEvent({userId, action, timestamp})` helper used across routes |

---

## 5. Integrations — library modules (`/lib`)

- `lib/firebase/client.ts` + `lib/firebase/admin.ts` — Auth, Firestore, Storage clients
- `lib/airtable.ts` — typed create/find for leads + prospects (base/table IDs from env)
- `lib/whatsapp.ts` — Business Cloud API send + click-to-chat deep-link builder (pre-filled messages)
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
- `.env.example` (full): `NEXT_PUBLIC_FIREBASE_CONFIG`, `FIREBASE_ADMIN_*`, `GOOGLE_CLIENT_ID`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID=appeUbnHpGamghy8q`, `AIRTABLE_TABLE_ID=tbl6r1kqhvRN4IDgI`, `AIRTABLE_PROSPECTS_TABLE_ID`, `ANTHROPIC_API_KEY`, `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_TO=+96874114028`, `RESEND_API_KEY`, `CALENDAR_*`
- `README.md` rewritten: setup, env, Firebase init, run/deploy instructions.

---

## 10. Build sequence (after approval)

1. Scaffold Next.js 16 + Tailwind + next-intl + design tokens + fonts; remove Vite/Express scaffold.
2. Layout shell: Header, Footer, LanguageToggle, WhatsAppFloat, CopilotWidget, message catalogs.
3. `lib/constants.ts` (numbers/copy governance) + `lib/value.ts` + SEO/JSON-LD helpers.
4. Home + Audit (flagship) + Leak-Test form + countdown/counter + result + WhatsApp share.
5. API: `/api/diagnostic`, `/api/lead`, `/api/upload`, Airtable + WhatsApp + Resend wiring.
6. Firebase Auth (Google + email/password), session cookies, AuthGate, Prospects mirror, `/portal`, `/login`.
7. Claude Copilot route + widget (streaming, suggested prompts, "Powered by Claude").
8. Remaining pages: bess, solar, technology, industries, security, privacy, cases, papers, investors, pricing, about, contact.
9. Security rules, audit log, file-upload hardening, CSP headers.
10. SEO finalize: metadata, sitemap, robots, hreflang, image optimization.
11. Firebase config files + README + `.env.example`; `tsc --noEmit` + build green.
12. Commit + push to `claude/focused-ptolemy-imel68`. (No PR unless you ask.)

---

## 11. Open items needing your input

1. **Confirm Path A** (fresh Next.js 16) vs B/C.
2. **Email:** Resend (recommended) vs Nodemailer.
3. **Booking:** Google Calendar embed (recommended, MCP available) vs Calendly.
4. **WhatsApp:** confirm WhatsApp Business **Cloud API** (Graph) — vs keeping Twilio WhatsApp that's already wired. (Brief says "WhatsApp Business API"; I'll use Cloud API unless you prefer Twilio.)
5. **Assets:** real industrial photography + final white-paper PDFs — provide, or I use documented placeholders.
6. **Secrets:** I'll commit `.env.example` only; you provide real keys at deploy time.

---

*No code will be written until you approve this plan and resolve §0 / §11.*
