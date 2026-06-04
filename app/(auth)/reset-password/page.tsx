'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

const schema = z.object({
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Les mots de passe ne correspondent pas', path: ['confirm'] });

type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password: data.password }),
      });
      const json = await res.json();
      if (res.ok) { setDone(true); setTimeout(() => router.push('/login'), 3000); }
      else setServerError(json.error ?? 'Erreur inconnue');
    } catch { setServerError('Erreur réseau.'); }
    finally { setLoading(false); }
  };

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-red-600 font-inter text-sm">Lien invalide ou manquant.</p>
        <Link href="/forgot-password" className="text-[#C9A875] text-sm mt-3 block hover:underline">Faire une nouvelle demande →</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-[#C9A875] mx-auto" />
        <p className="font-playfair italic text-xl text-[#3D2B1F]">Mot de passe réinitialisé !</p>
        <p className="text-sm font-inter text-[#3D2B1F]/60">Redirection vers la connexion…</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-playfair italic text-2xl text-[#3D2B1F] mb-2 text-center">Nouveau mot de passe</h1>
      <p className="text-sm font-inter text-[#3D2B1F]/60 mb-6 text-center">Choisissez un mot de passe sécurisé.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="font-inter text-sm text-[#3D2B1F]">Nouveau mot de passe *</Label>
          <div className="relative mt-1">
            <Input type={showPwd ? 'text' : 'password'} {...register('password')}
              className="bg-[#F5EDE0] border-[#3D2B1F]/15 pr-10" placeholder="Minimum 8 caractères" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <Label className="font-inter text-sm text-[#3D2B1F]">Confirmer le mot de passe *</Label>
          <Input type="password" {...register('confirm')} className="bg-[#F5EDE0] border-[#3D2B1F]/15 mt-1" placeholder="Répétez le mot de passe" />
          {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
        </div>

        {serverError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{serverError}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm py-4">
          {loading ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#F5EDE0] border border-[#C9A875]/20 p-8 shadow-sm">
        <div className="text-center mb-6">
          <Link href="/" className="font-playfair italic text-2xl text-[#3D2B1F]">Ritual Glowry</Link>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-[#3D2B1F]/50">Chargement…</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
