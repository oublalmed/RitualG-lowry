import Link from 'next/link';
import { Mail, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vérification email | Ritual Glowry',
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const hasToken = Boolean(params.token);

  return (
    <div className="w-full max-w-md bg-[#F5EDE0] rounded-2xl border border-[#C9A875]/20 shadow-xl px-8 py-10 text-center">
      {/* Logo */}
      <Link href="/" className="inline-block mb-8">
        <span
          className="text-2xl text-[#3D2B1F] tracking-wide"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Ritual<span className="text-[#C9A875]">Glowry</span>
        </span>
      </Link>

      {hasToken ? (
        /* Token present — verified state */
        <>
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          <h1
            className="text-3xl text-[#3D2B1F] mb-3"
            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
          >
            Email vérifié !
          </h1>
          <p className="font-inter text-sm text-[#3D2B1F]/60 mb-8">
            Votre compte est maintenant actif.
          </p>
          <Link
            href="/boutique"
            className="inline-block w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-wider py-3 rounded-lg transition-colors text-sm"
          >
            Accéder à la boutique
          </Link>
        </>
      ) : (
        /* No token — waiting state */
        <>
          <div className="flex justify-center mb-6">
            <Mail className="h-16 w-16 text-[#C9A875]" />
          </div>
          <h1
            className="text-3xl text-[#3D2B1F] mb-3"
            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
          >
            Vérifiez votre email
          </h1>
          <p className="font-inter text-sm text-[#3D2B1F]/60 mb-2">
            Un lien de confirmation a été envoyé à votre adresse email.
          </p>
          <p className="font-inter text-sm text-[#3D2B1F]/60 mb-8">
            Cliquez sur le lien dans l&apos;email pour activer votre compte.
          </p>
          <button
            type="button"
            className="w-full border border-[#3D2B1F] text-[#3D2B1F] hover:bg-[#3D2B1F]/5 font-inter font-semibold uppercase tracking-wider py-3 rounded-lg transition-colors text-sm mb-4"
          >
            Renvoyer l&apos;email
          </button>
          <Link
            href="/login"
            className="font-inter text-sm text-[#C9A875] hover:text-[#B8924B] transition-colors"
          >
            Retour à la connexion
          </Link>
        </>
      )}
    </div>
  );
}
