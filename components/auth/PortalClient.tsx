"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, LogOut } from "lucide-react";
import { onAuthStateChanged, getFirebaseAuth, signOut, type User } from "@/lib/firebase/client";
import { API_BASE } from "@/lib/api";
import GoogleSignInButton from "@/components/forms/GoogleSignInButton";

const MAX_BYTES = 10 * 1024 * 1024;
const OK_EXT = [".csv", ".xls", ".xlsx"];

export default function PortalClient() {
  const t = useTranslations("portal");
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  async function upload(file: File) {
    setStatus(null);
    const lower = file.name.toLowerCase();
    if (!OK_EXT.some((e) => lower.endsWith(e)) || lower.endsWith(".xlsm")) {
      return setStatus("Only CSV/Excel files (no macros) are accepted.");
    }
    if (file.size > MAX_BYTES) return setStatus("File exceeds 10MB.");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("email", user?.email || "");
    try {
      await fetch(`${API_BASE}/api/upload`, { method: "POST", body: fd });
      setStatus("Uploaded ✓");
    } catch {
      setStatus("Upload failed — please try again.");
    }
  }

  if (!ready) return <div className="surface mx-auto max-w-md rounded-2xl p-8 text-center">…</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-md">
        <div className="surface rounded-2xl p-8">
          <h1 className="font-display text-2xl font-extrabold">{t("title")}</h1>
          <p className="mt-2 text-sm text-[--color-ink-muted]">{t("lead")}</p>
          <div className="mt-6">
            <GoogleSignInButton onSignedIn={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="surface flex items-center justify-between rounded-2xl p-6">
        <div>
          <p className="text-xs text-[--color-ink-muted]">{t("signedInAs")}</p>
          <p className="font-semibold">{user.displayName || user.email}</p>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
          <LogOut className="h-4 w-4" /> {t("signOut")}
        </button>
      </div>

      <div className="surface rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold">{t("uploadTitle")}</h2>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-black/10 px-4 py-4 text-sm">
          <Upload className="h-5 w-5 text-[--color-secondary]" />
          <span>CSV / Excel · max 10MB · never executed</span>
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
        </label>
        {status ? <p className="mt-2 text-sm text-[--color-ink-muted]">{status}</p> : null}
      </div>
    </div>
  );
}
