'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Package,
  MapPin,
  Heart,
  Star,
  User,
  Mail,
  LogOut,
} from 'lucide-react';

const navLinks = [
  { href: '/compte/commandes', icon: Package, label: 'Mes commandes' },
  { href: '/compte/adresses', icon: MapPin, label: 'Mes adresses' },
  { href: '/compte/favoris', icon: Heart, label: 'Mes favoris' },
  { href: '/compte/points', icon: Star, label: 'Mes points' },
  { href: '/compte/informations', icon: User, label: 'Mes informations' },
  { href: '/compte/newsletter', icon: Mail, label: 'Newsletter' },
];

const tierColors: Record<string, string> = {
  BRONZE: 'bg-[#C9A875]/20 text-[#B8924B]',
  SILVER: 'bg-gray-200 text-gray-600',
  GOLD: 'bg-[#C9A875]/40 text-[#B8924B] font-semibold',
  PLATINUM: 'bg-[#3D2B1F]/10 text-[#3D2B1F] font-semibold',
};

function getInitials(name?: string | null) {
  if (!name) return 'C';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const tier = 'BRONZE'; // would come from session extended data
  const points = 127; // mock

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-screen bg-[#F5EDE0] border-r border-[#C9A875]/15 sticky top-0 h-screen overflow-y-auto">
        {/* User info */}
        <div className="px-6 py-8 border-b border-[#C9A875]/15">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#3D2B1F] flex items-center justify-center flex-shrink-0">
              <span className="text-[#FAF6EF] font-inter font-semibold text-base">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-inter font-semibold text-[#3D2B1F] text-sm truncate">
                {user?.name ?? 'Cliente'}
              </p>
              <p className="text-xs text-[#3D2B1F]/50 truncate font-inter">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-inter ${tierColors[tier] ?? tierColors.BRONZE}`}
            >
              {tier.charAt(0) + tier.slice(1).toLowerCase()}
            </span>
            <span className="text-xs text-[#3D2B1F]/60 font-inter">{points} pts</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navLinks.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter transition-colors ${
                  active
                    ? 'bg-[#C9A875]/15 text-[#3D2B1F] font-medium'
                    : 'text-[#3D2B1F]/70 hover:bg-[#C9A875]/10 hover:text-[#3D2B1F]'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-[#C9A875]/15">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-inter text-[#3D2B1F]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 bg-[#FAF6EF]">
        {/* Mobile nav */}
        <div className="md:hidden border-b border-[#C9A875]/15 bg-[#F5EDE0] px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 w-max">
            {navLinks.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#C9A875]/20 text-[#3D2B1F] font-medium'
                      : 'text-[#3D2B1F]/60 hover:bg-[#C9A875]/10'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
