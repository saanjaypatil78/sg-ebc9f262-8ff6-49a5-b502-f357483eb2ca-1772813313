import { supabase } from "@/integrations/supabase/client";

export interface DeviceFingerprint {
  deviceId: string;
  browser: string;
  os: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  hardwareConcurrency: number;
}

type TrustedDeviceRow = {
  id: string;
  is_trusted: boolean;
  trust_expires_at: string | null;
};

export const deviceFingerprintService = {
  async generateFingerprint(): Promise<DeviceFingerprint> {
    const fingerprint: DeviceFingerprint = {
      deviceId: await this.getDeviceId(),
      browser: this.getBrowser(),
      os: this.getOS(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
    };

    return fingerprint;
  },

  async registerTrustedDevice(userId: string, deviceName: string): Promise<void> {
    const fingerprint = await this.generateFingerprint();
    const now = new Date().toISOString();

    const { error } = await supabase.from("trusted_devices").insert({
      user_id: userId,
      device_fingerprint: fingerprint.deviceId,
      device_name: deviceName,
      browser_name: fingerprint.browser,
      os_name: fingerprint.os,
      screen_resolution: fingerprint.screenResolution,
      timezone: fingerprint.timezone,
      language: fingerprint.language,
      is_trusted: true,
      last_seen: now,
    });

    if (error) throw new Error(error.message || "Failed to register device");
  },

  async isTrustedDevice(userId: string): Promise<boolean> {
    const fingerprint = await this.generateFingerprint();

    const { data } = await supabase
      .from("trusted_devices")
      .select("id, is_trusted, trust_expires_at")
      .eq("user_id", userId)
      .eq("device_fingerprint", fingerprint.deviceId)
      .maybeSingle();

    if (!data) return false;

    const row = data as unknown as TrustedDeviceRow;
    if (!row.is_trusted) return false;
    if (!row.trust_expires_at) return true;

    return new Date(row.trust_expires_at).getTime() > Date.now();
  },

  async getTrustedDevices(userId: string): Promise<any[]> {
    const { data } = await supabase
      .from("trusted_devices")
      .select("*")
      .eq("user_id", userId)
      .order("last_seen", { ascending: false });

    return data || [];
  },

  async revokeDevice(deviceId: string): Promise<void> {
    await supabase.from("trusted_devices").update({ is_trusted: false }).eq("id", deviceId);
  },

  async updateDeviceUsage(userId: string): Promise<void> {
    const fingerprint = await this.generateFingerprint();
    await supabase
      .from("trusted_devices")
      .update({ last_seen: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("device_fingerprint", fingerprint.deviceId);
  },

  async getDeviceId(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      window.screen.width,
      window.screen.height,
      window.screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
    ];

    const fp = components.join("|");
    return this.hashString(fp);
  },

  async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  },

  getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg/")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown";
  },

  getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown";
  },
};