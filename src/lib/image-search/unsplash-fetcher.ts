/**
 * Unsplash Image Fetcher
 * Fetches real product images matching titles without API key requirement
 */

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
}

interface ImageSearchResult {
  images: string[];
  source: string;
}

export class ImageSearchEngine {
  private cache: Map<string, string[]> = new Map();

  /**
   * Extract keywords from product title for image search
   */
  private extractKeywords(productName: string): string[] {
    // Remove common e-commerce words
    const stopWords = [
      "for", "with", "pack", "of", "set", "combo", "online", "buy",
      "best", "top", "premium", "quality", "original", "genuine",
      "latest", "new", "sale", "offer", "discount", "price",
      "india", "indian", "imported", "branded"
    ];

    const words = productName
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));

    // Prioritize: Brand + Product Type
    const keywords: string[] = [];
    
    // Extract brand (usually first word or after "by")
    if (words.length > 0) {
      keywords.push(words[0]);
    }
    
    // Extract product type (usually second word or key descriptor)
    if (words.length > 1) {
      keywords.push(words[1]);
    }

    // Add remaining important words (max 2 more)
    const remaining = words.slice(2).filter(w => w.length > 3);
    keywords.push(...remaining.slice(0, 2));

    return keywords.slice(0, 4); // Max 4 keywords
  }

  /**
   * Fetch images from Unsplash (no API key required for basic usage)
   */
  async fetchFromUnsplash(query: string): Promise<string[]> {
    try {
      // Use Unsplash Source API (no key required, direct image URLs)
      // Format: https://source.unsplash.com/1600x900/?keyword1,keyword2
      const keywords = query.split(" ").join(",");
      
      // Generate multiple image variations
      const images: string[] = [];
      
      // Primary image
      images.push(`https://source.unsplash.com/1600x900/?${keywords}`);
      
      // Variant angles/styles
      images.push(`https://source.unsplash.com/1600x900/?${keywords},product`);
      images.push(`https://source.unsplash.com/1600x900/?${keywords},closeup`);
      
      return images;
    } catch (error) {
      console.error("Unsplash fetch error:", error);
      return [];
    }
  }

  /**
   * Fetch images from Picsum (Lorem Picsum - free placeholder images)
   */
  private fetchFromPicsum(seed: string): string[] {
    // Generate deterministic images based on product name
    const hash = this.hashString(seed);
    const imageIds = [
      hash % 1000,
      (hash + 1) % 1000,
      (hash + 2) % 1000,
    ];

    return imageIds.map(id => `https://picsum.photos/seed/${id}/800/800`);
  }

  /**
   * Simple hash function for deterministic image selection
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Category-specific fallback images
   */
  private getCategoryImages(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      Electronics: [
        "https://source.unsplash.com/1600x900/?smartphone,technology",
        "https://source.unsplash.com/1600x900/?laptop,computer",
        "https://source.unsplash.com/1600x900/?electronics,gadget"
      ],
      Fashion: [
        "https://source.unsplash.com/1600x900/?fashion,clothing",
        "https://source.unsplash.com/1600x900/?tshirt,apparel",
        "https://source.unsplash.com/1600x900/?dress,style"
      ],
      "Home & Kitchen": [
        "https://source.unsplash.com/1600x900/?kitchen,appliances",
        "https://source.unsplash.com/1600x900/?home,decor",
        "https://source.unsplash.com/1600x900/?furniture,interior"
      ],
      Beauty: [
        "https://source.unsplash.com/1600x900/?skincare,beauty",
        "https://source.unsplash.com/1600x900/?makeup,cosmetics",
        "https://source.unsplash.com/1600x900/?perfume,fragrance"
      ],
      Sports: [
        "https://source.unsplash.com/1600x900/?sports,fitness",
        "https://source.unsplash.com/1600x900/?gym,exercise",
        "https://source.unsplash.com/1600x900/?running,shoes"
      ],
      Books: [
        "https://source.unsplash.com/1600x900/?books,reading",
        "https://source.unsplash.com/1600x900/?novel,literature",
        "https://source.unsplash.com/1600x900/?education,study"
      ],
      Toys: [
        "https://source.unsplash.com/1600x900/?toys,kids",
        "https://source.unsplash.com/1600x900/?baby,children",
        "https://source.unsplash.com/1600x900/?play,games"
      ],
    };

    return categoryMap[category] || categoryMap.Electronics;
  }

  /**
   * Main method: Get relevant images for product
   */
  async getProductImages(
    productName: string,
    category: string
  ): Promise<ImageSearchResult> {
    // Check cache first
    const cacheKey = `${productName}-${category}`;
    if (this.cache.has(cacheKey)) {
      return {
        images: this.cache.get(cacheKey)!,
        source: "cache"
      };
    }

    try {
      // Extract keywords from product name
      const keywords = this.extractKeywords(productName);
      const searchQuery = keywords.join(" ");

      // Try Unsplash first
      let images = await this.fetchFromUnsplash(searchQuery);

      // Fallback to category images if Unsplash fails
      if (images.length === 0) {
        images = this.getCategoryImages(category);
      }

      // Add unique timestamp to prevent caching issues
      const uniqueImages = images.map(url => `${url}&t=${Date.now()}`);

      // Cache results
      this.cache.set(cacheKey, uniqueImages);

      return {
        images: uniqueImages,
        source: "unsplash"
      };
    } catch (error) {
      console.error("Image search error:", error);
      
      // Ultimate fallback: category images
      const fallbackImages = this.getCategoryImages(category);
      return {
        images: fallbackImages,
        source: "category-fallback"
      };
    }
  }

  /**
   * Batch process multiple products
   */
  async batchFetchImages(
    products: Array<{ name: string; category: string }>
  ): Promise<Map<string, string[]>> {
    const results = new Map<string, string[]>();

    for (const product of products) {
      const result = await this.getProductImages(product.name, product.category);
      results.set(product.name, result.images);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export const imageSearchEngine = new ImageSearchEngine();