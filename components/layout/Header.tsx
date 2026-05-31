"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/products", label: "Shop All" },
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Journal" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-brand-mocha hover:text-brand-champagne transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-ivory border-r border-brand-cream">
                <nav className="flex flex-col gap-6 mt-10">
                  <Link
                    href="/"
                    className="text-2xl font-playfair font-bold italic text-brand-dark"
                  >
                    Ritual Glowry
                  </Link>
                  <div className="w-8 h-px bg-brand-champagne" />
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-brand-mocha font-cormorant text-lg tracking-wide hover:text-brand-champagne transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 text-xl md:text-2xl font-playfair font-bold italic text-brand-dark hover:text-brand-mocha transition-colors tracking-tight"
          >
            Ritual Glowry
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-inter font-medium text-brand-mocha uppercase tracking-widest hover:text-brand-champagne transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-brand-mocha hover:text-brand-champagne hover:bg-transparent"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-mocha hover:text-brand-champagne hover:bg-transparent"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-brand-mocha hover:text-brand-champagne hover:bg-transparent"
              >
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-champagne text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-inter font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
