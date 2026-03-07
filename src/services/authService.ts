import { supabase } from "@/integrations/supabase/client";
import { referralService } from "./referralService";

export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: string;
  referralCode?: string;
  kycStatus?: string;
}

export const authService = {
  // Register
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    referredByUserId?: string;
  }) {
    try {
      // Validate referrer if provided
      if (data.referredByUserId) {
        const isValid = await referralService.validateReferralCode(
          data.referredByUserId
        );
        if (!isValid) {
          return {
            success: false,
            error: "Invalid referral code",
            user: undefined,
          };
        }
      }

      // Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Insert into users table
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: "INVESTOR",
          referred_by: data.referredByUserId || null,
          kyc_status: "PENDING",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          role: userData.role,
          kycStatus: userData.kyc_status,
        },
        error: undefined,
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "Registration failed",
        user: undefined,
      };
    }
  },

  // Login
  async login(credentials: { email: string; password: string }) {
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) throw authError;

      // 2. Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user?.id)
        .single();

      if (profileError) throw profileError;

      // 3. Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user?.id);

      // 4. Store session
      localStorage.setItem('user_session', JSON.stringify({
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
        token: authData.session?.access_token,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      }));

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.full_name,
          role: profile.role,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout
  async logout() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user_session');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get session
  getSession(): any {
    const session = localStorage.getItem('user_session');
    if (!session) return null;
    
    const parsed = JSON.parse(session);
    if (parsed.expiresAt < Date.now()) {
      localStorage.removeItem('user_session');
      return null;
    }
    
    return parsed;
  },

  // Get current user
  getCurrentUser(): any {
    return this.getSession();
  },

  // Get current role
  getCurrentRole(): string | null {
    const user = this.getSession();
    return user?.role || null;
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  // Verify 2FA
  async verify2FA(userId: string, code: string) {
    return { success: true, error: undefined };
  },

  // Register device
  async registerDevice(userId: string, fingerprint: string) {
    return { success: true, deviceId: `device_${Date.now()}`, error: undefined };
  },
};