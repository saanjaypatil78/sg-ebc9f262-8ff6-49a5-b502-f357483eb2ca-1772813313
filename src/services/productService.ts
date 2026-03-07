import { supabase } from "@/integrations/supabase/client";
import { productGenerator } from "@/lib/mock-data/product-generator";

// Use mock data generator as primary source (no database dependency)
const USE_MOCK_DATA = true;

// Cache for mock products
let mockProductsCache: any[] | null = null;

export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from("vendor_products")
        .select(`
          *,
          vendors (
            business_name,
            email
          )
        `)
        .eq("product_status", "active")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        console.log("✅ Loaded products from database");
        return data;
      }

      // Fallback: Generate mock products with relevant images
      console.log("⚠️ Database empty, generating mock products with real images...");
      const products = await productGenerator.generateAllProductsAsync();
      return products;
    } catch (error) {
      console.error("Database error, using mock data:", error);
      
      // Generate mock products with relevant images
      const products = await productGenerator.generateAllProductsAsync();
      return products;
    }
  },

  // Get products by vendor
  async getVendorProducts(vendorId: string) {
    if (USE_MOCK_DATA) {
      if (!mockProductsCache) {
        mockProductsCache = productGenerator.generateAllProducts();
      }
      return mockProductsCache.filter(p => p.vendor_id === vendorId);
    }

    const { data, error } = await supabase
      .from("vendor_products")
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
    if (USE_MOCK_DATA) {
      if (!mockProductsCache) {
        mockProductsCache = productGenerator.generateAllProducts();
      }
      const product = mockProductsCache.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");
      return product;
    }

    const { data, error } = await supabase
      .from("vendor_products")
      .select(`
        *,
        vendors(business_name)
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
  async createProduct(product: any) {
    const { data, error } = await supabase
      .from("vendor_products")
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
  async updateProduct(productId: string, updates: any) {
    const { data, error } = await supabase
      .from("vendor_products")
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
      .from("vendor_products")
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
      .from("vendor_products")
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
    if (USE_MOCK_DATA) {
      if (!mockProductsCache) {
        mockProductsCache = productGenerator.generateAllProducts();
      }
      const lowerQuery = query.toLowerCase();
      return mockProductsCache.filter(p => 
        p.product_name?.toLowerCase().includes(lowerQuery) ||
        p.product_description?.toLowerCase().includes(lowerQuery) ||
        p.category?.toLowerCase().includes(lowerQuery)
      ).slice(0, 20);
    }

    const { data, error } = await supabase
      .from("vendor_products")
      .select(`
        *,
        vendors(business_name)
      `)
      .eq("product_status", "active")
      .or(`product_name.ilike.%${query}%,product_description.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error("Error searching products:", error);
      throw error;
    }
    return (data || []) as any[];
  },

  async getProductDetails(productId: string) {
    if (USE_MOCK_DATA) {
      return this.getProduct(productId);
    }

    const { data, error } = await supabase
      .from("vendor_products")
      .select(`
        *,
        vendors ( business_name ),
        product_aggregated_reviews (*)
      `)
      .eq("id", productId)
      .single();

    if (error) throw error;
    return data;
  }
};