import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col">
      <div className="flex justify-center pt-8 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-[var(--font-playfair)] italic text-2xl text-[#3D2B1F] tracking-wide"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Ritual Glowry
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
