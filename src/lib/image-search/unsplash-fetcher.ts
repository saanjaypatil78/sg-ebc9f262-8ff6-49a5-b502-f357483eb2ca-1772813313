interface ImageMatchContext {
  productName: string;
  category?: string;
  count?: number;
  seed?: string;
}

const STOP_WORDS = new Set([
  "for",
  "with",
  "pack",
  "of",
  "set",
  "combo",
  "online",
  "buy",
  "best",
  "top",
  "premium",
  "quality",
  "original",
  "genuine",
  "latest",
  "new",
  "sale",
  "offer",
  "discount",
  "price",
  "india",
  "indian",
  "branded",
  "edition",
  "series",
  "model",
  "plus",
  "max",
  "pro",
  "mini",
  "ultra",
]);

const BRAND_TOKENS = new Set([
  "samsung",
  "xiaomi",
  "redmi",
  "poco",
  "oneplus",
  "realme",
  "vivo",
  "oppo",
  "pixel",
  "apple",
  "dell",
  "hp",
  "lenovo",
  "asus",
  "boat",
  "noise",
  "philips",
  "bajaj",
  "prestige",
  "butterfly",
  "havells",
  "minimalist",
  "plum",
  "lakme",
  "maybelline",
  "loreal",
  "pantene",
  "dove",
  "nike",
  "adidas",
  "puma",
  "wrangler",
  "levis",
]);

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function isMostlyNumericToken(token: string): boolean {
  if (!token) return true;
  const hasDigit = /\d/.test(token);
  const letters = token.replace(/[^a-z]/gi, "").length;
  return hasDigit && letters < 2;
}

function extractTokens(productName: string): string[] {
  const text = normalizeText(productName);
  const tokens = text
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length >= 3)
    .filter((t) => !STOP_WORDS.has(t))
    .filter((t) => !isMostlyNumericToken(t));

  return tokens.slice(0, 12);
}

type ProductKind =
  | "smartphone"
  | "laptop"
  | "earbuds"
  | "headphones"
  | "speaker"
  | "smartwatch"
  | "powerbank"
  | "tshirt"
  | "shirt"
  | "jeans"
  | "saree"
  | "kurti"
  | "dress"
  | "shoes"
  | "mixergrinder"
  | "iron"
  | "bedsheet"
  | "wallclock"
  | "faceserum"
  | "lipstick"
  | "shampoo"
  | "trimmer"
  | "book"
  | "toy"
  | "generic";

function detectKind(productName: string, category?: string): ProductKind {
  const t = normalizeText(productName);
  const c = normalizeText(category || "");

  const has = (re: RegExp) => re.test(t);

  if (has(/\b(iphone|smartphone|mobile|phone|galaxy|redmi|oneplus|realme|vivo|oppo|pixel)\b/)) return "smartphone";
  if (has(/\b(laptop|notebook|macbook|thinkpad|vivobook|ideapad|inspiron|pavilion|victus|rog)\b/)) return "laptop";
  if (has(/\b(earbuds|airdopes|tws|buds)\b/)) return "earbuds";
  if (has(/\b(headphone|headphones|rockerz|over-ear|overear)\b/)) return "headphones";
  if (has(/\b(speaker|soundbar)\b/)) return "speaker";
  if (has(/\b(smartwatch|watch|band|colorfit)\b/)) return "smartwatch";
  if (has(/\b(power\s?bank|powerbank)\b/)) return "powerbank";

  if (has(/\b(t-?shirt|tee)\b/)) return "tshirt";
  if (has(/\b(formal\s?shirt|shirt)\b/)) return "shirt";
  if (has(/\b(jeans|denim)\b/)) return "jeans";
  if (has(/\b(saree)\b/)) return "saree";
  if (has(/\b(kurti)\b/)) return "kurti";
  if (has(/\b(dress|gown)\b/)) return "dress";
  if (has(/\b(shoe|shoes|sneaker|sneakers|footwear|running\s?shoes)\b/)) return "shoes";

  if (has(/\b(mixer|grinder|mixergrinder)\b/)) return "mixergrinder";
  if (has(/\b(iron)\b/)) return "iron";
  if (has(/\b(bedsheet|bed\s?sheet)\b/)) return "bedsheet";
  if (has(/\b(wall\s?clock|clock)\b/)) return "wallclock";

  if (has(/\b(serum|face\s?serum)\b/)) return "faceserum";
  if (has(/\b(lipstick)\b/)) return "lipstick";
  if (has(/\b(shampoo)\b/)) return "shampoo";
  if (has(/\b(trimmer)\b/)) return "trimmer";

  if (c.includes("books")) return "book";
  if (c.includes("toys")) return "toy";

  return "generic";
}

