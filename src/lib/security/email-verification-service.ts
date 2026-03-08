import { supabase } from "@/integrations/supabase/client";

type EmailVerificationTokenRow = {
  id: string;
  user_id: string;
  email: string;
  token: string;
  expires_at: string;
  verified_at: string | null;
};

function randomToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const emailVerificationService = {
  async createToken(userId: string, email: string): Promise<{ token: string; expiresAt: string }> {
    const token = randomToken(48);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 min

    const { error } = await supabase.from("email_verification_tokens").insert({
      user_id: userId,
      email,
      token,
      expires_at: expiresAt,
    });

    if (error) throw new Error(error.message || "Failed to create verification token");

    return { token, expiresAt };
  },

  async verifyToken(token: string): Promise<{ ok: boolean; userId?: string; email?: string; error?: string }> {
    const { data, error } = await supabase
      .from("email_verification_tokens")
      .select("id, user_id, email, token, expires_at, verified_at")
      .eq("token", token)
      .maybeSingle();

    if (error) return { ok: false, error: error.message || "Token lookup failed" };
    if (!data) return { ok: false, error: "Invalid token" };

    const row = data as unknown as EmailVerificationTokenRow;

    if (row.verified_at) return { ok: false, error: "Token already used" };
    if (new Date(row.expires_at).getTime() <= Date.now()) return { ok: false, error: "Token expired" };

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("email_verification_tokens")
      .update({ verified_at: now })
      .eq("id", row.id);

    if (updateError) return { ok: false, error: updateError.message || "Failed to verify token" };

    await supabase
      .from("users")
      .update({ email_verified: true, email_verified_at: now })
      .eq("id", row.user_id);

    return { ok: true, userId: row.user_id, email: row.email };
  },

  async verifyEmail(token: string): Promise<{ ok: boolean; userId?: string; email?: string; error?: string }> {
    return this.verifyToken(token);
  },
};