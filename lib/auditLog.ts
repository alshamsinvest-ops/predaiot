import "server-only";
import { adminDb } from "./firebase/admin";

/**
 * Append-only audit trail: every data-access/mutation event is logged with
 * {userId, action, timestamp}. No-ops gracefully if Firestore isn't configured.
 */
export async function logEvent(userId: string, action: string, meta?: Record<string, unknown>) {
  const db = adminDb();
  if (!db) return;
  try {
    await db.collection("audit_log").add({
      userId: userId || "anonymous",
      action,
      meta: meta ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch {
    /* never block the request on logging */
  }
}
