/**
 * Advanced Product Generator - lightweight output for UI performance.
 * Generates realistic products while keeping payload small (no massive review arrays).
 */

import { PRODUCT_TEMPLATES } from "@/lib/mock-data/product-templates";
import { INDIAN_NAMES, REVIEW_TEMPLATES } from "@/lib/mock-data/review-data";

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  reviewer_name: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

export interface GeneratedProduct {
  product_name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  discount_percentage: number;
  stock_quantity: number;
  sku: string;
  images: string[];
  specifications: Record<string, string>;
  variations: ProductVariation[];
  reviews: ProductReview[];
  aggregated_rating: number;
  review_count: number;
  tags: string[];
  brand: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export class ProductGenerator {
  private productCounter = 0;
  private reviewCounter = 0;

  generateSKU(category: string): string {
    this.productCounter++;
    const prefix = category.substring(0, 3).toUpperCase();
    return `${prefix}${String(this.productCounter).padStart(7, "0")}`;
  }

  randomDate(): string {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
  }

  generateReviews(sampleCount: number, avgRating: number): ProductReview[] {
    const count = clamp(sampleCount, 0, 6);
    const reviews: ProductReview[] = [];

    for (let i = 0; i < count; i++) {
      this.reviewCounter++;

      let rating: number;
      const rand = Math.random();
      if (rand < 0.6) {
        rating = avgRating;
      } else if (rand < 0.85) {
        rating = clamp(avgRating + (Math.random() > 0.5 ? 1 : -1), 1, 5);
      } else {
        rating = Math.floor(Math.random() * 5) + 1;
      }

      const templates = rating >= 4 ? REVIEW_TEMPLATES.positive : rating === 3 ? REVIEW_TEMPLATES.neutral : REVIEW_TEMPLATES.negative;
      const template = templates[Math.floor(Math.random() * templates.length)];

      reviews.push({
        id: `REV${String(this.reviewCounter).padStart(8, "0")}`,
        rating,
        title: template.title,
        comment: template.comment,
        reviewer_name: INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)],
        verified_purchase: Math.random() > 0.2,
        helpful_count: Math.floor(Math.random() * 50),
        created_at: this.randomDate(),
      });
    }

