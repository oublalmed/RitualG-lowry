import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null;
  queryClient?: QueryClient;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    session = null,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

export function createMockSession(overrides: Partial<Session['user']> = {}): Session {
  return {
    user: {
      id: 'user-test-123',
      name: 'Sara Test',
      email: 'sara.test@example.ma',
      image: null,
      role: 'CUSTOMER',
      ...overrides,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function createAdminSession(): Session {
  return createMockSession({ id: 'admin-test-456', role: 'ADMIN', email: 'admin@ritualglowry.ma' });
}
