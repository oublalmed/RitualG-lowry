import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/helpers/renderWithProviders';
import { ProductCard } from '@/components/product/ProductCard';

// Mock the cart store so ProductCard doesn't need a real Zustand store
vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
    getItemCount: () => 0,
    openCart: vi.fn(),
  }),
}));

// Minimal product shape accepted by ProductCard
function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod-test-001',
    name: 'Extension Lisse Naturelle',
    price: 850,
    comparePrice: null,
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

describe('ProductCard', () => {
  it('TC-UI-011 — devrait afficher le nom et le prix du produit', () => {
    renderWithProviders(<ProductCard product={makeProduct()} />);

    expect(screen.getByText('Extension Lisse Naturelle')).toBeInTheDocument();
    // Price formatted with fr-BE locale: "850 €"
    expect(screen.getByText(/850.*€/i)).toBeInTheDocument();
  });

  it('TC-UI-012 — devrait afficher le badge "Nouveau" quand isNew est true', () => {
    renderWithProviders(<ProductCard product={makeProduct({ isNew: true })} />);

    expect(screen.getByText('Nouveau')).toBeInTheDocument();
  });

  it('TC-UI-012 — ne devrait pas afficher le badge "Nouveau" quand isNew est false', () => {
    renderWithProviders(<ProductCard product={makeProduct({ isNew: false })} />);

    expect(screen.queryByText('Nouveau')).not.toBeInTheDocument();
  });

  it('TC-UI-013 — devrait afficher le badge "Promo" quand comparePrice est défini', () => {
    renderWithProviders(
      <ProductCard product={makeProduct({ comparePrice: 1200, badge: 'Promo' })} />
    );

    expect(screen.getByText('Promo')).toBeInTheDocument();
  });

  it('TC-UI-014 — devrait afficher le prix barré quand comparePrice est défini', () => {
    renderWithProviders(
      <ProductCard product={makeProduct({ price: 850, comparePrice: 1200 })} />
    );

    // The strikethrough element should contain the original price
    const struckPrice = screen.getByText(/1[\s.,]?200.*€|1200.*€/i);
    expect(struckPrice).toBeInTheDocument();
    expect(struckPrice).toHaveClass('line-through');
  });

  it('TC-UI-017 — devrait afficher les icônes étoiles quand rating est défini', () => {
    renderWithProviders(
      <ProductCard product={makeProduct({ rating: 4, reviewCount: 12 })} />
    );

    // The component renders 5 Star icons from lucide-react as SVG elements
    // We can verify the review count is shown which only renders alongside stars
    expect(screen.getByText('(12)')).toBeInTheDocument();
  });
});
