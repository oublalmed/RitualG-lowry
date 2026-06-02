import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';

// Polyfill localStorage for jsdom + Zustand persist middleware
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => null),
}));

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
      const React = require('react');
      return React.createElement('div', props, children);
    },
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
      const React = require('react');
      return React.createElement('span', props, children);
    },
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const React = require('react');
      return React.createElement('section', props, children);
    },
    button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
      const React = require('react');
      return React.createElement('button', props, children);
    },
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const React = require('react');
      return React.createElement('h1', props, children);
    },
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const React = require('react');
      return React.createElement('h2', props, children);
    },
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
      const React = require('react');
      return React.createElement('p', props, children);
    },
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const React = require('react');
      return React.createElement('img', props);
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useInView: () => [null, false],
}));

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
