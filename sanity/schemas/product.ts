import { defineType, defineField, defineArrayMember } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "asset", type: "image", title: "Image" }),
            defineField({ name: "alt", type: "string", title: "Alt Text" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "richDescription",
      title: "Full Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "text",
    }),
    defineField({
      name: "howToUse",
      title: "How to Use",
      type: "text",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({ name: "size", type: "string", title: "Size (e.g. 250ml)" }),
            defineField({ name: "price", type: "number", title: "Price" }),
            defineField({ name: "sku", type: "string", title: "SKU" }),
            defineField({ name: "stockQuantity", type: "number", title: "Stock" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "bestseller",
      title: "Bestseller",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "images.0.asset",
    },
  },
});
