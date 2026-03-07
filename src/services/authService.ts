import { supabase } from "@/integrations/supabase/client";

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
    referralCode: string;
  }) {
    try {
      // 1. Validate referral code exists and get referrer's role
      const { data: referrer, error: referrerError } = await supabase
        .from("users")
        .select("id, role, referral_code")
        .eq("referral_code", data.referralCode.toUpperCase())
        .single();

      if (referrerError || !referrer) {
        return {
          success: false,
          error: "Invalid referral code. Please check and try again.",
          user: undefined,
        };
      }

      // 2. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
          user: undefined,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: "Failed to create user account",
          user: undefined,
        };
      }

      // 3. Insert user with same role as referrer
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        role: referrer.role, // Inherit role from referrer
        referred_by: referrer.id,
        referral_code: `REF${Date.now().toString().slice(-6)}`, // Generate unique code
        kyc_status: "pending",
        status: "active",
      });

      if (insertError) {
        // Cleanup auth user if insert fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return {
          success: false,
          error: "Failed to create user profile. Please try again.",
          user: undefined,
        };
      }

      // 4. Return success with user data
      const user: User = {
        id: authData.user.id,
        email: data.email,
        fullName: data.fullName,
        role: referrer.role,
        referralCode: `REF${Date.now().toString().slice(-6)}`,
        kycStatus: "pending",
      };

      return {
        success: true,
        user,
        error: undefined,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
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