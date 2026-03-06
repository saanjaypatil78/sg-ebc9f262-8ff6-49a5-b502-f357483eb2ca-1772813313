import { supabase } from "@/integrations/supabase/client";

/**
 * Service to handle Didit.me Identity Verification
 */
export const diditService = {
  /**
   * Initialize a verification session for a vendor
   * This calls our own backend API to keep the API key secure
   */
  async createVerificationSession() {
    try {
      const response = await fetch("/api/verification/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create verification session");
      }

      return await response.json();
    } catch (error) {
      console.error("Didit Verification Error:", error);
      throw error;
    }
  },

  /**
   * Update local vendor profile status after successful verification
   * In a real prod env, this should be handled via Webhook from Didit
   */
  async updateVendorVerificationStatus(vendorId: string, status: string, verificationId: string) {
    const { data, error } = await supabase
      .from("vendors")
      .update({
        // Map Didit status to our schema status if needed, or store in a separate column
        // For now, we assume 'approved' means 'active' or 'pending_approval' -> 'verified'
        kyc_status: status === "approved" ? "verified" : "rejected",
        kyc_verification_id: verificationId,
        onboarding_step: 2 // Move to next onboarding step (Documentation)
      } as any) // Casting to any to avoid strict type issues during rapid dev
      .eq("id", vendorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};