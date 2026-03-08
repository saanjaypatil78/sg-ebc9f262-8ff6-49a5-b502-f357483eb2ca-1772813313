import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  profileId?: string;
  referralCode?: string;
  kycVerified?: boolean;
  twoFactorEnabled?: boolean;
}

type LoginResult =
  | { success: true; user: User }
  | { success: false; error: string; needsEmailVerification?: boolean };

type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  referredByUserId?: string | null;
};

type LoginInput = { email: string; password: string };

const STORAGE_KEY = "sunray.auth.user.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredUser(): User | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const u = parsed as Partial<User>;
    if (!u.id || !u.email) return null;
    return {
      id: String(u.id),
      email: String(u.email),
      name: u.name ? String(u.name) : undefined,
      role: u.role ? String(u.role) : undefined,
      profileId: u.profileId ? String(u.profileId) : undefined,
      referralCode: u.referralCode ? String(u.referralCode) : undefined,
      kycVerified: typeof u.kycVerified === "boolean" ? u.kycVerified : undefined,
      twoFactorEnabled: typeof u.twoFactorEnabled === "boolean" ? u.twoFactorEnabled : undefined,
    };
  } catch {
    return null;
  }
}

function writeStoredUser(user: User | null) {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

let memoryUser: User | null = null;

function setCachedUser(user: User | null) {
  memoryUser = user;
  writeStoredUser(user);
}

function getCachedUser(): User | null {
  if (memoryUser) return memoryUser;
  const stored = readStoredUser();
  memoryUser = stored;
  return stored;
}

type UserProfilesRow = Tables<"user_profiles">;
type UsersRow = Tables<"users">;

function coerceRole(role: unknown): string | undefined {
  if (!role) return undefined;
  return String(role);
}

async function fetchAppUser(authUserId: string, email: string, fallbackName?: string): Promise<User> {
  const metadataName = fallbackName?.trim() ? fallbackName.trim() : undefined;

  const base: User = {
    id: authUserId,
    email,
    name: metadataName,
  };

  const profileFields = "id, user_id, email, full_name, role, referral_code, kyc_verified";

  try {
    const byUserId = await supabase
      .from("user_profiles")
      .select(profileFields)
      .eq("user_id", authUserId)
      .maybeSingle<UserProfilesRow>();

    if (byUserId.data) {
      return {
        id: authUserId,
        email: String(byUserId.data.email || email),
        name: String(byUserId.data.full_name || metadataName || email),
        role: coerceRole(byUserId.data.role),
        profileId: String(byUserId.data.id),
        referralCode: String(byUserId.data.referral_code || ""),
        kycVerified: Boolean(byUserId.data.kyc_verified),
      };
    }
  } catch {}

  try {
    const byId = await supabase
      .from("user_profiles")
      .select(profileFields)
      .eq("id", authUserId)
      .maybeSingle<UserProfilesRow>();

    if (byId.data) {
      return {
        id: authUserId,
        email: String(byId.data.email || email),
        name: String(byId.data.full_name || metadataName || email),
        role: coerceRole(byId.data.role),
        profileId: String(byId.data.id),
        referralCode: String(byId.data.referral_code || ""),
        kycVerified: Boolean(byId.data.kyc_verified),
      };
    }
  } catch {}

  try {
    const usersFields = "id, email, full_name, role, referral_code, two_factor_enabled";
    const u = await supabase.from("users").select(usersFields).eq("id", authUserId).maybeSingle<UsersRow>();

    if (u.data) {
      return {
        id: authUserId,
        email: String(u.data.email || email),
        name: String(u.data.full_name || metadataName || email),
        role: coerceRole(u.data.role),
        referralCode: String(u.data.referral_code || ""),
        twoFactorEnabled: Boolean(u.data.two_factor_enabled),
      };
    }
  } catch {}

  return base;
}

async function hydrateFromSession(session: Session | null): Promise<User | null> {
  const supaUser = session?.user;
  if (!supaUser) return null;

  const email = supaUser.email || "";
  const meta = supaUser.user_metadata as Record<string, unknown> | null;
  const fallbackName =
    (meta && (typeof meta.full_name === "string" ? meta.full_name : undefined)) ||
    (meta && (typeof meta.name === "string" ? meta.name : undefined)) ||
    undefined;

  return fetchAppUser(supaUser.id, email, fallbackName);
}

export const authService = {
  getSession(): User | null {
    return getCachedUser();
  },

  getCurrentUser(): User | null {
    return getCachedUser();
  },

  getCurrentRole(): string | null {
    return getCachedUser()?.role || null;
  },

  async getCurrentSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getSessionUser(): Promise<User | null> {
    try {
      const { data } = await supabase.auth.getSession();
      const user = await hydrateFromSession(data.session);
      setCachedUser(user);
      return user;
    } catch {
      setCachedUser(null);
      return null;
    }
  },

  async login(input: LoginInput): Promise<LoginResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const session = data.session;
      const hydrated = await hydrateFromSession(session);

      if (!hydrated) {
        return { success: false, error: "Login succeeded but session could not be hydrated." };
      }

      setCachedUser(hydrated);
      return { success: true, user: hydrated };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      return { success: false, error: msg };
    }
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } finally {
      setCachedUser(null);
    }
  },

  async register(input: RegisterInput): Promise<LoginResult> {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { full_name: input.fullName },
        },
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }

      const authUserId = signUpData.user?.id;

      let session = signUpData.session;

      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

        if (signInError) {
          const fallbackUser: User | null = authUserId
            ? { id: authUserId, email: input.email, name: input.fullName }
            : null;

          if (fallbackUser) setCachedUser(fallbackUser);

          return {
            success: false,
            error: "Account created. Please verify your email before signing in.",
            needsEmailVerification: true,
          };
        }

        session = signInData.session;
      }

      try {
        await supabase.rpc("create_self_profile_v1", {
          p_full_name: input.fullName,
          p_referrer_user_id: input.referredByUserId || null,
        });
      } catch {}

      const hydrated = await hydrateFromSession(session);

      if (!hydrated && authUserId) {
        const fallback = await fetchAppUser(authUserId, input.email, input.fullName);
        setCachedUser(fallback);
        return { success: true, user: fallback };
      }

      if (!hydrated) {
        return { success: false, error: "Registration succeeded but profile could not be loaded." };
      }

      setCachedUser(hydrated);
      return { success: true, user: hydrated };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      return { success: false, error: msg };
    }
  },

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const redirectTo = isBrowser() ? `${window.location.origin}/auth/reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
      return { error: error ? error.message : null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Password reset failed";
      return { error: msg };
    }
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        const hydrated = await hydrateFromSession(session);
        setCachedUser(hydrated);
      } catch {
        setCachedUser(null);
      }
      callback(event, session);
    });
  },

  async verify2FA(_userId: string, _code: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  },

  async registerDevice(_userId: string, _deviceName: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  },
};