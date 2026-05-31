# Ritual Glowry — Premium Hair E-Commerce

A luxury hair care e-commerce platform built with Next.js 14, featuring a sophisticated design system rooted in a warm, feminine brand palette.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| CMS | Sanity v3 |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js v4 |
| Payments | Stripe |
| State | Zustand |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Email | Resend + React Email |
| Animation | Framer Motion |

## Brand Identity

### Color Palette

| Name | Hex | Usage |
|---|---|---|
| Ivory | `#FAF6EF` | Main background |
| Cream | `#F5EDE0` | Light section backgrounds |
| Mocha | `#3D2B1F` | Strong text, header |
| Dark | `#1A1410` | Title text, footer |
| Champagne | `#C9A875` | CTA, premium accents |
| Gold | `#B8924B` | Hover, micro-interactions |
| Nude | `#C9A8A0` | Feminine accents, sales |

### Typography

- **Display Headings** — Playfair Display 700 italic
- **Subheadings** — Cormorant Garamond 400 italic  
- **Body** — Cormorant Garamond 400 or Inter 400
- **Buttons/Labels** — Inter 600, uppercase, letter-spacing 0.08em

### Design Principles

- Minimalist, sophisticated, feminine
- Generous white space
- Subtle fade-in and parallax animations
- Mobile-first, perfectly responsive
- No flashy discount-style elements

## Project Structure

```
/
├── app/
│   ├── (shop)/           # Shop routes (products, cart, checkout, account)
│   ├── (content)/        # Content routes (about, blog, contact)
│   ├── api/              # API routes (auth, products, orders, webhooks)
│   ├── studio/           # Sanity Studio embedded
│   ├── layout.tsx        # Root layout with fonts
│   ├── page.tsx          # Homepage
│   └── globals.css       # CSS variables, brand tokens, animations
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Header, Footer, HeroSection
│   ├── product/          # ProductCard, FeaturedProducts, etc.
│   ├── cart/             # Cart drawer, cart item, etc.
│   ├── checkout/         # Checkout form, order summary
│   └── common/           # Shared components (testimonials, manifesto)
├── lib/
│   ├── sanity/           # Sanity client + GROQ queries
│   ├── stripe/           # Stripe helpers
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # NextAuth configuration
│   └── utils.ts          # Shared utilities
├── prisma/
│   └── schema.prisma     # Database schema
├── sanity/
│   └── schemas/          # Sanity content models
├── stores/
│   └── cartStore.ts      # Zustand cart state
├── types/
│   └── index.ts          # TypeScript types
└── public/               # Static assets
```

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd RitualG-lowry
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Set up Sanity

```bash
npx sanity init
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Sanity Studio runs at [http://localhost:3000/studio](http://localhost:3000/studio).

## Environment Variables

See `.env.example` for all required environment variables.

### Required services:

- **PostgreSQL** — Local or hosted (Neon, Supabase, Railway)
- **Sanity** — Create a project at sanity.io
- **Stripe** — Create an account at stripe.com
- **Google OAuth** — Create credentials in Google Cloud Console
- **Resend** — Create an account at resend.com

## Database Schema

The Prisma schema includes:

- `User` — Customer accounts with NextAuth adapter support
- `Product` + `ProductVariant` — Synced from Sanity
- `Order` + `OrderItem` — Complete order management
- `Address` — Saved shipping addresses
- `WishlistItem` — Saved products

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build  # Test build locally first
```

## Development Notes

- All colors must come from the brand palette — no ad-hoc grays or blues
- Animations should be subtle: fade-in, gentle parallax, no bouncing
- Typography hierarchy: Playfair (titles) > Cormorant (sub/body) > Inter (UI)
- Mobile-first: design for 375px first, then expand
