/**
 * Session Management Service
 * Track active sessions, allow remote logout
 */

import { supabase } from "@/integrations/supabase/client";

export const sessionManagementService = {
  /**
   * Create a new active session
   */
  async createSession(userId: string, ipAddress: string, userAgent: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session
  },

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: string): Promise<any[]> {
    const { data } = await (supabase.from("active_sessions") as any)
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_activity", { ascending: false });
    
    return data || [];
  },

  /**
   * Terminate specific session
   */
  async terminateSession(sessionToken: string): Promise<void> {
    await (supabase.from("active_sessions") as any)
      .update({ is_active: false })
      .eq("session_token", sessionToken);
  },

  /**
   * Terminate all sessions except current
   */
  async terminateOtherSessions(userId: string, currentSessionToken: string): Promise<void> {
    await (supabase.from("active_sessions") as any)
      .update({ is_active: false })
      .eq("user_id", userId)
      .neq("session_token", currentSessionToken);
  },

  /**
   * Update session activity
   */
  async updateActivity(sessionToken: string): Promise<void> {
    await (supabase.from("active_sessions") as any)
      .update({ last_activity: new Date().toISOString() })
      .eq("session_token", sessionToken)
      .eq("is_active", true);
  },

  /**
   * Validate session
   */
  async validateSession(sessionToken: string): Promise<boolean> {
    const { data } = await (supabase.from("active_sessions") as any)
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
    await (supabase.from("active_sessions") as any)
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