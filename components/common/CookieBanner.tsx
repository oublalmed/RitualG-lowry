'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type CookieConsent = {
  accepted: boolean
  analytics: boolean
  marketing: boolean
}

function loadConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('cookie-consent')
    if (!raw) return null
    return JSON.parse(raw) as CookieConsent
  } catch {
    return null
  }
}

function saveConsent(consent: CookieConsent) {
  if (typeof window === 'undefined') return
  localStorage.setItem('cookie-consent', JSON.stringify(consent))
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
  description,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#F5EDE0] last:border-0">
      <div>
        <p className="font-inter text-sm font-semibold text-[#3D2B1F]">{label}</p>
        <p className="font-inter text-xs text-[#3D2B1F]/60 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A875] ${
          checked ? 'bg-[#C9A875]' : 'bg-[#3D2B1F]/20'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function CookiePreferencesDialog({
  open,
  onClose,
  onSave,
  analytics,
  marketing,
  onChangeAnalytics,
  onChangeMarketing,
}: {
  open: boolean
  onClose: () => void
  onSave: () => void
  analytics: boolean
  marketing: boolean
  onChangeAnalytics: (v: boolean) => void
  onChangeMarketing: (v: boolean) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1410]/60 z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-[201] px-4"
          >
            <div className="bg-[#FAF6EF] border border-[#F5EDE0] shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5EDE0]">
                <h2 className="font-playfair italic text-[#3D2B1F] text-xl">
                  Préférences cookies
                </h2>
                <button onClick={onClose} aria-label="Fermer">
                  <X className="h-5 w-5 text-[#3D2B1F]/60 hover:text-[#3D2B1F] transition-colors" />
                </button>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm font-inter text-[#3D2B1F]/70 mb-4">
                  Gérez vos préférences de cookies. Certains cookies sont nécessaires au fonctionnement du site.
                </p>
                <Toggle
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                  label="Nécessaires"
                  description="Indispensables au fonctionnement du site (panier, session...)"
                />
                <Toggle
                  checked={analytics}
                  onChange={onChangeAnalytics}
                  label="Analytics"
                  description="Google Analytics — nous aide à améliorer notre site"
                />
                <Toggle
                  checked={marketing}
                  onChange={onChangeMarketing}
                  label="Marketing"
                  description="Publicité personnalisée selon vos centres d'intérêt"
                />
              </div>
              <div className="px-6 py-4 border-t border-[#F5EDE0]">
                <button
                  onClick={onSave}
                  className="w-full bg-[#C9A875] text-[#1A1410] text-sm font-inter font-semibold uppercase tracking-[0.1em] py-3 hover:bg-[#B8924B] transition-colors"
                >
                  Sauvegarder mes préférences
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const consent = loadConsent()
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  function acceptAll() {
    saveConsent({ accepted: true, analytics: true, marketing: true })
    setVisible(false)
  }

  function refuseAll() {
    saveConsent({ accepted: true, analytics: false, marketing: false })
    setVisible(false)
  }

  function savePreferences() {
    saveConsent({ accepted: true, analytics, marketing })
    setDialogOpen(false)
    setVisible(false)
  }

  return (
    <>
      <CookiePreferencesDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={savePreferences}
        analytics={analytics}
        marketing={marketing}
        onChangeAnalytics={setAnalytics}
        onChangeMarketing={setMarketing}
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[150] bg-[#F5EDE0] border-t-2 border-[#C9A875] shadow-2xl"
          >
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <p className="font-inter text-sm text-[#3D2B1F] flex-1">
                Nous utilisons des cookies pour améliorer votre expérience.{' '}
                <button
                  onClick={() => setDialogOpen(true)}
                  className="text-[#C9A875] hover:underline font-semibold"
                >
                  En savoir plus
                </button>
              </p>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={refuseAll}
                  className="px-4 py-2 text-sm font-inter font-semibold text-[#3D2B1F] border border-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-[#FAF6EF] transition-colors"
                >
                  Tout refuser
                </button>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="px-4 py-2 text-sm font-inter font-semibold text-[#3D2B1F] border border-[#F5EDE0] bg-white hover:border-[#C9A875] transition-colors"
                >
                  Personnaliser
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm font-inter font-semibold bg-[#C9A875] text-[#1A1410] hover:bg-[#B8924B] transition-colors"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
