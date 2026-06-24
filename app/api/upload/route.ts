import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const OK_EXT = [".csv", ".xls", ".xlsx"];

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
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

  // Reject executable signatures (MZ / ELF); never parse macros or execute content.
  const head = Buffer.from(await file.slice(0, 4).arrayBuffer()).toString("hex");
  if (head.startsWith("4d5a") || head.startsWith("7f454c46")) {
    return NextResponse.json({ error: "Rejected: not a spreadsheet." }, { status: 415 });
  }

  // NOTE: production persists to Firebase Storage (encrypted, owner-only rules)
  // and writes an audit-log entry. We never execute uploaded content.
  console.log(`[predaiot] Upload accepted: ${file.name} (${file.size} bytes)`);
  return NextResponse.json({ ok: true, name: file.name, size: file.size });
}
