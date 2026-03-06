import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  user_role?: string;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
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
      if (currentUser) {
        // Fetch profile data from profiles table
        const { data } = await authService.supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        setUser(data || null);
      } else {
        setUser(null);
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
      await authService.login(email, password);
      await loadUser();
      
      // Redirect based on role
      if (user?.user_role) {
        const roleRoutes: Record<string, string> = {
          client: "/dashboard/client",
          vendor: "/dashboard/vendor",
          admin: "/dashboard/admin",
          bdm: "/dashboard/bdm",
          investor: "/dashboard/investor"
        };
        router.push(roleRoutes[user.user_role] || "/dashboard/client");
      }
    } catch (error) {
      throw error;
    }
  }

  async function register(email: string, password: string, fullName: string, role: string = "client") {
    try {
      await authService.register(email, password);
      await loadUser();
      
      // Redirect to appropriate dashboard
      const roleRoutes: Record<string, string> = {
        client: "/dashboard/client",
        vendor: "/dashboard/vendor",
        admin: "/dashboard/admin",
        bdm: "/dashboard/bdm",
        investor: "/dashboard/investor"
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