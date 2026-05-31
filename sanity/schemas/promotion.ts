import { defineType, defineField } from "sanity";

export const promotionSchema = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code promo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type de réduction",
      type: "string",
      options: {
        list: [
          { title: "Pourcentage (%)", value: "PERCENTAGE" },
          { title: "Montant fixe (MAD)", value: "FIXED" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Valeur de la réduction",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "minOrderAmount",
      title: "Montant minimum de commande (MAD)",
      type: "number",
    }),
    defineField({
      name: "startsAt",
      title: "Date de début",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "Date de fin",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "code",
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title ?? "Sans titre",
        subtitle: subtitle ? `Code: ${subtitle}` : undefined,
      };
    },
  },
});
