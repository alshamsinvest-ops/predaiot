import { NextRequest, NextResponse } from "next/server";
import { copilotReply, checkIpRate, clientIp } from "@/lib/server/backend";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

export async function POST(req: NextRequest) {
  // Abuse control: cap requests per IP so the LLM can't be run up as a bill/DoS.
  if (!checkIpRate(`copilot:${clientIp(req)}`, 20, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const { messages } = await req.json().catch(() => ({ messages: null }));
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing messages." }, { status: 400 });
  }

  // Bound payload: last N turns, each capped, string content only.
  const safe = messages
    .slice(-MAX_MESSAGES)
    .filter((m) => m && typeof m.content === "string")
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, MAX_CHARS),
    }));
  if (safe.length === 0) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  try {
    const content = await copilotReply(safe);
    return NextResponse.json({ content: content || "…" });
  } catch (e) {
    console.error("[predaiot] Copilot error:", (e as Error).message);
    return NextResponse.json({ error: "Copilot temporarily unavailable." }, { status: 500 });
  }
}
