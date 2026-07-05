/**
 * Shared backend logic for Next.js route handlers (Vercel-native).
 * Mirrors the Express server.ts integrations so the platform runs as a single
 * app on Vercel. All integrations degrade gracefully when env vars are absent.
 * Node runtime only (imported exclusively by app/api/* route handlers).
 */
import Anthropic from "@anthropic-ai/sdk";
import Airtable from "airtable";
import twilio from "twilio";
import { Resend } from "resend";
import { AIRTABLE, COMPANY, COPILOT, COPILOT_SYSTEM_PROMPT, PRIMARY } from "@/lib/constants";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const airtableBase =
  process.env.AIRTABLE_API_KEY
    ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
        process.env.AIRTABLE_BASE_ID || AIRTABLE.baseId
      )
    : null;

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function writeLead(fields: Record<string, string>) {
  if (!airtableBase) {
    console.log("[predaiot] LEAD (no Airtable):", fields);
    return;
  }
  await airtableBase(process.env.AIRTABLE_TABLE_ID || AIRTABLE.leadsTableId).create([{ fields }]);
}

export async function notifyWhatsApp(text: string) {
  if (!twilioClient) return;
  const from = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  // Recipient for lead notifications — override with WHATSAPP_TO (E.164).
  const toNumber = process.env.WHATSAPP_TO || COMPANY.phoneE164;
  try {
    await twilioClient.messages.create({ from, to: `whatsapp:${toNumber}`, body: text });
  } catch (e) {
    console.warn("[predaiot] WhatsApp notify failed:", (e as Error).message);
  }
}

export async function sendEmail(to: string, subject: string, html: string) {
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

/** NVIDIA NIM — OpenAI-compatible chat completions. Used when configured. */
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

async function nvidiaReply(
  system: string,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  const resp = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.NVIDIA_MODEL || COPILOT.nvidiaModel,
      max_tokens: maxTokens,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ],
    }),
  });
  if (!resp.ok) {
    throw new Error(`NVIDIA API ${resp.status}: ${await resp.text().catch(() => "")}`);
  }
  const data = (await resp.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function copilotReply(
  messages: { role: string; content: string }[],
  whatsapp = false
): Promise<string> {
  const system =
    COPILOT_SYSTEM_PROMPT +
    (whatsapp
      ? "\n\nYou are replying over WhatsApp. Keep it very short and mobile-friendly. Reply in Arabic if the user writes Arabic."
      : "");
  const maxTokens = whatsapp ? 400 : 700;

  // Provider order: Anthropic when configured, NVIDIA NIM as fallback,
  // then NVIDIA as rescue if Anthropic errors at runtime.
  if (anthropic) {
    try {
      const resp = await anthropic.messages.create({
        model: COPILOT.model,
        max_tokens: maxTokens,
        system,
        messages: messages.map((m) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
      });
      return resp.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("\n");
    } catch (e) {
      console.warn("[predaiot] Anthropic failed, trying NVIDIA:", (e as Error).message);
      if (!process.env.NVIDIA_API_KEY) throw e;
    }
  }

  if (process.env.NVIDIA_API_KEY) {
    return nvidiaReply(system, messages, maxTokens);
  }

  return "I'm in offline mode right now. PREDAIOT finds recoverable economic value in energy assets — scaled from Oman's published 862,903 OMR / 500 MW benchmark. Start a free 7-day diagnostic and we'll quantify your asset's potential.";
}

/** Rate limit: 1 diagnostic / email / 30 days. In-memory (per serverless
 *  instance). For strict global limits, back this with Firestore. */
const RATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const lastDiagnostic = new Map<string, number>();

export function checkRateLimit(email: string): boolean {
  const key = email.toLowerCase();
  const prev = lastDiagnostic.get(key);
  if (prev && Date.now() - prev < RATE_WINDOW_MS) return false;
  lastDiagnostic.set(key, Date.now());
  return true;
}

export { PRIMARY, COMPANY };
