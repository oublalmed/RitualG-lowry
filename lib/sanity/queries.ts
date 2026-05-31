import { groq } from "next-sanity";

// ─────────────────────────────────────────────────────────────────────────────
// Fragment helpers
// ─────────────────────────────────────────────────────────────────────────────

const imageFields = groq`
  asset->{_id, url, metadata{dimensions, lqip}},
  hotspot,
  crop,
  alt
`;

const seoFields = groq`
  seoTitle,
  seoDescription,
  ogImage{${imageFields}}
`;

const variantFields = groq`
  _key,
  label,
  color{
    name,
    hexCode,
    photo{${imageFields}}
  },
  length,
  price,
  sku,
  stock,
  isAvailable
`;

export const productCardFields = groq`
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  shortDescription,
  basePrice,
  comparePrice,
  stockStatus,
  isNew,
  isBestSeller,
  isFeatured,
  productType,
  texture,
  "category": category->{_id, name, "slug": slug.current},
  images[0]{${imageFields}},
  "variantCount": count(variants)
`;

export const productFullFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  shortDescription,
  description,
  composition,
  careInstructions,
  basePrice,
  comparePrice,
  stockStatus,
  isNew,
  isBestSeller,
  isFeatured,
  productType,
  texture,
  tags,
  "category": category->{_id, name, "slug": slug.current, description},
  images[]{${imageFields}},
  variants[]{${variantFields}},
  seo{${seoFields}}
`;

const blogCardFields = groq`
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  excerpt,
  featuredImage{${imageFields}},
  author{name, image{${imageFields}}, bio},
  publishedAt,
  readTime,
  categories,
  tags
`;

const blogFullFields = groq`
  ${blogCardFields},
  body,
  seo{${seoFields}}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Product queries
// ─────────────────────────────────────────────────────────────────────────────

export interface GetAllProductsParams {
  categorySlug?: string;
  productType?: string;
  texture?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

/**
 * Paginated product list with optional filters.
 * Returns { products, total } — call with params object.
 */
export function getAllProductsQuery(params: GetAllProductsParams = {}) {
  const {
    categorySlug,
    productType,
    texture,
    minPrice,
    maxPrice,
    page = 1,
    perPage = 12,
  } = params;

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const filters: string[] = [
    `_type == "product"`,
    `!(_id in path("drafts.**"))`,
  ];

  if (categorySlug) {
    filters.push(`category->slug.current == "${categorySlug}"`);
  }
  if (productType) {
    filters.push(`"${productType}" in productType`);
  }
  if (texture) {
    filters.push(`"${texture}" in texture`);
  }
  if (minPrice !== undefined) {
    filters.push(`basePrice >= ${minPrice}`);
  }
  if (maxPrice !== undefined) {
    filters.push(`basePrice <= ${maxPrice}`);
  }

  const filter = filters.join(" && ");

  const productsQuery = groq`
    *[${filter}] | order(_createdAt desc) [${start}...${end}] {
      ${productCardFields}
    }
  `;

  const totalQuery = groq`
    count(*[${filter}])
  `;

  return { productsQuery, totalQuery };
}

/** Full product document by slug */
export const getProductBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${productFullFields}
  }
`;

/** Products in a category (for ISR pages) */
export const getProductsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug && !(_id in path("drafts.**"))]
  | order(_createdAt desc) {
    ${productCardFields}
  }
`;

/** Featured products (isFeatured === true) */
export const getFeaturedProductsQuery = groq`
  *[_type == "product" && isFeatured == true && !(_id in path("drafts.**"))]
  | order(_createdAt desc) [0...8] {
    ${productCardFields}
  }
`;

/** Best-seller products (isBestSeller === true) */
export const getBestSellerProductsQuery = groq`
  *[_type == "product" && isBestSeller == true && !(_id in path("drafts.**"))]
  | order(_createdAt desc) [0...8] {
    ${productCardFields}
  }
`;

/** New products (isNew === true) */
export const getNewProductsQuery = groq`
  *[_type == "product" && isNew == true && !(_id in path("drafts.**"))]
  | order(_createdAt desc) [0...8] {
    ${productCardFields}
  }
`;

/** Full-text product search */
export const searchProductsQuery = groq`
  *[_type == "product" && !(_id in path("drafts.**")) && [
    name,
    shortDescription,
    pt::text(description),
    tags[]
  ] match $query]
  | order(score(
    boost(name match $query, 3),
    isFeatured == true,
    isBestSeller == true
  ) desc) [0...20] {
    ${productCardFields}
  }
`;

/** Related products — same category, exclude current */
export const getRelatedProductsQuery = groq`
  *[
    _type == "product" &&
    !(_id in path("drafts.**")) &&
    _id != $productId &&
    category._ref == $categoryId
  ] | order(isBestSeller desc, _createdAt desc) [0...4] {
    ${productCardFields}
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Category queries
// ─────────────────────────────────────────────────────────────────────────────

/** All categories ordered by display order */
export const getAllCategoriesQuery = groq`
  *[_type == "category" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image{${imageFields}},
    order,
    "parent": parent->{_id, name, "slug": slug.current},
    seo{${seoFields}},
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Blog queries
// ─────────────────────────────────────────────────────────────────────────────

export interface GetBlogPostsParams {
  category?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}

/**
 * Paginated blog posts with optional category / tag filter.
 * Returns { postsQuery, totalQuery }.
 */
export function getBlogPostsQuery(params: GetBlogPostsParams = {}) {
  const { category, tag, page = 1, perPage = 9 } = params;

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const filters: string[] = [
    `_type == "blogPost"`,
    `!(_id in path("drafts.**"))`,
    `defined(publishedAt)`,
  ];

  if (category) {
    filters.push(`"${category}" in categories`);
  }
  if (tag) {
    filters.push(`"${tag}" in tags`);
  }

  const filter = filters.join(" && ");

  const postsQuery = groq`
    *[${filter}] | order(publishedAt desc) [${start}...${end}] {
      ${blogCardFields}
    }
  `;

  const totalQuery = groq`
    count(*[${filter}])
  `;

  return { postsQuery, totalQuery };
}

/** Single blog post by slug */
export const getBlogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    ${blogFullFields}
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// FAQ queries
// ─────────────────────────────────────────────────────────────────────────────

/** All published FAQ items ordered by display order */
export const getFaqItemsQuery = groq`
  *[_type == "faqItem" && isPublished == true && !(_id in path("drafts.**"))]
  | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Site settings query (singleton)
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch the single siteSettings document */
export const getSiteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    logo{${imageFields}},
    favicon{asset->{_id, url}},
    social{instagram, facebook, tiktok},
    contact{email, phone, address},
    shippingConfig{
      freeShippingThreshold,
      standardPrice,
      expressPrice,
      premiumPrice
    },
    loyaltyConfig{
      pointsPerMad,
      bronzeMin,
      silverMin,
      goldMin,
      platinumMin
    },
    maintenanceMode
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Legacy exports (kept for backwards-compat with existing pages)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use getProductBySlugQuery */
export const productBySlugQuery = getProductBySlugQuery;

/** @deprecated Use getAllCategoriesQuery */
export const categoriesQuery = getAllCategoriesQuery;

/** @deprecated Use getFeaturedProductsQuery */
export const featuredProductsQuery = getFeaturedProductsQuery;

/** @deprecated Use getBlogPostBySlugQuery */
export const blogPostBySlugQuery = getBlogPostBySlugQuery;
