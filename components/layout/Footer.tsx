'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Users, Music2 } from 'lucide-react';

const footerLinks = {
  boutique: [
    { href: '/boutique?textures=lisse', label: 'Extensions Lisses' },
    { href: '/boutique?textures=bouclée', label: 'Extensions Bouclées' },
    { href: '/boutique?textures=afro', label: 'Extensions Afro' },
    { href: '/boutique?types=perruque', label: 'Perruques' },
    { href: '/boutique?types=accessoire', label: 'Accessoires' },
    { href: '/cartes-cadeaux', label: 'Cartes cadeaux' },
  ],
  aide: [
    { href: '/faq', label: 'FAQ' },
    { href: '/livraison-retours', label: 'Livraison & retours' },
    { href: '/guide-des-tailles', label: 'Guide des tailles' },
    { href: '/contact', label: 'Contactez-nous' },
    { href: '/suivi-commande', label: 'Suivi de commande' },
  ],
  legal: [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/cgv', label: 'CGV' },
    { href: '/politique-confidentialite', label: 'Politique de confidentialité' },
    { href: '/politique-cookies', label: 'Politique cookies' },
    { href: '/droit-retractation', label: 'Droit de rétractation' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    setSubError('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const json = await res.json();
      if (res.ok) { setSubscribed(true); setEmail(''); }
      else setSubError(json.error ?? 'Erreur, réessayez.');
    } catch { setSubError('Erreur réseau.'); }
    finally { setSubLoading(false); }
  };

  return (
    <footer>
      {/* Newsletter row */}
      <div className="bg-[#F5EDE0] py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-playfair font-bold italic text-2xl md:text-3xl text-[#1A1410] mb-2">
              Rejoignez le Club Glowry
            </h3>
            <p className="font-cormorant italic text-base text-[#3D2B1F]/70 mb-6">
              Recevez nos conseils beauté, nos offres exclusives et −10% sur votre première commande.
            </p>
            {subscribed ? (
              <p className="font-inter font-semibold text-sm text-[#C9A875] uppercase tracking-[0.08em]">
                ✓ Merci ! Bienvenue dans le Club Glowry.
              </p>
            ) : (
              <div className="max-w-md mx-auto">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="flex-1 bg-[#FAF6EF] border border-[#3D2B1F]/15 px-4 py-3 font-inter text-sm text-[#1A1410] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#C9A875] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subLoading}
                    className="bg-[#3D2B1F] hover:bg-[#1A1410] disabled:opacity-60 text-[#FAF6EF] font-inter font-semibold uppercase tracking-[0.08em] text-xs px-8 py-3 transition-colors duration-300 whitespace-nowrap"
                  >
                    {subLoading ? '...' : "S'inscrire"}
                  </button>
                </form>
                {subError && <p className="text-xs text-red-500 mt-2">{subError}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main footer — dark bg */}
      <div className="bg-[#1A1410] text-[#FAF6EF]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Col 1 — Marque */}
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity" aria-label="Ritual Glowry">
                <Image
                  src="/logo.png"
                  alt="Ritual Glowry"
                  width={100}
                  height={68}
                  className="h-14 w-auto object-contain brightness-0 invert"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-playfair font-bold italic text-xl text-[#FAF6EF]">Ritual</span>
                  <span className="font-playfair font-bold italic text-xl text-[#C9A875]">Glowry</span>
                </div>
              </Link>
              <p className="mt-3 text-sm font-cormorant italic text-[#FAF6EF]/60 leading-relaxed max-w-[220px]">
                Des extensions naturelles qui subliment votre beauté authentique.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://www.instagram.com/ritualglowry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#FAF6EF]/50 hover:text-[#C9A875] transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/ritualglowry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-[#FAF6EF]/50 hover:text-[#C9A875] transition-colors"
                >
                  <Users className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@ritualglowry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-[#FAF6EF]/50 hover:text-[#C9A875] transition-colors"
                >
                  <Music2 className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Col 2 — Boutique */}
            <div>
              <h4 className="text-xs font-inter font-semibold uppercase tracking-[0.12em] text-[#C9A875] mb-5">
                Boutique
              </h4>
              <ul className="space-y-3">
                {footerLinks.boutique.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-inter text-[#FAF6EF]/60 hover:text-[#C9A875] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Aide */}
            <div>
              <h4 className="text-xs font-inter font-semibold uppercase tracking-[0.12em] text-[#C9A875] mb-5">
                Aide
              </h4>
              <ul className="space-y-3">
                {footerLinks.aide.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-inter text-[#FAF6EF]/60 hover:text-[#C9A875] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Légal */}
            <div>
              <h4 className="text-xs font-inter font-semibold uppercase tracking-[0.12em] text-[#C9A875] mb-5">
                Légal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-inter text-[#FAF6EF]/60 hover:text-[#C9A875] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#FAF6EF]/8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-inter text-[#FAF6EF]/40 text-center md:text-left">
              Visa · Mastercard · Amex · Stripe · Apple Pay
            </p>
            <p className="text-xs font-inter text-[#FAF6EF]/40 text-center">
              &copy; 2026 Ritual Glowry · Made with ♥ in Morocco
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
