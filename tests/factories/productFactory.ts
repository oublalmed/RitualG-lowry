import { faker } from '@faker-js/faker';

export interface VariantFactory {
  _key: string;
  label: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string;
}

export interface ProductFactory {
  _id: string;
  _type: 'product';
  name: string;
  slug: { current: string };
  shortDescription: string;
  basePrice: number;
  comparePrice: number | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  productType: string[];
  texture: string[];
  category: { _id: string; name: string; slug: { current: string } } | null;
  images: { asset: { url: string }; alt: string }[];
  variants: VariantFactory[];
  rating: number;
  reviewCount: number;
}

export function createVariant(overrides: Partial<VariantFactory> = {}): VariantFactory {
  return {
    _key: faker.string.uuid(),
    label: `${faker.number.int({ min: 30, max: 70 })}cm`,
    price: faker.number.int({ min: 300, max: 2000 }),
    comparePrice: null,
    stock: faker.number.int({ min: 0, max: 50 }),
    sku: faker.string.alphanumeric(10).toUpperCase(),
    ...overrides,
  };
}

export function createProduct(overrides: Partial<ProductFactory> = {}): ProductFactory {
  const name = faker.commerce.productName();
  return {
    _id: faker.string.uuid(),
    _type: 'product',
    name,
    slug: { current: faker.helpers.slugify(name).toLowerCase() },
    shortDescription: faker.commerce.productDescription(),
    basePrice: faker.number.int({ min: 300, max: 2000 }),
    comparePrice: null,
    stockStatus: 'in_stock',
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    productType: ['extension'],
    texture: ['lisse'],
    category: {
      _id: faker.string.uuid(),
      name: 'Extensions',
      slug: { current: 'extensions' },
    },
    images: [
      { asset: { url: 'https://via.placeholder.com/800x800' }, alt: name },
    ],
    variants: [createVariant(), createVariant()],
    rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 200 }),
    ...overrides,
  };
}

export function createOutOfStockProduct(overrides: Partial<ProductFactory> = {}): ProductFactory {
  return createProduct({
    stockStatus: 'out_of_stock',
    variants: [createVariant({ stock: 0 })],
    ...overrides,
  });
}

export function createNewProduct(overrides: Partial<ProductFactory> = {}): ProductFactory {
  return createProduct({ isNew: true, ...overrides });
}
