'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Package, ArrowRight, Loader2 } from 'lucide-react'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

interface SearchProduct {
  _id: string
  name: string
  slug: string
  basePrice: number
  image?: string | null
  category?: string | null
}

const POPULAR_SUGGESTIONS = [
  { label: 'Extensions lisses', href: '/boutique?textures=lisse' },
  { label: 'Perruques lace front', href: '/boutique?types=perruque' },
  { label: 'Extensions bouclées', href: '/boutique?textures=bouclée' },
]

function highlight(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#C9A875]/30 text-[#3D2B1F] not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [productResults, setProductResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 2) {
      setProductResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const json = await res.json()
          setProductResults(json.data ?? [])
        } else {
          setProductResults([])
        }
      } catch {
        setProductResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const allResults = productResults.map((p) => ({ href: `/produit/${p.slug}` }))

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      onClose()
    },
    [router, onClose]
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setProductResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor((c) => Math.min(c + 1, allResults.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => Math.max(c - 1, 0))
      }
      if (e.key === 'Enter' && allResults[cursor]) {
        navigate(allResults[cursor].href)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, allResults, cursor, navigate, onClose])

  useEffect(() => {
    setCursor(0)
  }, [productResults])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#1A1410]/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg mx-4"
            role="dialog"
            aria-label="Recherche"
          >
            <div className="bg-[#FAF6EF] border border-[#C9A875]/30 shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F5EDE0]">
                {loading ? (
                  <Loader2 className="h-5 w-5 text-[#C9A875] flex-shrink-0 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-[#3D2B1F]/50 flex-shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="flex-1 bg-transparent text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 font-inter text-sm focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Effacer">
                    <X className="h-4 w-4 text-[#3D2B1F]/50 hover:text-[#3D2B1F] transition-colors" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-xs font-inter text-[#3D2B1F]/50 hover:text-[#3D2B1F] transition-colors border border-[#F5EDE0] px-2 py-0.5 hidden sm:block"
                >
                  Échap
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.length < 2 ? (
                  /* Empty state / suggestions */
                  <div className="px-4 py-5">
                    <p className="text-xs font-inter font-semibold uppercase tracking-[0.1em] text-[#3D2B1F]/40 mb-3">
                      Suggestions populaires
                    </p>
                    <div className="flex flex-col gap-1">
                      {POPULAR_SUGGESTIONS.map((s) => (
                        <button
                          key={s.href}
                          onClick={() => navigate(s.href)}
                          className="flex items-center justify-between px-3 py-2.5 hover:bg-[#F5EDE0] transition-colors group text-left"
                        >
                          <span className="font-inter text-sm text-[#3D2B1F]">{s.label}</span>
                          <ArrowRight className="h-4 w-4 text-[#C9A875] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-xs font-inter text-[#3D2B1F]/40 mt-5">
                      Découvrez nos produits →{' '}
                      <button
                        onClick={() => navigate('/boutique')}
                        className="text-[#C9A875] hover:underline"
                      >
                        Voir la boutique
                      </button>
                    </p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-[#C9A875]" />
                  </div>
                ) : productResults.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <p className="font-inter text-sm text-[#3D2B1F]/60">
                      Aucun résultat pour &quot;{query}&quot;
                    </p>
                    <button
                      onClick={() => navigate('/boutique')}
                      className="mt-3 text-xs font-inter font-semibold text-[#C9A875] hover:underline"
                    >
                      Découvrez nos produits →
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-3.5 w-3.5 text-[#C9A875]" />
                      <p className="text-xs font-inter font-semibold uppercase tracking-[0.1em] text-[#3D2B1F]/50">
                        Produits
                      </p>
                    </div>
                    {productResults.map((p, i) => (
                      <button
                        key={p._id}
                        onClick={() => navigate(`/produit/${p.slug}`)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          cursor === i ? 'bg-[#F5EDE0]' : 'hover:bg-[#F5EDE0]/60'
                        }`}
                      >
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-sm text-[#3D2B1F] truncate">
                            {highlight(p.name, query)}
                          </p>
                          {p.category && (
                            <p className="text-xs text-[#3D2B1F]/50">{p.category}</p>
                          )}
                        </div>
                        <p className="text-sm font-inter font-semibold text-[#C9A875] flex-shrink-0">
                          {p.basePrice} €
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
