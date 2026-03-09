import { supabase } from "@/integrations/supabase/client";

type EmailVerificationTokenRow = {
  id: string;
  user_id: string;
  email: string;
  token_hash: string;
  expires_at: string;
  verified_at: string | null;
};

function randomToken(length = 48): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = "";
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Crypto.subtle unavailable");
  const buf = await subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const emailVerificationService = {
  async createToken(userId: string, email: string): Promise<{ token: string; expiresAt: string }> {
    const token = randomToken(64);
    const tokenHash = await sha256Hex(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 min

    const { error } = await (supabase.from("email_verification_tokens") as any).insert({
      user_id: userId,
      email,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    if (error) throw new Error(error.message || "Failed to create verification token");

    return { token, expiresAt };
  },

  async verifyToken(token: string): Promise<{ ok: boolean; userId?: string; email?: string; error?: string }> {
    const tokenHash = await sha256Hex(token);

    const { data, error } = await (supabase.from("email_verification_tokens") as any)
      .select("id, user_id, email, token_hash, expires_at, verified_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (error) return { ok: false, error: error.message || "Token lookup failed" };
    if (!data) return { ok: false, error: "Invalid token" };

    const row = data as unknown as EmailVerificationTokenRow;

    if (row.verified_at) return { ok: false, error: "Token already used" };
    if (new Date(row.expires_at).getTime() <= Date.now()) return { ok: false, error: "Token expired" };

    const now = new Date().toISOString();

    const { error: updateError } = await (supabase.from("email_verification_tokens") as any)
      .update({ verified_at: now })
      .eq("id", row.id);

    if (updateError) return { ok: false, error: updateError.message || "Failed to verify token" };

    await (supabase.from("profiles") as any)
      .update({ email_verified: true, email_verified_at: now })
      .eq("id", row.user_id);

    return { ok: true, userId: row.user_id, email: row.email };
  },

  async verifyEmail(token: string): Promise<{ ok: boolean; userId?: string; email?: string; error?: string }> {
    return this.verifyToken(token);
  },
};