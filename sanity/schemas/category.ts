import { defineType, defineField } from "sanity";

export const categorySchema = defineType({
  name: "category",
  title: "Catégorie",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Texte alternatif" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "parent",
      title: "Catégorie parente",
      type: "reference",
      to: [{ type: "category" }],
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
      subtitle: "parent.name",
      media: "image",
    },
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: string }) {
      return {
        title: title ?? "Sans nom",
        subtitle: subtitle ? `Sous-catégorie de: ${subtitle}` : "Catégorie principale",
        media,
      };
    },
  },
});
