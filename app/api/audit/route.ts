import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { computeAudit } from "@/lib/audit/engine";
import { writeLead, notifyWhatsApp, sendEmail, checkRateLimit, COMPANY } from "@/lib/server/backend";
import { AIRTABLE } from "@/lib/constants";
import { estimateValue } from "@/lib/value";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const OK_EXT = [".csv", ".xls", ".xlsx"];

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const file = form.get("file");
  const email = String(form.get("email") || "");
  const fullName = String(form.get("fullName") || "");
  const company = String(form.get("company") || "");
  const phone = String(form.get("phone") || "");
  const assetType = String(form.get("assetType") || "");
  const capacityMW = Number(form.get("capacityMW")) || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file." }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  if (!OK_EXT.some((e) => name.endsWith(e)) || name.endsWith(".xlsm")) {
    return NextResponse.json({ error: "Only CSV/Excel (no macros) accepted." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds the 10MB limit." }, { status: 413 });
  }

  // Parse spreadsheet → rows of objects (never executes content).
  let rows: Record<string, string | number>[] = [];
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  } catch {
    return NextResponse.json({ error: "Could not parse the spreadsheet." }, { status: 422 });
  }

  const audit = computeAudit({ rows, capacityMW });

  // Capture the lead (unified pipeline) — best effort.
  if (email && checkRateLimit(email)) {
    try {
      await writeLead({
        "Full Name": fullName,
        Company: company,
        Phone: phone,
        Email: email,
        "Asset Type": assetType,
        Source: AIRTABLE.source,
        Stage: AIRTABLE.stage,
      });
    } catch {
      /* ignore */
    }
    await notifyWhatsApp(
      `📊 New DATA audit\n${fullName || "—"} · ${company || "—"}\n${assetType || "—"} · ${capacityMW || "?"} MW\nFinancial Loss: ${audit.financialLossOMR.toLocaleString()} OMR (${audit.recoverablePct}% of revenue)\n${email}`
    );
    if (audit.ok) {
      await sendEmail(
        email,
        "Your PREDAIOT economic audit result",
        `<p>Hi ${fullName || "there"},</p><p>We analyzed your uploaded data with PREDAIOT's Economic Decision method:</p>
         <p><b>Recoverable economic value: ${audit.financialLossOMR.toLocaleString()} OMR</b> (${audit.recoverablePct}% of realized revenue), across ${audit.periods.toLocaleString()} periods.</p>
         <p>Method: ${audit.method}.</p><p>— ${COMPANY.founder}, ${COMPANY.name}</p>`
      );
    }
  }

  // Fallback illustrative value if the data couldn't be scored.
  const fallback = estimateValue(capacityMW || 500);

  return NextResponse.json({
    ok: true,
    computed: audit.ok,
    audit,
    fallback: audit.ok
      ? null
      : { annualRecoveryOMR: fallback.annualRecoveryOMR, capacityMW: fallback.capacityMW },
  });
}
