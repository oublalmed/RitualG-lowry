import { sanityClient } from "./client";
import {
  getFeaturedProductsQuery,
  getBestSellerProductsQuery,
  getProductBySlugQuery,
  getRelatedProductsQuery,
  getBlogPostsQuery,
  getBlogPostBySlugQuery,
  getFaqItemsQuery,
  getSiteSettingsQuery,
  getAllCategoriesQuery,
  productCardFields,
} from "./queries";
import { groq } from "next-sanity";

async function safeFetch<T>(query: string, params?: Record<string, unknown>, fallback?: T): Promise<T> {
  try {
    const result = await sanityClient.fetch<T>(query, params ?? {});
    return result ?? (fallback as T);
  } catch (err) {
    console.warn("[sanity/fetch] fetch failed:", (err as Error).message);
    return fallback as T;
  }
}

// ── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  return safeFetch<any[]>(
    groq`*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      ${productCardFields}
    }`,
    {},
    []
  );
}

export async function getFeaturedProducts() {
  return safeFetch<any[]>(getFeaturedProductsQuery, {}, []);
}

export async function getBestSellerProducts() {
  return safeFetch<any[]>(getBestSellerProductsQuery, {}, []);
}

export async function getProductBySlug(slug: string) {
  return safeFetch<any | null>(getProductBySlugQuery, { slug }, null);
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return safeFetch<any[]>(getRelatedProductsQuery, { productId, categoryId }, []);
}

export async function getAllProductSlugs() {
  return safeFetch<{ slug: string }[]>(
    groq`*[_type == "product" && !(_id in path("drafts.**"))]{
      "slug": slug.current
    }`,
    {},
    []
  );
}

// ── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories() {
  return safeFetch<any[]>(getAllCategoriesQuery, {}, []);
}

// ── Blog ────────────────────────────────────────────────────────────────────

export async function getBlogPosts(params?: { category?: string; page?: number }) {
  try {
    const { postsQuery, totalQuery } = getBlogPostsQuery(params);
    const [posts, total] = await Promise.all([
      safeFetch<any[]>(postsQuery, {}, []),
      safeFetch<number>(totalQuery, {}, 0),
    ]);
    return { posts, total };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function getBlogPostBySlug(slug: string) {
  return safeFetch<any | null>(getBlogPostBySlugQuery, { slug }, null);
}

export async function getAllBlogSlugs() {
  return safeFetch<{ slug: string }[]>(
    groq`*[_type == "blogPost" && !(_id in path("drafts.**"))]{
      "slug": slug.current
    }`,
    {},
    []
  );
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export async function getFaqItems() {
  return safeFetch<any[]>(getFaqItemsQuery, {}, []);
}

// ── Site Settings ───────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return safeFetch<any | null>(getSiteSettingsQuery, {}, null);
}
