# PREDAIOT

**Economic Decision Intelligence for Energy Assets — Oman / GCC**
Domain: [preda-iot.com](https://preda-iot.com) · Founder: Chams Eddine Madi · Muscat, Oman

Full-stack bilingual (EN/AR) platform that helps energy operators find recoverable economic
value in solar, battery and industrial assets — built on Oman's published market data.

---

## Architecture (Path C — hybrid)

| Layer | Stack |
|-------|-------|
| **Frontend** | Next.js 16 (App Router, RSC) · TypeScript · Tailwind v4 · `next-intl` (EN/AR + RTL) · Firebase Auth |
| **Backend API** | Express (`server.ts`) — Claude Copilot, diagnostic/lead/upload, Twilio WhatsApp, Resend email |
| **Data** | Airtable (CRM leads) · Firestore (profiles, audit log, rate-limit) · Firebase Storage (uploads) |
| **AI** | Anthropic Claude `claude-sonnet-4-6` |
| **Hosting** | Firebase Hosting (web) + Express API as Cloud Run service (`/api/**` rewrite) |

The Next.js app calls the Express API through `NEXT_PUBLIC_API_URL`
(separate port in dev, Hosting rewrite in prod).

## Project layout

```
app/[locale]/        16 localized routes (home, economic-audit, bess, solar, …)
app/api/auth/session Firebase session-cookie route (Admin SDK)
app/sitemap.ts robots.ts manifest.ts
components/           layout, ui, forms, copilot, dashboard, auth
lib/                 constants (number/copy governance), value, seo, api, firebase
messages/            en.json · ar.json
server.ts            Express API backend
firebase.json firestore.rules storage.rules
```

> **Content governance:** every economic figure on the site comes from `lib/constants.ts`.
> The banned-claims list is documented there. Do not hardcode numbers in components.

## Local development

```bash
npm install
cp .env.example .env.local      # fill in your keys
npm run dev                     # runs Next.js (:3000) + Express API (:8787) together
```

- `npm run dev:web` — Next.js only
- `npm run dev:api` — Express API only
- `npm run build` — production build · `npm run typecheck` — `tsc --noEmit`

## Environment variables

See `.env.example`. Key groups:
- **Firebase** (client `NEXT_PUBLIC_FIREBASE_*` + admin `FIREBASE_ADMIN_*`)
- **GOOGLE_CLIENT_ID** — Google OAuth2 provider for Firebase Auth
- **ANTHROPIC_API_KEY** — Copilot
- **AIRTABLE_API_KEY** (+ fixed `AIRTABLE_BASE_ID=appeUbnHpGamghy8q`, `AIRTABLE_TABLE_ID=tbl6r1kqhvRN4IDgI`)
- **TWILIO_*** — WhatsApp notifications
- **RESEND_API_KEY** — email

All integrations degrade gracefully when unset, so the app builds and runs without secrets.

## Security

- HTTPS enforced (Hosting headers + HSTS); no mixed content.
- Firebase Auth session cookies (httpOnly, SameSite) — CSRF-safe.
- Firestore rules: users read/write only their own data; audit log append-only via Admin SDK.
- Storage rules: owner-only, type + size constrained; encrypted at rest.
- Uploads validated server-side (CSV/Excel only, ≤10MB, macro/`.xlsm` rejected, never executed).
- Audit trail: `{userId, action, timestamp}` for data-access events (`lib/auditLog.ts`).
- Privacy Policy aligned with Oman PDPL (Royal Decree 6/2022).

> **Rate limiting** for the free diagnostic (1/email/30 days) is in-memory in `server.ts`.
> For multi-instance production, back it with the Firestore `diagnostics` collection.

## Deployment

```bash
# 1. Deploy the Express API to Cloud Run as service "predaiot-api"
#    (build server.ts; expose API_PORT). Set its env vars (Anthropic, Airtable, Twilio, Resend).
# 2. Deploy the Next.js frontend + rules to Firebase Hosting:
firebase deploy --only hosting,firestore:rules,storage
```

Firebase Hosting serves the Next.js framework backend and rewrites `/api/**`
to the `predaiot-api` Cloud Run service (see `firebase.json`). Point the custom
domain `preda-iot.com` at the Hosting site.

## SEO

Per-page metadata (title/description/OG/Twitter), JSON-LD (Organization site-wide,
Service on audit/bess/pricing, Article on papers), `ar-OM`/`en` hreflang, clean URLs,
auto `sitemap.xml` + `robots.txt`.
