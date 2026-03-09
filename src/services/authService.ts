import { supabase } from "@/integrations/supabase/client";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  user_metadata?: Record<string, unknown> | null;
  created_at?: string | null;
}

export interface AuthError {
  message: string;
  code?: string;
}

export type LoginResult =
  | { success: true; user: AuthUser }
  | { success: false; error: string; needsEmailVerification?: boolean };

export type RegisterResult =
  | { success: true; user: AuthUser }
  | { success: false; error: string; needsEmailVerification?: boolean };

let cachedUser: AuthUser | null = null;

function getURL(): string {
  let url =
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  if (!url) url = "http://localhost:3000";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}

function toAuthUser(user: SupabaseUser | null, session: Session | null): AuthUser | null {
  if (!user) return null;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role = typeof meta.role === "string" ? meta.role : null;
  const name =
    typeof meta.full_name === "string"
      ? meta.full_name
      : typeof meta.name === "string"
        ? meta.name
        : null;

  return {
    id: user.id,
    email: user.email || "",
    name,
    role,
    user_metadata: meta,
    created_at: user.created_at ?? null,
  };
}

export const authService = {
  getURL,

  getSession(): AuthUser | null {
    return cachedUser;
  },

  async getCurrentSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const session = await this.getCurrentSession();
    const out = toAuthUser(user, session);
    cachedUser = out;
    return out;
  },

  async getSessionUser(): Promise<AuthUser | null> {
    return this.getCurrentUser();
  },

  getCurrentRole(): string | null {
    return cachedUser?.role ?? null;
  },

  async signUp(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getURL()}auth/callback`,
        },
      });

      if (error) {
        return { user: null, error: { message: error.message, code: error.status?.toString() } };
      }

      const out = toAuthUser(data.user, data.session ?? null);
      cachedUser = out;
      return { user: out, error: null };
    } catch {
      return { user: null, error: { message: "An unexpected error occurred during sign up" } };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { user: null, error: { message: error.message, code: error.status?.toString() } };
      }

      const out = toAuthUser(data.user, data.session ?? null);
      cachedUser = out;
      return { user: out, error: null };
    } catch {
      return { user: null, error: { message: "An unexpected error occurred during sign in" } };
    }
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      cachedUser = null;

      if (error) return { error: { message: error.message, code: error.status?.toString() } };
      return { error: null };
    } catch {
      cachedUser = null;
      return { error: { message: "An unexpected error occurred during sign out" } };
    }
  },

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}auth/reset-password`,
      });

      if (error) return { error: { message: error.message, code: error.status?.toString() } };
      return { error: null };
    } catch {
      return { error: { message: "An unexpected error occurred during password reset" } };
    }
  },

  async confirmEmail(
    token: string,
    type: "signup" | "recovery" | "email_change" = "signup",
  ): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ token_hash: token, type });

      if (error) {
        return { user: null, error: { message: error.message, code: error.status?.toString() } };
      }

      const out = toAuthUser(data.user, data.session ?? null);
      cachedUser = out;
      return { user: out, error: null };
    } catch {
      return { user: null, error: { message: "An unexpected error occurred during email confirmation" } };
    }
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const out = toAuthUser(session?.user ?? null, session);
      cachedUser = out;
      callback(event, session);
    });
  },

  async login(params: { email: string; password: string }): Promise<LoginResult> {
    const result = await this.signIn(params.email, params.password);
    if (result.error || !result.user) {
      return { success: false, error: result.error?.message || "Login failed" };
    }
    return { success: true, user: result.user };
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    const out = await this.signOut();
    if (out.error) return { success: false, error: out.error.message };
    return { success: true };
  },

  async register(params: {
    email: string;
    password: string;
    fullName: string;
    referredByUserId?: string | null;
  }): Promise<RegisterResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          emailRedirectTo: `${getURL()}auth/callback`,
          data: {
            full_name: params.fullName,
            referred_by_user_id: params.referredByUserId ?? null,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message || "Registration failed" };
      }

      const out = toAuthUser(data.user, data.session ?? null) ?? {
        id: data.user?.id || "",
        email: params.email,
        name: params.fullName,
        role: "REGISTERED",
        user_metadata: { full_name: params.fullName, referred_by_user_id: params.referredByUserId ?? null },
        created_at: data.user?.created_at ?? null,
      };

      cachedUser = out;

      if (data.user && !data.session) {
        return {
          success: false,
          error: "Account created. Please verify your email before signing in.",
          needsEmailVerification: true,
        };
      }

      return { success: true, user: out };
    } catch {
      return { success: false, error: "An unexpected error occurred during registration" };
    }
  },

  async verify2FA(_userId: string, _token: string): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "2FA verification is not wired yet." };
  },

  async registerDevice(_userId: string, _deviceName: string): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "Device registration is not wired yet." };
  },
};