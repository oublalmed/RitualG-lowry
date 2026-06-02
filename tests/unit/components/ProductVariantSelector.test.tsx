import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/tests/helpers/renderWithProviders';
import { ProductVariantSelector } from '@/components/product/ProductVariantSelector';
import type { ProductVariant } from '@/lib/types';

// Helper: build a minimal ProductVariant
function makeVariant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    _key: 'var-001',
    label: '40 cm',
    color: { name: 'Noir', hexCode: '#000000' },
    length: 40,
    price: 850,
    stock: 10,
    isAvailable: true,
    ...overrides,
  };
}

describe('ProductVariantSelector', () => {
  it('TC-UI-023 — devrait marquer une variante comme sélectionnée après un clic', () => {
    const variantA = makeVariant({ _key: 'v1', label: '40 cm', length: 40 });
    const variantB = makeVariant({ _key: 'v2', label: '50 cm', length: 50 });
    const onSelect = vi.fn();

    renderWithProviders(
      <ProductVariantSelector
        variants={[variantA, variantB]}
        selectedVariant={variantA}
        onSelect={onSelect}
        basePrice={850}
      />
    );

    // The "50 cm" button should not be pressed initially
    const btn50 = screen.getByRole('button', { name: /50 cm/i });
    expect(btn50).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(btn50);
    expect(onSelect).toHaveBeenCalledWith(variantB);
  });

  it('TC-UI-024 — devrait désactiver le bouton d\'une variante hors stock', () => {
    const inStock = makeVariant({ _key: 'v1', label: '40 cm', length: 40, isAvailable: true, stock: 5 });
    const outOfStock = makeVariant({ _key: 'v2', label: '50 cm', length: 50, isAvailable: false, stock: 0 });

    renderWithProviders(
      <ProductVariantSelector
        variants={[inStock, outOfStock]}
        selectedVariant={inStock}
        onSelect={vi.fn()}
        basePrice={850}
      />
    );

    const btn50 = screen.getByRole('button', { name: /50 cm/i });
    expect(btn50).toBeDisabled();

    const btn40 = screen.getByRole('button', { name: /40 cm/i });
    expect(btn40).not.toBeDisabled();
  });

  it('TC-UI-025 — devrait appeler onSelect avec la variante cliquée', () => {
    const variantA = makeVariant({ _key: 'v1', label: '40 cm', length: 40 });
    const variantB = makeVariant({ _key: 'v2', label: '60 cm', length: 60 });
    const onSelect = vi.fn();

    renderWithProviders(
      <ProductVariantSelector
        variants={[variantA, variantB]}
        selectedVariant={variantA}
        onSelect={onSelect}
        basePrice={850}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /60 cm/i }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(variantB);
  });

  it('TC-UI-025b — ne devrait pas appeler onSelect pour une variante indisponible', () => {
    const available = makeVariant({ _key: 'v1', label: '40 cm', length: 40 });
    const unavailable = makeVariant({ _key: 'v2', label: '50 cm', length: 50, isAvailable: false });
    const onSelect = vi.fn();

    renderWithProviders(
      <ProductVariantSelector
        variants={[available, unavailable]}
        selectedVariant={available}
        onSelect={onSelect}
        basePrice={850}
      />
    );

    // Clicking a disabled button should not fire the callback
    const btn50 = screen.getByRole('button', { name: /50 cm/i });
    fireEvent.click(btn50);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
