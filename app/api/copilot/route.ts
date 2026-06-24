import { NextRequest, NextResponse } from "next/server";
import { copilotReply } from "@/lib/server/backend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { messages } = await req.json().catch(() => ({ messages: null }));
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "Missing messages." }, { status: 400 });
  }
  try {
    const content = await copilotReply(messages);
    return NextResponse.json({ content: content || "…" });
  } catch (e) {
    console.error("[predaiot] Copilot error:", (e as Error).message);
    return NextResponse.json({ error: "Copilot temporarily unavailable." }, { status: 500 });
  }
}
