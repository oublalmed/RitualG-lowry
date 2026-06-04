'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Shield, Truck, Zap, Star, Tag } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/stores/cartStore';

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const identificationSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('login'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
  }),
  z.object({
    mode: z.literal('guest'),
    email: z.string().email('Email invalide'),
    password: z.string().optional(),
  }),
  z.object({
    mode: z.literal('register'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
    confirmPassword: z.string(),
  }),
]).superRefine((val, ctx) => {
  if (val.mode === 'register' && val.password !== val.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }
});

const shippingSchema = z.object({
  civility: z.enum(['M.', 'Mme']),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Téléphone requis'),
  address: z.string().min(5, 'Adresse requise'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(4, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis'),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'PREMIUM']),
});

type IdentificationFormData = z.infer<typeof identificationSchema>;
type ShippingFormData = z.infer<typeof shippingSchema>;

// ─── Stripe setup ─────────────────────────────────────────────────────────────

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// ─── Shipping config ──────────────────────────────────────────────────────────

const SHIPPING_OPTIONS = [
  {
    id: 'STANDARD' as const,
    label: 'Standard',
    days: '5-7',
    price: 50,
    freeAbove: 1200,
    icon: Truck,
  },
  {
    id: 'EXPRESS' as const,
    label: 'Express',
    days: '2-3',
    price: 100,
    freeAbove: null,
    icon: Zap,
  },
  {
    id: 'PREMIUM' as const,
    label: 'Premium 24h',
    days: '1',
    price: 200,
    freeAbove: null,
    icon: Star,
  },
];

function getEstimatedDelivery(days: string): string {
  const today = new Date();
  const minDays = parseInt(days.split('-')[0]);
  const maxDays = days.includes('-') ? parseInt(days.split('-')[1]) : minDays;
  const minDate = new Date(today);
  const maxDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  maxDate.setDate(today.getDate() + maxDays);
  const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' });
  if (minDays === maxDays) return fmt.format(minDate);
  return `${fmt.format(minDate)} – ${fmt.format(maxDate)}`;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const STEPS = ['Identification', 'Livraison', 'Paiement'];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, idx) => {
        const isActive = idx === current;
        const isDone = idx < current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-inter font-semibold transition-all duration-300 ${
                  isDone
                    ? 'bg-[#C9A875] text-[#1A1410]'
                    : isActive
                    ? 'bg-[#C9A875] text-[#1A1410] ring-4 ring-[#C9A875]/30'
                    : 'bg-[#F5EDE0] text-[#3D2B1F]/40 border border-[#3D2B1F]/20'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`mt-1.5 text-xs font-inter whitespace-nowrap ${
                  isActive ? 'text-[#3D2B1F] font-semibold' : 'text-[#3D2B1F]/40'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-px mx-1 mb-5 transition-all duration-300 ${
                  idx < current ? 'bg-[#C9A875]' : 'bg-[#3D2B1F]/15'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Identification ───────────────────────────────────────────────────

interface StepIdentProps {
  onNext: (email: string) => void;
  guestEmail: string | null;
  sessionName: string | null;
}

function StepIdentification({ onNext, guestEmail, sessionName }: StepIdentProps) {
  const [mode, setMode] = useState<'login' | 'guest' | 'register'>('guest');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IdentificationFormData>({
    resolver: zodResolver(identificationSchema),
    defaultValues: { mode: 'guest', email: guestEmail ?? '' } as IdentificationFormData,
  });

  const currentMode = watch('mode' as keyof IdentificationFormData) as string;

  useEffect(() => {
    (setValue as (name: string, value: string) => void)('mode', mode);
  }, [mode, setValue]);

  const onSubmit = async (data: IdentificationFormData) => {
    setAuthError(null);
    setSubmitting(true);
    try {
      if (mode === 'register') {
        // Create account then proceed
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: (data as any).password, name: data.email.split('@')[0] }),
        });
        const json = await res.json();
        if (!res.ok) {
          setAuthError(json.error ?? 'Erreur lors de la création du compte');
          return;
        }
      }
      onNext(data.email);
    } catch {
      setAuthError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionName) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-[#F5EDE0] border border-[#C9A875]/30 rounded-sm p-6 mb-6 text-center">
          <p className="font-playfair italic text-xl text-[#3D2B1F] mb-1">
            Bonjour, {sessionName} 👋
          </p>
          <p className="text-sm font-inter text-[#3D2B1F]/60">
            Vous êtes connecté(e). Continuez vers la livraison.
          </p>
        </div>
        <button
          onClick={() => onNext('')}
          className="w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm py-4 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          Continuer <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      {/* Mode cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(
          [
            { id: 'login', label: "J'ai un compte" },
            { id: 'guest', label: 'Invité' },
            { id: 'register', label: 'Créer un compte' },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`py-3 px-2 text-xs font-inter font-semibold border transition-all duration-200 text-center ${
              mode === id
                ? 'border-[#C9A875] bg-[#C9A875]/10 text-[#3D2B1F]'
                : 'border-[#3D2B1F]/15 bg-white text-[#3D2B1F]/50 hover:border-[#C9A875]/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('mode')} value={mode} />

        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            placeholder="votre@email.com"
          />
          {'email' in (errors as Record<string, unknown>) && (
            <p className="text-xs text-red-500 mt-1">
              {(errors as Record<string, { message?: string }>).email?.message}
            </p>
          )}
        </div>

        {(mode === 'login' || mode === 'register') && (
          <div>
            <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
              Mot de passe *
            </label>
            <input
              {...register('password')}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
              placeholder="••••••••"
            />
            {'password' in (errors as Record<string, unknown>) && (
              <p className="text-xs text-red-500 mt-1">
                {(errors as Record<string, { message?: string }>).password?.message}
              </p>
            )}
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
              Confirmer le mot de passe *
            </label>
            <input
              {...register('confirmPassword' as keyof IdentificationFormData)}
              type="password"
              autoComplete="new-password"
              className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
              placeholder="••••••••"
            />
            {'confirmPassword' in (errors as Record<string, unknown>) && (
              <p className="text-xs text-red-500 mt-1">
                {(errors as Record<string, { message?: string }>).confirmPassword?.message}
              </p>
            )}
          </div>
        )}

        {authError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 font-inter">
            {authError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#C9A875] hover:bg-[#B8924B] disabled:opacity-60 text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm py-4 transition-colors duration-300 flex items-center justify-center gap-2 mt-2"
        >
          {submitting ? 'Création du compte...' : <>Continuer <ChevronRight className="h-4 w-4" /></>}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Step 2: Livraison ────────────────────────────────────────────────────────

interface StepShippingProps {
  onNext: (data: ShippingFormData) => void;
  onBack: () => void;
  defaultValues?: Partial<ShippingFormData>;
}

function StepShipping({ onNext, onBack, defaultValues }: StepShippingProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: 'MA',
      shippingMethod: 'STANDARD',
      civility: 'Mme',
      ...defaultValues,
    },
  });

  const selectedMethod = watch('shippingMethod');
  const { getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  const getShippingCost = (method: 'STANDARD' | 'EXPRESS' | 'PREMIUM') => {
    if (method === 'STANDARD' && subtotal >= 1200) return 0;
    return SHIPPING_OPTIONS.find((o) => o.id === method)?.price ?? 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <form onSubmit={handleSubmit((data) => onNext(data as ShippingFormData))} className="space-y-5">
        {/* Civility */}
        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-2">
            Civilité *
          </label>
          <div className="flex gap-4">
            {(['M.', 'Mme'] as const).map((civ) => (
              <label key={civ} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('civility')}
                  value={civ}
                  className="accent-[#C9A875]"
                />
                <span className="text-sm font-inter text-[#3D2B1F]">{civ}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
              Prénom *
            </label>
            <input
              {...register('firstName')}
              className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
              Nom *
            </label>
            <input
              {...register('lastName')}
              className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
            Téléphone *
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            placeholder="+212 6 00 00 00 00"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
            Adresse *
          </label>
          <input
            {...register('address')}
            className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
            Complément d&apos;adresse
          </label>
          <input
            {...register('addressLine2')}
            className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            placeholder="Appartement, étage, bâtiment..."
          />
        </div>

        {/* City / Postal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
              Ville *
            </label>
            <input
              {...register('city')}
              className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
              Code postal *
            </label>
            <input
              {...register('postalCode')}
              className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1.5">
            Pays *
          </label>
          <select
            {...register('country')}
            className="w-full border border-[#3D2B1F]/20 bg-white px-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors"
          >
            <option value="MA">Maroc</option>
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="TN">Tunisie</option>
            <option value="DZ">Algérie</option>
          </select>
        </div>

        {/* Shipping methods */}
        <div>
          <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider mb-3">
            Mode de livraison *
          </label>
          <div className="space-y-3">
            {SHIPPING_OPTIONS.map((option) => {
              const cost = getShippingCost(option.id);
              const Icon = option.icon;
              const isSelected = selectedMethod === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#C9A875] bg-[#C9A875]/8'
                      : 'border-[#3D2B1F]/15 bg-white hover:border-[#C9A875]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      {...register('shippingMethod')}
                      value={option.id}
                      className="accent-[#C9A875]"
                    />
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#C9A875]' : 'text-[#3D2B1F]/40'}`} />
                    <div>
                      <p className="text-sm font-inter font-semibold text-[#3D2B1F]">
                        {option.label} · {option.days} j ouvrés
                      </p>
                      <p className="text-xs font-inter text-[#3D2B1F]/50">
                        Livraison estimée : {getEstimatedDelivery(option.days)}
                      </p>
                      {option.freeAbove && (
                        <p className="text-xs font-inter text-[#C9A875]">
                          Gratuit dès {option.freeAbove.toLocaleString('fr-MA')} MAD
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-inter font-semibold text-sm text-[#3D2B1F]">
                    {cost === 0 ? (
                      <span className="text-green-600">Offert</span>
                    ) : (
                      `${cost} MAD`
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-6 py-3 border border-[#3D2B1F]/20 text-[#3D2B1F] font-inter text-sm hover:border-[#3D2B1F] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Retour
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm py-3 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Continuer <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Promo Code ───────────────────────────────────────────────────────────────

interface PromoResult {
  isValid: boolean;
  discountAmount: number;
  message: string;
  code: string;
}

function PromoCodeInput({
  subtotal,
  onPromo,
}: {
  subtotal: number;
  onPromo: (result: PromoResult | null) => void;
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromoResult | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), total: subtotal }),
      });
      const data = (await res.json()) as PromoResult & { isValid: boolean; message: string };
      const promoResult: PromoResult = {
        isValid: data.isValid,
        discountAmount: data.discountAmount ?? 0,
        message: data.message,
        code: code.trim().toUpperCase(),
      };
      setResult(promoResult);
      onPromo(promoResult.isValid ? promoResult : null);
    } catch {
      setResult({ isValid: false, discountAmount: 0, message: 'Erreur de validation', code });
      onPromo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setResult(null);
    onPromo(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-inter font-semibold text-[#3D2B1F] uppercase tracking-wider">
        Code promo
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3D2B1F]/30" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={result?.isValid}
            placeholder="GLOWRY10"
            className="w-full border border-[#3D2B1F]/20 bg-white pl-9 pr-4 py-3 text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors disabled:opacity-50"
          />
        </div>
        {result?.isValid ? (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-3 border border-red-300 text-red-500 font-inter text-xs hover:bg-red-50 transition-colors"
          >
            Retirer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-5 py-3 bg-[#3D2B1F] text-[#FAF6EF] font-inter text-xs font-semibold uppercase tracking-wider hover:bg-[#1A1410] disabled:opacity-40 transition-colors"
          >
            {loading ? '...' : 'Appliquer'}
          </button>
        )}
      </div>
      {result && (
        <p className={`text-xs font-inter ${result.isValid ? 'text-green-600' : 'text-red-500'}`}>
          {result.isValid ? `✓ ${result.message} — −${result.discountAmount} MAD` : result.message}
        </p>
      )}
    </div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────

interface OrderSummaryProps {
  shippingMethod: 'STANDARD' | 'EXPRESS' | 'PREMIUM' | null;
  promo: PromoResult | null;
}

function OrderSummary({ shippingMethod, promo }: OrderSummaryProps) {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  const getShippingCost = () => {
    if (!shippingMethod) return 0;
    if (shippingMethod === 'STANDARD' && subtotal >= 1200) return 0;
    return SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)?.price ?? 0;
  };

  const shipping = getShippingCost();
  const discount = promo?.discountAmount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <div className="bg-[#F5EDE0] p-6 sticky top-24">
      <h3 className="font-playfair italic text-lg text-[#3D2B1F] mb-4">
        Récapitulatif
      </h3>
      <ul className="space-y-3 mb-4 max-h-52 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 text-sm">
            <span className="font-inter text-[#3D2B1F]/80 leading-snug">
              {item.name}
              <span className="block text-xs text-[#3D2B1F]/50">{item.variantLabel} × {item.quantity}</span>
            </span>
            <span className="font-inter font-semibold text-[#3D2B1F] whitespace-nowrap">
              {(item.price * item.quantity).toLocaleString('fr-MA')} MAD
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-[#3D2B1F]/15 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-inter text-[#3D2B1F]/60">Sous-total</span>
          <span className="font-inter text-[#3D2B1F]">{subtotal.toLocaleString('fr-MA')} MAD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-inter text-[#3D2B1F]/60">Livraison</span>
          <span className="font-inter text-[#3D2B1F]">
            {shipping === 0 ? <span className="text-green-600">Offert</span> : `${shipping} MAD`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-inter text-[#C9A8A0]">Code promo ({promo?.code})</span>
            <span className="font-inter text-[#C9A8A0] line-through">−{discount} MAD</span>
          </div>
        )}
        <div className="border-t border-[#3D2B1F]/15 pt-3 flex justify-between">
          <span className="font-inter font-bold text-[#3D2B1F]">Total</span>
          <span className="font-playfair font-bold text-xl text-[#1A1410]">
            {total.toLocaleString('fr-MA')} MAD
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-inter text-[#3D2B1F]/50">
        <Shield className="h-3.5 w-3.5 text-[#C9A875]" />
        Paiement 100% sécurisé
      </div>
    </div>
  );
}

// ─── Stripe Payment Form ───────────────────────────────────────────────────────

interface StripeFormProps {
  clientSecret: string;
  orderId: string;
  total: number;
  onBack: () => void;
}

function StripePaymentForm({ clientSecret: _clientSecret, orderId: _orderId, total, onBack }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clear } = useCartStore();

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Erreur de paiement');
      setLoading(false);
      return;
    }
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });
    if (confirmError) {
      setError(confirmError.message ?? 'Paiement refusé');
      setLoading(false);
    } else {
      clear();
    }
  };

  return (
    <div className="space-y-6">
      <PaymentElement />
      {error && (
        <p className="text-sm text-red-500 font-inter">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-6 py-3 border border-[#3D2B1F]/20 text-[#3D2B1F] font-inter text-sm hover:border-[#3D2B1F] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Retour
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading || !stripe}
          className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] disabled:opacity-50 text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm py-4 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {loading ? 'Traitement...' : `Payer ${total.toLocaleString('fr-MA')} MAD`}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Paiement ─────────────────────────────────────────────────────────

interface StepPaymentProps {
  shippingData: ShippingFormData;
  guestEmail: string;
  onBack: () => void;
  onPromoChange?: (promo: PromoResult | null) => void;
}

function StepPayment({ shippingData, guestEmail, onBack, onPromoChange }: StepPaymentProps) {
  const [sameBilling, setSameBilling] = useState(true);
  const [promo, setPromo] = useState<PromoResult | null>(null);

  const handlePromoChange = (p: PromoResult | null) => {
    setPromo(p);
    onPromoChange?.(p);
  };
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const hasCreatedRef = useRef(false);
  const { items, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();

  const getShippingCost = () => {
    if (shippingData.shippingMethod === 'STANDARD' && subtotal >= 1200) return 0;
    return SHIPPING_OPTIONS.find((o) => o.id === shippingData.shippingMethod)?.price ?? 0;
  };

  const discount = promo?.discountAmount ?? 0;
  const shippingCost = getShippingCost();
  const computedTotal = Math.max(0, subtotal + shippingCost - discount);

  const createPaymentIntent = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            sanityProductId: i.sanityProductId,
            sanityVariantId: i.sanityVariantId,
            quantity: i.quantity,
            variantLabel: i.variantLabel,
          })),
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            phone: shippingData.phone,
            address: shippingData.address,
            addressLine2: shippingData.addressLine2,
            city: shippingData.city,
            postalCode: shippingData.postalCode,
            country: shippingData.country,
          },
          shippingMethod: shippingData.shippingMethod,
          promoCode: promo?.code ?? null,
          guestEmail: guestEmail || null,
          existingOrderId: orderId ?? undefined,
        }),
      });
      const data = (await res.json()) as {
        clientSecret?: string;
        orderId?: string;
        total?: number;
        error?: string;
      };
      if (!res.ok || data.error) {
        setApiError(data.error ?? 'Erreur lors de la création de la commande');
        return;
      }
      setClientSecret(data.clientSecret ?? null);
      setOrderId(data.orderId ?? null);
      setTotal(data.total ?? computedTotal);
    } catch {
      setApiError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Create payment intent on mount
  useEffect(() => {
    if (hasCreatedRef.current) return;
    hasCreatedRef.current = true;
    void createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When promo changes after initial PI creation: update the Stripe PI amount
  // We do NOT recreate the order — we just update the existing PI's amount via the API
  const prevPromoRef = useRef<string | null>(null);
  useEffect(() => {
    const newCode = promo?.code ?? null;
    if (prevPromoRef.current === newCode) return;
    prevPromoRef.current = newCode;
    if (!hasCreatedRef.current) return; // initial PI not yet created
    // Reset client secret so Stripe Elements reload with new amount
    setClientSecret(null);
    void createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      {/* Billing address toggle */}
      <div className="flex items-center gap-3 p-4 bg-[#F5EDE0]/60 border border-[#3D2B1F]/10">
        <input
          type="checkbox"
          id="same-billing"
          checked={sameBilling}
          onChange={(e) => setSameBilling(e.target.checked)}
          className="accent-[#C9A875] w-4 h-4"
        />
        <label htmlFor="same-billing" className="text-sm font-inter text-[#3D2B1F] cursor-pointer">
          Même adresse que la livraison
        </label>
      </div>

      {/* Promo code */}
      <PromoCodeInput subtotal={subtotal} onPromo={handlePromoChange} />

      {/* Stripe or demo */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-600 font-inter">
          {apiError}
          <button
            onClick={() => void createPaymentIntent()}
            className="ml-2 underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {loading && (
        <div className="py-8 text-center text-sm font-inter text-[#3D2B1F]/50">
          Préparation du paiement...
        </div>
      )}

      {!loading && !apiError && clientSecret && stripePromise ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#C9A875',
                colorBackground: '#FAF6EF',
                colorText: '#3D2B1F',
                borderRadius: '0px',
                fontFamily: 'Inter, sans-serif',
              },
            },
          }}
        >
          <StripePaymentForm
            clientSecret={clientSecret}
            orderId={orderId ?? ''}
            total={computedTotal}
            onBack={onBack}
          />
        </Elements>
      ) : !loading && !apiError && !stripePublishableKey ? (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-sm space-y-3">
          <p className="text-sm font-inter font-semibold text-amber-800">
            Mode démo — Stripe non configuré
          </p>
          <p className="text-xs font-inter text-amber-700">
            Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans votre .env pour activer le paiement.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-6 py-3 border border-[#3D2B1F]/20 text-[#3D2B1F] font-inter text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Retour
            </button>
            <button
              disabled
              className="flex-1 bg-[#C9A875]/50 text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm py-3 cursor-not-allowed"
            >
              Payer {computedTotal.toLocaleString('fr-MA')} MAD
            </button>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

// ─── Main CheckoutClient ──────────────────────────────────────────────────────

export function CheckoutClient() {
  const [step, setStep] = useState(0);
  const [guestEmail, setGuestEmail] = useState('');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [activePromo, setActivePromo] = useState<PromoResult | null>(null);
  const { items } = useCartStore();

  // TODO: Replace with actual session check
  const sessionName: string | null = null;

  if (items.length === 0 && step < 2) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center px-6 py-20">
        <p className="font-playfair italic text-2xl text-[#3D2B1F] mb-4">
          Votre panier est vide
        </p>
        <a
          href="/boutique"
          className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm px-8 py-4 transition-colors duration-300"
        >
          Découvrir la boutique
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Brand header */}
        <div className="text-center mb-10">
          <h1 className="font-playfair italic text-3xl text-[#3D2B1F]">
            Ritual Glowry
          </h1>
          <p className="text-xs font-inter text-[#3D2B1F]/40 uppercase tracking-widest mt-1">
            Finaliser ma commande
          </p>
        </div>

        <ProgressBar current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step-0" exit={{ opacity: 0, x: -20 }}>
                  <StepIdentification
                    onNext={(email) => {
                      setGuestEmail(email);
                      setStep(1);
                    }}
                    guestEmail={guestEmail}
                    sessionName={sessionName}
                  />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="step-1" exit={{ opacity: 0, x: -20 }}>
                  <StepShipping
                    onNext={(data) => {
                      setShippingData(data);
                      setStep(2);
                    }}
                    onBack={() => setStep(0)}
                    defaultValues={shippingData ?? undefined}
                  />
                </motion.div>
              )}
              {step === 2 && shippingData && (
                <motion.div key="step-2" exit={{ opacity: 0, x: -20 }}>
                  <StepPayment
                    shippingData={shippingData}
                    guestEmail={guestEmail}
                    onBack={() => setStep(1)}
                    onPromoChange={setActivePromo}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              shippingMethod={shippingData?.shippingMethod ?? null}
              promo={activePromo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
