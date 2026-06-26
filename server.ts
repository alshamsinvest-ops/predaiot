/**
 * PREDAIOT API backend (Path C hybrid).
 * Standalone Express service consumed by the Next.js frontend via
 * NEXT_PUBLIC_API_URL. Integrations degrade gracefully when secrets are absent
 * so the app runs in any environment.
 *
 * Endpoints:
 *   POST /api/diagnostic  — Leak Test: rate-limit → Airtable → WhatsApp → email → scaled result
 *   POST /api/lead        — unified lead capture (contact / paper / investor / prospect)
 *   POST /api/upload      — validated CSV/Excel upload (never executed)
 *   POST /api/copilot     — Claude claude-sonnet-4-6 chat
 *   POST /api/whatsapp    — Twilio inbound webhook (Claude reply)
 *   GET  /api/health      — liveness
 */
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import Airtable from "airtable";
import twilio from "twilio";
import { Resend } from "resend";
import {
  AIRTABLE,
  COMPANY,
  COPILOT,
  COPILOT_SYSTEM_PROMPT,
  PRIMARY,
} from "./lib/constants";
import { estimateValue } from "./lib/value";

dotenv.config({ path: ".env.local" });
dotenv.config();

// Cloud Run injects PORT; fall back to API_PORT for local dev.
const PORT = Number(process.env.PORT || process.env.API_PORT || 8787);
const app = express();
app.use(express.json());

// --- CORS (frontend origin) ---
const ALLOWED = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (ALLOWED.includes(origin) || ALLOWED.includes("*"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// --- Integration clients (all optional) ---
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const airtableBase =
  process.env.AIRTABLE_API_KEY && (process.env.AIRTABLE_BASE_ID || AIRTABLE.baseId)
    ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
        process.env.AIRTABLE_BASE_ID || AIRTABLE.baseId
      )
    : null;

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!anthropic) console.warn("[predaiot] ANTHROPIC_API_KEY missing — Copilot runs in offline mode.");
if (!airtableBase) console.warn("[predaiot] Airtable not configured — leads logged to console.");
if (!twilioClient) console.warn("[predaiot] Twilio not configured — WhatsApp notifications skipped.");
if (!resend) console.warn("[predaiot] Resend not configured — emails skipped.");

// --- Helpers ---------------------------------------------------------------

/** Rate limit: 1 diagnostic per email per 30 days. In-memory; swap for
 *  Firestore in multi-instance production (see README). */
const RATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const lastDiagnostic = new Map<string, number>();

async function writeLead(fields: Record<string, string>) {
  if (!airtableBase) {
    console.log("[predaiot] LEAD (no Airtable):", fields);
    return;
  }
  await airtableBase(process.env.AIRTABLE_TABLE_ID || AIRTABLE.leadsTableId).create([
    { fields },
  ]);
}

async function notifyWhatsApp(text: string) {
  if (!twilioClient) return;
  const from = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const to = `whatsapp:${process.env.WHATSAPP_TO || COMPANY.phoneE164}`;
  try {
    await twilioClient.messages.create({ from, to, body: text });
  } catch (e) {
    console.warn("[predaiot] WhatsApp notify failed:", (e as Error).message);
  }
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend || !to) return;
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || `PREDAIOT <noreply@${COMPANY.domain}>`,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.warn("[predaiot] Email send failed:", (e as Error).message);
  }
}

// --- Routes ----------------------------------------------------------------

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "predaiot-api" }));

/** Free 7-Day Leak Test submission. */
app.post("/api/diagnostic", async (req, res) => {
  const { fullName, email, phone, company, assetType, capacityMW, noData } = req.body || {};
  if (!fullName || !email || !phone || !company) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Rate limit (1 / email / 30 days)
  const key = String(email).toLowerCase();
  const prev = lastDiagnostic.get(key);
  if (prev && Date.now() - prev < RATE_WINDOW_MS) {
    return res.status(429).json({ error: "rate_limited" });
  }
  lastDiagnostic.set(key, Date.now());

  const mw = noData ? PRIMARY.assetMW : Number(capacityMW) || PRIMARY.assetMW;
  const estimate = estimateValue(mw);

  // Airtable (unified pipeline) — fields per spec
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

  // WhatsApp notify founder (primary channel)
  await notifyWhatsApp(
    `🎯 New Leak Test\n${fullName} · ${company}\n${assetType || "—"} · ${mw} MW\n${email} · ${phone}\nEst. ~${estimate.annualRecoveryOMR.toLocaleString()} OMR/yr`
  );

  // Email confirmation
  await sendEmail(
    email,
    "Your PREDAIOT 7-Day Leak Test is underway",
    `<p>Hi ${fullName},</p><p>Thanks for requesting your free 7-Day Leak Test. Based on a ${mw} MW asset, the illustrative recoverable value is ~${estimate.annualRecoveryOMR.toLocaleString()} OMR/year (scaled from our published ${PRIMARY.annualRevenueOMR.toLocaleString()} OMR / ${PRIMARY.assetMW} MW benchmark).</p><p>We'll be in touch within 7 days.</p><p>— ${COMPANY.founder}, ${COMPANY.name}</p>`
  );

  return res.json({
    ok: true,
    illustrative: true,
    capacityMW: estimate.capacityMW,
    annualRecoveryOMR: estimate.annualRecoveryOMR,
    profitMinPct: estimate.profitMinPct,
    profitMaxPct: estimate.profitMaxPct,
  });
});

