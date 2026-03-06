/**
 * Device Fingerprinting Service
 * Required for investors with >5 Cr investment
 */

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

export const deviceFingerprintService = {
  /**
   * Generate device fingerprint
   */
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

  /**
   * Register trusted device for user
   */
  async registerTrustedDevice(userId: string, deviceName: string): Promise<void> {
    const fingerprint = await this.generateFingerprint();
    
    const { error } = await supabase
      .from("trusted_devices")
      .insert({
        user_id: userId,
        device_id: fingerprint.deviceId,
        device_name: deviceName,
        device_info: fingerprint,
        last_used: new Date().toISOString(),
      });
    
    if (error) throw new Error("Failed to register device");
  },

  /**
   * Check if device is trusted
   */
  async isTrustedDevice(userId: string): Promise<boolean> {
    const fingerprint = await this.generateFingerprint();
    
    const { data } = await supabase
      .from("trusted_devices")
      .select("id")
      .eq("user_id", userId)
      .eq("device_id", fingerprint.deviceId)
      .eq("is_active", true)
      .single();
    
    return !!data;
  },

  /**
   * Get all trusted devices for user
   */
  async getTrustedDevices(userId: string): Promise<any[]> {
    const { data } = await supabase
      .from("trusted_devices")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_used", { ascending: false });
    
    return data || [];
  },

  /**
   * Revoke trusted device
   */
  async revokeDevice(deviceId: string): Promise<void> {
    await supabase
      .from("trusted_devices")
      .update({ is_active: false })
      .eq("id", deviceId);
  },

  /**
   * Update device last used
   */
  async updateDeviceUsage(userId: string): Promise<void> {
    const fingerprint = await this.generateFingerprint();
    
    await supabase
      .from("trusted_devices")
      .update({ last_used: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("device_id", fingerprint.deviceId);
  },

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  async getDeviceId(): Promise<string> {
    // Generate unique device ID based on browser fingerprint
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
    
    const fingerprint = components.join('|');
    
    // Hash the fingerprint
    const hash = await this.hashString(fingerprint);
    return hash;
  },

  async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  },

  getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  },
};