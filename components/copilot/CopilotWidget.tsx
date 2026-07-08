"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Send } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { COPILOT } from "@/lib/constants";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function CopilotWidget() {
  const t = useTranslations("copilot");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.content || "…" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I can't reach the decision engine right now. Please try again, or book a free diagnostic.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-[2px] bg-secondary px-4 py-3 text-sm font-semibold text-[#0B0D0F] transition-colors hover:brightness-105"
        aria-label={tc("talkExpert")}
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[#0B0D0F]" />
            {tc("talkExpert")}
          </>
        )}
      </button>

      {open ? (
        <div className="fixed bottom-20 end-5 z-40 flex h-[32rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-[2px] border border-line bg-primary-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-primary-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-secondary" />
              <div>
                <p className="text-sm font-semibold">{COPILOT.name}</p>
                <p className="text-[10px] text-ink-muted">{COPILOT.poweredBy}</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-ink-muted">{t("intro")}</p>
                <div className="flex flex-wrap gap-2">
                  {COPILOT.suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-ink-muted hover:bg-white/5"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-secondary text-[#04101f]"
                      : "bg-white/5 text-ink"
                  }`}
                >
                  {m.content}
                </div>
              ))
            )}
            {busy ? <p className="text-xs text-ink-muted">…</p> : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm outline-none focus:border-secondary"
            />
            <button
              type="submit"
              disabled={busy}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-[#04101f] disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
