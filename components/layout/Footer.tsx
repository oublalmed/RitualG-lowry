import Link from "next/link";
import { Share2, Users, Play } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/collections/all", label: "All Products" },
    { href: "/collections/shampoo", label: "Shampoos" },
    { href: "/collections/conditioner", label: "Conditioners" },
    { href: "/collections/treatments", label: "Treatments" },
    { href: "/collections/styling", label: "Styling" },
  ],
  help: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping & Returns" },
    { href: "/contact", label: "Contact Us" },
    { href: "/wholesale", label: "Wholesale" },
  ],
  brand: [
    { href: "/about", label: "Our Story" },
    { href: "/blog", label: "Journal" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/sustainability", label: "Sustainability" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Top section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-playfair font-bold italic text-brand-ivory hover:text-brand-champagne transition-colors"
            >
              Ritual Glowry
            </Link>
            <p className="mt-4 text-sm font-cormorant font-light text-brand-nude leading-relaxed max-w-xs">
              Premium hair care rituals for the modern woman. Crafted with rare
              botanicals and advanced science.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="text-brand-nude hover:text-brand-champagne transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-brand-nude hover:text-brand-champagne transition-colors"
                aria-label="Facebook"
              >
                <Users className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-brand-nude hover:text-brand-champagne transition-colors"
                aria-label="YouTube"
              >
                <Play className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-brand-champagne mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-cormorant text-brand-cream/70 hover:text-brand-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand links */}
          <div>
            <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-brand-champagne mb-5">
              Brand
            </h3>
            <ul className="space-y-3">
              {footerLinks.brand.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-cormorant text-brand-cream/70 hover:text-brand-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="text-xs font-inter font-semibold uppercase tracking-widest text-brand-champagne mb-5">
              Help
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-cormorant text-brand-cream/70 hover:text-brand-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-inter text-brand-nude/60">
            &copy; {new Date().getFullYear()} Ritual Glowry. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-inter text-brand-nude/60 hover:text-brand-champagne transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-inter text-brand-nude/60 hover:text-brand-champagne transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
