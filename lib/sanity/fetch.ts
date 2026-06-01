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

// ── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  return sanityClient.fetch<any[]>(
    groq`*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      ${productCardFields}
    }`
  );
}

export async function getFeaturedProducts() {
  return sanityClient.fetch<any[]>(getFeaturedProductsQuery);
}

export async function getBestSellerProducts() {
  return sanityClient.fetch<any[]>(getBestSellerProductsQuery);
}

export async function getProductBySlug(slug: string) {
  return sanityClient.fetch<any | null>(getProductBySlugQuery, { slug });
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return sanityClient.fetch<any[]>(getRelatedProductsQuery, {
    productId,
    categoryId,
  });
}

export async function getAllProductSlugs() {
  return sanityClient.fetch<{ slug: string }[]>(
    groq`*[_type == "product" && !(_id in path("drafts.**"))]{
      "slug": slug.current
    }`
  );
}

// ── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories() {
  return sanityClient.fetch<any[]>(getAllCategoriesQuery);
}

// ── Blog ────────────────────────────────────────────────────────────────────

export async function getBlogPosts(params?: { category?: string; page?: number }) {
  const { postsQuery, totalQuery } = getBlogPostsQuery(params);
  const [posts, total] = await Promise.all([
    sanityClient.fetch<any[]>(postsQuery),
    sanityClient.fetch<number>(totalQuery),
  ]);
  return { posts, total };
}

export async function getBlogPostBySlug(slug: string) {
  return sanityClient.fetch<any | null>(getBlogPostBySlugQuery, { slug });
}

export async function getAllBlogSlugs() {
  return sanityClient.fetch<{ slug: string }[]>(
    groq`*[_type == "blogPost" && !(_id in path("drafts.**"))]{
      "slug": slug.current
    }`
  );
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export async function getFaqItems() {
  return sanityClient.fetch<any[]>(getFaqItemsQuery);
}

// ── Site Settings ───────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return sanityClient.fetch<any | null>(getSiteSettingsQuery);
}
