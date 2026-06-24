import { NextRequest, NextResponse } from "next/server";
import { writeLead, notifyWhatsApp } from "@/lib/server/backend";
import { AIRTABLE } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { type, fullName, email, company, message } = body;
  if (!email) return NextResponse.json({ error: "Missing email." }, { status: 400 });

  try {
    await writeLead({
      "Full Name": fullName || "",
      Company: company || "",
      Email: email,
      Source: `Website ${type || "lead"}`,
      Stage: AIRTABLE.stage,
    });
  } catch (e) {
    console.warn("[predaiot] Airtable lead failed:", (e as Error).message);
  }

  await notifyWhatsApp(`✉️ New ${type || "lead"}: ${fullName || email} (${email})${message ? `\n${message}` : ""}`);
  return NextResponse.json({ ok: true });
}
