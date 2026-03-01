import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export const productService = {
  // Get all products
  async getAllProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        vendors(business_name, status)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    return (data || []) as any[];
  },

  // Get products by vendor
  async getVendorProducts(vendorId: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vendor products:", error);
      throw error;
    }
    return data || [];
  },

  // Get single product
  async getProduct(productId: string) {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        vendors(business_name, contact_email, contact_phone)
      `)
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
    return data as any;
  },

  // Create product
  async createProduct(product: ProductInsert) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }
    return data;
  },

  // Update product
  async updateProduct(productId: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    return data;
  },

  // Update stock quantity
  async updateStock(productId: string, quantity: number) {
    const { data, error } = await supabase
      .from("products")
      .update({ stock_quantity: quantity })
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
    return data;
  },

  // Deduct stock (when order placed)
  async deductStock(productId: string, quantity: number) {
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", productId)
      .single();

    if (!product) throw new Error("Product not found");

    const newQuantity = (product.stock_quantity || 0) - quantity;
    if (newQuantity < 0) throw new Error("Insufficient stock");

    return this.updateStock(productId, newQuantity);
  },

  // Search products
  async searchProducts(query: string) {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        vendors(business_name)
      `)
      .eq("status", "active")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error("Error searching products:", error);
      throw error;
    }
    return (data || []) as any[];
  }
};