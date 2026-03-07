/**
 * Advanced Product Generator - 15,000+ Realistic Products
 * Matches Amazon, Meesho, eBay trending product patterns
 */

import { imageSearchEngine } from "@/lib/image-search/unsplash-fetcher";

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

// Real Indian E-commerce Product Templates
const PRODUCT_TEMPLATES = {
  electronics: {
    smartphones: [
      { brand: "Samsung", models: ["Galaxy M14 5G", "Galaxy F54 5G", "Galaxy S23 FE"], price: [12999, 29999] },
      { brand: "Xiaomi", models: ["Redmi Note 13 Pro", "Redmi 12 5G", "POCO X6 Pro"], price: [9999, 24999] },
      { brand: "realme", models: ["narzo 60 Pro", "11 Pro+", "C55"], price: [8999, 19999] },
      { brand: "OnePlus", models: ["Nord CE 3", "11R 5G", "12"], price: [24999, 64999] },
      { brand: "Vivo", models: ["Y100", "V29 Pro", "X100"], price: [11999, 59999] },
    ],
    laptops: [
      { brand: "HP", models: ["15s Ryzen 5", "Pavilion Gaming", "Victus"], price: [35990, 75990] },
      { brand: "Dell", models: ["Inspiron 3520", "G15 Gaming", "XPS 13"], price: [39990, 124990] },
      { brand: "Lenovo", models: ["IdeaPad Slim 3", "LOQ Gaming", "ThinkPad E14"], price: [32990, 89990] },
      { brand: "ASUS", models: ["VivoBook 15", "TUF Gaming F15", "ROG Strix G15"], price: [38990, 134990] },
    ],
    accessories: [
      { brand: "boAt", models: ["Airdopes 141", "Rockerz 450", "Stone 350"], price: [999, 2999] },
      { brand: "Noise", models: ["Buds VS104", "ColorFit Pro 4", "Shots X5"], price: [799, 4999] },
      { brand: "Mi", models: ["Power Bank 3i", "Smart Band 7", "TWS Earbuds 3"], price: [699, 2999] },
    ],
  },
  fashion: {
    mens: [
      { type: "T-Shirt", brands: ["Roadster", "H&M", "Wrogn", "Allen Solly"], price: [399, 1299] },
      { type: "Jeans", brands: ["Levi's", "Wrangler", "Spykar", "Flying Machine"], price: [999, 3499] },
      { type: "Formal Shirt", brands: ["Peter England", "Van Heusen", "Arrow", "Louis Philippe"], price: [899, 2999] },
      { type: "Casual Shoe", brands: ["Puma", "Adidas", "Nike", "Bata"], price: [1299, 4999] },
    ],
    womens: [
      { type: "Kurti", brands: ["Libas", "Soch", "W", "Biba"], price: [499, 2499] },
      { type: "Saree", brands: ["Sareemall", "Craftsvilla", "Kalaniketan"], price: [799, 4999] },
      { type: "Western Dress", brands: ["FabIndia", "AND", "Vero Moda", "Only"], price: [999, 3999] },
      { type: "Footwear", brands: ["Metro", "Bata", "Crocs", "Skechers"], price: [699, 2999] },
    ],
  },
  home: [
    { type: "Mixer Grinder", brands: ["Philips", "Bajaj", "Prestige", "Butterfly"], price: [1999, 5999] },
    { type: "Iron", brands: ["Philips", "Bajaj", "Havells", "Morphy Richards"], price: [699, 2499] },
    { type: "Bedsheet Set", brands: ["Home Centre", "Amazon Brand", "Cortina"], price: [599, 2499] },
    { type: "Wall Clock", brands: ["Ajanta", "Random", "Safal Quartz"], price: [299, 1499] },
  ],
  beauty: [
    { type: "Face Serum", brands: ["Minimalist", "Dot & Key", "Plum", "The Derma Co"], price: [399, 999] },
    { type: "Lipstick", brands: ["Maybelline", "Lakme", "Sugar", "MAC"], price: [199, 1999] },
    { type: "Shampoo", brands: ["Pantene", "Head & Shoulders", "Dove", "L'Oreal"], price: [199, 699] },
    { type: "Trimmer", brands: ["Philips", "Havells", "Mi", "Bombay Shaving Company"], price: [999, 3499] },
  ],
};

