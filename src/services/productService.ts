import { supabase } from "@/integrations/supabase/client";
import { productGenerator, type GeneratedProduct } from "@/lib/mock-data/product-generator";

type PublicVendorInfo = {
  business_name: string;
  email?: string | null;
};

export type PublicProduct = {
  id: string;
  vendor_id: string | null;
  product_name: string;
  product_description: string | null;
  category: string | null;
  price: string;
  images: string[] | null;
  image_url?: string | null;
  stock_quantity: number;
  sku: string | null;
  aggregated_rating: number | null;
  review_count: number | null;
  created_at: string | null;
  product_status: string | null;
  vendors?: PublicVendorInfo | null;
};

const IS_DEV = process.env.NODE_ENV !== "production";
const FORCE_MOCK_PRODUCTS =
  IS_DEV || process.env.NEXT_PUBLIC_FORCE_MOCK_PRODUCTS === "true";

let mockProductsCache: PublicProduct[] | null = null;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();
}

function toPublicProduct(p: GeneratedProduct, index: number): PublicProduct {
  const id = p.sku;
  const vendorId = `mock_vendor_${slugify(p.brand || "vendor")}`;

  const baseMs = Date.UTC(2026, 2, 7, 0, 0, 0);
  const createdAt = new Date(baseMs + index * 60_000).toISOString();

  return {
    id,
    vendor_id: vendorId,
    product_name: p.product_name,
    product_description: p.description,
    category: p.category,
    price: String(p.price),
    images: Array.isArray(p.images) ? p.images : [],
    image_url: Array.isArray(p.images) && p.images[0] ? p.images[0] : null,
    stock_quantity: typeof p.stock_quantity === "number" ? p.stock_quantity : 0,
    sku: p.sku,
    aggregated_rating:
      typeof p.aggregated_rating === "number" ? p.aggregated_rating : null,
    review_count: typeof p.review_count === "number" ? p.review_count : null,
    created_at: createdAt,
    product_status: "active",
    vendors: {
      business_name: p.brand || "Vendor",
      email: null,
    },
  };
}

function getMockProducts(count: number = 240): PublicProduct[] {
  if (mockProductsCache) return mockProductsCache;

  const generated = productGenerator.generateAllProducts(count);
  mockProductsCache = generated.map((p, idx) => toPublicProduct(p, idx));
  return mockProductsCache;
}

export const productService = {
  async getAllProducts(): Promise<PublicProduct[]> {
    if (FORCE_MOCK_PRODUCTS) return getMockProducts();

    try {
      const { data, error } = await supabase
        .from("vendor_products")
        .select(
          `
          *,
          vendors (
            business_name,
            email
          )
        `
        )
        .eq("product_status", "active")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data as unknown as PublicProduct[];
      }

      return getMockProducts();
    } catch (e) {
      console.error("getAllProducts failed, falling back to mock products:", e);
      return getMockProducts();
    }
  },

  async getProduct(productId: string): Promise<PublicProduct> {
    if (FORCE_MOCK_PRODUCTS) {
      const all = getMockProducts();
      const found = all.find((p) => p.id === productId);
      if (!found) throw new Error("Product not found");
      return found;
    }

    const { data, error } = await supabase
      .from("vendor_products")
      .select(
        `
        *,
        vendors(business_name, email)
      `
      )
      .eq("id", productId)
      .single();

    if (error || !data) throw error ?? new Error("Product not found");
    return data as unknown as PublicProduct;
  },

  async searchProducts(query: string): Promise<PublicProduct[]> {
    const q = query.trim();
    if (!q) return this.getAllProducts();

    if (FORCE_MOCK_PRODUCTS) {
      const all = getMockProducts();
      const ql = q.toLowerCase();
      return all
        .filter((p) => {
          const name = (p.product_name || "").toLowerCase();
          const desc = (p.product_description || "").toLowerCase();
          return name.includes(ql) || desc.includes(ql);
        })
        .slice(0, 50);
    }

    const { data, error } = await supabase
      .from("vendor_products")
      .select(
        `
        *,
        vendors(business_name, email)
      `
      )
      .eq("product_status", "active")
      .or(`product_name.ilike.%${q}%,product_description.ilike.%${q}%`)
      .limit(50);

    if (error) throw error;
    return (data || []) as unknown as PublicProduct[];
  },

  clearMockCache() {
    mockProductsCache = null;
  },
};