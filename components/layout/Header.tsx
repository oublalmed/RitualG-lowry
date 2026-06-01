'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Heart, Menu, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cartStore';
import { SearchModal } from '@/components/common/SearchModal';

const announcements = [
  'Livraison offerte dès 1 200 MAD',
  'Paiement sécurisé · 100% naturel',
  'Retours gratuits sous 30 jours',
];

const megaMenuCategories = [
  {
    name: 'Extensions Lisses',
    description: 'Soyeuses et légères',
    href: '/boutique/lisses',
    color: 'linear-gradient(135deg, #3D2B1F 0%, #5A3D2B 100%)',
  },
  {
    name: 'Extensions Bouclées',
    description: 'Volume et mouvement naturel',
    href: '/boutique/bouclees',
    color: 'linear-gradient(135deg, #4A3528 0%, #6B4C35 100%)',
  },
  {
    name: 'Extensions Afro',
    description: 'Pour toutes les textures',
    href: '/boutique/afro',
    color: 'linear-gradient(135deg, #5A3D2B 0%, #C9A875 100%)',
  },
];

const navLinks = [
  { href: '/boutique', label: 'Boutique', hasMegaMenu: true },
  { href: '/boutique/nouveautes', label: 'Nouveautés', hasMegaMenu: false },
  { href: '/boutique/best-sellers', label: 'Best-sellers', hasMegaMenu: false },
  { href: '/a-propos', label: 'À propos', hasMegaMenu: false },
  { href: '/blog', label: 'Blog', hasMegaMenu: false },
  { href: '/faq', label: 'FAQ', hasMegaMenu: false },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const { getItemCount, openCart } = useCartStore();
  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMegaMenuEnter = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimer.current = setTimeout(() => setMegaMenuOpen(false), 150);
  };

  return (
    <>
    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar */}
      <div className="bg-[#C9A875] text-[#1A1410] py-2 text-center overflow-hidden">
        <p className="text-xs font-inter font-semibold uppercase tracking-[0.08em] transition-all duration-500">
          {announcements[announcementIndex]}
        </p>
      </div>

      {/* Main header */}
      <header
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-[#FAF6EF]/96 backdrop-blur-md shadow-sm'
            : 'bg-[#FAF6EF]'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile hamburger */}
            <div className="flex md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  className="inline-flex items-center justify-center p-2 text-[#3D2B1F] hover:text-[#C9A875] transition-colors"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[85vw] max-w-sm bg-[#FAF6EF] border-r border-[#F5EDE0] p-0"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5EDE0]">
                      <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        className="text-xl font-playfair font-bold italic"
                      >
                        <span className="text-[#3D2B1F]">Ritual</span>
                        <span className="text-[#C9A875]">Glowry</span>
                      </Link>
                    </div>
                    <nav className="flex-1 px-6 py-8 space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between py-3 font-inter font-semibold text-sm uppercase tracking-[0.08em] text-[#3D2B1F] hover:text-[#C9A875] transition-colors border-b border-[#F5EDE0]"
                        >
                          {link.label}
                          <ChevronRight className="h-4 w-4 opacity-40" />
                        </Link>
                      ))}
                    </nav>
                    <div className="px-6 py-6 border-t border-[#F5EDE0] flex items-center gap-4">
                      <Link
                        href="/compte"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-sm font-inter text-[#3D2B1F] hover:text-[#C9A875] transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Mon compte
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-sm font-inter text-[#3D2B1F] hover:text-[#C9A875] transition-colors"
                      >
                        <Heart className="h-5 w-5" />
                        Favoris
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          openCart();
                        }}
                        className="flex items-center gap-2 text-sm font-inter text-[#3D2B1F] hover:text-[#C9A875] transition-colors relative"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        Panier
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[#C9A875] text-[#1A1410] text-xs w-4 h-4 rounded-full flex items-center justify-center font-inter font-semibold">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 text-xl md:text-2xl font-playfair font-bold italic hover:opacity-80 transition-opacity"
            >
              <span className="text-[#3D2B1F]">Ritual</span>
              <span className="text-[#C9A875]">Glowry</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) =>
                link.hasMegaMenu ? (
                  <div
                    key={link.href}
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMegaMenuLeave}
                    className="relative"
                  >
                    <Link
                      href={link.href}
                      className="text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F] hover:text-[#C9A875] transition-colors duration-300 py-2 block"
                    >
                      {link.label}
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F] hover:text-[#C9A875] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#3D2B1F] hover:text-[#C9A875] transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <Link
                href="/compte"
                className="hidden md:block p-2 text-[#3D2B1F] hover:text-[#C9A875] transition-colors"
                aria-label="Mon compte"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/wishlist"
                className="hidden md:block p-2 text-[#3D2B1F] hover:text-[#C9A875] transition-colors relative"
                aria-label="Liste de souhaits"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <button
                onClick={openCart}
                className="relative p-2 text-[#3D2B1F] hover:text-[#C9A875] transition-colors"
                aria-label="Ouvrir le panier"
              >
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#C9A875] text-[#1A1410] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-inter font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        {megaMenuOpen && (
          <div
            className="absolute left-0 right-0 bg-[#FAF6EF] border-t border-[#F5EDE0] shadow-lg"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
              <p className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-6">
                Nos Collections
              </p>
              <div className="grid grid-cols-3 gap-6">
                {megaMenuCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMegaMenuOpen(false)}
                    className="group border border-[#F5EDE0] hover:border-[#C9A875] transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="aspect-[3/2] w-full"
                      style={{ background: cat.color }}
                    />
                    <div className="p-4">
                      <h3 className="font-playfair font-bold italic text-base text-[#1A1410] group-hover:text-[#C9A875] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs font-inter text-[#3D2B1F]/60 mt-1">
                        {cat.description}
                      </p>
                      <span className="text-xs font-inter font-semibold text-[#C9A875] uppercase tracking-[0.08em] mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Découvrir <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
    </>
  );
}
