import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import type { AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authService.getSession());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const sessionUser = await authService.getSessionUser();
      if (!active) return;
      setUser(sessionUser);
      setLoading(false);
    })().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    if (result.success) {
      setUser(result.user);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}