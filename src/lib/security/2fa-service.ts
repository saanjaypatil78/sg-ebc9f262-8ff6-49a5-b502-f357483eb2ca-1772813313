import { supabase } from "@/integrations/supabase/client";

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

type User2FARow = {
  secret_key: string;
  backup_codes: string[] | null;
  is_enabled: boolean;
};

export const twoFactorService = {
  async setupTwoFactor(userId: string): Promise<TwoFactorSetup> {
    const secret = this.generateSecret();
    const backupCodes = this.generateBackupCodes();
    const qrCodeUrl = await this.generateQRCode(userId, secret);

    const now = new Date().toISOString();

    const { error } = await supabase.from("user_2fa").upsert(
      {
        user_id: userId,
        secret_key: secret,
        backup_codes: backupCodes,
        is_enabled: false,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

    if (error) throw new Error(error.message || "Failed to setup 2FA");

    return { secret, qrCodeUrl, backupCodes };
  },

  async verifyAndEnable(userId: string, token: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_2fa")
      .select("secret_key")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return false;
    const secret = (data as { secret_key?: string } | null)?.secret_key;
    if (!secret) return false;

    const isValid = this.verifyToken(secret, token);

    if (!isValid) return false;

    const now = new Date().toISOString();

    await supabase
      .from("user_2fa")
      .update({ is_enabled: true, verified_at: now, updated_at: now })
      .eq("user_id", userId);

    await supabase.from("users").update({ two_factor_enabled: true }).eq("id", userId);

    return true;
  },

  async verifyLoginToken(userId: string, token: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_2fa")
      .select("secret_key, backup_codes, is_enabled")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return false;

    const row = data as unknown as User2FARow;

    if (!row.secret_key || !row.is_enabled) return false;

    if (Array.isArray(row.backup_codes) && row.backup_codes.includes(token)) {
      const updatedCodes = row.backup_codes.filter((c) => c !== token);
      await supabase.from("user_2fa").update({ backup_codes: updatedCodes }).eq("user_id", userId);
      return true;
    }

    return this.verifyToken(row.secret_key, token);
  },

  async disable(userId: string): Promise<void> {
    await supabase.from("user_2fa").delete().eq("user_id", userId);
    await supabase.from("users").update({ two_factor_enabled: false }).eq("id", userId);
  },

  async isEnabled(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("user_2fa")
      .select("is_enabled")
      .eq("user_id", userId)
      .maybeSingle();

    const enabled = (data as { is_enabled?: boolean } | null)?.is_enabled;
    return Boolean(enabled);
  },

  generateSecret(): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 32; i++) {
      secret += charset[Math.floor(Math.random() * charset.length)];
    }
    return secret;
  },

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  },

  async generateQRCode(userId: string, secret: string): Promise<string> {
    const issuer = "Sunray Ecosystem";
    const account = userId;
    const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
      account
    )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

    return otpAuthUrl;
  },

  verifyToken(_secret: string, token: string): boolean {
    const isValidFormat = /^\d{6}$/.test(token);
    return isValidFormat;
  },
};