const REVIEW_TEMPLATES = {
  positive: [
    { title: "Excellent product!", comment: "Worth every penny. Highly recommended!" },
    { title: "Amazing quality", comment: "Better than expected. Fast delivery too." },
    { title: "Best purchase ever", comment: "Using it daily. No complaints at all." },
    { title: "Super satisfied", comment: "Great value for money. Will buy again!" },
    { title: "Loved it", comment: "Perfect product. Exactly as described." },
  ],
  neutral: [
    { title: "Good product", comment: "Works fine. Average quality for the price." },
    { title: "Decent", comment: "Nothing special but does the job." },
    { title: "Okay purchase", comment: "Expected better but acceptable." },
  ],
  negative: [
    { title: "Not satisfied", comment: "Quality could be better. Disappointed." },
    { title: "Average product", comment: "Doesn't meet expectations. Overpriced." },
    { title: "Poor quality", comment: "Not worth the money. Looking for return." },
  ],
};

const INDIAN_NAMES = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Singh", "Vikram Reddy",
  "Anjali Gupta", "Rahul Verma", "Pooja Desai", "Sanjay Mehta", "Kavita Joshi",
  "Arjun Nair", "Divya Menon", "Rohan Das", "Neha Agarwal", "Karan Khanna",
];

export class ProductGenerator {
  private productCounter = 0;
  private reviewCounter = 0;

  generateSKU(category: string): string {
    this.productCounter++;
    const prefix = category.substring(0, 3).toUpperCase();
    return `${prefix}${String(this.productCounter).padStart(7, "0")}`;
  }

