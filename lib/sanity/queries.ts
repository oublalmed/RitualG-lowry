import { groq } from "next-sanity";

export const productFields = groq`
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  category->{name, "slug": slug.current},
  images[]{
    asset->{_id, url},
    alt
  },
  price,
  compareAtPrice,
  description,
  richDescription,
  ingredients,
  howToUse,
  "tags": tags[]->name,
  variants[]{
    _key,
    name,
    size,
    price,
    sku,
    stockQuantity
  },
  featured,
  bestseller
`;

export const allProductsQuery = groq`
  *[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    ${productFields}
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...8] {
    ${productFields}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${productFields}
  }
`;

export const categoriesQuery = groq`
  *[_type == "category" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image{asset->{_id, url}, alt}
  }
`;

export const blogPostFields = groq`
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  excerpt,
  coverImage{asset->{_id, url}, alt},
  author->{name, image{asset->{_id, url}}, bio},
  publishedAt,
  "categories": categories[]->title,
  body
`;

export const allBlogPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    ${blogPostFields}
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${blogPostFields}
  }
`;
