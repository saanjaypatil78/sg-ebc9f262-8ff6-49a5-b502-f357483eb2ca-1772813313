export const PRODUCT_TEMPLATES = {
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
} as const;