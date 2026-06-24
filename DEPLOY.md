# PREDAIOT — Deployment Runbook (preda-iot.com)

Two services: **Express API** (Cloud Run) + **Next.js web** (Firebase App Hosting).
Steps marked **(you)** need your Google/Firebase account and can't be scripted from CI.

---

## 0. Prerequisites (you)
```bash
npm i -g firebase-tools
firebase login                       # opens browser OAuth
gcloud auth login                    # for Cloud Run (Google Cloud SDK)
```
- Create/confirm a Firebase project (e.g. `predaiot`). Update `.firebaserc`,
  `apphosting.yaml`, and the Firebase env values if the project id differs.
- Enable: **Authentication** (Google + Email/Password providers), **Firestore**,
  **Storage**, **App Hosting**, and **Cloud Run** + **Artifact Registry** APIs.

## 1. Deploy the API → Cloud Run (you)
```bash
gcloud run deploy predaiot-api \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars CORS_ORIGINS=https://preda-iot.com \
  --set-env-vars AIRTABLE_BASE_ID=appeUbnHpGamghy8q,AIRTABLE_TABLE_ID=tbl6r1kqhvRN4IDgI
# then add secrets (recommended via Secret Manager, not plain env):
gcloud run services update predaiot-api --region europe-west1 \
  --set-env-vars ANTHROPIC_API_KEY=...,AIRTABLE_API_KEY=...,RESEND_API_KEY=...,\
TWILIO_ACCOUNT_SID=...,TWILIO_AUTH_TOKEN=...,TWILIO_WHATSAPP_NUMBER=whatsapp:+1...
```
> Uses `Dockerfile.api`. Rename it to `Dockerfile` if `--source` doesn't pick it up,
> or pass `--dockerfile Dockerfile.api` where supported. Note the printed service URL.

## 2. Deploy Firestore + Storage rules (you)
```bash
firebase deploy --only firestore:rules,storage --project predaiot
```

## 3. Deploy the web app → App Hosting (you)
Set `NEXT_PUBLIC_API_URL` in `apphosting.yaml` to the Cloud Run URL from step 1, then:
```bash
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set FIREBASE_ADMIN_CLIENT_EMAIL
firebase apphosting:secrets:set FIREBASE_ADMIN_PRIVATE_KEY
# ...repeat for each `secret:` entry in apphosting.yaml
firebase apphosting:backends:create --project predaiot   # first time; connects this GitHub repo
# subsequent deploys happen automatically on push to the connected branch
```

**Alternative (classic web-frameworks Hosting, single command):**
```bash
firebase experiments:enable webframeworks
firebase deploy --only hosting --project predaiot     # builds Next.js, deploys to Hosting
```
With this path the web app calls the API via the absolute `NEXT_PUBLIC_API_URL`
(set it as a build env var). The Next.js `/api/auth/session` route stays on Hosting.

## 4. Custom domain (you)
Firebase Console → App Hosting (or Hosting) → Add custom domain → `preda-iot.com`
→ add the shown A/TXT records at your DNS registrar → wait for SSL provisioning.
Add `https://preda-iot.com` to Firebase Auth → Authorized domains.

## 5. Post-deploy verification
```bash
curl https://<cloud-run-url>/api/health           # {"ok":true}
# Visit https://preda-iot.com — submit a Leak Test, confirm the row in Airtable,
# the WhatsApp ping to +968 7411 4028, and a Copilot reply.
```

## CI / CD (GitHub Actions)

- **`.github/workflows/ci.yml`** — typecheck + `next build` on every push/PR, so the
  branch is always known-deployable. No credentials, no deploy.
- **`.github/workflows/deploy.yml`** — auto-deploys on **push to `main`** (or manual
  *Run workflow*): builds the API image → Artifact Registry → Cloud Run, captures the
  API URL, then builds the Next.js app with that URL and runs
  `firebase deploy --only hosting,firestore:rules,storage`.

### Required GitHub repository secrets
Set these in **Settings → Secrets and variables → Actions** before the first deploy.

| Secret | Purpose |
|--------|---------|
| `GCP_SA_KEY` | Service-account JSON. Roles: Cloud Run Admin, Cloud Build Editor, Artifact Registry Writer, Firebase Hosting Admin, Cloud Datastore (Firestore) Index/Rules, Service Account User. |
| `ANTHROPIC_API_KEY` | Copilot (Claude). |
| `AIRTABLE_API_KEY` | CRM writes. |
| `RESEND_API_KEY` | Email. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` | WhatsApp. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` … `_APP_ID` | Firebase web config (build-time). |
| `NEXT_PUBLIC_GOOGLE_CALENDAR_URL` | Booking embed (optional). |
| `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` | Server session route (runtime). |

> **One-time bootstrap (you):** the project, enabled APIs, Auth providers, Firestore,
> Storage, and the custom domain (steps 0 & 4 above) still require your account.
> After that, every push to `main` ships automatically.
>
> For keyless auth, replace `credentials_json` in `deploy.yml` with
> `workload_identity_provider` + `service_account` (Workload Identity Federation).

