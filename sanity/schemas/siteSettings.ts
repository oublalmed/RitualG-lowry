import { defineType, defineField } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  // Singleton — only one document of this type
  // Use structure builder to hide "Create" button in Sanity Studio
  fields: [
    defineField({
      name: "siteName",
      title: "Nom du site",
      type: "string",
      initialValue: "Ritual Glowry",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Description du site",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),
    defineField({
      name: "social",
      title: "Réseaux sociaux",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url", title: "Instagram" }),
        defineField({ name: "facebook", type: "url", title: "Facebook" }),
        defineField({ name: "tiktok", type: "url", title: "TikTok" }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Informations de contact",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string", title: "Email" }),
        defineField({ name: "phone", type: "string", title: "Téléphone" }),
        defineField({ name: "address", type: "text", title: "Adresse", rows: 3 }),
      ],
    }),
    defineField({
      name: "shippingConfig",
      title: "Configuration de la livraison",
      type: "object",
      fields: [
        defineField({
          name: "freeShippingThreshold",
          type: "number",
          title: "Seuil livraison gratuite (MAD)",
          initialValue: 500,
        }),
        defineField({
          name: "standardPrice",
          type: "number",
          title: "Prix livraison standard (MAD)",
          initialValue: 30,
        }),
        defineField({
          name: "expressPrice",
          type: "number",
          title: "Prix livraison express (MAD)",
          initialValue: 60,
        }),
        defineField({
          name: "premiumPrice",
          type: "number",
          title: "Prix livraison premium (MAD)",
          initialValue: 100,
        }),
      ],
    }),
    defineField({
      name: "loyaltyConfig",
      title: "Configuration du programme fidélité",
      type: "object",
      fields: [
        defineField({
          name: "pointsPerMad",
          type: "number",
          title: "Points par MAD dépensé",
          initialValue: 1,
        }),
        defineField({
          name: "bronzeMin",
          type: "number",
          title: "Points minimum Bronze",
          initialValue: 0,
        }),
        defineField({
          name: "silverMin",
          type: "number",
          title: "Points minimum Silver",
          initialValue: 500,
        }),
        defineField({
          name: "goldMin",
          type: "number",
          title: "Points minimum Gold",
          initialValue: 1500,
        }),
        defineField({
          name: "platinumMin",
          type: "number",
          title: "Points minimum Platinum",
          initialValue: 5000,
        }),
      ],
    }),
    defineField({
      name: "maintenanceMode",
      title: "Mode maintenance",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      media: "logo",
    },
  },
});