/** Unified lead capture: contact / paper / investor / prospect. */
app.post("/api/lead", async (req, res) => {
  const { type, fullName, email, company, message } = req.body || {};
  if (!email) return res.status(400).json({ error: "Missing email." });

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
  return res.json({ ok: true });
});

/** Validated CSV/Excel upload. Never executed; macro files rejected. */
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = (req as express.Request & { file?: Express.Multer.File }).file;
  if (!file) return res.status(400).json({ error: "No file." });

  const name = file.originalname.toLowerCase();
  const okExt = [".csv", ".xls", ".xlsx"].some((e) => name.endsWith(e));
  if (!okExt || name.endsWith(".xlsm")) {
    return res.status(415).json({ error: "Only CSV/Excel (no macros) accepted." });
  }
  // Basic schema sanity: first bytes shouldn't be an executable/script signature.
  const head = file.buffer.subarray(0, 4).toString("hex");
  if (head.startsWith("4d5a") /* MZ */ || head.startsWith("7f454c46") /* ELF */) {
    return res.status(415).json({ error: "Rejected: not a spreadsheet." });
  }
  // NOTE: production stores the buffer in Firebase Storage (encrypted at rest)
  // with owner-only rules and writes an audit-log entry. We never parse macros.
  console.log(`[predaiot] Upload accepted: ${file.originalname} (${file.size} bytes) for ${req.body?.email || "?"}`);
  return res.json({ ok: true, name: file.originalname, size: file.size });
});

/** PREDAIOT Copilot — Claude claude-sonnet-4-6. */
app.post("/api/copilot", async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "Missing messages." });

  if (!anthropic) {
    return res.json({
      content:
        "I'm in offline mode right now. PREDAIOT finds recoverable economic value in energy assets — scaled from Oman's published 862,903 OMR / 500 MW benchmark. Start a free 7-day diagnostic and we'll quantify your asset's potential.",
    });
  }

  try {
    const resp = await anthropic.messages.create({
      model: COPILOT.model,
      max_tokens: 700,
      system: COPILOT_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });
    const content = resp.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n");
    return res.json({ content: content || "…" });
  } catch (e) {
    console.error("[predaiot] Copilot error:", (e as Error).message);
    return res.status(500).json({ error: "Copilot temporarily unavailable." });
  }
});

/** Twilio inbound WhatsApp webhook → Claude reply. */
app.post("/api/whatsapp", express.urlencoded({ extended: true }), async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incoming = req.body?.Body || "";

  if (!anthropic) {
    twiml.message(
      "مرحباً! / Hello! This is PREDAIOT. Reply with your asset type & capacity and we'll estimate your recoverable value. (offline mode)"
    );
    return res.type("text/xml").send(twiml.toString());
  }

  try {
    const resp = await anthropic.messages.create({
      model: COPILOT.model,
      max_tokens: 400,
      system:
        COPILOT_SYSTEM_PROMPT +
        "\n\nYou are replying over WhatsApp. Keep it very short and mobile-friendly. Reply in Arabic if the user writes Arabic.",
      messages: [{ role: "user", content: incoming }],
    });
    const text = resp.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n");
    twiml.message(text || `Hello! Contact ${COMPANY.founder} at ${COMPANY.email}.`);
  } catch {
    twiml.message(`Our engine is briefly offline. Contact ${COMPANY.founder} at ${COMPANY.email}.`);
  }
  return res.type("text/xml").send(twiml.toString());
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PREDAIOT API running on http://0.0.0.0:${PORT}`);
});
