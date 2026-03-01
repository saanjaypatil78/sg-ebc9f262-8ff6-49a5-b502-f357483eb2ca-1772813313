import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ReturnStatus = Database["public"]["Enums"]["return_status"];
// Simplified types to prevent excessive depth error
type ReturnInsert = any;
type ReturnUpdate = any;

export const returnService = {
  // Get returns for customer
  async getCustomerReturns(customerId: string) {
    const { data, error } = await supabase
      .from("returns")
      .select(`
        *,
        orders(order_number, total_amount),
        products(name, image_url),
        vendors(business_name)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customer returns:", error);
      throw error;
    }
    return (data || []) as any[];
  },

  // Get returns for vendor
  async getVendorReturns(vendorId: string) {
    const { data, error } = await supabase
      .from("returns")
      .select(`
        *,
        orders(order_number, total_amount),
        products(name, image_url),
        profiles!returns_customer_id_fkey(full_name, email)
      `)
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vendor returns:", error);
      throw error;
    }
    return (data || []) as any[];
  },

  // Get all returns (admin)
  async getAllReturns() {
    const { data, error } = await supabase
      .from("returns")
      .select(`
        *,
        orders(order_number, total_amount),
        products(name, image_url),
        vendors(business_name),
        profiles!returns_customer_id_fkey(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all returns:", error);
      throw error;
    }
    return (data || []) as any[];
  },

  // Create return request
  async createReturn(returnData: ReturnInsert) {
    const { data, error } = await supabase
      .from("returns")
      .insert(returnData)
      .select()
      .single();

    if (error) {
      console.error("Error creating return:", error);
      throw error;
    }
    return data;
  },

  // Update return status
  async updateReturnStatus(
    returnId: string, 
    status: ReturnStatus,
    adminNotes?: string
  ) {
    const updates: ReturnUpdate = { status };
    if (adminNotes) updates.admin_notes = adminNotes;
    if (status === "approved") updates.approved_at = new Date().toISOString();
    if (status === "completed") updates.resolved_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("returns")
      .update(updates)
      .eq("id", returnId)
      .select()
      .single();

    if (error) {
      console.error("Error updating return status:", error);
      throw error;
    }
    return data;
  },

  // Update replacement tracking
  async updateReplacementTracking(returnId: string, trackingNumber: string) {
    const { data, error } = await supabase
      .from("returns")
      .update({ 
        replacement_tracking: trackingNumber,
        status: "replacement_shipped"
      })
      .eq("id", returnId)
      .select()
      .single();

    if (error) {
      console.error("Error updating replacement tracking:", error);
      throw error;
    }
    return data;
  },

  // Get return rate for vendor
  async getVendorReturnRate(vendorId: string): Promise<number> {
    // Get total delivered orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("status", "delivered");

    if (ordersError) throw ordersError;

    // Get approved returns
    const { data: returns, error: returnsError } = await supabase
      .from("returns")
      .select("id")
      .eq("vendor_id", vendorId)
      .in("status", ["approved", "replacement_shipped", "completed"]);

    if (returnsError) throw returnsError;

    const totalOrders = orders?.length || 0;
    const totalReturns = returns?.length || 0;

    return totalOrders > 0 ? (totalReturns / totalOrders) * 100 : 0;
  },

  // Check if vendor exceeds 10% return limit
  async checkReturnLimit(vendorId: string): Promise<{
    exceeded: boolean;
    returnRate: number;
    penalty: number;
  }> {
    const returnRate = await this.getVendorReturnRate(vendorId);
    const exceeded = returnRate > 10;
    
    // Calculate penalty (e.g., 5% of total sales for every 1% above limit)
    const excessRate = Math.max(0, returnRate - 10);
    const penalty = exceeded ? excessRate * 5 : 0;

    return { exceeded, returnRate, penalty };
  }
};