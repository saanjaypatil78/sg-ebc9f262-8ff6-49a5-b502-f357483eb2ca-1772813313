import { supabase } from "@/integrations/supabase/client";

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export const settlementService = {
  // Get all settlements
  async getAllSettlements() {
    const { data, error } = await supabase
      .from("settlements")
      .select(`
        *,
        vendors!settlements_vendor_id_fkey(business_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching settlements:", error);
      throw error;
    }
    return data || [];
  }
};