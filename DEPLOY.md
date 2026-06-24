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

## CI
`.github/workflows/ci.yml` runs typecheck + `next build` on every push/PR so the
branch is always known-deployable. It does **not** deploy (no credentials in CI by
default); add a deploy job with `FIREBASE_TOKEN` / Workload Identity when ready.
