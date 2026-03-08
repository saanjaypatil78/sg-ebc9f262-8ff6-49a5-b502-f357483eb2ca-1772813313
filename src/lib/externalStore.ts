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
  { name: "Global Sponsor 1" },
  { name: "Global Sponsor 2" },
  { name: "Global Sponsor 3" },
  { name: "Global Sponsor 4" },
  { name: "Global Sponsor 5" },
];