    return reviews;
  }

  generateVariations(basePrice: number, type: "clothing" | "electronics"): ProductVariation[] {
    const variations: ProductVariation[] = [];

    if (type === "clothing") {
      const sizes = ["S", "M", "L", "XL", "XXL"];
      const colors = ["Black", "White", "Blue", "Red", "Grey"];

      sizes.forEach((size) => {
        colors.forEach((color) => {
          variations.push({
            id: `VAR${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            name: `${size} - ${color}`,
            price: basePrice + (Math.random() > 0.5 ? 100 : 0),
            stock: Math.floor(Math.random() * 50) + 5,
            sku: this.generateSKU("VAR"),
          });
        });
      });
    }

    if (type === "electronics") {
      const variants = ["4GB RAM", "6GB RAM", "8GB RAM"];
      variants.forEach((variant, idx) => {
        variations.push({
          id: `VAR${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          name: variant,
          price: basePrice + idx * 2000,
          stock: Math.floor(Math.random() * 30) + 10,
          sku: this.generateSKU("VAR"),
        });
      });
    }

    return variations;
  }

  private createProductBase(params: {
    productName: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    mrp: number;
    discount: number;
    stock: number;
    skuPrefix: string;
    brand: string;
    tags: string[];
    specifications: Record<string, string>;
    variations: ProductVariation[];
    reviewCount: number;
    aggregatedRating: number;
  }): GeneratedProduct {
    const sku = this.generateSKU(params.skuPrefix);

    return {
      product_name: params.productName,
      description: params.description,
      category: params.category,
      subcategory: params.subcategory,
      price: params.price,
      mrp: params.mrp,
      discount_percentage: params.discount,
      stock_quantity: params.stock,
      sku,
      images: [],
      specifications: params.specifications,
      variations: params.variations,
      reviews: this.generateReviews(Math.min(params.reviewCount, 6), Math.floor(params.aggregatedRating)),
      aggregated_rating: parseFloat(params.aggregatedRating.toFixed(1)),
      review_count: params.reviewCount,
      tags: params.tags,
      brand: params.brand,
    };
  }

  generateElectronicsProducts(count: number): GeneratedProduct[] {
    const products: GeneratedProduct[] = [];
    const categories = ["smartphones", "laptops", "accessories"] as const;

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const templates = PRODUCT_TEMPLATES.electronics[category];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const model = template.models[Math.floor(Math.random() * template.models.length)];

      const mrp = Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0];
      const discount = Math.floor(Math.random() * 30) + 10;
      const price = Math.floor(mrp * (1 - discount / 100));

      const reviewCount = Math.floor(Math.random() * 500) + 15;
      const avgRating = Math.random() * 1.5 + 3.5;

      products.push(
        this.createProductBase({
          productName: `${template.brand} ${model}`,
          description: `Experience premium quality with ${template.brand} ${model}. Features latest technology, long battery life, and stunning display. Perfect for daily use and professional work. Comes with manufacturer warranty and assured quality.`,
          category: "Electronics",
          subcategory: category.charAt(0).toUpperCase() + category.slice(1),
          price,
          mrp,
          discount,
          stock: Math.floor(Math.random() * 100) + 20,
          skuPrefix: "ELEC",
          brand: template.brand,
          tags: ["trending", "bestseller", template.brand.toLowerCase()],
          specifications: {
            Brand: template.brand,
            Model: model,
            Warranty: "1 Year Manufacturer Warranty",
            "Country of Origin": "India",
          },
          variations: this.generateVariations(price, "electronics"),
          reviewCount,
          aggregatedRating: avgRating,
        })
      );
    }

    return products;
  }

  generateFashionProducts(count: number): GeneratedProduct[] {
    const products: GeneratedProduct[] = [];
    const genders = ["mens", "womens"] as const;

    for (let i = 0; i < count; i++) {
      const gender = genders[i % genders.length];
      const templates = PRODUCT_TEMPLATES.fashion[gender];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const brand = template.brands[Math.floor(Math.random() * template.brands.length)];

      const mrp = Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0];
      const discount = Math.floor(Math.random() * 50) + 20;
      const price = Math.floor(mrp * (1 - discount / 100));

      const reviewCount = Math.floor(Math.random() * 300) + 20;
      const avgRating = Math.random() * 1.5 + 3.5;

      products.push(
        this.createProductBase({
          productName: `${brand} ${template.type} for ${gender === "mens" ? "Men" : "Women"}`,
          description: `Stylish and comfortable ${template.type} from ${brand}. Premium fabric, perfect fit, and latest design. Ideal for casual and semi-formal occasions. Machine washable and long-lasting quality.`,
          category: "Fashion",
          subcategory: gender === "mens" ? "Men's Wear" : "Women's Wear",
          price,
          mrp,
          discount,
          stock: Math.floor(Math.random() * 150) + 30,
          skuPrefix: "FASH",
          brand,
          tags: ["fashion", "trending", brand.toLowerCase()],
          specifications: {
            Brand: brand,
            Material: "Cotton Blend",
            Fit: "Regular Fit",
            Care: "Machine Wash",
          },
          variations: this.generateVariations(price, "clothing"),
          reviewCount,
          aggregatedRating: avgRating,
        })
      );
    }

    return products;
  }

  generateHomeProducts(count: number): GeneratedProduct[] {
    const products: GeneratedProduct[] = [];

    for (let i = 0; i < count; i++) {
      const template = PRODUCT_TEMPLATES.home[Math.floor(Math.random() * PRODUCT_TEMPLATES.home.length)];
      const brand = template.brands[Math.floor(Math.random() * template.brands.length)];

      const mrp = Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0];
      const discount = Math.floor(Math.random() * 40) + 15;
      const price = Math.floor(mrp * (1 - discount / 100));

      const reviewCount = Math.floor(Math.random() * 250) + 25;
      const avgRating = Math.random() * 1.5 + 3.5;

      products.push(
        this.createProductBase({
          productName: `${brand} ${template.type}`,
          description: `Premium quality ${template.type} from ${brand}. Durable construction, modern design, and excellent performance. Perfect for home use with energy efficiency and safety features. Trusted brand with reliable after-sales service.`,
          category: "Home & Kitchen",
          subcategory: "Home Appliances",
          price,
          mrp,
          discount,
          stock: Math.floor(Math.random() * 80) + 15,
          skuPrefix: "HOME",
          brand,
          tags: ["home", "appliances", brand.toLowerCase()],
          specifications: {
            Brand: brand,
            Material: "Plastic/Metal",
            Warranty: "1 Year",
            Power: "220V",
          },
          variations: [],
          reviewCount,
          aggregatedRating: avgRating,
        })
      );
    }

    return products;
  }

  generateBeautyProducts(count: number): GeneratedProduct[] {
    const products: GeneratedProduct[] = [];

    for (let i = 0; i < count; i++) {
      const template = PRODUCT_TEMPLATES.beauty[Math.floor(Math.random() * PRODUCT_TEMPLATES.beauty.length)];
      const brand = template.brands[Math.floor(Math.random() * template.brands.length)];

      const mrp = Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0];
      const discount = Math.floor(Math.random() * 35) + 10;
      const price = Math.floor(mrp * (1 - discount / 100));

      const reviewCount = Math.floor(Math.random() * 400) + 30;
      const avgRating = Math.random() * 1.5 + 3.5;

      products.push(
        this.createProductBase({
          productName: `${brand} ${template.type}`,
          description: `Premium ${template.type} from ${brand}. Dermatologically tested, suitable for all skin types. Natural ingredients, cruelty-free, and long-lasting results. Trusted by professionals and beauty enthusiasts.`,
          category: "Beauty & Personal Care",
          subcategory: "Beauty Products",
          price,
          mrp,
          discount,
          stock: Math.floor(Math.random() * 120) + 25,
          skuPrefix: "BEAU",
          brand,
          tags: ["beauty", "skincare", brand.toLowerCase()],
          specifications: {
            Brand: brand,
            Type: template.type,
            "Suitable For": "All Skin Types",
            "Cruelty Free": "Yes",
          },
          variations: [],
          reviewCount,
          aggregatedRating: avgRating,
        })
      );
    }

    return products;
  }

  generateAllProducts(totalCount: number = 240): GeneratedProduct[] {
    const distribution = {
      electronics: Math.floor(totalCount * 0.26),
      fashion: Math.floor(totalCount * 0.34),
      home: Math.floor(totalCount * 0.22),
      beauty: Math.floor(totalCount * 0.18),
    };

    return [
      ...this.generateElectronicsProducts(distribution.electronics),
      ...this.generateFashionProducts(distribution.fashion),
      ...this.generateHomeProducts(distribution.home),
      ...this.generateBeautyProducts(distribution.beauty),
    ];
  }
}

export const productGenerator = new ProductGenerator();