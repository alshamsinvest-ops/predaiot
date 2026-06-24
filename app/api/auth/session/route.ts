import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { logEvent } from "@/lib/auditLog";

const COOKIE = "predaiot_session";
const EXPIRES_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/** Exchange a Firebase ID token for an httpOnly session cookie (CSRF-safe). */
export async function POST(req: NextRequest) {
  const auth = adminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }
  const { idToken } = await req.json().catch(() => ({}));
  if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

  try {
    const decoded = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: EXPIRES_MS });
    const store = await cookies();
    store.set(COOKIE, sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: EXPIRES_MS / 1000,
      path: "/",
    });
    await logEvent(decoded.uid, "session.create");
    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

/** Sign out — clear the session cookie. */
export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
