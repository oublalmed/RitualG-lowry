'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({ email: z.string().email('Email invalide') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md bg-[#F5EDE0] rounded-2xl border border-[#C9A875]/20 shadow-xl px-8 py-12 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-14 w-14 text-[#C9A875]" strokeWidth={1.5} />
        </div>
        <h1
          className="text-2xl text-[#3D2B1F] mb-2"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Email envoyé !
        </h1>
        <p className="text-sm text-[#3D2B1F]/60 font-inter mb-6">
          Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation
          dans quelques minutes.
        </p>
        <Link
          href="/login"
          className="text-sm text-[#C9A875] hover:text-[#B8924B] font-inter font-medium transition-colors"
        >
          ← Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-[#F5EDE0] rounded-2xl border border-[#C9A875]/20 shadow-xl px-8 py-10">
      <h1
        className="text-center text-3xl text-[#3D2B1F] mb-1"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Mot de passe oublié
      </h1>
      <p className="text-center text-sm text-[#3D2B1F]/60 mb-8 font-inter">
        Entrez votre email pour recevoir un lien de réinitialisation
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-[#3D2B1F] font-inter text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 focus:border-[#C9A875] text-[#1A1410]"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-wider py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </Button>
      </form>

      <p className="text-center text-sm text-[#3D2B1F]/60 mt-6 font-inter">
        <Link href="/login" className="text-[#C9A875] hover:text-[#B8924B] font-medium transition-colors">
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
