import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export const authService = {
  // Register new user
  async register(email: string, password: string, fullName: string, role: UserRole = "client") {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (authError) {
      console.error("Error during registration:", authError);
      throw authError;
    }

    // Profile is automatically created by database trigger
    return authData;
  },

  // Login user
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Error during login:", error);
      throw error;
    }

    return data;
  },

  // Logout user
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  // Get current user session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      throw error;
    }
    return session;
  },

  // Get current user profile with role
  async getCurrentUser() {
    const session = await this.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
  }) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return data;
  },

  // Check if user has role
  async checkRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === requiredRole;
  },

  // Get dynamic redirect URL for OAuth callbacks
  getRedirectUrl() {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/auth/callback`;
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`;
  }
};