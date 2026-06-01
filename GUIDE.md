# Guide Complet — Ritual Glowry

## Table des matières
1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture technique](#2-architecture-technique)
3. [Installation locale](#3-installation-locale)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Base de données (Prisma + PostgreSQL)](#5-base-de-données-prisma--postgresql)
6. [Sanity CMS — Gestion des produits](#6-sanity-cms--gestion-des-produits)
7. [Stripe — Paiement](#7-stripe--paiement)
8. [Emails (Resend)](#8-emails-resend)
9. [Authentification (NextAuth.js)](#9-authentification-nextauthjs)
10. [Structure des pages](#10-structure-des-pages)
11. [Déploiement sur Vercel](#11-déploiement-sur-vercel)
12. [Back-office Admin](#12-back-office-admin)
13. [SEO & Performance](#13-seo--performance)
14. [RGPD & Conformité](#14-rgpd--conformité)
15. [Maintenance & Évolutions](#15-maintenance--évolutions)

---

## 1. Vue d'ensemble

**Ritual Glowry** est un site e-commerce premium pour extensions capillaires et perruques, construit sur :

```
Next.js 16 (App Router) + TypeScript strict
Tailwind CSS v4 + shadcn/ui (New York)
Sanity CMS (catalogue produits, blog, FAQ)
PostgreSQL + Prisma v7 (commandes, utilisateurs)
NextAuth.js v5 (authentification)
Stripe v22 (paiement)
Resend (emails transactionnels)
Framer Motion (animations)
Zustand (état global : panier, wishlist)
```

---

## 2. Architecture technique

```
RitualG-lowry/
│
├── app/                          ← Pages Next.js App Router
│   ├── (auth)/                   ← Pages auth (hors layout boutique)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── (shop)/                   ← Boutique (avec Header + Footer)
│   │   ├── page.tsx              ← Page d'accueil
│   │   ├── boutique/             ← Catalogue + filtres
│   │   ├── produit/[slug]/       ← Page produit (ISR 1h)
│   │   ├── checkout/             ← Tunnel achat 3 étapes
│   │   └── compte/               ← Espace cliente
│   ├── (content)/                ← Pages éditoriales
│   │   ├── a-propos/
│   │   ├── blog/
│   │   ├── faq/
│   │   ├── contact/
│   │   ├── cartes-cadeaux/
│   │   └── [mentions-legales, cgv, politique-*]/
│   ├── admin/                    ← Back-office (rôle ADMIN requis)
│   ├── api/                      ← API Routes
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── webhook/stripe/       ← CRITIQUE : webhook Stripe
│   │   ├── promo/
│   │   ├── newsletter/
│   │   ├── contact/
│   │   ├── account/
│   │   └── admin/
│   ├── studio/[[...tool]]/       ← Sanity Studio intégré
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── layout/                   ← Header, Footer
│   ├── home/                     ← Sections homepage
│   ├── product/                  ← ProductCard, Gallery, Variants...
│   ├── shop/                     ← Boutique, Filtres, Skeleton
│   ├── checkout/                 ← Wizard checkout
│   ├── cart/                     ← CartDrawer
│   ├── about/                    ← Sections À propos
│   ├── faq/                      ← FAQ avec recherche
│   ├── common/                   ← Search, Cookies, Stars, Breadcrumb
│   └── ui/                       ← shadcn/ui primitives
│
├── lib/
│   ├── prisma.ts                 ← Client Prisma singleton
│   ├── auth.ts                   ← NextAuth config
│   ├── email.ts                  ← Fonctions Resend
│   ├── analytics.ts              ← GA4 helpers
│   ├── mockData.ts               ← Données mock (produits, blog)
│   └── sanity/
│       ├── client.ts             ← Client Sanity
│       └── queries.ts            ← Toutes les requêtes GROQ
│
├── stores/
│   ├── cartStore.ts              ← Zustand panier (localStorage)
│   └── wishlistStore.ts          ← Zustand wishlist (localStorage)
│
├── sanity/schemas/               ← Schémas Sanity CMS
│   ├── product.ts
│   ├── category.ts
│   ├── blogPost.ts
│   ├── faqItem.ts
│   ├── promotion.ts
│   └── siteSettings.ts
│
├── prisma/
│   ├── schema.prisma             ← Schéma BDD complet (13 modèles)
│   └── seed.ts                   ← Données initiales
│
├── emails/                       ← Templates React Email
│   ├── OrderConfirmationEmail.tsx
│   ├── OrderShippedEmail.tsx
│   ├── OrderDeliveredEmail.tsx
│   └── WelcomeEmail.tsx
│
├── middleware.ts                 ← Protection routes /compte + /admin
├── sanity.config.ts              ← Config Studio
└── .env.example                  ← Toutes les variables requises
```

---

## 3. Installation locale

### Prérequis
- Node.js 18+
- PostgreSQL 14+ (ou compte Railway/Supabase)
- Compte Sanity.io (gratuit)
- Compte Stripe (mode test)
- Compte Resend (gratuit)

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/oublalmed/RitualG-lowry.git
cd RitualG-lowry

# 2. Installer les dépendances
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local
# → Remplir toutes les valeurs (voir section 4)

# 4. Initialiser la base de données
npx prisma migrate dev --name init
npx prisma db seed              # Crée 3 users + données de test

# 5. Lancer en développement
npm run dev
# → http://localhost:3000
# → http://localhost:3000/studio  (Sanity Studio)
# → http://localhost:3000/admin   (back-office)
```

---

## 4. Variables d'environnement

Fichier `.env.local` à créer à la racine :

### Application
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Base de données
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ritualglowry"
```

### NextAuth.js
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=               # générer: openssl rand -base64 32
GOOGLE_CLIENT_ID=              # Google Cloud Console
GOOGLE_CLIENT_SECRET=          # Google Cloud Console
```

### Sanity CMS
```env
NEXT_PUBLIC_SANITY_PROJECT_ID= # sanity.io/manage → votre project ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=              # token "Editor" depuis sanity.io/manage
```

### Stripe
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # généré lors de la config webhook
```

### Emails (Resend)
```env
RESEND_API_KEY=re_...
EMAIL_FROM=hello@ritualglowry.ma
EMAIL_REPLY_TO=support@ritualglowry.ma
EMAIL_ADMIN=admin@ritualglowry.ma
```

### Analytics (optionnel)
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 5. Base de données (Prisma + PostgreSQL)

### Modèles principaux

| Modèle | Description |
|--------|-------------|
| `User` | Clientes + admins (rôle, points fidélité, tier) |
| `Account` | OAuth providers (NextAuth) |
| `Session` | Sessions JWT |
| `Address` | Adresses de livraison/facturation |
| `Order` | Commandes (statut, stripe, livraison) |
| `OrderItem` | Lignes de commande (snapshot produit) |
| `Review` | Avis produits (modération) |
| `WishlistItem` | Liste de favoris |
| `Newsletter` | Abonnées newsletter |
| `LoyaltyTransaction` | Historique points fidélité |
| `PromoCode` | Codes promotionnels |
| `AdminLog` | Journal d'audit admin |

### Commandes utiles

```bash
# Créer une migration après modification du schéma
npx prisma migrate dev --name "description_changement"

# Appliquer en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface visuelle BDD)
npx prisma studio

# Régénérer le client après un changement de schéma
npx prisma generate

# Réinitialiser la BDD + seed
npx prisma migrate reset
```

### Comptes de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@ritualglowry.ma` | `Admin123!` |
| Cliente 1 | `yasmine@example.com` | `Client123!` |
| Cliente 2 | `aicha@example.com` | `Client123!` |

---

## 6. Sanity CMS — Gestion des produits

### Accès Studio
```
http://localhost:3000/studio    (local)
https://votre-domaine.ma/studio (production)
```

### Schémas disponibles

| Type | Usage |
|------|-------|
| `product` | Produits avec variantes (couleur × longueur × prix × stock) |
| `category` | Catégories hiérarchiques |
| `blogPost` | Articles blog |
| `faqItem` | Questions FAQ |
| `promotion` | Bannières promotionnelles |
| `siteSettings` | Configuration globale (singleton) |

### Créer un produit

1. Ouvrir `/studio` → **Products** → **+ Create**
2. Remplir : nom, slug (auto), description, images (glisser-déposer)
3. Ajouter des **variantes** : couleur + longueur + prix + SKU + stock
4. Cocher : `isFeatured`, `isBestSeller`, `isNew` selon besoin
5. Remplir l'onglet **SEO** (meta title + description)
6. **Publish** → visible sur le site en moins d'1h (ISR)

### Configuration Sanity

1. Créer un compte sur [sanity.io](https://sanity.io)
2. Créer un nouveau projet : `sanity init --create-project`
3. Copier le **Project ID** dans `.env.local`
4. Créer un token **Editor** : `sanity.io/manage` → API → Tokens

---

## 7. Stripe — Paiement

### Configuration

1. Créer un compte [Stripe](https://stripe.com)
2. Récupérer les clés depuis Dashboard → Développeurs → Clés API
3. **Mode test** : `pk_test_...` et `sk_test_...`
4. **Mode production** : `pk_live_...` et `sk_live_...`

### Configurer le Webhook (CRITIQUE)

Le webhook Stripe met à jour les commandes après paiement.

```bash
# En développement : utiliser Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook/stripe
# Copier le "webhook signing secret" affiché dans .env.local
```

En production (Vercel) :
1. Stripe Dashboard → Développeurs → Webhooks → **+ Ajouter un endpoint**
2. URL : `https://votre-domaine.ma/api/webhook/stripe`
3. Événements : `payment_intent.succeeded` + `payment_intent.payment_failed`
4. Copier le **Signing Secret** dans les variables Vercel

### Cartes de test Stripe

| Scénario | Numéro | Exp | CVC |
|----------|--------|-----|-----|
| Succès | `4242 4242 4242 4242` | 12/34 | 123 |
| Échec | `4000 0000 0000 0002` | 12/34 | 123 |
| 3D Secure | `4000 0027 6000 3184` | 12/34 | 123 |

### Codes promo disponibles (démo)

| Code | Réduction | Minimum |
|------|-----------|---------|
| `GLOWRY10` | -10% | Aucun |
| `BIENVENUE` | -15% | 500 MAD |
| `LUXE200` | -200 MAD | 1 000 MAD |

---

## 8. Emails (Resend)

### Configuration

1. Créer un compte [resend.com](https://resend.com)
2. Vérifier votre domaine (ajouter les enregistrements DNS)
3. Créer une API Key → copier dans `.env.local`

### Templates disponibles

| Fichier | Déclencheur |
|---------|-------------|
| `WelcomeEmail` | Inscription d'une nouvelle cliente |
| `OrderConfirmationEmail` | Paiement Stripe confirmé (webhook) |
| `OrderShippedEmail` | Admin marque commande "expédiée" |
| `OrderDeliveredEmail` | Admin marque commande "livrée" |

### Prévisualiser les emails

```bash
npx react-email dev
# → http://localhost:3001
```

---

## 9. Authentification (NextAuth.js)

### Méthodes disponibles
- **Email + mot de passe** (bcrypt, min 8 caractères)
- **Google OAuth**

### Configurer Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → Nouveau projet
2. APIs & Services → Credentials → **OAuth 2.0 Client IDs**
3. Authorized redirect URIs : `http://localhost:3000/api/auth/callback/google`
4. Copier Client ID + Secret dans `.env.local`

### Rôles utilisateurs

```
CUSTOMER  → accès à /compte/*
ADMIN     → accès à /compte/* et /admin/*
```

Promouvoir un utilisateur en admin :
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

---

## 10. Structure des pages

### Pages publiques

| URL | Description |
|-----|-------------|
| `/` | Page d'accueil (7 sections) |
| `/boutique` | Catalogue avec filtres URL |
| `/produit/[slug]` | Fiche produit (ISR 1h) |
| `/a-propos` | Histoire de la marque |
| `/blog` | Liste articles |
| `/blog/[slug]` | Article blog |
| `/faq` | FAQ avec recherche |
| `/contact` | Formulaire de contact |
| `/cartes-cadeaux` | Cartes cadeaux (250/500/1 000 MAD) |
| `/mentions-legales` | Mentions légales |
| `/cgv` | Conditions générales de vente |
| `/politique-confidentialite` | Politique RGPD |
| `/politique-cookies` | Gestion des cookies |

### Pages cliente (authentification requise)

| URL | Description |
|-----|-------------|
| `/compte` | Dashboard (stats, commandes récentes) |
| `/compte/commandes` | Historique + téléchargement factures |
| `/compte/commandes/[id]` | Détail + timeline de statut |
| `/compte/adresses` | Carnet d'adresses (max 5) |
| `/compte/favoris` | Wishlist |
| `/compte/points` | Fidélité + parrainage 20 MAD |
| `/compte/informations` | Profil + MDP + suppression RGPD |
| `/compte/newsletter` | Préférences emails |

### Pages admin (rôle ADMIN requis)

| URL | Description |
|-----|-------------|
| `/admin` | Dashboard KPI + graphiques Recharts |
| `/admin/commandes` | Gestion et filtrage commandes |
| `/admin/commandes/[id]` | Détail + changement statut + notes |
| `/admin/produits` | Aperçu lecture seule + lien Sanity |
| `/admin/clientes` | Gestion clientes par tier/CA |
| `/admin/avis` | Modération avis (Pending/Approved/Rejected) |
| `/admin/promos` | CRUD codes promo + stats utilisation |
| `/admin/newsletter` | Abonnées + export CSV |
| `/admin/parametres` | Config boutique, fidélité, livraison |
| `/studio` | Sanity Studio (catalogue produits) |

---

## 11. Déploiement sur Vercel

### Étapes

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Configurer les variables dans Vercel Dashboard
# Settings → Environment Variables → ajouter chaque variable .env.local
```

### Variables spécifiques à la production

```env
NEXT_PUBLIC_APP_URL=https://ritualglowry.ma
NEXTAUTH_URL=https://ritualglowry.ma
NODE_ENV=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Base de données production

**Railway (recommandé) :**
```
railway.app → New Project → PostgreSQL
→ Copier la DATABASE_URL dans Vercel Variables
```

**Supabase (alternative) :**
```
supabase.com → New Project → Settings → Database → Connection String
```

Puis appliquer les migrations :
```bash
npx prisma migrate deploy
```

### Domaine personnalisé
Vercel Dashboard → Domains → Ajouter `ritualglowry.ma` → Configurer DNS.

---

## 12. Back-office Admin

### Flux de gestion des commandes

```
PENDING    → (Stripe webhook)   → PAID
PAID       → (admin prépare)    → PROCESSING
PROCESSING → (admin expédie)    → SHIPPED  ← entrer numéro de suivi
SHIPPED    → (admin/cliente)    → DELIVERED
           → (problème)         → REFUNDED
           → (annulation)       → CANCELLED
```

### Gestion produits
Exclusivement via **Sanity Studio** (`/studio`).
La page `/admin/produits` est en lecture seule avec lien direct vers le Studio.

### Codes promo — création rapide
`/admin/promos` → **+ Créer** :
- Type : `%` (pourcentage) ou fixe (MAD)
- Montant minimum de commande
- Date d'expiration
- Nombre maximum d'utilisations

---

## 13. SEO & Performance

### Schema.org JSON-LD implémenté

| Page | Schéma |
|------|--------|
| Homepage | `Organization` + `WebSite` |
| Produit | `Product` + `AggregateRating` |
| Blog | `Article` + `BreadcrumbList` |
| FAQ | `FAQPage` |

### ISR — Revalidation

```typescript
export const revalidate = 1800   // Homepage : 30 min
export const revalidate = 3600   // Pages produit : 1h
export const revalidate = 86400  // Articles blog : 24h
```

### Sitemap dynamique
Généré automatiquement via `/sitemap.ts` — inclut toutes les pages, produits et articles.

### Objectifs Lighthouse
- Performance ≥ 90 (mobile + desktop)
- LCP < 2.5s · CLS < 0.1 · FID < 100ms

---

## 14. RGPD & Conformité

### Bandeau cookies
Apparaît 2 secondes après l'arrivée, 3 choix :
- **Tout accepter** — Analytics + Marketing activés
- **Tout refuser** — cookies nécessaires uniquement
- **Personnaliser** — toggle granulaire par catégorie

Le script GA4 ne se charge que si `analytics: true` dans `localStorage('cookie-consent')`.

### Droit à l'oubli
`/compte/informations` → **Supprimer mon compte** → dialog 2 étapes (confirmation + saisie "SUPPRIMER").

### Pages légales
Toutes éditables sans code via Sanity CMS (ajouter un document `contentBlock`).

---

## 15. Maintenance & Évolutions

### Mises à jour

```bash
# Vérifier les packages obsolètes
npm outdated

# Mettre à jour
npm update
```

### Ajouter un produit
→ `/studio` → Products → + Create (aucun code requis)

### Ajouter un article blog
→ `/studio` → Blog Posts → + Create → Publish

### Évolutions V2 recommandées

| Fonctionnalité | Effort | Impact |
|---------------|--------|--------|
| Recherche Algolia (instantanée) | Moyen | Haute |
| Multilingue FR/EN (next-intl) | Élevé | Haute |
| Recommandations IA | Élevé | Haute |
| Intégration transporteurs (DHL/Colissimo) | Moyen | Haute |
| Reviews avec photos clientes | Faible | Haute |
| A/B testing (Vercel Edge Config) | Faible | Moyenne |
| Chat support (Intercom/Crisp) | Faible | Moyenne |
| App mobile (Expo + même API) | Très élevé | Haute |

### Tableaux de bord services

| Service | URL |
|---------|-----|
| Vercel (hébergement) | vercel.com/dashboard |
| Railway (base de données) | railway.app |
| Sanity (CMS) | sanity.io/manage |
| Stripe (paiements) | dashboard.stripe.com |
| Resend (emails) | resend.com |
| Google Analytics | analytics.google.com |

---

> **Branche de développement :** `claude/full-stack-prompts-execution-vtTIG`
> **25/25 User Stories CDC Pack Premium implémentées · TypeScript : 0 erreurs**
