import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: Database["public"]["Enums"]["user_role"]) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      await authService.login(email, password);
      await loadUser();
      
      // Redirect based on role
      if (user) {
        const roleRoutes: Record<string, string> = {
          client: "/dashboard/client",
          vendor: "/dashboard/vendor",
          admin: "/dashboard/admin",
          bdm: "/dashboard/bdm"
        };
        router.push(roleRoutes[user.role] || "/dashboard/client");
      }
    } catch (error) {
      throw error;
    }
  }

  async function register(email: string, password: string, fullName: string, role: Database["public"]["Enums"]["user_role"] = "client") {
    try {
      await authService.register(email, password, fullName, role);
      await loadUser();
      
      // Redirect to appropriate dashboard
      const roleRoutes: Record<string, string> = {
        client: "/dashboard/client",
        vendor: "/dashboard/vendor",
        admin: "/dashboard/admin",
        bdm: "/dashboard/bdm"
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