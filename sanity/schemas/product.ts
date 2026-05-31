import { defineType, defineField, defineArrayMember } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Produit",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom du produit",
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
      name: "shortDescription",
      title: "Description courte",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Description complète",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Texte alternatif" }),
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productType",
      title: "Type de produit",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Extensions", value: "extensions" },
          { title: "Perruque", value: "perruque" },
          { title: "Accessoire", value: "accessoire" },
        ],
      },
    }),
    defineField({
      name: "texture",
      title: "Texture",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Lisse", value: "lisse" },
          { title: "Bouclée", value: "bouclée" },
          { title: "Afro", value: "afro" },
          { title: "Ondulée", value: "ondulée" },
        ],
      },
    }),
    defineField({
      name: "variants",
      title: "Variantes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          title: "Variante",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "color",
              title: "Couleur",
              type: "object",
              fields: [
                defineField({ name: "name", type: "string", title: "Nom de la couleur" }),
                defineField({ name: "hexCode", type: "string", title: "Code hex (ex: #1A1A2E)" }),
                defineField({
                  name: "photo",
                  type: "image",
                  title: "Photo couleur",
                  options: { hotspot: true },
                }),
              ],
            }),
            defineField({
              name: "length",
              title: "Longueur (cm)",
              type: "number",
            }),
            defineField({
              name: "price",
              title: "Prix (MAD)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
            }),
            defineField({
              name: "stock",
              title: "Stock",
              type: "number",
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: "isAvailable",
              title: "Disponible",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "sku",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "basePrice",
      title: "Prix de base (MAD)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "comparePrice",
      title: "Prix barré (MAD)",
      type: "number",
    }),
    defineField({
      name: "isNew",
      title: "Nouveau produit",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isBestSeller",
      title: "Best-seller",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isFeatured",
      title: "Mis en avant",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "stockStatus",
      title: "Statut du stock",
      type: "string",
      options: {
        list: [
          { title: "En stock", value: "in_stock" },
          { title: "Stock faible", value: "low_stock" },
          { title: "Rupture de stock", value: "out_of_stock" },
        ],
        layout: "radio",
      },
      initialValue: "in_stock",
    }),
    defineField({
      name: "careInstructions",
      title: "Instructions d'entretien",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "composition",
      title: "Composition",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "seoTitle", type: "string", title: "Titre SEO" }),
        defineField({ name: "seoDescription", type: "text", title: "Description SEO", rows: 3 }),
        defineField({
          name: "ogImage",
          type: "image",
          title: "Image Open Graph",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "images.0",
    },
  },
});
