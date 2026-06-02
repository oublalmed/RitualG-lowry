import { faker } from '@faker-js/faker';

export interface AddressFactory {
  id: string;
  userId: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string | null;
  city: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

export function createAddress(overrides: Partial<AddressFactory> = {}): AddressFactory {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    label: 'Domicile',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    line1: faker.location.streetAddress(),
    line2: null,
    city: faker.location.city(),
    postalCode: faker.location.zipCode('####'),
    country: 'MA',
    phone: faker.phone.number(),
    isDefault: false,
    ...overrides,
  };
}

export function createDefaultAddress(overrides: Partial<AddressFactory> = {}): AddressFactory {
  return createAddress({ isDefault: true, ...overrides });
}
