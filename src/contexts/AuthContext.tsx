import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { UserRole, UserSession } from "@/lib/rbac/rbac-system";

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const sessionUser = authService.getSession();
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        const refreshed = await authService.refreshUserData();
        setUser(refreshed);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const { success, user: sessionUser, error } = await authService.login(email, password);
      if (success && sessionUser) {
        setUser(sessionUser);
      } else if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function register(email: string, password: string, fullName: string, role: string = UserRole.CLIENT) {
    try {
      const result = await authService.register({ 
        email, 
        password, 
        full_name: fullName, 
        role: role as UserRole 
      });
      
      if (!result.success) {
        throw new Error(result.error || "Registration failed");
      }
      
      // Attempt login after registration
      await login(email, password);
      
      // Redirect to appropriate dashboard
      const roleRoutes: Record<string, string> = {
        [UserRole.CLIENT]: "/dashboard/client",
        [UserRole.VENDOR]: "/dashboard/vendor",
        [UserRole.ADMIN]: "/dashboard/admin",
        [UserRole.SUPER_ADMIN]: "/dashboard/admin",
        [UserRole.FINANCE]: "/dashboard/admin",
        [UserRole.COMPLIANCE]: "/dashboard/admin",
        [UserRole.BDM]: "/dashboard/bdm",
        [UserRole.INVESTOR]: "/dashboard/investor"
      };
      
      router.push(roleRoutes[role] || "/dashboard/client");
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await authService.logout();
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      throw error;
    }
  }

  async function refreshUser() {
    await loadUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}