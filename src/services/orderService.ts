import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export const orderService = {
  // Get all orders for a user (client view)
  async getClientOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products(name, image_url),
        vendors(business_name)
      `)
      .eq("customer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client orders:", error);
      throw error;
    }
    return data || [];
  },

  // Get all orders for a vendor
  async getVendorOrders(vendorId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products(name, image_url),
        profiles!orders_customer_id_fkey(full_name, email)
      `)
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vendor orders:", error);
      throw error;
    }
    return data || [];
  },

  // Get all orders (admin view)
  async getAllOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products(name, image_url),
        vendors(business_name),
        profiles!orders_customer_id_fkey(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
    return data || [];
  },

  // Create new order
  async createOrder(order: OrderInsert) {
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }
    return data;
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Database["public"]["Enums"]["order_status"]) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
    return data;
  },

  // Update tracking information
  async updateTracking(orderId: string, trackingNumber: string, courierName?: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ 
        tracking_number: trackingNumber,
        courier_name: courierName,
        status: "shipped"
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating tracking:", error);
      throw error;
    }
    return data;
  },

  // Update QR code
  async updateQRCode(orderId: string, qrCode: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ qr_code: qrCode })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating QR code:", error);
      throw error;
    }
    return data;
  },

  // Mark order as delivered
  async markDelivered(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ 
        status: "delivered",
        delivered_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error marking order as delivered:", error);
      throw error;
    }
    return data;
  },

  // Get order statistics
  async getOrderStats(vendorId?: string) {
    let query = supabase
      .from("orders")
      .select("status, total_amount");

    if (vendorId) {
      query = query.eq("vendor_id", vendorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(o => o.status === "pending").length || 0,
      processing: data?.filter(o => o.status === "processing").length || 0,
      shipped: data?.filter(o => o.status === "shipped").length || 0,
      delivered: data?.filter(o => o.status === "delivered").length || 0,
      cancelled: data?.filter(o => o.status === "cancelled").length || 0,
      totalRevenue: data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
    };

    return stats;
  }
};