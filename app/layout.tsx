import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ritualglowry.ma'),
  title: {
    default: 'Ritual Glowry | Extensions & Perruques Premium au Maroc',
    template: '%s | Ritual Glowry',
  },
  description:
    'Découvrez nos extensions capillaires et perruques 100% naturelles Remy. Livraison au Maroc. Paiement sécurisé.',
  keywords: [
    'extensions cheveux',
    'perruques',
    'extensions naturelles',
    'Maroc',
    'Ritual Glowry',
    'cheveux Remy',
    'extensions lisses',
    'extensions bouclées',
    'extensions afro',
  ],
  authors: [{ name: 'Ritual Glowry' }],
  creator: 'Ritual Glowry',
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    siteName: 'Ritual Glowry',
    title: 'Ritual Glowry | Extensions & Perruques Premium au Maroc',
    description:
      'Découvrez nos extensions et perruques 100% naturelles cheveux Remy. Qualité premium pour toutes les textures.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ritual Glowry | Extensions & Perruques Premium au Maroc',
    description:
      'Découvrez nos extensions et perruques 100% naturelles cheveux Remy. Qualité premium pour toutes les textures.',
    site: '@ritualglowry',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF6EF',
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ritual Glowry',
  url: 'https://ritualglowry.com',
  logo: 'https://ritualglowry.com/logo.png',
  description:
    'Extensions et perruques 100% naturelles cheveux Remy. Qualité premium pour toutes les textures.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['French', 'Arabic'],
  },
  sameAs: [
    'https://www.instagram.com/ritualglowry',
    'https://www.facebook.com/ritualglowry',
    'https://www.tiktok.com/@ritualglowry',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF6EF] font-sans">
        <SessionProvider>
          <QueryProvider>
            {children}
            <CartDrawer />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
