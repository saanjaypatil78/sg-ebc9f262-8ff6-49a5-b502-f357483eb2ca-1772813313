export interface ExternalStoreLink {
  label: string;
  url: string;
  platform: "SHOPIFY" | "WORDPRESS" | "OTHER";
}

export const EXTERNAL_STORE_LINKS: ExternalStoreLink[] = [
  {
    label: "Visit Official Store",
    url: process.env.NEXT_PUBLIC_EXTERNAL_STORE_URL || "",
    platform: "OTHER",
  },
];

export const SPONSORS: Array<{ name: string; note?: string }> = [
  { name: "Apple" },
  { name: "Google" },
  { name: "Microsoft" },
  { name: "Amazon" },
  { name: "Samsung" },
  { name: "Nike" },
  { name: "Coca-Cola" },
  { name: "Toyota" },
  { name: "Unilever" },
  { name: "IBM" },
];
