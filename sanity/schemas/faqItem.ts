import { defineType, defineField, defineArrayMember } from "sanity";

export const faqItemSchema = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Réponse",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Livraison", value: "livraison" },
          { title: "Produits", value: "produits" },
          { title: "Retours", value: "retours" },
          { title: "Paiement", value: "paiement" },
          { title: "Compte", value: "compte" },
          { title: "Général", value: "general" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isPublished",
      title: "Publié",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category",
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title ?? "Sans question",
        subtitle: subtitle ?? "Non catégorisé",
      };
    },
  },
});
