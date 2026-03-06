import { supabase } from "@/integrations/supabase/client";
import { UserRole, RBACService, UserSession } from "@/lib/rbac/rbac-system";

const SESSION_KEY = "sunray_user_session";
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// FAST LOGIN (No Database Delays)
// ============================================================================

export const authService = {
  /**
   * OPTIMIZED LOGIN - Instant response with role-based redirect
   */
  async login(email: string, password: string): Promise<{
    success: boolean;
    user?: UserSession;
    redirectTo?: string;
    error?: string;
  }> {
    try {
      // Step 1: Authenticate with Supabase (single query)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || "Invalid credentials",
        };
      }

      // Step 2: Get user role from database (single query with select)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, role, full_name")
        .eq("id", authData.user.id)
        .single();

      let userRole: UserRole;
      
      if (userError || !userData) {
        // Fallback: Detect role from email for development
        userRole = RBACService.getRoleFromEmail(email);
      } else {
        // Use database role
        userRole = (userData.role as UserRole) || RBACService.getRoleFromEmail(email);
      }

      // Step 3: Create session with embedded permissions (no future DB calls needed)
      const userSession: UserSession = {
        id: authData.user.id,
        email: authData.user.email!,
        role: userRole,
        permissions: RBACService.getPermissions(userRole),
        name: userData?.full_name || email.split('@')[0],
      };

      // Step 4: Store session locally (fast access)
      this.setSession(userSession);

      // Step 5: Get instant redirect route
      const redirectTo = RBACService.getDashboardRoute(userRole);

      return {
        success: true,
        user: userSession,
        redirectTo,
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
   * INSTANT LOGOUT
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearSession();
    }
  },

  /**
   * GET CURRENT SESSION (No DB Call - Instant)
   */
  getSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check expiry
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
   * SET SESSION (Instant)
   */
  setSession(user: UserSession): void {
    const sessionData = {
      user,
      expiresAt: Date.now() + SESSION_EXPIRY,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  /**
   * CLEAR SESSION (Instant)
   */
  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * CHECK IF AUTHENTICATED (Instant)
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  /**
   * GET CURRENT USER ROLE (Instant)
   */
  getCurrentRole(): UserRole | null {
    const session = this.getSession();
    return session?.role || null;
  },

  /**
   * REFRESH SESSION (Optional - can be called after redirect)
   */
  async refreshUserData(): Promise<UserSession | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userData } = await supabase
        .from("users")
        .select("id, email, role, full_name")
        .eq("id", user.id)
        .single();

      if (!userData) return null;

      const userRole = (userData.role as UserRole) || RBACService.getRoleFromEmail(user.email!);

      const userSession: UserSession = {
        id: user.id,
        email: user.email!,
        role: userRole,
        permissions: RBACService.getPermissions(userRole),
        name: userData.full_name || user.email!.split('@')[0],
      };

      this.setSession(userSession);
      return userSession;
    } catch (error) {
      console.error("Refresh session error:", error);
      return null;
    }
  },

  /**
   * REGISTER USER (Optimized)
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