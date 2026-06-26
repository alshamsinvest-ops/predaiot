import "server-only";
import {
  initializeApp,
  getApps,
  cert,
  type App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Firebase Admin (server-only). Used for verifying ID tokens, minting session
 * cookies, and writing the audit trail. Degrades to null if not configured so
 * the app still builds/runs in environments without secrets.
 */
let adminApp: App | null = null;

export function getAdminApp(): App | null {
  // Project id + service-account email aren't secret, so they default to the
  // prd2025 values. Only the PRIVATE KEY must be supplied (Vercel env) — and
  // until it is, this returns null and the app degrades gracefully.
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || "prd2025";
  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    "firebase-adminsdk-fbsvc@prd2025.iam.gserviceaccount.com";
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;

  if (!adminApp) {
    adminApp = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return adminApp;
}

export function adminAuth() {
  const a = getAdminApp();
  return a ? getAuth(a) : null;
}

export function adminDb() {
  const a = getAdminApp();
  return a ? getFirestore(a) : null;
}
