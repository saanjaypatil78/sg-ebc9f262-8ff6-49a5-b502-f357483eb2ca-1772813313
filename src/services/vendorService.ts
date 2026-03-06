import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Use strict types where possible, fallback to any for now to unblock build
type Vendor = any;
type VendorInsert = any;
type VendorUpdate = any;

export const vendorService = {
  // Get all vendors (admin/bdm only)
  async getAllVendors() {
    const { data, error } = await supabase
      .from("vendors")
      .select(`
        *,
        profiles!vendors_user_id_fkey(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
    return data || [];
  },

  // Get vendor by user ID
  async getVendorByUserId(userId: string) {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // Ignore not found error
      if (error.code === 'PGRST116') return null;
      console.error("Error fetching vendor:", error);
      throw error;
    }
    return data;
  },

  // Create vendor profile
  async createVendor(vendor: VendorInsert) {
    const { data, error } = await supabase
      .from("vendors")
      .insert(vendor)
      .select()
      .single();

    if (error) {
      console.error("Error creating vendor:", error);
      throw error;
    }
    return data;
  },

  // Update vendor
  async updateVendor(vendorId: string, updates: VendorUpdate) {
    const { data, error } = await supabase
      .from("vendors")
      .update(updates)
      .eq("id", vendorId)
      .select()
      .single();

    if (error) {
      console.error("Error updating vendor:", error);
      throw error;
    }
    return data;
  },

  // Update vendor status
  async updateVendorStatus(vendorId: string, status: 'active' | 'suspended' | 'rejected' | 'pending') {
    const { data, error } = await supabase
      .from("vendors")
      .update({ vendor_status: status } as any)
      .eq("id", vendorId)
      .select()
      .single();

    if (error) {
      console.error("Error updating vendor status:", error);
      throw error;
    }
    return data;
  },

  // Update onboarding step
  async updateOnboardingStep(vendorId: string, step: string) {
    const { data, error } = await supabase
      .from("vendors")
      .update({ onboarding_step: step } as any)
      .eq("id", vendorId)
      .select()
      .single();

    if (error) {
      console.error("Error updating onboarding step:", error);
      throw error;
    }
    return data;
  },

  // Get vendor performance metrics
  async getVendorPerformance(vendorId: string) {
    const { data, error } = await supabase
      .from("vendors")
      .select(`
        on_time_delivery_rate,
        return_rate,
        average_rating,
        total_orders,
        successful_deliveries
      `)
      .eq("id", vendorId)
      .single();

    if (error) {
      console.error("Error fetching vendor performance:", error);
      throw error;
    }
    return data;
  },

  // Calculate and update vendor metrics
  async updateVendorMetrics(vendorId: string) {
    // Get total orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("status")
      .eq("vendor_id", vendorId);

    if (ordersError) throw ordersError;

    const totalOrders = orders?.length || 0;
    const deliveredOrders = orders?.filter(o => o.status === "delivered").length || 0;
    
    // Get on-time deliveries (simplified)
    const onTimeRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // Get returns
    const { data: returns, error: returnsError } = await supabase
      .from("returns")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("status", "approved");

    if (returnsError) throw returnsError;

    const returnRate = totalOrders > 0 ? ((returns?.length || 0) / totalOrders) * 100 : 0;

    // Update vendor metrics
    const { data, error } = await supabase
      .from("vendors")
      .update({
        total_orders: totalOrders,
        successful_deliveries: deliveredOrders,
        on_time_delivery_rate: onTimeRate,
        return_rate: returnRate
      } as any)
      .eq("id", vendorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Register a new vendor profile
   */
  async registerVendor(userId: string, data: any) {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert({
        user_id: userId,
        business_name: data.businessName,
        business_type: data.businessType,
        gst_number: data.gstNumber,
        pickup_address: data.pickupAddress,
        vendor_status: 'pending',
        onboarding_step: 'verification'
      } as any)
      .select()
      .single();

    if (error) throw error;
    return vendor;
  },

  /**
   * Get vendor profile
   */
  async getVendorProfile(userId: string) {
    return this.getVendorByUserId(userId);
  },

  /**
   * Get vendor stats
   */
  async getVendorStats(vendorId: string) {
    // In a real app, these would be aggregated queries
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      returnRate: 0
    };
  },

  /**
   * Get vendor orders
   */
  async getVendorOrders(vendorId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get vendor returns
   */
  async getVendorReturns(vendorId: string) {
    const { data, error } = await supabase
      .from('returns')
      .select('*, orders(*)')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};