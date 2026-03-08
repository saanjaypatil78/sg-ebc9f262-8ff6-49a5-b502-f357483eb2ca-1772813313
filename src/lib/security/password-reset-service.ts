import { supabase } from "@/integrations/supabase/client";

type PasswordResetTokenRow = {
  id: string;
  user_id: string;
  email: string;
  token: string;
  expires_at: string;
  used_at: string | null;
};

function randomToken(length = 48): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const passwordResetService = {
  async createResetToken(params: {
    userId: string;
    email: string;
    ipAddress?: string | null;
    expiresMinutes?: number;
  }): Promise<{ token: string; expiresAt: string }> {
    const token = randomToken(64);
    const expiresAt = new Date(Date.now() + 1000 * 60 * (params.expiresMinutes ?? 30)).toISOString();

    const { error } = await supabase.from("password_reset_tokens").insert({
      user_id: params.userId,
      email: params.email,
      token,
      expires_at: expiresAt,
      ip_address: params.ipAddress ?? null,
    });

    if (error) throw new Error(error.message || "Failed to create password reset token");
    return { token, expiresAt };
  },

  async validateToken(params: { email: string; token: string }): Promise<{ ok: boolean; userId?: string; error?: string }> {
    const { data, error } = await supabase
      .from("password_reset_tokens")
      .select("id, user_id, email, token, expires_at, used_at")
      .eq("email", params.email)
      .eq("token", params.token)
      .maybeSingle();

    if (error) return { ok: false, error: error.message || "Token lookup failed" };
    if (!data) return { ok: false, error: "Invalid token" };

    const row = data as unknown as PasswordResetTokenRow;

    if (row.used_at) return { ok: false, error: "Token already used" };
    if (new Date(row.expires_at).getTime() <= Date.now()) return { ok: false, error: "Token expired" };

    return { ok: true, userId: row.user_id };
  },

  async markUsed(params: { email: string; token: string }): Promise<{ ok: boolean; error?: string }> {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("password_reset_tokens")
      .update({ used_at: now })
      .eq("email", params.email)
      .eq("token", params.token)
      .is("used_at", null);

    if (error) return { ok: false, error: error.message || "Failed to mark token used" };
    return { ok: true };
  },

  async verifyToken(token: string): Promise<{ ok: boolean; userId?: string; email?: string; error?: string }> {
    const { data, error } = await supabase
      .from("password_reset_tokens")
      .select("id, user_id, email, token, expires_at, used_at")
      .eq("token", token)
      .maybeSingle();

    if (error) return { ok: false, error: error.message || "Token lookup failed" };
    if (!data) return { ok: false, error: "Invalid token" };

    const row = data as unknown as PasswordResetTokenRow;

    if (row.used_at) return { ok: false, error: "Token already used" };
    if (new Date(row.expires_at).getTime() <= Date.now()) return { ok: false, error: "Token expired" };

    return { ok: true, userId: row.user_id, email: row.email };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
    const verified = await this.verifyToken(token);
    if (!verified.ok) return { ok: false, error: verified.error || "Invalid token" };

    const mark = await this.markUsed({ email: verified.email || "", token });
    if (!mark.ok) return { ok: false, error: mark.error || "Failed to mark token used" };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return {
        ok: false,
        error:
          error.message ||
          "No active session to update password. Use the Supabase password reset email flow to create a valid session.",
      };
    }

    return { ok: true };
  },
};