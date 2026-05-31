export interface MockVariant {
  label: string;
  color: { name: string; hexCode: string };
  length: number;
  price: number;
  stock: number;
  isAvailable: boolean;
}

export interface MockProduct {
  _id: string;
  slug: string;
  name: string;
  shortDescription: string;
  basePrice: number;
  comparePrice: number | null;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  productType: string[];
  texture: string[];
  rating: number;
  reviewCount: number;
  variants: MockVariant[];
  category: { name: string; slug: string };
}

export const mockProducts: MockProduct[] = [
  {
    _id: 'prod-1',
    slug: 'extension-lisse-naturelle',
    name: 'Extension Lisse Naturelle',
    shortDescription: 'Extensions 100% Remy, texture lisse parfaite',
    basePrice: 890,
    comparePrice: 1100,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stockStatus: 'in_stock',
    productType: ['extensions'],
    texture: ['lisse'],
    rating: 4.8,
    reviewCount: 124,
    variants: [
      { label: '40cm - Noir Naturel', color: { name: 'Noir Naturel', hexCode: '#1A1410' }, length: 40, price: 890, stock: 15, isAvailable: true },
      { label: '50cm - Noir Naturel', color: { name: 'Noir Naturel', hexCode: '#1A1410' }, length: 50, price: 990, stock: 8, isAvailable: true },
      { label: '60cm - Châtain', color: { name: 'Châtain', hexCode: '#6B3A2A' }, length: 60, price: 1090, stock: 3, isAvailable: true },
    ],
    category: { name: 'Extensions', slug: 'extensions' },
  },
  {
    _id: 'prod-2',
    slug: 'extension-bouclee-sublime',
    name: 'Extension Bouclée Sublime',
    shortDescription: 'Boucles naturelles rebondies et volumineuses',
    basePrice: 950,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    stockStatus: 'in_stock',
    productType: ['extensions'],
    texture: ['bouclée'],
    rating: 4.9,
    reviewCount: 87,
    variants: [
      { label: '40cm - Noir', color: { name: 'Noir', hexCode: '#1A1410' }, length: 40, price: 950, stock: 20, isAvailable: true },
      { label: '50cm - Brun', color: { name: 'Brun', hexCode: '#3D2B1F' }, length: 50, price: 1050, stock: 5, isAvailable: true },
    ],
    category: { name: 'Extensions', slug: 'extensions' },
  },
  {
    _id: 'prod-3',
    slug: 'perruque-lace-front',
    name: 'Perruque Lace Front Premium',
    shortDescription: 'Perruque lace front ultra-réaliste',
    basePrice: 1450,
    comparePrice: 1800,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    stockStatus: 'in_stock',
    productType: ['perruque'],
    texture: ['lisse'],
    rating: 4.7,
    reviewCount: 203,
    variants: [
      { label: '14 pouces - Noir', color: { name: 'Noir', hexCode: '#1A1410' }, length: 35, price: 1450, stock: 12, isAvailable: true },
      { label: '18 pouces - Noir', color: { name: 'Noir', hexCode: '#1A1410' }, length: 45, price: 1650, stock: 7, isAvailable: true },
    ],
    category: { name: 'Perruques', slug: 'perruques' },
  },
  {
    _id: 'prod-4',
    slug: 'extension-afro-naturelle',
    name: 'Extension Afro Naturelle',
    shortDescription: 'Texture afro authentique, densité naturelle',
    basePrice: 780,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    stockStatus: 'low_stock',
    productType: ['extensions'],
    texture: ['afro'],
    rating: 4.6,
    reviewCount: 56,
    variants: [
      { label: '30cm - Noir', color: { name: 'Noir', hexCode: '#1A1410' }, length: 30, price: 780, stock: 4, isAvailable: true },
    ],
    category: { name: 'Extensions', slug: 'extensions' },
  },
  {
    _id: 'prod-5',
    slug: 'serre-tete-satin',
    name: 'Serre-tête Satin Glowry',
    shortDescription: 'Serre-tête en satin premium pour protéger vos cheveux',
    basePrice: 180,
    comparePrice: null,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    stockStatus: 'in_stock',
    productType: ['accessoire'],
    texture: [],
    rating: 4.5,
    reviewCount: 34,
    variants: [
      { label: 'Beige', color: { name: 'Beige', hexCode: '#F5EDE0' }, length: 0, price: 180, stock: 50, isAvailable: true },
      { label: 'Noir', color: { name: 'Noir', hexCode: '#1A1410' }, length: 0, price: 180, stock: 50, isAvailable: true },
    ],
    category: { name: 'Accessoires', slug: 'accessoires' },
  },
  {
    _id: 'prod-6',
    slug: 'extension-ondule-naturelle',
    name: 'Extension Ondulée Body Wave',
    shortDescription: 'Ondulations naturelles et brillantes',
    basePrice: 920,
    comparePrice: 1050,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    stockStatus: 'in_stock',
    productType: ['extensions'],
    texture: ['ondulée'],
    rating: 4.8,
    reviewCount: 99,
    variants: [
      { label: '45cm - Noir', color: { name: 'Noir', hexCode: '#1A1410' }, length: 45, price: 920, stock: 18, isAvailable: true },
      { label: '55cm - Brun', color: { name: 'Brun', hexCode: '#3D2B1F' }, length: 55, price: 1020, stock: 6, isAvailable: true },
    ],
    category: { name: 'Extensions', slug: 'extensions' },
  },
];

export const mockCategories = [
  { name: 'Extensions', slug: 'extensions', description: 'Extensions 100% naturelles' },
  { name: 'Perruques', slug: 'perruques', description: 'Perruques premium lace front' },
  { name: 'Accessoires', slug: 'accessoires', description: 'Accessoires cheveux premium' },
];
