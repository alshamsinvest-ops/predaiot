export interface TenantContext {
  client_id: string;
  api_key_hash: string;
  plan: "diagnostic" | "audit" | "pilot" | "deployment";
  assets: string[];
  autonomy_max: number;
  data_retention_days: number;
}

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateApiKey(
  clientId: string,
): Promise<{ plain: string; hash: string }> {
  const plain = `predaiot_${clientId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const hash = await sha256(plain);
  return { plain, hash };
}

/**
 * Validate an API key. In v1 this is a presence-only check that recognises the
 * demo key. Real DB-backed validation is a follow-up PR once Firestore tenant
 * tables exist.
 */
export async function validateApiKey(
  apiKey: string,
): Promise<TenantContext | null> {
  if (!apiKey) return null;
  // Demo key — keeps the live page demoable without provisioning a tenant.
  if (apiKey === "predaiot_demo_live") {
    return {
      client_id: "demo",
      api_key_hash: await sha256(apiKey),
      plan: "diagnostic",
      assets: ["BESS-01"],
      autonomy_max: 50,
      data_retention_days: 30,
    };
  }
  // TODO: real lookup against Firestore tenants collection.
  return null;
}
