/**
 * Email Verification Service
 * Sends verification emails and validates tokens
 */

import { supabase } from "@/integrations/supabase/client";

export const emailVerificationService = {
  /**
   * Send verification email to user
   */
  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    // Generate secure token
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Store token in database
    const { error } = await supabase
      .from("email_verification_tokens")
      .insert({
        user_id: userId,
        token,
        email,
        expires_at: expiresAt.toISOString(),
      });
    
    if (error) throw new Error("Failed to create verification token");
    
    // Send email (integrate with your email service)
    await this.sendEmail(email, token);
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    // Find token in database
    const { data, error } = await supabase
      .from("email_verification_tokens")
      .select("user_id, email, expires_at, verified")
      .eq("token", token)
      .single();
    
    if (error || !data) {
      return { success: false, error: "Invalid verification token" };
    }
    
    if (data.verified) {
      return { success: false, error: "Email already verified" };
    }
    
    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, error: "Verification token expired" };
    }
    
    // Mark as verified
    await supabase
      .from("email_verification_tokens")
      .update({ verified: true })
      .eq("token", token);
    
    // Update user email_verified status
    await supabase
      .from("users")
      .update({ email_verified: true })
      .eq("id", data.user_id);
    
    return { success: true };
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(userId: string): Promise<void> {
    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();
    
    if (!data?.email) throw new Error("User not found");
    
    await this.sendVerificationEmail(userId, data.email);
  },

  /**
   * Check if email is verified
   */
  async isEmailVerified(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("users")
      .select("email_verified")
      .eq("id", userId)
      .single();
    
    return data?.email_verified || false;
  },

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  generateToken(): string {
    // Generate secure random token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  async sendEmail(email: string, token: string): Promise<void> {
    // Get verification URL
    const verifyUrl = `${window.location.origin}/auth/verify-email?token=${token}`;
    
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, log to console in development
    console.log(`
      📧 Email Verification
      To: ${email}
      Verify URL: ${verifyUrl}
      
      Please verify your email by clicking the link above.
      This link expires in 24 hours.
    `);
    
    // In production, call email API:
    // await fetch('/api/email/send-verification', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, verifyUrl }),
    // });
  },
};