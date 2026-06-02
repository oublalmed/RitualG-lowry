import { faker } from '@faker-js/faker';

export type UserRole = 'CUSTOMER' | 'ADMIN';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface UserFactory {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  password: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  referralCode: string;
  referredById: string | null;
  newsletterOptIn: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export function createUser(overrides: Partial<UserFactory> = {}): UserFactory {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    password: '$2a$10$hashedpasswordmock',
    emailVerified: new Date(),
    image: null,
    role: 'CUSTOMER',
    loyaltyPoints: 0,
    loyaltyTier: 'BRONZE',
    referralCode: faker.string.uuid(),
    referredById: null,
    newsletterOptIn: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null,
    ...overrides,
  };
}

export function createAdmin(overrides: Partial<UserFactory> = {}): UserFactory {
  return createUser({ role: 'ADMIN', ...overrides });
}

export function createUnverifiedUser(overrides: Partial<UserFactory> = {}): UserFactory {
  return createUser({ emailVerified: null, ...overrides });
}
