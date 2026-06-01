'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Loader2 } from 'lucide-react'

const contactSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Adresse email invalide'),
  subject: z.enum(['commande', 'produit', 'livraison', 'autre'], {
    error: () => ({ message: 'Veuillez sélectionner un sujet' }),
  }),
  message: z.string().min(20, 'Message trop court (min. 20 caractères)'),
})

type ContactFormData = z.infer<typeof contactSchema>

const subjects = [
  { value: 'commande', label: 'Commande' },
  { value: 'produit', label: 'Produit' },
  { value: 'livraison', label: 'Livraison' },
  { value: 'autre', label: 'Autre' },
] as const

export function ContactForm() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de l\'envoi')
      setSuccess(true)
      reset()
    } catch {
      setServerError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-[#C9A875]/15 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-[#C9A875]" />
        </div>
        <h3 className="font-playfair italic text-[#3D2B1F] text-2xl mb-2">
          Message envoyé !
        </h3>
        <p className="font-inter text-[#3D2B1F]/70 text-sm mb-6">
          Nous vous répondrons dans les 24h ouvrées.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm font-inter font-semibold text-[#C9A875] hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F]/70 mb-1.5">
            Prénom <span className="text-[#C9A875]">*</span>
          </label>
          <input
            {...register('firstName')}
            type="text"
            placeholder="Fatima"
            className="w-full px-3 py-2.5 border border-[#F5EDE0] bg-white text-sm font-inter text-[#3D2B1F] placeholder:text-[#3D2B1F]/30 focus:outline-none focus:border-[#C9A875] transition-colors"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F]/70 mb-1.5">
            Nom <span className="text-[#C9A875]">*</span>
          </label>
          <input
            {...register('lastName')}
            type="text"
            placeholder="Benali"
            className="w-full px-3 py-2.5 border border-[#F5EDE0] bg-white text-sm font-inter text-[#3D2B1F] placeholder:text-[#3D2B1F]/30 focus:outline-none focus:border-[#C9A875] transition-colors"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F]/70 mb-1.5">
          Email <span className="text-[#C9A875]">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="votre@email.com"
          className="w-full px-3 py-2.5 border border-[#F5EDE0] bg-white text-sm font-inter text-[#3D2B1F] placeholder:text-[#3D2B1F]/30 focus:outline-none focus:border-[#C9A875] transition-colors"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F]/70 mb-1.5">
          Sujet <span className="text-[#C9A875]">*</span>
        </label>
        <select
          {...register('subject')}
          defaultValue=""
          className="w-full px-3 py-2.5 border border-[#F5EDE0] bg-white text-sm font-inter text-[#3D2B1F] focus:outline-none focus:border-[#C9A875] transition-colors appearance-none"
        >
          <option value="" disabled>Choisissez un sujet...</option>
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#3D2B1F]/70 mb-1.5">
          Message <span className="text-[#C9A875]">*</span>
        </label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Décrivez votre demande..."
          className="w-full px-3 py-2.5 border border-[#F5EDE0] bg-white text-sm font-inter text-[#3D2B1F] placeholder:text-[#3D2B1F]/30 focus:outline-none focus:border-[#C9A875] transition-colors resize-none"
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 font-inter">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#C9A875] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.12em] text-sm py-3.5 hover:bg-[#B8924B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi...
          </>
        ) : (
          'Envoyer'
        )}
      </button>
    </form>
  )
}
