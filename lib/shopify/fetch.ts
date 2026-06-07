import { shopifyFetch } from "./client";
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, COLLECTIONS_QUERY, COLLECTION_BY_HANDLE_QUERY } from "./queries";
import type { Product, ProductVariant, SanityImage, ProductCategory } from "../types";

// ── Shopify → Internal type mappers ──────────────────────────────────────────

interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

interface ShopifyVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  selectedOptions: { name: string; value: string }[];
}

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  createdAt: string;
  updatedAt: string;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice: { amount: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string } };
}

function mapImage(img: ShopifyImage): SanityImage {
  return {
    asset: { url: img.url, _id: img.url },
    alt: img.altText ?? undefined,
  };
}

function extractColor(variant: ShopifyVariant): { name: string; hexCode: string } {
  const colorOpt = variant.selectedOptions.find((o) => o.name.toLowerCase() === "couleur");
  const colorName = colorOpt?.value ?? "Naturel";
  const colorMap: Record<string, string> = {
    "Naturel": "#1A1410",
    "Noir": "#0a0a0a",
    "Brun Chocolat": "#3D2B1F",
    "Brun": "#5C3317",
  };
  return { name: colorName, hexCode: colorMap[colorName] ?? "#1A1410" };
}

function extractLength(variant: ShopifyVariant): number {
  const lengthOpt = variant.selectedOptions.find((o) => o.name.toLowerCase() === "longueur");
  if (!lengthOpt) return 18;
  return parseInt(lengthOpt.value.replace(/"/g, ""), 10) || 18;
}

function mapVariant(v: ShopifyVariant): ProductVariant {
  return {
    _key: v.id,
    label: v.title,
    color: extractColor(v),
    length: extractLength(v),
    price: parseFloat(v.price.amount),
    sku: v.sku ?? undefined,
    stock: v.quantityAvailable ?? (v.availableForSale ? 10 : 0),
    isAvailable: v.availableForSale,
  };
}

function inferCategory(product: ShopifyProduct): ProductCategory {
  const type = product.productType?.toLowerCase() ?? "";
  const tags = product.tags.map((t) => t.toLowerCase());

  if (type === "perruques" || tags.includes("perruque")) {
    return { name: "Perruques", slug: "perruques" };
  }
  if (tags.includes("afro")) {
    return { name: "Afro & Curly", slug: "afro-curly" };
  }
  if (tags.includes("bouclée") || tags.includes("bouclee")) {
    return { name: "Bouclées", slug: "extensions-bouclees" };
  }
  return { name: "Lisses", slug: "extensions-lisses" };
}

function inferTexture(product: ShopifyProduct): string[] {
  const tags = product.tags.map((t) => t.toLowerCase());
  const textures: string[] = [];
  if (tags.includes("lisse")) textures.push("lisse");
  if (tags.includes("bouclée") || tags.includes("bouclee") || tags.includes("body-wave") || tags.includes("deep-wave") || tags.includes("water-wave")) textures.push("bouclée");
  if (tags.includes("afro") || tags.includes("kinky-curly")) textures.push("afro");
  return textures.length ? textures : ["lisse"];
}

function mapProduct(sp: ShopifyProduct): Product {
  const variants = sp.variants.edges.map((e) => mapVariant(e.node));
  const basePrice = parseFloat(sp.priceRange.minVariantPrice.amount);
  const comparePrice = sp.compareAtPriceRange?.minVariantPrice
    ? parseFloat(sp.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const tags = sp.tags.map((t) => t.toLowerCase());

  return {
    _id: sp.id,
    _createdAt: sp.createdAt,
    _updatedAt: sp.updatedAt,
    name: sp.title,
    slug: sp.handle,
    shortDescription: sp.description.slice(0, 200),
    description: sp.descriptionHtml,
    basePrice,
    comparePrice: comparePrice && comparePrice > basePrice ? comparePrice : null,
    stockStatus: totalStock === 0 ? "out_of_stock" : totalStock <= 5 ? "low_stock" : "in_stock",
    isNew: tags.includes("nouveau"),
    isBestSeller: tags.includes("best-seller"),
    isFeatured: tags.includes("best-seller") || tags.includes("nouveau"),
    productType: sp.productType ? [sp.productType] : [],
    texture: inferTexture(sp),
    tags: sp.tags,
    category: inferCategory(sp),
    images: sp.images.edges.map((e) => mapImage(e.node)),
    variants,
    rating: 4.8,
    reviewCount: Math.floor(Math.random() * 30) + 15,
  };
}

// ── Public fetch functions (same API as sanity/fetch.ts) ──────────────────────

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
      PRODUCTS_QUERY,
      { first: 50 }
    );
    return data.products.edges.map((e) => mapProduct(e.node));
  } catch (err) {
    console.warn("[shopify/fetch] getAllProducts failed:", (err as Error).message);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
      PRODUCTS_QUERY,
      { first: 8, query: "tag:best-seller OR tag:nouveau" }
    );
    return data.products.edges.map((e) => mapProduct(e.node));
  } catch (err) {
    console.warn("[shopify/fetch] getFeaturedProducts failed:", (err as Error).message);
    return [];
  }
}

export async function getBestSellerProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
      PRODUCTS_QUERY,
      { first: 8, query: "tag:best-seller", sortKey: "BEST_SELLING" }
    );
    return data.products.edges.map((e) => mapProduct(e.node));
  } catch (err) {
    console.warn("[shopify/fetch] getBestSellerProducts failed:", (err as Error).message);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle: slug }
    );
    return data.productByHandle ? mapProduct(data.productByHandle) : null;
  } catch (err) {
    console.warn("[shopify/fetch] getProductBySlug failed:", (err as Error).message);
    return null;
  }
}

export async function getRelatedProducts(slug: string, category?: string): Promise<Product[]> {
  try {
    const query = category ? `product_type:${category}` : undefined;
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
      PRODUCTS_QUERY,
      { first: 4, query }
    );
    return data.products.edges
      .map((e) => mapProduct(e.node))
      .filter((p) => p.slug !== slug);
  } catch (err) {
    console.warn("[shopify/fetch] getRelatedProducts failed:", (err as Error).message);
    return [];
  }
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: { handle: string } }[] } }>(
      `query { products(first: 250) { edges { node { handle } } } }`
    );
    return data.products.edges.map((e) => ({ slug: e.node.handle }));
  } catch (err) {
    console.warn("[shopify/fetch] getAllProductSlugs failed:", (err as Error).message);
    return [];
  }
}

export async function getAllCategories(): Promise<ProductCategory[]> {
  try {
    const data = await shopifyFetch<{ collections: { edges: { node: { id: string; handle: string; title: string; description: string } }[] } }>(
      COLLECTIONS_QUERY,
      { first: 20 }
    );
    return data.collections.edges.map((e) => ({
      _id: e.node.id,
      name: e.node.title,
      slug: e.node.handle,
      description: e.node.description,
    }));
  } catch (err) {
    console.warn("[shopify/fetch] getAllCategories failed:", (err as Error).message);
    return [];
  }
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ collectionByHandle: { products: { edges: { node: ShopifyProduct }[] } } | null }>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle, first: 50 }
    );
    if (!data.collectionByHandle) return [];
    return data.collectionByHandle.products.edges.map((e) => mapProduct(e.node));
  } catch (err) {
    console.warn("[shopify/fetch] getCollectionProducts failed:", (err as Error).message);
    return [];
  }
}
