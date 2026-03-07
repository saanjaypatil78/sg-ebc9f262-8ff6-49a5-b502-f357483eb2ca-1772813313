import { supabase } from "@/integrations/supabase/client";

// Platform Adapter Interface
export interface PlatformAdapter {
  platformName: string;
  fetchProducts(config: PlatformConfig): Promise<ExternalProduct[]>;
  fetchProductDetails(productId: string, config: PlatformConfig): Promise<ExternalProduct>;
  validateCredentials(config: PlatformConfig): Promise<boolean>;
  mapToInternalProduct(external: ExternalProduct): InternalProduct;
}

export interface PlatformConfig {
  storeId: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ExternalProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  category: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  attributes: Record<string, any>;
  lastUpdated: string;
}

export interface InternalProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  specifications: any;
  vendorId: string;
}

export interface SyncResult {
  success: boolean;
  productsFetched: number;
  productsCreated: number;
  productsUpdated: number;
  productsFailed: number;
  conflicts: number;
  errors: string[];
  duration: number;
}

// ═══════════════════════════════════════════════════════════════
// PLATFORM ADAPTERS
// ═══════════════════════════════════════════════════════════════

class AmazonAdapter implements PlatformAdapter {
  platformName = "amazon";

  async fetchProducts(config: PlatformConfig): Promise<ExternalProduct[]> {
    // Amazon SP-API integration
    // This is a placeholder - real implementation would use Amazon SP-API
    try {
      const response = await fetch(`https://sellingpartnerapi-na.amazon.com/catalog/2022-04-01/items`, {
        headers: {
          'x-amz-access-token': config.accessToken || '',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Amazon API failed');
      
      const data = await response.json();
      return this.parseAmazonProducts(data);
    } catch (error) {
      console.error('Amazon fetch error:', error);
      return [];
    }
  }

  async fetchProductDetails(productId: string, config: PlatformConfig): Promise<ExternalProduct> {
    // Fetch single product details from Amazon
    const products = await this.fetchProducts(config);
    return products.find(p => p.id === productId) || {} as ExternalProduct;
  }

  async validateCredentials(config: PlatformConfig): Promise<boolean> {
    try {
      await this.fetchProducts(config);
      return true;
    } catch {
      return false;
    }
  }

  mapToInternalProduct(external: ExternalProduct): InternalProduct {
    return {
      name: external.name,
      description: external.description,
      category: external.category,
      price: external.price * 0.85, // 15% platform fee
      mrp: external.price,
      stock: external.stock,
      images: external.images,
      specifications: external.attributes,
      vendorId: '', // Set by sync service
    };
  }

  private parseAmazonProducts(data: any): ExternalProduct[] {
    // Parse Amazon-specific response format
    return [];
  }
}

class ShopsyAdapter implements PlatformAdapter {
  platformName = "shopsy";

  async fetchProducts(config: PlatformConfig): Promise<ExternalProduct[]> {
    // Shopsy API integration
    return [];
  }

  async fetchProductDetails(productId: string, config: PlatformConfig): Promise<ExternalProduct> {
    return {} as ExternalProduct;
  }

  async validateCredentials(config: PlatformConfig): Promise<boolean> {
    return true;
  }

  mapToInternalProduct(external: ExternalProduct): InternalProduct {
    return {
      name: external.name,
      description: external.description,
      category: external.category,
      price: external.price * 0.85,
      mrp: external.price,
      stock: external.stock,
      images: external.images,
      specifications: external.attributes,
      vendorId: '',
    };
  }
}

class MeeshoAdapter implements PlatformAdapter {
  platformName = "meesho";

  async fetchProducts(config: PlatformConfig): Promise<ExternalProduct[]> {
    // Meesho API integration
    return [];
  }

  async fetchProductDetails(productId: string, config: PlatformConfig): Promise<ExternalProduct> {
    return {} as ExternalProduct;
  }

  async validateCredentials(config: PlatformConfig): Promise<boolean> {
    return true;
  }

  mapToInternalProduct(external: ExternalProduct): InternalProduct {
    return {
      name: external.name,
      description: external.description,
      category: external.category,
      price: external.price * 0.85,
      mrp: external.price,
      stock: external.stock,
      images: external.images,
      specifications: external.attributes,
      vendorId: '',
    };
  }
}

class FlipkartAdapter implements PlatformAdapter {
  platformName = "flipkart";

  async fetchProducts(config: PlatformConfig): Promise<ExternalProduct[]> {
    // Flipkart Marketplace API integration
    return [];
  }

  async fetchProductDetails(productId: string, config: PlatformConfig): Promise<ExternalProduct> {
    return {} as ExternalProduct;
  }

  async validateCredentials(config: PlatformConfig): Promise<boolean> {
    return true;
  }

  mapToInternalProduct(external: ExternalProduct): InternalProduct {
    return {
      name: external.name,
      description: external.description,
      category: external.category,
      price: external.price * 0.85,
      mrp: external.price,
      stock: external.stock,
      images: external.images,
      specifications: external.attributes,
      vendorId: '',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// SYNC ENGINE
// ═══════════════════════════════════════════════════════════════

export const platformSyncService = {
  adapters: {
    amazon: new AmazonAdapter(),
    shopsy: new ShopsyAdapter(),
    meesho: new MeeshoAdapter(),
    flipkart: new FlipkartAdapter(),
  },

  /**
   * Create Platform Integration
   */
  async createIntegration(data: {
    vendorId: string;
    platformName: string;
    storeId: string;
    apiKey?: string;
    apiSecret?: string;
    syncFrequency?: string;
  }) {
    const { data: integration, error } = await supabase
      .from('platform_integrations')
      .insert({
        vendor_id: data.vendorId,
        platform_name: data.platformName,
        platform_store_id: data.storeId,
        api_key: data.apiKey,
        api_secret: data.apiSecret,
        sync_frequency: data.syncFrequency || 'hourly',
        next_sync_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      } as any)
      .select()
      .single();

    if (error) throw error;
    return integration;
  },

  /**
   * Sync Products from Platform
   */
  async syncProducts(integrationId: string): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      success: false,
      productsFetched: 0,
      productsCreated: 0,
      productsUpdated: 0,
      productsFailed: 0,
      conflicts: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Get integration details
      const { data: integration, error: integrationError } = await supabase
        .from('platform_integrations')
        .select('*')
        .eq('id', integrationId)
        .single();

      if (integrationError || !integration) {
        throw new Error('Integration not found');
      }

      // Mark as syncing
      await supabase
        .from('platform_integrations')
        .update({ sync_status: 'syncing' } as any)
        .eq('id', integrationId);

      // Get platform adapter
      const adapter = this.adapters[integration.platform_name as keyof typeof this.adapters];
      if (!adapter) {
        throw new Error(`Adapter not found for ${integration.platform_name}`);
      }

      // Fetch products from external platform
      const externalProducts = await adapter.fetchProducts({
        storeId: integration.platform_store_id,
        apiKey: integration.api_key,
        apiSecret: integration.api_secret,
        accessToken: integration.access_token,
      });

      result.productsFetched = externalProducts.length;

      // Process each product
      for (const externalProduct of externalProducts) {
        try {
          await this.syncSingleProduct(integration, externalProduct, adapter);
          result.productsUpdated++;
        } catch (error) {
          console.error('Product sync error:', error);
          result.productsFailed++;
          result.errors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      result.success = result.productsFailed === 0;
      result.duration = Math.floor((Date.now() - startTime) / 1000);

      // Record sync result
      await supabase.rpc('record_sync_result', {
        p_integration_id: integrationId,
        p_sync_type: 'full',
        p_products_fetched: result.productsFetched,
        p_products_created: result.productsCreated,
        p_products_updated: result.productsUpdated,
        p_products_failed: result.productsFailed,
        p_status: result.success ? 'success' : 'partial',
        p_error_message: result.errors.join('; ') || null,
      });

    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Math.floor((Date.now() - startTime) / 1000);

      // Record failed sync
      await supabase.rpc('record_sync_result', {
        p_integration_id: integrationId,
        p_sync_type: 'full',
        p_products_fetched: result.productsFetched,
        p_products_created: result.productsCreated,
        p_products_updated: result.productsUpdated,
        p_products_failed: result.productsFailed,
        p_status: 'failed',
        p_error_message: result.errors.join('; '),
      });
    }

    return result;
  },

  /**
   * Sync Single Product
   */
  async syncSingleProduct(
    integration: any,
    externalProduct: ExternalProduct,
    adapter: PlatformAdapter
  ): Promise<void> {
    // Check if mapping exists
    const { data: mapping } = await supabase
      .from('product_sync_mapping')
      .select('*, vendor_products(*)')
      .eq('integration_id', integration.id)
      .eq('external_product_id', externalProduct.id)
      .single();

    if (mapping) {
      // Update existing product
      await this.updateProduct(mapping, externalProduct, adapter);
    } else {
      // Create new product
      await this.createProduct(integration, externalProduct, adapter);
    }
  },

  /**
   * Create Product from External Source
   */
  async createProduct(
    integration: any,
    externalProduct: ExternalProduct,
    adapter: PlatformAdapter
  ): Promise<void> {
    const internalProduct = adapter.mapToInternalProduct(externalProduct);
    internalProduct.vendorId = integration.vendor_id;

    // Create product in vendor_products
    const { data: product, error: productError } = await supabase
      .from('vendor_products')
      .insert({
        vendor_id: integration.vendor_id,
        product_name: internalProduct.name,
        description: internalProduct.description,
        category: internalProduct.category,
        price: internalProduct.price,
        mrp: internalProduct.mrp,
        stock: internalProduct.stock,
        images: internalProduct.images,
        specifications: internalProduct.specifications,
        status: 'active',
      } as any)
      .select()
      .single();

    if (productError) throw productError;

    // Create sync mapping
    await supabase
      .from('product_sync_mapping')
      .insert({
        integration_id: integration.id,
        bravecom_product_id: product.id,
        external_product_id: externalProduct.id,
        external_sku: externalProduct.sku,
        sync_status: 'active',
        last_synced_at: new Date().toISOString(),
      } as any);
  },

  /**
   * Update Product from External Source
   */
  async updateProduct(
    mapping: any,
    externalProduct: ExternalProduct,
    adapter: PlatformAdapter
  ): Promise<void> {
    const internalProduct = adapter.mapToInternalProduct(externalProduct);
    const existingProduct = mapping.vendor_products;

    // Detect conflicts
    const conflicts = [];
    if (existingProduct.price !== internalProduct.price) {
      conflicts.push({
        type: 'price_mismatch',
        bravecom: existingProduct.price,
        external: internalProduct.price,
      });
    }
    if (existingProduct.stock !== internalProduct.stock) {
      conflicts.push({
        type: 'stock_mismatch',
        bravecom: existingProduct.stock,
        external: internalProduct.stock,
      });
    }

    // Auto-resolve conflicts (external wins)
    if (conflicts.length > 0 && mapping.auto_resolve_conflicts) {
      await supabase
        .from('vendor_products')
        .update({
          price: internalProduct.price,
          mrp: internalProduct.mrp,
          stock: internalProduct.stock,
          description: internalProduct.description,
          images: internalProduct.images,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', mapping.bravecom_product_id);

      // Update mapping
      await supabase
        .from('product_sync_mapping')
        .update({
          last_synced_at: new Date().toISOString(),
          sync_count: mapping.sync_count + 1,
        } as any)
        .eq('id', mapping.id);
    }
  },

  /**
   * Get Vendor Integrations
   */
  async getVendorIntegrations(vendorId: string) {
    const { data, error } = await supabase
      .from('platform_integrations')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get Sync Logs
   */
  async getSyncLogs(integrationId: string, limit = 20) {
    const { data, error } = await supabase
      .from('product_sync_logs')
      .select('*')
      .eq('integration_id', integrationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Toggle Auto-Sync
   */
  async toggleAutoSync(integrationId: string, enabled: boolean) {
    const { error } = await supabase
      .from('platform_integrations')
      .update({ 
        sync_enabled: enabled,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', integrationId);

    if (error) throw error;
  },

  /**
   * Trigger Manual Sync
   */
  async triggerManualSync(integrationId: string) {
    return await this.syncProducts(integrationId);
  },

  /**
   * Get Platform Statistics
   */
  async getPlatformStats(integrationId: string) {
    const { data: logs, error } = await supabase
      .from('product_sync_logs')
      .select('*')
      .eq('integration_id', integrationId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    const totalSyncs = logs?.length || 0;
    const successfulSyncs = logs?.filter(l => l.status === 'success').length || 0;
    const totalProducts = logs?.reduce((sum, l) => sum + (l.products_fetched || 0), 0) || 0;
    const totalConflicts = logs?.reduce((sum, l) => sum + (l.conflicts_detected || 0), 0) || 0;

    return {
      totalSyncs,
      successfulSyncs,
      successRate: totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0,
      totalProducts,
      totalConflicts,
      lastSync: logs && logs.length > 0 ? logs[0].created_at : null,
    };
  },
};