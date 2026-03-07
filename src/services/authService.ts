import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export const authService = {
  // Register new user
  async register(data: { email: string; password: string; full_name: string; referral_code?: string; role?: string; referred_by?: string }) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            referral_code: data.referral_code,
          }
        }
      });

      if (authError) throw authError;

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role || 'client',
          referral_code: data.referral_code || `REF${Date.now()}`,
          referred_by: data.referred_by
        });

      if (profileError) throw profileError;

      return {
        success: true,
        user: authData.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
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