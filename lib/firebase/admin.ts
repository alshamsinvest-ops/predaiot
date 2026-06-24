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
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
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
