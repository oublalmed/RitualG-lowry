'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const schema = z
  .object({
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().min(2, 'Nom requis'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Au moins 8 caractères'),
    confirmPassword: z.string(),
    newsletter: z.boolean().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { newsletter: false } });

  const newsletter = watch('newsletter');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          newsletterOptIn: data.newsletter ?? false,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Une erreur est survenue.');
        setLoading(false);
        return;
      }
      // Auto sign-in
      await signIn('credentials', { email: data.email, password: data.password, redirect: false });
      router.push('/compte');
      router.refresh();
    } catch {
      setError('Une erreur est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#F5EDE0] rounded-2xl border border-[#C9A875]/20 shadow-xl px-8 py-10">
      <h1
        className="text-center text-3xl text-[#3D2B1F] mb-1"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Créer un compte
      </h1>
      <p className="text-center text-sm text-[#3D2B1F]/60 mb-8 font-inter">
        Rejoignez la communauté Ritual Glowry
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-[#3D2B1F] font-inter text-sm font-medium">
              Prénom
            </Label>
            <Input
              id="firstName"
              placeholder="Prénom"
              className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 focus:border-[#C9A875] text-[#1A1410]"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-[#3D2B1F] font-inter text-sm font-medium">
              Nom
            </Label>
            <Input
              id="lastName"
              placeholder="Nom"
              className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 focus:border-[#C9A875] text-[#1A1410]"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

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

        <div>
          <Label htmlFor="password" className="text-[#3D2B1F] font-inter text-sm font-medium">
            Mot de passe
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="bg-[#FAF6EF] border-[#C9A875]/30 focus:border-[#C9A875] text-[#1A1410] pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40 hover:text-[#3D2B1F]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-[#3D2B1F] font-inter text-sm font-medium">
            Confirmer le mot de passe
          </Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="bg-[#FAF6EF] border-[#C9A875]/30 focus:border-[#C9A875] text-[#1A1410] pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40 hover:text-[#3D2B1F]"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3 pt-1">
          <Checkbox
            id="newsletter"
            checked={newsletter ?? false}
            onCheckedChange={(v) => setValue('newsletter', v === true)}
            className="mt-0.5 border-[#C9A875]/40 data-[state=checked]:bg-[#C9A875] data-[state=checked]:border-[#C9A875]"
          />
          <label htmlFor="newsletter" className="text-sm text-[#3D2B1F]/70 font-inter leading-relaxed cursor-pointer">
            Je souhaite recevoir les offres exclusives et nouveautés Ritual Glowry
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-wider py-3 rounded-lg transition-colors disabled:opacity-60 mt-2"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="text-center text-sm text-[#3D2B1F]/60 mt-6 font-inter">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#C9A875] hover:text-[#B8924B] font-medium transition-colors">
          ← Se connecter
        </Link>
      </p>
    </div>
  );
}
