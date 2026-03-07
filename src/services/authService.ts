import { supabase } from "@/integrations/supabase/client";

// Mock user database for testing without backend
const MOCK_USERS = {
  "investor@sunray.eco": {
    id: "investor-001",
    email: "investor@sunray.eco",
    password: "Test@123",
    name: "Test Investor",
    role: "investor",
    twoFactorEnabled: false,
  },
  "client@bravecom.info": {
    id: "client-001",
    email: "client@bravecom.info",
    password: "Test@123",
    name: "Test Client",
    role: "client",
    twoFactorEnabled: false,
  },
  "vendor@bravecom.info": {
    id: "vendor-001",
    email: "vendor@bravecom.info",
    password: "Test@123",
    name: "Test Vendor",
    role: "vendor",
    twoFactorEnabled: false,
  },
  "admin@bravecom.info": {
    id: "admin-001",
    email: "admin@bravecom.info",
    password: "Admin@123",
    name: "Admin User",
    role: "admin",
    twoFactorEnabled: false,
  },
  "superadmin@bravecom.info": {
    id: "superadmin-001",
    email: "superadmin@bravecom.info",
    password: "SuperAdmin@123",
    name: "Super Admin",
    role: "super_admin",
    twoFactorEnabled: false,
  },
  "bdm@bravecom.info": {
    id: "bdm-001",
    email: "bdm@bravecom.info",
    password: "Test@123",
    name: "BDM User",
    role: "bdm",
    twoFactorEnabled: false,
  },
  "franchise@bravecom.info": {
    id: "franchise-001",
    email: "franchise@bravecom.info",
    password: "Test@123",
    name: "Franchise Partner",
    role: "franchise_partner",
    twoFactorEnabled: false,
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  twoFactorEnabled?: boolean;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
  requires2FA?: boolean;
  requiresDeviceBinding?: boolean;
  redirectTo?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Check mock users first
      const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
      
      if (mockUser && mockUser.password === password) {
        // Mock authentication successful
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          twoFactorEnabled: mockUser.twoFactorEnabled,
        };

        // Store session in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_session', JSON.stringify({
            user,
            token: `mock_token_${user.id}`,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          }));
        }

        // Determine redirect based on role
        const redirectMap: Record<string, string> = {
          investor: '/dashboard/investor',
          client: '/dashboard/client',
          vendor: '/dashboard/vendor',
          admin: '/dashboard/admin',
          super_admin: '/dashboard/admin',
          bdm: '/dashboard/bdm',
          franchise_partner: '/dashboard/franchise',
        };

        return {
          success: true,
          user,
          redirectTo: redirectMap[user.role] || '/dashboard',
          requires2FA: false,
          requiresDeviceBinding: false,
        };
      }

      // Try real Supabase auth if mock fails
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || "User",
          role: data.user.user_metadata?.role || "investor",
        };

        return {
          success: true,
          user,
          redirectTo: `/dashboard/${user.role}`,
        };
      }

      return {
        success: false,
        error: "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  },

  async register(userData: { email: string; password: string; full_name: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Registration failed",
      };
    }
  },

  async logout() {
    try {
      // Clear localStorage session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_session');
      }

      // Try Supabase logout
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false };
    }
  },

  getSession(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const sessionStr = localStorage.getItem('auth_session');
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr);
      
      // Check if session expired
      if (session.expiresAt && Date.now() > session.expiresAt) {
        localStorage.removeItem('auth_session');
        return null;
      }

      return session.user;
    } catch {
      return null;
    }
  },

  getCurrentRole(): string | null {
    const user = this.getSession();
    return user?.role || null;
  },

  async verify2FA(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
    // Mock 2FA verification
    if (code === "123456") {
      return { success: true };
    }
    return {
      success: false,
      error: "Invalid verification code",
    };
  },

  async registerDevice(userId: string, deviceName: string): Promise<{ success: boolean; deviceId?: string; error?: string }> {
    // Mock device registration
    return {
      success: true,
      deviceId: `device_${Date.now()}`,
    };
  },
};