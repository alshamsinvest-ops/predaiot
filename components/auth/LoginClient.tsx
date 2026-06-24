"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { signInWithEmail, registerWithEmail } from "@/lib/firebase/client";
import GoogleSignInButton from "@/components/forms/GoogleSignInButton";

export default function LoginClient() {
  const t = useTranslations("login");
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

  const field = "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[--color-secondary]";

  return (
    <div className="mx-auto max-w-md">
      <div className="surface rounded-2xl p-8">
        <h1 className="font-display text-2xl font-extrabold">{t("title")}</h1>

        {/* Google primary */}
        <div className="mt-6">
          <GoogleSignInButton onSignedIn={() => router.push("/portal")} />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-[--color-ink-muted]">
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
            className="w-full rounded-full bg-[--color-secondary] px-6 py-3 text-sm font-semibold text-[#04101f] disabled:opacity-60"
          >
            {mode === "signin" ? t("signIn") : t("register")}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "register" : "signin"))}
          className="mt-4 w-full text-center text-xs text-[--color-ink-muted] hover:text-[--color-ink]"
        >
          {mode === "signin" ? t("toggleRegister") : t("toggleSignIn")}
        </button>
      </div>
    </div>
  );
}