  generateReviews(count: number, avgRating: number): ProductReview[] {
    const reviews: ProductReview[] = [];
    
    for (let i = 0; i < count; i++) {
      this.reviewCounter++;
      
      // Weight ratings toward avgRating
      let rating: number;
      const rand = Math.random();
      if (rand < 0.6) {
        rating = avgRating;
      } else if (rand < 0.8) {
        rating = Math.max(1, Math.min(5, avgRating + (Math.random() > 0.5 ? 1 : -1)));
      } else {
        rating = Math.floor(Math.random() * 5) + 1;
      }

      const templates = rating >= 4 ? REVIEW_TEMPLATES.positive :
                       rating === 3 ? REVIEW_TEMPLATES.neutral :
                       REVIEW_TEMPLATES.negative;
      
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

  randomDate(): string {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
  }

  generateProductImages(category: string, count: number): string[] {
    const images: string[] = [];
    const seed = Math.floor(Math.random() * 10000);
    
    for (let i = 0; i < count; i++) {
      images.push(`https://picsum.photos/seed/${seed + i}/800/800`);
    }
    
    return images;
  }

  generateVariations(basePrice: number, type: string): ProductVariation[] {
    const variations: ProductVariation[] = [];
    
    if (type === "clothing") {
      const sizes = ["S", "M", "L", "XL", "XXL"];
      const colors = ["Black", "White", "Blue", "Red", "Grey"];
      
      sizes.forEach(size => {
        colors.forEach(color => {
          variations.push({
            id: `VAR${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            name: `${size} - ${color}`,
            price: basePrice + (Math.random() > 0.5 ? 100 : 0),
            stock: Math.floor(Math.random() * 50) + 5,
            sku: this.generateSKU("VAR"),
          });
        });
      });
    } else if (type === "electronics") {
      const variants = ["4GB RAM", "6GB RAM", "8GB RAM"];
      variants.forEach(variant => {
        const priceIncrease = variants.indexOf(variant) * 2000;
        variations.push({
          id: `VAR${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          name: variant,
          price: basePrice + priceIncrease,
          stock: Math.floor(Math.random() * 30) + 10,
          sku: this.generateSKU("VAR"),
        });
      });
    }

    return variations;
  }

  generateElectronicsProducts(count: number): GeneratedProduct[] {
    const products: GeneratedProduct[] = [];
    const categories = ["smartphones", "laptops", "accessories"];
    
    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const templates = PRODUCT_TEMPLATES.electronics[category as keyof typeof PRODUCT_TEMPLATES.electronics];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const model = template.models[Math.floor(Math.random() * template.models.length)];
      
      const mrp = Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0];
      const discount = Math.floor(Math.random() * 30) + 10;
      const price = Math.floor(mrp * (1 - discount / 100));
      
      const reviewCount = Math.floor(Math.random() * 500) + 15;
      const avgRating = Math.random() * 1.5 + 3.5; // 3.5-5.0
      
      products.push({
        product_name: `${template.brand} ${model}`,
        description: `Experience premium quality with ${template.brand} ${model}. Features latest technology, long battery life, and stunning display. Perfect for daily use and professional work. Comes with manufacturer warranty and assured quality.`,
        category: "Electronics",
        subcategory: category.charAt(0).toUpperCase() + category.slice(1),
        price,
        mrp,
        discount_percentage: discount,
        stock_quantity: Math.floor(Math.random() * 100) + 20,
        sku: this.generateSKU("ELEC"),
        images: this.generateProductImages("electronics", Math.floor(Math.random() * 3) + 3),
        specifications: {
          "Brand": template.brand,
          "Model": model,
          "Warranty": "1 Year Manufacturer Warranty",
          "Country of Origin": "India",
        },
        variations: this.generateVariations(price, "electronics"),
        reviews: this.generateReviews(reviewCount, Math.floor(avgRating)),
        aggregated_rating: parseFloat(avgRating.toFixed(1)),
        review_count: reviewCount,
        tags: ["trending", "bestseller", template.brand.toLowerCase()],
        brand: template.brand,
      });
    }

    return products;
  }

  generateFashionProducts(count: number): GeneratedProduct[] {
    const products: GeneratedProduct[] = [];
    const genders = ["mens", "womens"];
    
    for (let i = 0; i < count; i++) {
      const gender = genders[i % genders.length];
      const templates = PRODUCT_TEMPLATES.fashion[gender as keyof typeof PRODUCT_TEMPLATES.fashion];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const brand = template.brands[Math.floor(Math.random() * template.brands.length)];
      
      const mrp = Math.floor(Math.random() * (template.price[1] - template.price[0])) + template.price[0];
      const discount = Math.floor(Math.random() * 50) + 20;
      const price = Math.floor(mrp * (1 - discount / 100));
      
      const reviewCount = Math.floor(Math.random() * 300) + 20;
      const avgRating = Math.random() * 1.5 + 3.5;
      
      products.push({
        product_name: `${brand} ${template.type} for ${gender === "mens" ? "Men" : "Women"}`,
        description: `Stylish and comfortable ${template.type} from ${brand}. Premium fabric, perfect fit, and latest design. Ideal for casual and semi-formal occasions. Machine washable and long-lasting quality.`,
        category: "Fashion",
        subcategory: gender === "mens" ? "Men's Wear" : "Women's Wear",
        price,
        mrp,
        discount_percentage: discount,
        stock_quantity: Math.floor(Math.random() * 150) + 30,
        sku: this.generateSKU("FASH"),
        images: this.generateProductImages("fashion", Math.floor(Math.random() * 3) + 3),
        specifications: {
          "Brand": brand,
          "Material": "Cotton Blend",
          "Fit": "Regular Fit",
          "Care": "Machine Wash",
        },
        variations: this.generateVariations(price, "clothing"),
        reviews: this.generateReviews(reviewCount, Math.floor(avgRating)),
        aggregated_rating: parseFloat(avgRating.toFixed(1)),
        review_count: reviewCount,
        tags: ["fashion", "trending", brand.toLowerCase()],
        brand,
      });
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
      
      products.push({
        product_name: `${brand} ${template.type}`,
        description: `Premium quality ${template.type} from ${brand}. Durable construction, modern design, and excellent performance. Perfect for home use with energy efficiency and safety features. Trusted brand with reliable after-sales service.`,
        category: "Home & Kitchen",
        subcategory: "Home Appliances",
        price,
        mrp,
        discount_percentage: discount,
        stock_quantity: Math.floor(Math.random() * 80) + 15,
        sku: this.generateSKU("HOME"),
        images: this.generateProductImages("home", Math.floor(Math.random() * 3) + 3),
        specifications: {
          "Brand": brand,
          "Material": "Plastic/Metal",
          "Warranty": "1 Year",
          "Power": "220V",
        },
        variations: [],
        reviews: this.generateReviews(reviewCount, Math.floor(avgRating)),
        aggregated_rating: parseFloat(avgRating.toFixed(1)),
        review_count: reviewCount,
        tags: ["home", "appliances", brand.toLowerCase()],
        brand,
      });
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
      
      products.push({
        product_name: `${brand} ${template.type}`,
        description: `Premium ${template.type} from ${brand}. Dermatologically tested, suitable for all skin types. Natural ingredients, cruelty-free, and long-lasting results. Trusted by professionals and beauty enthusiasts.`,
        category: "Beauty & Personal Care",
        subcategory: "Beauty Products",
        price,
        mrp,
        discount_percentage: discount,
        stock_quantity: Math.floor(Math.random() * 120) + 25,
        sku: this.generateSKU("BEAU"),
        images: this.generateProductImages("beauty", Math.floor(Math.random() * 3) + 3),
        specifications: {
          "Brand": brand,
          "Type": template.type,
          "Suitable For": "All Skin Types",
          "Cruelty Free": "Yes",
        },
        variations: [],
        reviews: this.generateReviews(reviewCount, Math.floor(avgRating)),
        aggregated_rating: parseFloat(avgRating.toFixed(1)),
        review_count: reviewCount,
        tags: ["beauty", "skincare", brand.toLowerCase()],
        brand,
      });
    }

    return products;
  }

  generateAllProducts(totalCount: number = 15000): GeneratedProduct[] {
    console.log(`🎯 Generating ${totalCount} products...`);
    
    const distribution = {
      electronics: Math.floor(totalCount * 0.20), // 20%
      fashion: Math.floor(totalCount * 0.27), // 27%
      home: Math.floor(totalCount * 0.17), // 17%
      beauty: Math.floor(totalCount * 0.13), // 13%
      sports: Math.floor(totalCount * 0.10), // 10%
      books: Math.floor(totalCount * 0.07), // 7%
      toys: Math.floor(totalCount * 0.06), // 6%
    };

    const allProducts: GeneratedProduct[] = [
      ...this.generateElectronicsProducts(distribution.electronics),
      ...this.generateFashionProducts(distribution.fashion),
      ...this.generateHomeProducts(distribution.home),
      ...this.generateBeautyProducts(distribution.beauty),
    ];

    console.log(`✅ Generated ${allProducts.length} products successfully!`);
    return allProducts;
  }

  /**
   * Generate a single product with relevant images
   */
  private async generateProduct(
    category: string,
    index: number
  ): Promise<any> {
    const categoryData = this.productTemplates[category];
    if (!categoryData) {
      throw new Error(`Category ${category} not found`);
    }

    // Select random template
    const template = categoryData.templates[
      Math.floor(Math.random() * categoryData.templates.length)
    ];

    // Generate product name with brand
    const brand = categoryData.brands[
      Math.floor(Math.random() * categoryData.brands.length)
    ];
    const productName = `${brand} ${template.name}`;

    // Fetch relevant images based on product name
    const imageResult = await imageSearchEngine.getProductImages(
      productName,
      category
    );

    // Generate variations
    const variations = this.generateVariations(template, brand);

    // Generate reviews
    const reviewCount = Math.floor(Math.random() * 485) + 15; // 15-500 reviews
    const rating = this.generateWeightedRating();

    // Calculate pricing
    const basePrice = this.generatePrice(template.priceRange);
    const discount = Math.floor(Math.random() * 40) + 10; // 10-50% discount
    const mrp = basePrice * (1 + discount / 100);

    return {
      id: `${category.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      product_name: productName,
      product_description: this.generateDescription(template, brand),
      category: category,
      brand: brand,
      price: basePrice.toFixed(2),
      mrp: mrp.toFixed(2),
      discount_percentage: discount,
      images: imageResult.images, // Real relevant images
      image_url: imageResult.images[0], // Primary image
      sku: `SKU-${brand.substring(0, 3).toUpperCase()}-${Date.now()}-${index}`,
      stock_quantity: Math.floor(Math.random() * 191) + 10, // 10-200
      aggregated_rating: rating.toFixed(1),
      review_count: reviewCount,
      specifications: template.specifications,
      variations: variations,
      tags: [
        brand.toLowerCase(),
        category.toLowerCase(),
        template.name.toLowerCase(),
        rating >= 4.5 ? "bestseller" : "",
        reviewCount > 200 ? "trending" : "",
      ].filter(Boolean),
      vendor_id: "00000000-0000-0000-0000-000000000001", // Mock vendor
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Generate all products with relevant images (async)
   */
  async generateAllProductsAsync(): Promise<any[]> {
    console.log("🚀 Generating 15,000+ products with relevant images...");
    const allProducts: any[] = [];

    for (const [category, data] of Object.entries(this.productTemplates)) {
      console.log(`📦 Generating ${data.count} products for ${category}...`);
      
      // Generate products in batches to avoid overwhelming the system
      const batchSize = 100;
      for (let i = 0; i < data.count; i += batchSize) {
        const batchPromises = [];
        const batchEnd = Math.min(i + batchSize, data.count);
        
        for (let j = i; j < batchEnd; j++) {
          batchPromises.push(this.generateProduct(category, j + 1));
        }
        
        const batchProducts = await Promise.all(batchPromises);
        allProducts.push(...batchProducts);
        
        console.log(`  ✅ Generated ${batchEnd}/${data.count} ${category} products`);
      }
    }

    console.log(`✅ Generated ${allProducts.length} products with relevant images!`);
    return allProducts;
  }
}

export const productGenerator = new ProductGenerator();