function kindToQuery(kind: ProductKind): string {
  switch (kind) {
    case "smartphone":
      return "smartphone,android phone,product photography,isolated";
    case "laptop":
      return "laptop,computer,product photography,isolated";
    case "earbuds":
      return "wireless earbuds,earphones,product photography,isolated";
    case "headphones":
      return "headphones,audio,product photography,isolated";
    case "speaker":
      return "bluetooth speaker,audio,product photography,isolated";
    case "smartwatch":
      return "smartwatch,wearable,product photography,isolated";
    case "powerbank":
      return "power bank,portable charger,product photography,isolated";
    case "tshirt":
      return "tshirt,clothing,product photography,flat lay";
    case "shirt":
      return "shirt,formal shirt,clothing,product photography,flat lay";
    case "jeans":
      return "jeans,denim,clothing,product photography,flat lay";
    case "saree":
      return "saree,indian clothing,fabric,product photography";
    case "kurti":
      return "kurti,indian clothing,product photography";
    case "dress":
      return "dress,fashion,product photography";
    case "shoes":
      return "sneakers,shoes,footwear,product photography,isolated";
    case "mixergrinder":
      return "mixer grinder,kitchen appliance,product photography,isolated";
    case "iron":
      return "electric iron,home appliance,product photography,isolated";
    case "bedsheet":
      return "bedsheet,home textile,product photography";
    case "wallclock":
      return "wall clock,home decor,product photography,isolated";
    case "faceserum":
      return "face serum,skincare bottle,product photography,isolated";
    case "lipstick":
      return "lipstick,makeup,product photography,isolated";
    case "shampoo":
      return "shampoo bottle,haircare,product photography,isolated";
    case "trimmer":
      return "electric trimmer,grooming,product photography,isolated";
    case "book":
      return "book cover,book,product photography,isolated";
    case "toy":
      return "toy,children toy,product photography,isolated";
    default:
      return "product,shopping,product photography";
  }
}

function buildHumanQuery(productName: string, category?: string): string {
  const kind = detectKind(productName, category);
  const base = kindToQuery(kind);

  const tokens = extractTokens(productName);
  const brand = tokens.find((t) => BRAND_TOKENS.has(t)) || "";

  const categoryHint = normalizeText(category || "");
  const categoryTag =
    categoryHint.includes("home") || categoryHint.includes("kitchen")
      ? "home"
      : categoryHint.includes("fashion")
        ? "fashion"
        : categoryHint.includes("beauty")
          ? "beauty"
          : categoryHint.includes("electronics")
            ? "technology"
            : categoryHint.includes("books")
              ? "books"
              : categoryHint.includes("toys")
                ? "toys"
                : "";

  const queryParts = [
    base,
    brand ? `${brand},product` : "",
    categoryTag ? `${categoryTag}` : "",
  ].filter(Boolean);

  return queryParts.join(",");
}

function buildUnsplashUrls(queryCommaSeparated: string, count: number, seed: string): string[] {
  const baseSig = hashString(seed);
  const q = encodeURIComponent(queryCommaSeparated);
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    const sig = (baseSig + i * 97) % 10000;
    urls.push(`https://source.unsplash.com/featured/800x800?${q}&sig=${sig}`);
  }
  return urls;
}

export class ImageSearchEngine {
  private cache = new Map<string, string[]>();

  getProductImages(context: ImageMatchContext): string[] {
    const count = Math.max(1, Math.min(context.count ?? 3, 6));
    const seed = context.seed ?? context.productName;
    const query = buildHumanQuery(context.productName, context.category);

    const cacheKey = `${query}|${count}|${seed}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const urls = buildUnsplashUrls(query, count, seed);
    this.cache.set(cacheKey, urls);
    return urls;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const imageSearchEngine = new ImageSearchEngine();