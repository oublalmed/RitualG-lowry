import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className={`flex items-center gap-1.5 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-[#3D2B1F]/30 flex-shrink-0" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-xs font-inter text-[#3D2B1F]/60 hover:text-[#C9A875] transition-colors uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-xs font-inter uppercase tracking-widest ${
                  isLast ? 'text-[#3D2B1F]/40' : 'text-[#3D2B1F]/60'
                }`}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
