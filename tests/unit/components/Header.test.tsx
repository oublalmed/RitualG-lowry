import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, createMockSession } from '@/tests/helpers/renderWithProviders';
import { Header } from '@/components/layout/Header';

// Mock the cart store used by Header
vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => ({
    getItemCount: () => 0,
    openCart: vi.fn(),
  }),
}));

// Mock the SearchModal so it does not try to render complex internals
vi.mock('@/components/common/SearchModal', () => ({
  SearchModal: () => null,
}));

// Mock the Sheet / SheetContent UI primitives to avoid Radix portal issues in jsdom
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('Header', () => {
  it('TC-UI-001 — devrait afficher le logo RitualGlowry', () => {
    renderWithProviders(<Header />);

    // Logo is split across two spans: "Ritual" + "Glowry"
    // Both pieces must be visible inside the anchor pointing to "/"
    const logoLinks = screen.getAllByRole('link', { name: /ritualglowry/i });
    // At least one logo link (desktop; mobile may have a second one)
    expect(logoLinks.length).toBeGreaterThanOrEqual(1);
    expect(logoLinks[0]).toHaveAttribute('href', '/');
  });

  it('TC-UI-001b — devrait afficher le texte "Ritual" et "Glowry" dans le logo', () => {
    renderWithProviders(<Header />);

    // queryAllByText because both the desktop and mobile logo render the same text
    expect(screen.getAllByText('Ritual').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Glowry').length).toBeGreaterThanOrEqual(1);
  });

  it('TC-UI-006 — devrait afficher un lien vers /compte pour le compte utilisateur', () => {
    renderWithProviders(<Header />);

    // Without a session the Header still shows the /compte link (no login redirect)
    const accountLinks = screen.getAllByRole('link', { name: /mon compte/i });
    expect(accountLinks.length).toBeGreaterThanOrEqual(1);
    accountLinks.forEach((link) => expect(link).toHaveAttribute('href', '/compte'));
  });

  it('TC-UI-006 — devrait afficher un lien vers /compte lorsque l\'utilisateur est connecté', () => {
    const session = createMockSession();
    renderWithProviders(<Header />, { session });

    // The component links to /compte regardless of auth state
    const accountLinks = screen.getAllByRole('link', { name: /mon compte/i });
    expect(accountLinks.length).toBeGreaterThanOrEqual(1);
    accountLinks.forEach((link) => expect(link).toHaveAttribute('href', '/compte'));
  });

  it('TC-UI-006b — devrait afficher le bouton d\'icône de compte (aria-label "Mon compte")', () => {
    renderWithProviders(<Header />);

    // Desktop icon-only link uses aria-label
    const accountIconLinks = screen.getAllByRole('link', { name: 'Mon compte' });
    expect(accountIconLinks.length).toBeGreaterThan(0);
    accountIconLinks.forEach(link => expect(link).toHaveAttribute('href', '/compte'));
  });
});
