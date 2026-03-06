import { supabase } from "@/integrations/supabase/client";
import { UserRole, RBACService, UserSession } from "@/lib/rbac/rbac-system";
import { twoFactorService } from "@/lib/security/2fa-service";
import { abacPolicyEngine } from "@/lib/security/abac-policy-engine";
import { sessionManagementService } from "@/lib/security/session-management-service";
import { deviceFingerprintService } from "@/lib/security/device-fingerprint-service";

const SESSION_KEY = "sunray_user_session";
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// HYBRID RBAC-ABAC AUTHENTICATION SERVICE
// ============================================================================

export const authService = {
  /**
   * ENHANCED LOGIN with ABAC + 2FA
   */
  async login(email: string, password: string): Promise<{
    success: boolean;
    user?: UserSession;
    redirectTo?: string;
    requires2FA?: boolean;
    requiresDeviceBinding?: boolean;
    error?: string;
  }> {
    try {
      // Step 1: Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        // Log failed attempt
        await supabase.from("login_history").insert({
          user_id: null,
          event_type: "LOGIN_FAILED",
          success: false,
          ip_address: "127.0.0.1", // TODO: Get from request
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        });

        return {
          success: false,
          error: authError?.message || "Invalid credentials",
        };
      }

      // Step 2: Get user data + attributes
      const { data: userData } = await supabase
        .from("users")
        .select("id, email, role, full_name")
        .eq("id", authData.user.id)
        .single();

      const { data: userAttributes } = await supabase
        .from("user_attributes")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      const userRole = (userData?.role as UserRole) || RBACService.getRoleFromEmail(email);
      const investmentAmount = userAttributes?.total_investment || 0;

      // Step 3: Create session
      const userSession: UserSession = {
        id: authData.user.id,
        email: authData.user.email!,
        role: userRole,
        permissions: RBACService.getPermissions(userRole),
        name: userData?.full_name || email.split('@')[0],
      };

      // Step 4: Check 2FA requirement
      const { data: twoFactorData } = await supabase
        .from("two_factor_secrets")
        .select("enabled")
        .eq("user_id", authData.user.id)
        .single();

      if (twoFactorData?.enabled) {
        return {
          success: false,
          requires2FA: true,
          user: userSession,
        };
      }

      // Step 5: ABAC Policy Checks (for high-value investors)
      if (investmentAmount >= 50000000) {
        // Check device binding requirement
        const deviceFingerprint = await deviceFingerprintService.generateFingerprint();
        const { data: trustedDevice } = await supabase
          .from("trusted_devices")
          .select("id")
          .eq("user_id", authData.user.id)
          .eq("device_fingerprint", deviceFingerprint)
          .eq("is_active", true)
          .single();

        if (!trustedDevice) {
          return {
            success: false,
            requiresDeviceBinding: true,
            user: userSession,
          };
        }
      }

      // Step 6: Create active session
      await sessionManagementService.createSession(
        authData.user.id,
        "127.0.0.1", // TODO: Get from request
        typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      );

      // Step 7: Log successful login
      await supabase.from("login_history").insert({
        user_id: authData.user.id,
        event_type: "LOGIN_SUCCESS",
        success: true,
        ip_address: "127.0.0.1",
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      });

      // Step 8: Store session
      this.setSession(userSession);

      return {
        success: true,
        user: userSession,
        redirectTo: RBACService.getDashboardRoute(userRole),
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    }
  },

  /**
   * VERIFY 2FA CODE
   */
  async verify2FA(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const isValid = await twoFactorService.verifyLoginToken(userId, code);
      
      if (!isValid) {
        return { success: false, error: "Invalid verification code" };
      }

      return { success: true };
    } catch (error) {
      console.error("2FA verification error:", error);
      return { success: false, error: "Verification failed" };
    }
  },

  /**
   * REGISTER DEVICE (for >5 Cr investors)
   */
  async registerDevice(userId: string, deviceName: string): Promise<{ success: boolean; error?: string }> {
    try {
      await deviceFingerprintService.registerTrustedDevice(userId, deviceName);
      return { success: true };
    } catch (error) {
      console.error("Device registration error:", error);
      return { success: false, error: "Failed to register device" };
    }
  },

  /**
   * LOGOUT
   */
  async logout(): Promise<void> {
    try {
      const session = this.getSession();
      if (session) {
        // Terminate active session
        const { data: sessions } = await supabase
          .from("active_sessions")
          .select("id")
          .eq("user_id", session.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (sessions && sessions.length > 0) {
          await sessionManagementService.terminateSession(sessions[0].id);
        }
      }

      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearSession();
    }
  },

  /**
   * GET SESSION
   */
  getSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session.user;
    } catch (error) {
      console.error("Session parse error:", error);
      return null;
    }
  },

  /**
   * SET SESSION
   */
  setSession(user: UserSession): void {
    const sessionData = {
      user,
      expiresAt: Date.now() + SESSION_EXPIRY,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  /**
   * CLEAR SESSION
   */
  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * IS AUTHENTICATED
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  /**
   * GET CURRENT ROLE
   */
  getCurrentRole(): UserRole | null {
    const session = this.getSession();
    return session?.role || null;
  },

  /**
   * REGISTER USER
   */
  async register(data: {
    email: string;
    password: string;
    full_name: string;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || "Registration failed",
        };
      }

      // Step 2: Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role || UserRole.CLIENT,
      });

      if (profileError) {
        return {
          success: false,
          error: "Failed to create user profile",
        };
      }

      // Step 3: Create user attributes
      await supabase.from("user_attributes").insert({
        user_id: authData.user.id,
        investment_tier: "BASIC",
        total_investment: 0,
      });

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Registration failed",
      };
    }
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRedirectPath(role: UserRole): string {
  return RBACService.getDashboardRoute(role);
}

export function hasPermission(permission: string): boolean {
  const session = authService.getSession();
  if (!session) return false;
  
  return session.permissions.some(p => p === permission);
}

export function hasAnyPermission(permissions: string[]): boolean {
  const session = authService.getSession();
  if (!session) return false;
  
  return permissions.some(p => session.permissions.includes(p as any));
}

export function requireAuth(): UserSession | null {
  const session = authService.getSession();
  if (!session && typeof window !== 'undefined') {
    window.location.href = '/auth/login';
    return null;
  }
  return session;
}