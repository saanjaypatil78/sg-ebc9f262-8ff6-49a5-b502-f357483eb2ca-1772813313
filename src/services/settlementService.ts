import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Settlement = Database["public"]["Tables"]["settlements"]["Row"];
type SettlementInsert = Database["public"]["Tables"]["settlements"]["Insert"];

export const settlementService = {
  // Get settlements for vendor
  async getVendorSettlements(vendorId: string) {
    const { data, error } = await supabase
      .from("settlements")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("period_end", { ascending: false });

    if (error) {
      console.error("Error fetching vendor settlements:", error);
      throw error;
    }
    return data || [];
  },

  // Get all settlements (admin)
  async getAllSettlements() {
    const { data, error } = await supabase
      .from("settlements")
      .select(`
        *,
        vendors(business_name, contact_email)
      `)
      .order("period_end", { ascending: false });

    if (error) {
      console.error("Error fetching all settlements:", error);
      throw error;
    }
    return data || [];
  },

  // Calculate settlement for vendor
  async calculateSettlement(vendorId: string, periodStart: string, periodEnd: string) {
    // Get all delivered orders in period
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, total_amount, commission_amount")
      .eq("vendor_id", vendorId)
      .eq("status", "delivered")
      .gte("delivered_at", periodStart)
      .lte("delivered_at", periodEnd);

    if (ordersError) throw ordersError;

    // Get approved returns (no commission charged)
    const { data: returns, error: returnsError } = await supabase
      .from("returns")
      .select("id, order_id")
      .eq("vendor_id", vendorId)
      .in("status", ["approved", "replacement_shipped", "completed"])
      .gte("created_at", periodStart)
      .lte("created_at", periodEnd);

    if (returnsError) throw returnsError;

    // Get penalties
    const { data: penalties, error: penaltiesError } = await supabase
      .from("penalties")
      .select("amount")
      .eq("vendor_id", vendorId)
      .gte("applied_at", periodStart)
      .lte("applied_at", periodEnd);

    if (penaltiesError) throw penaltiesError;

    // Calculate totals
    const totalOrders = orders?.length || 0;
    const totalSales = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const totalCommission = orders?.reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0;
    
    // Returns don't affect commission (already deducted from original order)
    const returnCount = returns?.length || 0;
    
    const totalPenalties = penalties?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Net payout = Total Sales - Commission - Penalties
    const netPayout = totalSales - totalCommission - totalPenalties;

    return {
      totalOrders,
      totalSales,
      totalCommission,
      returnCount,
      totalPenalties,
      netPayout
    };
  },

  // Create settlement
  async createSettlement(settlement: SettlementInsert) {
    const { data, error } = await supabase
      .from("settlements")
      .insert(settlement)
      .select()
      .single();

    if (error) {
      console.error("Error creating settlement:", error);
      throw error;
    }
    return data;
  },

  // Update settlement status
  async updateSettlementStatus(
    settlementId: string, 
    status: Database["public"]["Enums"]["payment_status"]
  ) {
    const updates: any = { payment_status: status };
    if (status === "completed") updates.payment_date = new Date().toISOString();

    const { data, error } = await supabase
      .from("settlements")
      .update(updates)
      .eq("id", settlementId)
      .select()
      .single();

    if (error) {
      console.error("Error updating settlement status:", error);
      throw error;
    }
    return data;
  },

  // Generate monthly settlements for all vendors
  async generateMonthlySettlements(year: number, month: number) {
    // Get period dates
    const periodStart = new Date(year, month - 1, 1).toISOString();
    const periodEnd = new Date(year, month, 0, 23, 59, 59).toISOString();

    // Get all active vendors
    const { data: vendors, error: vendorsError } = await supabase
      .from("vendors")
      .select("id")
      .eq("status", "active");

    if (vendorsError) throw vendorsError;

    const settlements: SettlementInsert[] = [];

    for (const vendor of vendors || []) {
      const calc = await this.calculateSettlement(vendor.id, periodStart, periodEnd);
      
      settlements.push({
        vendor_id: vendor.id,
        period_start: periodStart,
        period_end: periodEnd,
        total_orders: calc.totalOrders,
        total_sales: calc.totalSales,
        commission_amount: calc.totalCommission,
        return_count: calc.returnCount,
        penalty_amount: calc.totalPenalties,
        net_payout: calc.netPayout,
        payment_status: "pending"
      });
    }

    if (settlements.length > 0) {
      const { data, error } = await supabase
        .from("settlements")
        .insert(settlements as any)
        .select();

      if (error) throw error;
      return data;
    }
    return [];
  }
};