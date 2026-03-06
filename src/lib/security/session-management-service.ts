/**
 * Session Management Service
 * Track active sessions, allow remote logout
 */

import { supabase } from "@/integrations/supabase/client";

export const sessionManagementService = {
  /**
   * Create new session
   */
  async createSession(userId: string, deviceInfo: any): Promise<string> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const { error } = await supabase
      .from("active_sessions")
      .insert({
        user_id: userId,
        session_token: sessionToken,
        device_info: deviceInfo,
        ip_address: "127.0.0.1", // Get actual IP
        user_agent: navigator.userAgent,
        expires_at: expiresAt.toISOString(),
        last_activity: new Date().toISOString(),
      });
    
    if (error) throw new Error("Failed to create session");
    
    return sessionToken;
  },

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: string): Promise<any[]> {
    const { data } = await supabase
      .from("active_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_activity", { ascending: false });
    
    return data || [];
  },

  /**
   * Terminate specific session
   */
  async terminateSession(sessionId: string): Promise<void> {
    await supabase
      .from("active_sessions")
      .update({ is_active: false })
      .eq("id", sessionId);
  },

  /**
   * Terminate all sessions except current
   */
  async terminateOtherSessions(userId: string, currentSessionToken: string): Promise<void> {
    await supabase
      .from("active_sessions")
      .update({ is_active: false })
      .eq("user_id", userId)
      .neq("session_token", currentSessionToken);
  },

  /**
   * Update session activity
   */
  async updateActivity(sessionToken: string): Promise<void> {
    await supabase
      .from("active_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("session_token", sessionToken)
      .eq("is_active", true);
  },

  /**
   * Validate session
   */
  async validateSession(sessionToken: string): Promise<boolean> {
    const { data } = await supabase
      .from("active_sessions")
      .select("expires_at, is_active")
      .eq("session_token", sessionToken)
      .single();
    
    if (!data || !data.is_active) return false;
    
    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      await this.terminateSession(sessionToken);
      return false;
    }
    
    return true;
  },

  /**
   * Clean expired sessions (run periodically)
   */
  async cleanExpiredSessions(): Promise<void> {
    await supabase
      .from("active_sessions")
      .update({ is_active: false })
      .lt("expires_at", new Date().toISOString());
  },

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
};