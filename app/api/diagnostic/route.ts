import { NextRequest, NextResponse } from "next/server";
import { writeLead, notifyWhatsApp, sendEmail, checkRateLimit, PRIMARY, COMPANY } from "@/lib/server/backend";
import { estimateValue } from "@/lib/value";
import { AIRTABLE } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { fullName, email, phone, company, assetType, capacityMW, noData } = body;
  if (!fullName || !email || !phone || !company) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!checkRateLimit(String(email))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const mw = noData ? PRIMARY.assetMW : Number(capacityMW) || PRIMARY.assetMW;
  const estimate = estimateValue(mw);

  try {
    await writeLead({
      "Full Name": fullName,
      Company: company,
      Phone: phone,
      Email: email,
      "Asset Type": assetType || "",
      Source: AIRTABLE.source,
      Stage: AIRTABLE.stage,
    });
  } catch (e) {
    console.warn("[predaiot] Airtable write failed:", (e as Error).message);
  }

  await notifyWhatsApp(
    `🎯 New Leak Test\n${fullName} · ${company}\n${assetType || "—"} · ${mw} MW\n${email} · ${phone}\nEst. ~${estimate.annualRecoveryOMR.toLocaleString()} OMR/yr`
  );

  await sendEmail(
    email,
    "Your PREDAIOT 7-Day Leak Test is underway",
    `<p>Hi ${fullName},</p><p>Thanks for requesting your free 7-Day Leak Test. Based on a ${mw} MW asset, the illustrative recoverable value is ~${estimate.annualRecoveryOMR.toLocaleString()} OMR/year (scaled from our published ${PRIMARY.annualRevenueOMR.toLocaleString()} OMR / ${PRIMARY.assetMW} MW benchmark).</p><p>We'll be in touch within 7 days.</p><p>— ${COMPANY.founder}, ${COMPANY.name}</p>`
  );

  // Notify the founder of every new diagnostic request.
  await sendEmail(
    process.env.LEAD_NOTIFY_EMAIL || COMPANY.email,
    `New Leak Test — ${fullName} (${company})`,
    `<h2>New 7-Day Leak Test request</h2>
     <table cellpadding="6" style="border-collapse:collapse">
       <tr><td><b>Name</b></td><td>${fullName}</td></tr>
       <tr><td><b>Company</b></td><td>${company}</td></tr>
       <tr><td><b>Email</b></td><td><a href="mailto:${email}">${email}</a></td></tr>
       <tr><td><b>Phone</b></td><td>${phone}</td></tr>
       <tr><td><b>Asset type</b></td><td>${assetType || "—"}</td></tr>
       <tr><td><b>Capacity</b></td><td>${mw} MW</td></tr>
       <tr><td><b>Est. recovery</b></td><td>~${estimate.annualRecoveryOMR.toLocaleString()} OMR/yr</td></tr>
     </table>`
  );

  return NextResponse.json({
    ok: true,
    illustrative: true,
    capacityMW: estimate.capacityMW,
    annualRecoveryOMR: estimate.annualRecoveryOMR,
    profitMinPct: estimate.profitMinPct,
    profitMaxPct: estimate.profitMaxPct,
  });
}
