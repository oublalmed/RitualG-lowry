import { defineType, defineField, defineArrayMember } from "sanity";

export const blogPostSchema = defineType({
  name: "blogPost",
  title: "Article de blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extrait",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featuredImage",
      title: "Image principale",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Texte alternatif" }),
      ],
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "object",
      fields: [
        defineField({ name: "name", type: "string", title: "Nom" }),
        defineField({
          name: "image",
          type: "image",
          title: "Photo",
          options: { hotspot: true },
        }),
        defineField({ name: "bio", type: "text", title: "Biographie", rows: 3 }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Catégories",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
    }),
    defineField({
      name: "readTime",
      title: "Temps de lecture (minutes)",
      type: "number",
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Texte alternatif" }),
            defineField({ name: "caption", type: "string", title: "Légende" }),
          ],
        }),
        defineArrayMember({
          type: "object",
          name: "callout",
          title: "Encadré",
          fields: [
            defineField({ name: "type", type: "string", title: "Type", options: { list: ["info", "tip", "warning"] } }),
            defineField({ name: "content", type: "text", title: "Contenu" }),
          ],
          preview: {
            select: { title: "content", subtitle: "type" },
          },
        }),
      ],
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
      title: "title",
      subtitle: "publishedAt",
      media: "featuredImage",
    },
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: unknown }) {
      return {
        title: title ?? "Sans titre",
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString("fr-MA") : "Non publié",
        media,
      };
    },
  },
});
