import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from '@/stores/cartStore';
import type { CartItem } from '@/stores/cartStore';

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildItem(overrides: Partial<Omit<CartItem, 'quantity'>> = {}): Omit<CartItem, 'quantity'> {
  return {
    id: 'prod-001-40cm',
    productId: 'prod-001',
    sanityProductId: 'sanity-prod-001',
    sanityVariantId: 'variant-40cm',
    name: 'Extension Brun Moka',
    variantLabel: '40cm',
    price: 1200,
    imageUrl: 'https://example.com/image.jpg',
    slug: 'extension-brun-moka',
    ...overrides,
  };
}

// Réinitialise le store avant chaque test
beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
  localStorage.clear();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Zustand Cart Store', () => {
  // TC-CART-001
  it('devrait ajouter un nouvel article avec une quantité de 1', () => {
    // Arrange
    const item = buildItem();

    // Act
    useCartStore.getState().addItem(item);

    // Assert
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ ...item, quantity: 1 });
  });

  // TC-CART-002
  it('devrait incrémenter la quantité si le même article (même id) est ajouté deux fois', () => {
    // Arrange
    const item = buildItem();

    // Act
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);

    // Assert
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  // TC-CART-003
  it('devrait supprimer un article lorsque updateQuantity est appelé avec 0', () => {
    // Arrange
    const item = buildItem();
    useCartStore.getState().addItem(item);
    expect(useCartStore.getState().items).toHaveLength(1);

    // Act
    useCartStore.getState().updateQuantity(item.id, 0);

    // Assert
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  // TC-CART-004
  it('devrait mettre à jour la quantité à une valeur arbitraire (pas de plafond défini dans le store)', () => {
    // Arrange
    const item = buildItem();
    useCartStore.getState().addItem(item);

    // Act — le store ne plafonne pas à 10, il accepte la valeur transmise
    useCartStore.getState().updateQuantity(item.id, 99);

    // Assert — la valeur est enregistrée telle quelle
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(99);
  });

  // TC-CART-005
  it('devrait retirer un article du panier avec removeItem', () => {
    // Arrange
    const item = buildItem();
    const otherItem = buildItem({ id: 'prod-002-50cm', productId: 'prod-002', name: 'Autre article' });
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(otherItem);
    expect(useCartStore.getState().items).toHaveLength(2);

    // Act
    useCartStore.getState().removeItem(item.id);

    // Assert
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(otherItem.id);
  });

  // TC-CART-006
  it('devrait vider complètement le panier avec clear()', () => {
    // Arrange
    useCartStore.getState().addItem(buildItem());
    useCartStore.getState().addItem(buildItem({ id: 'prod-002-60cm' }));
    expect(useCartStore.getState().items).toHaveLength(2);

    // Act
    useCartStore.getState().clear();

    // Assert
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  // TC-CART-007
  it('devrait calculer le sous-total correct (somme de quantité × prix unitaire)', () => {
    // Arrange
    useCartStore.getState().addItem(buildItem({ id: 'prod-A', price: 1000 }));
    useCartStore.getState().addItem(buildItem({ id: 'prod-A', price: 1000 })); // → qty 2
    useCartStore.getState().addItem(buildItem({ id: 'prod-B', price: 500 }));

    // Act
    const subtotal = useCartStore.getState().getSubtotal();

    // Assert — prod-A: 1000 × 2 = 2000, prod-B: 500 × 1 = 500 → total = 2500
    expect(subtotal).toBe(2500);
  });

  // TC-CART-008
  it("devrait retourner le nombre total d'articles (somme des quantités) avec getItemCount()", () => {
    // Arrange
    useCartStore.getState().addItem(buildItem({ id: 'prod-A' }));
    useCartStore.getState().addItem(buildItem({ id: 'prod-A' })); // qty 2
    useCartStore.getState().addItem(buildItem({ id: 'prod-B' })); // qty 1
    useCartStore.getState().updateQuantity('prod-B', 3);           // qty 3

    // Act
    const count = useCartStore.getState().getItemCount();

    // Assert — 2 + 3 = 5
    expect(count).toBe(5);
  });

  // TC-CART-009
  it('devrait persister les articles dans localStorage via le middleware persist', () => {
    // Arrange
    const item = buildItem();

    // Act
    useCartStore.getState().addItem(item);

    // Assert — zustand/persist écrit dans localStorage sous la clé 'ritual-glowry-cart'
    const stored = localStorage.getItem('ritual-glowry-cart');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored as string);
    // Le middleware persist enveloppe dans { state: { items: [...] } }
    expect(parsed?.state?.items).toHaveLength(1);
    expect(parsed?.state?.items[0].id).toBe(item.id);
  });
});
