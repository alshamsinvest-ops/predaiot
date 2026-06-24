"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MessageCircle, Mail } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { signInWithEmail, registerWithEmail, isFirebaseConfigured } from "@/lib/firebase/client";
import GoogleSignInButton from "@/components/forms/GoogleSignInButton";
import { COMPANY } from "@/lib/constants";
import { whatsappLink } from "@/lib/api";

export default function LoginClient() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signin") await signInWithEmail(email, password);
      else await registerWithEmail(email, password);
      router.push("/portal");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-secondary";

  // Graceful state when Firebase Auth isn't configured yet (e.g. preview env):
  // show a clear "sign-in coming online" panel instead of buttons that error.
  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-md">
        <div className="surface rounded-2xl p-8 text-center">
          <h1 className="font-display text-2xl font-extrabold">{t("title")}</h1>
          <p className="mt-3 text-sm text-ink-muted">
            Secure sign-in is being finalized. In the meantime, start your free diagnostic
            or reach us directly — we'll set up your access.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/economic-audit"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04101f]"
            >
              {tc("startDiagnostic")}
            </Link>
            <a
              href={whatsappLink(COMPANY.whatsappNumber, "Hello PREDAIOT — I'd like access to the client portal.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5"
            >
              <MessageCircle className="h-4 w-4" /> {tc("talkExpert")}
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center justify-center gap-2 text-sm text-ink-muted hover:text-ink"
            >
              <Mail className="h-4 w-4" /> {COMPANY.email}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="surface rounded-2xl p-8">
        <h1 className="font-display text-2xl font-extrabold">{t("title")}</h1>

        {/* Google primary */}
        <div className="mt-6">
          <GoogleSignInButton onSignedIn={() => router.push("/portal")} />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-muted">
          <span className="h-px flex-1 bg-white/10" /> {t("or")} <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email/password fallback */}
        <form onSubmit={submit} className="space-y-3">
          <input required type="email" placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          <input required type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          {err ? <p className="text-xs text-red-400">{err}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-[#04101f] disabled:opacity-60"
          >
            {mode === "signin" ? t("signIn") : t("register")}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "register" : "signin"))}
          className="mt-4 w-full text-center text-xs text-ink-muted hover:text-ink"
        >
          {mode === "signin" ? t("toggleRegister") : t("toggleSignIn")}
        </button>
      </div>
    </div>
  );
}
