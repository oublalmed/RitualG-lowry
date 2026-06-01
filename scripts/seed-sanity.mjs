/**
 * Seed script for Sanity CMS — populates categories, products, blog posts,
 * FAQ items, and site settings.
 *
 * Usage:  node scripts/seed-sanity.mjs
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ─────────────────────────────────────────────────────────
const envPath = resolve(__dirname, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("Could not read .env.local — make sure it exists");
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN in .env.local.\n" +
      "Go to https://www.sanity.io/manage → project → API → Tokens → Add token (Editor role)\n" +
      "Then add SANITY_API_TOKEN=sk... to your .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Helper: create or skip if exists ────────────────────────────────────────
async function createIfNotExists(doc) {
  try {
    await client.createIfNotExists(doc);
    console.log(`  + ${doc._type}: ${doc._id}`);
  } catch (err) {
    console.error(`  ! Failed ${doc._type} ${doc._id}: ${err.message}`);
  }
}

// ── 1. Categories ───────────────────────────────────────────────────────────
const categories = [
  {
    _id: "cat-extensions",
    _type: "category",
    name: "Extensions",
    slug: { _type: "slug", current: "extensions" },
    description:
      "Extensions 100% cheveux naturels Remy — clip-in, tape-in et cousues. Toutes textures disponibles.",
    order: 1,
  },
  {
    _id: "cat-perruques",
    _type: "category",
    name: "Perruques",
    slug: { _type: "slug", current: "perruques" },
    description:
      "Perruques lace front et full lace ultra-realistes en cheveux naturels.",
    order: 2,
  },
  {
    _id: "cat-accessoires",
    _type: "category",
    name: "Accessoires",
    slug: { _type: "slug", current: "accessoires" },
    description:
      "Accessoires capillaires : bonnets en satin, peignes, huiles et produits d'entretien.",
    order: 3,
  },
  {
    _id: "cat-soins",
    _type: "category",
    name: "Soins Capillaires",
    slug: { _type: "slug", current: "soins" },
    description:
      "Shampoings, masques et serums specialement formules pour extensions et cheveux naturels.",
    order: 4,
  },
];

// ── 2. Products ─────────────────────────────────────────────────────────────
const products = [
  {
    _id: "prod-1",
    _type: "product",
    name: "Extension Lisse Naturelle",
    slug: { _type: "slug", current: "extension-lisse-naturelle" },
    shortDescription:
      "Extensions 100% Remy, texture lisse parfaite pour un look sleek et sophistique.",
    basePrice: 890,
    comparePrice: 1100,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stockStatus: "in_stock",
    productType: ["extensions"],
    texture: ["lisse"],
    tags: ["lisse", "remy", "clip-in", "best-seller"],
    category: { _type: "reference", _ref: "cat-extensions" },
    variants: [
      {
        _key: "v1a",
        label: "40cm - Noir Naturel",
        color: { name: "Noir Naturel", hexCode: "#1A1410" },
        length: 40,
        price: 890,
        sku: "EXT-LISSE-40-NOIR",
        stock: 15,
        isAvailable: true,
      },
      {
        _key: "v1b",
        label: "50cm - Noir Naturel",
        color: { name: "Noir Naturel", hexCode: "#1A1410" },
        length: 50,
        price: 990,
        sku: "EXT-LISSE-50-NOIR",
        stock: 8,
        isAvailable: true,
      },
      {
        _key: "v1c",
        label: "60cm - Chatain",
        color: { name: "Chatain", hexCode: "#6B3A2A" },
        length: 60,
        price: 1090,
        sku: "EXT-LISSE-60-CHAT",
        stock: 3,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-2",
    _type: "product",
    name: "Extension Bouclee Sublime",
    slug: { _type: "slug", current: "extension-bouclee-sublime" },
    shortDescription:
      "Boucles naturelles rebondies et volumineuses — texture luxueuse qui dure.",
    basePrice: 950,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    stockStatus: "in_stock",
    productType: ["extensions"],
    texture: ["bouclée"],
    tags: ["bouclee", "volume", "remy", "nouveau"],
    category: { _type: "reference", _ref: "cat-extensions" },
    variants: [
      {
        _key: "v2a",
        label: "40cm - Noir",
        color: { name: "Noir", hexCode: "#1A1410" },
        length: 40,
        price: 950,
        sku: "EXT-BOUCL-40-NOIR",
        stock: 20,
        isAvailable: true,
      },
      {
        _key: "v2b",
        label: "50cm - Brun",
        color: { name: "Brun", hexCode: "#3D2B1F" },
        length: 50,
        price: 1050,
        sku: "EXT-BOUCL-50-BRUN",
        stock: 5,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-3",
    _type: "product",
    name: "Perruque Lace Front Premium",
    slug: { _type: "slug", current: "perruque-lace-front" },
    shortDescription:
      "Perruque lace front ultra-realiste, ligne frontale invisible et naturelle.",
    basePrice: 1450,
    comparePrice: 1800,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stockStatus: "in_stock",
    productType: ["perruque"],
    texture: ["lisse"],
    tags: ["lace-front", "premium", "best-seller"],
    category: { _type: "reference", _ref: "cat-perruques" },
    variants: [
      {
        _key: "v3a",
        label: "35cm - Noir",
        color: { name: "Noir", hexCode: "#1A1410" },
        length: 35,
        price: 1450,
        sku: "PERR-LACE-35-NOIR",
        stock: 10,
        isAvailable: true,
      },
      {
        _key: "v3b",
        label: "45cm - Chatain fonce",
        color: { name: "Chatain Fonce", hexCode: "#3D2B1F" },
        length: 45,
        price: 1650,
        sku: "PERR-LACE-45-CHAT",
        stock: 4,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-4",
    _type: "product",
    name: "Extension Afro Naturelle",
    slug: { _type: "slug", current: "extension-afro-naturelle" },
    shortDescription:
      "Texture afro authentique, volume spectaculaire et tenue longue duree.",
    basePrice: 780,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    stockStatus: "low_stock",
    productType: ["extensions"],
    texture: ["afro"],
    tags: ["afro", "volume", "naturel", "nouveau"],
    category: { _type: "reference", _ref: "cat-extensions" },
    variants: [
      {
        _key: "v4a",
        label: "30cm - Noir",
        color: { name: "Noir", hexCode: "#1A1410" },
        length: 30,
        price: 780,
        sku: "EXT-AFRO-30-NOIR",
        stock: 3,
        isAvailable: true,
      },
      {
        _key: "v4b",
        label: "40cm - Noir",
        color: { name: "Noir", hexCode: "#1A1410" },
        length: 40,
        price: 880,
        sku: "EXT-AFRO-40-NOIR",
        stock: 2,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-5",
    _type: "product",
    name: "Bonnet en Satin Premium",
    slug: { _type: "slug", current: "bonnet-satin-premium" },
    shortDescription:
      "Bonnet en satin double couche pour proteger vos cheveux et extensions la nuit.",
    basePrice: 120,
    comparePrice: 150,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    stockStatus: "in_stock",
    productType: ["accessoire"],
    texture: [],
    tags: ["satin", "protection", "nuit", "accessoire"],
    category: { _type: "reference", _ref: "cat-accessoires" },
    variants: [
      {
        _key: "v5a",
        label: "Taille unique - Noir",
        color: { name: "Noir", hexCode: "#1A1410" },
        length: 0,
        price: 120,
        sku: "ACC-BONNET-NOIR",
        stock: 50,
        isAvailable: true,
      },
      {
        _key: "v5b",
        label: "Taille unique - Rose",
        color: { name: "Rose", hexCode: "#C9A8A0" },
        length: 0,
        price: 120,
        sku: "ACC-BONNET-ROSE",
        stock: 30,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-6",
    _type: "product",
    name: "Extension Ondulee Luxe",
    slug: { _type: "slug", current: "extension-ondulee-luxe" },
    shortDescription:
      "Ondulations naturelles et elegantes, parfaites pour un look glamour au quotidien.",
    basePrice: 920,
    comparePrice: null,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    stockStatus: "in_stock",
    productType: ["extensions"],
    texture: ["ondulée"],
    tags: ["ondulee", "glamour", "luxe"],
    category: { _type: "reference", _ref: "cat-extensions" },
    variants: [
      {
        _key: "v6a",
        label: "45cm - Noir",
        color: { name: "Noir", hexCode: "#1A1410" },
        length: 45,
        price: 920,
        sku: "EXT-ONDUL-45-NOIR",
        stock: 12,
        isAvailable: true,
      },
      {
        _key: "v6b",
        label: "55cm - Brun Dore",
        color: { name: "Brun Dore", hexCode: "#8B6914" },
        length: 55,
        price: 1020,
        sku: "EXT-ONDUL-55-DORE",
        stock: 7,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-7",
    _type: "product",
    name: "Huile Nourrissante Extensions",
    slug: { _type: "slug", current: "huile-nourrissante-extensions" },
    shortDescription:
      "Huile legere a base d'argan et de jojoba pour nourrir et faire briller vos extensions.",
    basePrice: 180,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    stockStatus: "in_stock",
    productType: ["accessoire"],
    texture: [],
    tags: ["huile", "soin", "argan", "entretien"],
    category: { _type: "reference", _ref: "cat-soins" },
    variants: [
      {
        _key: "v7a",
        label: "50ml",
        color: { name: "Standard", hexCode: "#C9A875" },
        length: 0,
        price: 180,
        sku: "SOIN-HUILE-50",
        stock: 25,
        isAvailable: true,
      },
      {
        _key: "v7b",
        label: "100ml",
        color: { name: "Standard", hexCode: "#C9A875" },
        length: 0,
        price: 290,
        sku: "SOIN-HUILE-100",
        stock: 15,
        isAvailable: true,
      },
    ],
  },
  {
    _id: "prod-8",
    _type: "product",
    name: "Perruque Full Lace Body Wave",
    slug: { _type: "slug", current: "perruque-full-lace-body-wave" },
    shortDescription:
      "Perruque full lace body wave — polyvalente, naturelle et ultra-confortable.",
    basePrice: 1890,
    comparePrice: 2200,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stockStatus: "in_stock",
    productType: ["perruque"],
    texture: ["ondulée"],
    tags: ["full-lace", "body-wave", "premium", "best-seller"],
    category: { _type: "reference", _ref: "cat-perruques" },
    variants: [
      {
        _key: "v8a",
        label: "40cm - Noir Naturel",
        color: { name: "Noir Naturel", hexCode: "#1A1410" },
        length: 40,
        price: 1890,
        sku: "PERR-FULL-40-NOIR",
        stock: 6,
        isAvailable: true,
      },
      {
        _key: "v8b",
        label: "50cm - Brun",
        color: { name: "Brun", hexCode: "#3D2B1F" },
        length: 50,
        price: 2090,
        sku: "PERR-FULL-50-BRUN",
        stock: 3,
        isAvailable: true,
      },
    ],
  },
];

// ── 3. Blog Posts ────────────────────────────────────────────────────────────
const blogPosts = [
  {
    _id: "blog-1",
    _type: "blogPost",
    title: "Comment choisir ses extensions selon sa texture de cheveux",
    slug: { _type: "slug", current: "choisir-extensions-texture-cheveux" },
    excerpt:
      "Guide complet pour trouver les extensions parfaites selon votre texture naturelle — lisses, boucles ou afro.",
    author: { name: "Imane", bio: "Fondatrice de Ritual Glowry et experte capillaire." },
    categories: ["guide"],
    publishedAt: "2025-11-15T10:00:00Z",
    readTime: 7,
    tags: ["extensions", "guide", "texture"],
    body: [
      {
        _type: "block",
        _key: "b1a",
        style: "h2",
        children: [{ _type: "span", _key: "s1", text: "Pourquoi la texture compte" }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b1b",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s2",
            text: "Choisir des extensions qui correspondent a votre texture naturelle est essentiel pour un rendu invisible et naturel. Une mauvaise correspondance sera visible et difficile a coiffer.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b1c",
        style: "h2",
        children: [{ _type: "span", _key: "s3", text: "Pour les cheveux lisses" }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b1d",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s4",
            text: "Optez pour nos extensions lisses Remy. Elles se fondent parfaitement avec vos cheveux naturels et peuvent etre coiffees au fer plat ou au boucleur.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b1e",
        style: "h2",
        children: [{ _type: "span", _key: "s5", text: "Pour les cheveux boucles" }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b1f",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s6",
            text: "Nos extensions bouclees sont pre-texturees pour correspondre aux boucles naturelles de type 3A a 3C. Le resultat est un volume spectaculaire et un look 100% naturel.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: "blog-2",
    _type: "blogPost",
    title: "5 erreurs a eviter avec ses extensions capillaires",
    slug: { _type: "slug", current: "5-erreurs-extensions-capillaires" },
    excerpt:
      "Decouvrez les erreurs les plus courantes qui abiment vos extensions et comment les eviter pour prolonger leur duree de vie.",
    author: { name: "Imane", bio: "Fondatrice de Ritual Glowry et experte capillaire." },
    categories: ["conseils"],
    publishedAt: "2025-12-03T10:00:00Z",
    readTime: 5,
    tags: ["extensions", "entretien", "conseils"],
    body: [
      {
        _type: "block",
        _key: "b2a",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s7",
            text: "Les extensions de qualite peuvent durer des mois, voire des annees, si elles sont correctement entretenues. Voici les 5 erreurs les plus frequentes a eviter absolument.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b2b",
        style: "h2",
        children: [{ _type: "span", _key: "s8", text: "1. Dormir sans protection" }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b2c",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s9",
            text: "Toujours porter un bonnet en satin la nuit. Le coton des oreillers cree des frictions qui emmelent et dessechent les extensions.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b2d",
        style: "h2",
        children: [{ _type: "span", _key: "s10", text: "2. Utiliser des produits avec sulfates" }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b2e",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s11",
            text: "Les sulfates dessechent les cheveux naturels et les extensions. Utilisez toujours des shampoings sans sulfate pour preserver l'hydratation et la brillance.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: "blog-3",
    _type: "blogPost",
    title: "Tendances coiffure 2026 : les looks a adopter",
    slug: { _type: "slug", current: "tendances-coiffure-2026" },
    excerpt:
      "Les tendances capillaires qui vont marquer 2026 — du sleek bun aux boucles XXL, decouvrez les looks incontournables.",
    author: { name: "Imane", bio: "Fondatrice de Ritual Glowry et experte capillaire." },
    categories: ["tendances"],
    publishedAt: "2026-01-10T10:00:00Z",
    readTime: 6,
    tags: ["tendances", "2026", "coiffure"],
    body: [
      {
        _type: "block",
        _key: "b3a",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s12",
            text: "L'annee 2026 s'annonce riche en tendances capillaires. Que vous soyez team lisse ou team boucles, il y en a pour tous les gouts.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b3b",
        style: "h2",
        children: [{ _type: "span", _key: "s13", text: "Le retour du Sleek Look" }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b3c",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s14",
            text: "Le sleek bun et les cheveux lisses ultra-brillants reviennent en force. Nos extensions lisses sont parfaites pour recreer ce look sans effort.",
          },
        ],
        markDefs: [],
      },
    ],
  },
];

// ── 4. FAQ Items ────────────────────────────────────────────────────────────
const faqItems = [
  {
    _id: "faq-1",
    _type: "faqItem",
    question: "Quels types d'extensions proposez-vous ?",
    answer: [
      {
        _type: "block",
        _key: "f1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs1",
            text: "Nous proposons des extensions clip-in, tape-in et a coudre, en cheveux 100% naturels Remy. Disponibles en textures lisse, bouclee, ondulee et afro, de 30cm a 70cm.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "produits",
    order: 1,
    isPublished: true,
  },
  {
    _id: "faq-2",
    _type: "faqItem",
    question: "Combien de temps durent les extensions ?",
    answer: [
      {
        _type: "block",
        _key: "f2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs2",
            text: "Avec un entretien adapte (shampoing sans sulfate, bonnet en satin la nuit, demeler regulierement), nos extensions Remy durent en moyenne 6 a 12 mois.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "produits",
    order: 2,
    isPublished: true,
  },
  {
    _id: "faq-3",
    _type: "faqItem",
    question: "Quels sont les delais de livraison ?",
    answer: [
      {
        _type: "block",
        _key: "f3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs3",
            text: "Livraison standard : 3-5 jours ouvrables partout au Maroc. Livraison express : 24-48h dans les grandes villes (Casablanca, Rabat, Marrakech, Tanger). La livraison est offerte des 1 200 MAD d'achat.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "livraison",
    order: 3,
    isPublished: true,
  },
  {
    _id: "faq-4",
    _type: "faqItem",
    question: "Comment effectuer un retour ou un echange ?",
    answer: [
      {
        _type: "block",
        _key: "f4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs4",
            text: "Vous disposez de 30 jours apres reception pour retourner un produit non utilise dans son emballage d'origine. Contactez-nous via le formulaire de contact ou par email a support@ritualglowry.ma pour initier votre retour.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "retours",
    order: 4,
    isPublished: true,
  },
  {
    _id: "faq-5",
    _type: "faqItem",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: [
      {
        _type: "block",
        _key: "f5",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs5",
            text: "Nous acceptons les cartes bancaires (Visa, Mastercard), le paiement a la livraison dans certaines villes, et les virements bancaires. Tous les paiements en ligne sont securises via Stripe.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "paiement",
    order: 5,
    isPublished: true,
  },
  {
    _id: "faq-6",
    _type: "faqItem",
    question: "Comment entretenir mes extensions ?",
    answer: [
      {
        _type: "block",
        _key: "f6",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs6",
            text: "Utilisez un shampoing sans sulfate, appliquez un soin hydratant une fois par semaine, demeler delicatement avec un peigne a dents larges, et portez un bonnet en satin la nuit. Evitez la chaleur excessive.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "produits",
    order: 6,
    isPublished: true,
  },
  {
    _id: "faq-7",
    _type: "faqItem",
    question: "Puis-je colorer ou lisser mes extensions ?",
    answer: [
      {
        _type: "block",
        _key: "f7",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs7",
            text: "Oui ! Nos extensions en cheveux naturels Remy peuvent etre colorees, lissees et bouclees comme vos propres cheveux. Nous recommandons de confier la coloration a un professionnel.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "produits",
    order: 7,
    isPublished: true,
  },
  {
    _id: "faq-8",
    _type: "faqItem",
    question: "Comment creer un compte client ?",
    answer: [
      {
        _type: "block",
        _key: "f8",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "fs8",
            text: "Cliquez sur l'icone compte en haut du site, puis sur 'Creer un compte'. Remplissez vos informations et vous pourrez suivre vos commandes, gerer vos adresses et accumuler des points fidelite.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "compte",
    order: 8,
    isPublished: true,
  },
];

// ── 5. Site Settings (singleton) ────────────────────────────────────────────
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Ritual Glowry",
  siteDescription:
    "Extensions et perruques premium 100% naturelles au Maroc. Qualite Remy pour toutes les textures.",
  social: {
    instagram: "https://instagram.com/ritualglowry",
    facebook: "https://facebook.com/ritualglowry",
    tiktok: "https://tiktok.com/@ritualglowry",
  },
  contact: {
    email: "hello@ritualglowry.ma",
    phone: "+212 6 00 00 00 00",
    address: "Casablanca, Maroc",
  },
  shippingConfig: {
    freeShippingThreshold: 1200,
    standardPrice: 35,
    expressPrice: 65,
    premiumPrice: 100,
  },
  loyaltyConfig: {
    pointsPerMad: 1,
    bronzeMin: 0,
    silverMin: 500,
    goldMin: 1500,
    platinumMin: 5000,
  },
  maintenanceMode: false,
};

// ── 6. Promotion ────────────────────────────────────────────────────────────
const promotions = [
  {
    _id: "promo-welcome",
    _type: "promotion",
    title: "Bienvenue chez Ritual Glowry",
    code: "WELCOME15",
    type: "PERCENTAGE",
    value: 15,
    minOrderAmount: 500,
    startsAt: "2025-01-01T00:00:00Z",
    endsAt: "2026-12-31T23:59:59Z",
    isActive: true,
    description:
      "15% de reduction sur votre premiere commande des 500 MAD d'achat.",
  },
  {
    _id: "promo-summer",
    _type: "promotion",
    title: "Soldes d'ete 2026",
    code: "ETE2026",
    type: "PERCENTAGE",
    value: 20,
    minOrderAmount: 800,
    startsAt: "2026-06-01T00:00:00Z",
    endsAt: "2026-08-31T23:59:59Z",
    isActive: true,
    description:
      "20% de reduction sur toute la boutique pendant les soldes d'ete.",
  },
];

// ── Run seed ────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\nSeeding Sanity project: ${projectId} / dataset: ${dataset}\n`);

  console.log("Categories:");
  for (const cat of categories) await createIfNotExists(cat);

  console.log("\nProducts:");
  for (const prod of products) await createIfNotExists(prod);

  console.log("\nBlog Posts:");
  for (const post of blogPosts) await createIfNotExists(post);

  console.log("\nFAQ Items:");
  for (const faq of faqItems) await createIfNotExists(faq);

  console.log("\nSite Settings:");
  await createIfNotExists(siteSettings);

  console.log("\nPromotions:");
  for (const promo of promotions) await createIfNotExists(promo);

  console.log("\nDone! Your Sanity Studio should now show all content.");
  console.log("Visit http://localhost:3000/studio to manage your content.\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
