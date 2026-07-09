import { NextRequest, NextResponse } from "next/server";
import { writeLead, notifyWhatsApp, sendEmail, checkIpRate, clientIp, COMPANY } from "@/lib/server/backend";
import { AIRTABLE } from "@/lib/constants";

export const runtime = "nodejs";

/** Where lead notifications are delivered. Defaults to the founder's inbox. */
const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || COMPANY.email;

const cap = (s: unknown, n = 2000) => String(s ?? "").slice(0, n);
const esc = (s: string) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export async function POST(req: NextRequest) {
  // Abuse control: cap submissions per IP so the form can't be used to spam.
  if (!checkIpRate(`lead:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const type = cap(body.type, 40);
  const fullName = cap(body.fullName, 200);
  const email = cap(body.email, 200);
  const company = cap(body.company, 200);
  const message = cap(body.message, 4000);
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

  // Deliver the submission straight to the founder's inbox.
  await sendEmail(
    NOTIFY_TO,
    `New ${type || "lead"} — ${fullName || email}`,
    `<h2>New ${esc(type || "lead")} from the PREDAIOT website</h2>
     <table cellpadding="6" style="border-collapse:collapse">
       <tr><td><b>Name</b></td><td>${esc(fullName || "—")}</td></tr>
       <tr><td><b>Email</b></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
       <tr><td><b>Company</b></td><td>${esc(company || "—")}</td></tr>
       <tr><td><b>Type</b></td><td>${esc(type || "lead")}</td></tr>
       ${message ? `<tr><td valign="top"><b>Message</b></td><td>${esc(message)}</td></tr>` : ""}
     </table>
     <p style="color:#667">Reply directly to this person at ${esc(email)}.</p>`
  );

  return NextResponse.json({ ok: true });
}
