/**
 * Password Reset Service
 * Secure password reset with token-based flow
 */

import { supabase } from "@/integrations/supabase/client";

export const passwordResetService = {
  /**
   * Request password reset (send email with token)
   */
  async requestReset(email: string): Promise<{ success: boolean; error?: string }> {
    // Check if user exists
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return { success: true };
    }
    
    // Generate secure reset token
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Store token
    const { error } = await supabase
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });
    
    if (error) throw new Error("Failed to create reset token");
    
    // Send email
    await this.sendResetEmail(email, token);
    
    return { success: true };
  },

  /**
   * Verify reset token
   */
  async verifyToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    const { data } = await supabase
      .from("password_reset_tokens")
      .select("user_id, expires_at, used")
      .eq("token", token)
      .single();
    
    if (!data || data.used) {
      return { valid: false };
    }
    
    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return { valid: false };
    }
    
    return { valid: true, userId: data.user_id };
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    // Verify token
    const verification = await this.verifyToken(token);
    if (!verification.valid || !verification.userId) {
      return { success: false, error: "Invalid or expired reset token" };
    }
    
    // Update password in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (authError) {
      return { success: false, error: "Failed to update password" };
    }
    
    // Mark token as used
    await supabase
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("token", token);
    
    // Log password change
    await supabase
      .from("login_history")
      .insert({
        user_id: verification.userId,
        event_type: "PASSWORD_RESET",
        ip_address: "127.0.0.1", // Get actual IP
        user_agent: navigator.userAgent,
      });
    
    return { success: true };
  },

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  async sendResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${window.location.origin}/auth/reset-password?token=${token}`;
    
    console.log(`
      🔐 Password Reset Request
      To: ${email}
      Reset URL: ${resetUrl}
      
      Click the link above to reset your password.
      This link expires in 1 hour.
    `);
    
    // TODO: Integrate with email service
  },
};