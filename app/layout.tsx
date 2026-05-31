import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ritual Glowry — Premium Hair Care",
    template: "%s | Ritual Glowry",
  },
  description:
    "Discover Ritual Glowry — a premium hair care brand dedicated to the science of beautiful, healthy hair. Luxurious formulations for every hair type.",
  keywords: [
    "premium hair care",
    "luxury hair products",
    "hair treatment",
    "ritual hair",
    "glowry hair",
  ],
  authors: [{ name: "Ritual Glowry" }],
  creator: "Ritual Glowry",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ritualglowry.com",
    siteName: "Ritual Glowry",
    title: "Ritual Glowry — Premium Hair Care",
    description:
      "Discover Ritual Glowry — a premium hair care brand dedicated to the science of beautiful, healthy hair.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ritual Glowry — Premium Hair Care",
    description:
      "Discover Ritual Glowry — a premium hair care brand dedicated to the science of beautiful, healthy hair.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory font-inter">
        {children}
      </body>
    </html>
  );
}
