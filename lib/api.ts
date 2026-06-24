/**
 * Client → Express backend (Path C hybrid).
 * In dev the API runs on its own port; in prod set NEXT_PUBLIC_API_URL to the
 * deployed backend (or a Firebase Hosting rewrite target).
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error((detail as { error?: string }).error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: formData });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error((detail as { error?: string }).error || `Upload failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** Build a WhatsApp click-to-chat deep link with a pre-filled message. */
export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
