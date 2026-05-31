import { productSchema } from "./product";
import { categorySchema } from "./category";
import { promotionSchema } from "./promotion";
import { blogPostSchema } from "./blogPost";
import { faqItemSchema } from "./faqItem";
import { siteSettingsSchema } from "./siteSettings";

export const schemaTypes = [
  productSchema,
  categorySchema,
  promotionSchema,
  blogPostSchema,
  faqItemSchema,
  siteSettingsSchema,
];
