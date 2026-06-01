'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  Users,
  Star,
  Gift,
  Mail,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
} from 'lucide-react';

const navSections = [
  {
    title: 'PRINCIPAL',
    links: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { href: '/admin/commandes', icon: Package, label: 'Commandes' },
      { href: '/admin/clientes', icon: Users, label: 'Clientes' },
      { href: '/admin/avis', icon: Star, label: 'Avis' },
    ],
  },
  {
    title: 'MARKETING',
    links: [
      { href: '/admin/promos', icon: Gift, label: 'Codes Promo' },
      { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
    ],
  },
  {
    title: 'PARAMÈTRES',
    links: [
      { href: '/admin/parametres', icon: Settings, label: 'Paramètres' },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

function getBreadcrumb(pathname: string) {
  const map: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/commandes': 'Commandes',
    '/admin/clientes': 'Clientes',
    '/admin/avis': 'Avis',
    '/admin/promos': 'Codes Promo',
    '/admin/newsletter': 'Newsletter',
    '/admin/parametres': 'Paramètres',
  };
  return map[pathname] ?? map[Object.keys(map).find((k) => pathname.startsWith(k + '/')) ?? ''] ?? 'Admin';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-screen bg-[#3D2B1F] text-[#FAF6EF] sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#FAF6EF]/10">
          <Link href="/admin">
            <span
              className="text-xl text-[#C9A875]"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Ritual Glowry
            </span>
            <span className="block text-xs font-inter text-[#FAF6EF]/40 mt-0.5 uppercase tracking-widest">
              Administration
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[10px] font-inter font-semibold uppercase tracking-widest text-[#FAF6EF]/30">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.links.map(({ href, icon: Icon, label, exact }) => {
                  const active = isActive(pathname, href, exact);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter transition-colors ${
                        active
                          ? 'bg-[#C9A875]/20 text-[#C9A875] font-medium'
                          : 'text-[#FAF6EF]/60 hover:bg-[#FAF6EF]/5 hover:text-[#FAF6EF]'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin user */}
        <div className="px-3 py-4 border-t border-[#FAF6EF]/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="h-8 w-8 rounded-full bg-[#C9A875]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#C9A875] text-xs font-inter font-semibold">
                {session?.user?.name?.charAt(0) ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-inter font-medium text-[#FAF6EF]/80 truncate">
                {session?.user?.name ?? 'Admin'}
              </p>
              <p className="text-xs font-inter text-[#FAF6EF]/40 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-inter text-[#FAF6EF]/40 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-[#FAF6EF] border-b border-[#C9A875]/15 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm font-inter text-[#3D2B1F]/50">
            <Link href="/admin" className="hover:text-[#3D2B1F] transition-colors">
              Admin
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#3D2B1F] font-medium">{getBreadcrumb(pathname)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-[#F5EDE0] text-[#3D2B1F]/60 hover:text-[#3D2B1F] transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-8 w-8 rounded-full bg-[#3D2B1F] flex items-center justify-center">
              <span className="text-[#FAF6EF] text-xs font-inter font-semibold">
                {session?.user?.name?.charAt(0) ?? 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-[#FAF6EF]">{children}</main>
      </div>
    </div>
  );
}
