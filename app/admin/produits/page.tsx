import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Package, Eye } from 'lucide-react'
import { mockProducts } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'Produits | Admin Ritual Glowry',
}

export default function AdminProduitsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold italic"
            style={{ fontFamily: 'var(--font-playfair)', color: '#3D2B1F' }}
          >
            Gestion des Produits
          </h1>
          <p className="text-sm mt-1" style={{ color: '#3D2B1F', opacity: 0.6 }}>
            Les produits sont gérés via Sanity CMS
          </p>
        </div>
        <Link
          href="/studio"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest transition-all duration-200"
          style={{
            background: '#C9A875',
            color: '#1A1410',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.08em',
          }}
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir Sanity Studio
        </Link>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: '#FEF9EE', borderColor: '#C9A875' }}
      >
        <Package className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#C9A875' }} />
        <div>
          <p className="font-semibold text-sm" style={{ color: '#3D2B1F' }}>
            Gestion via Sanity CMS
          </p>
          <p className="text-sm mt-0.5" style={{ color: '#3D2B1F', opacity: 0.7 }}>
            Pour ajouter, modifier ou supprimer des produits, utilisez le Sanity Studio intégré.
            Les modifications sont reflétées en temps réel sur la boutique grâce à l&apos;ISR (revalidation toutes les heures).
          </p>
        </div>
      </div>

      {/* Read-only product preview */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: '#E8DDD0', background: '#FAF6EF' }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#E8DDD0', background: '#F5EDE0' }}
        >
          <h2 className="font-semibold" style={{ color: '#3D2B1F', fontFamily: 'var(--font-inter)' }}>
            Aperçu des produits ({mockProducts.length})
          </h2>
          <span className="text-xs" style={{ color: '#3D2B1F', opacity: 0.5 }}>Lecture seule</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E8DDD0' }}>
                {['Produit', 'Type', 'Texture', 'Prix de base', 'Stock', 'Statut', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#3D2B1F', opacity: 0.6, fontFamily: 'var(--font-inter)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product, i) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
                const isLowStock = totalStock <= 5
                const isOutOfStock = product.stockStatus === 'out_of_stock'

                return (
                  <tr
                    key={product._id}
                    className="transition-colors"
                    style={{
                      borderBottom: i < mockProducts.length - 1 ? '1px solid #E8DDD0' : 'none',
                    }}
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #3D2B1F, #C9A875)' }}
                        />
                        <div>
                          <p className="font-semibold" style={{ color: '#1A1410' }}>{product.name}</p>
                          <p className="text-xs" style={{ color: '#3D2B1F', opacity: 0.6 }}>
                            {product.variants.length} variante{product.variants.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: '#F5EDE0', color: '#3D2B1F' }}
                      >
                        {product.productType[0] ?? '—'}
                      </span>
                    </td>

                    {/* Texture */}
                    <td className="px-4 py-3" style={{ color: '#3D2B1F', opacity: 0.8 }}>
                      {product.texture.join(', ') || '—'}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: '#C9A875' }}>
                        {product.basePrice.toLocaleString('fr-MA')} MAD
                      </span>
                      {product.comparePrice && (
                        <span
                          className="ml-2 text-xs line-through"
                          style={{ color: '#C9A8A0' }}
                        >
                          {product.comparePrice.toLocaleString('fr-MA')}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className="font-medium"
                        style={{ color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#22c55e' }}
                      >
                        {totalStock} unités
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: isOutOfStock
                            ? '#fee2e2'
                            : isLowStock
                            ? '#fef3c7'
                            : '#dcfce7',
                          color: isOutOfStock
                            ? '#dc2626'
                            : isLowStock
                            ? '#d97706'
                            : '#16a34a',
                        }}
                      >
                        {isOutOfStock ? 'Rupture' : isLowStock ? 'Stock faible' : 'En stock'}
                      </span>
                      {product.isNew && (
                        <span
                          className="ml-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{ background: '#FEF9EE', color: '#C9A875' }}
                        >
                          NEW
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/produit/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#3D2B1F' }}
                          title="Voir sur la boutique"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href="/studio"
                          target="_blank"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#C9A875' }}
                          title="Modifier dans Sanity"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sanity Studio CTA */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #3D2B1F, #1A1410)' }}
      >
        <Package className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A875' }} />
        <h3
          className="text-xl font-bold italic mb-2"
          style={{ fontFamily: 'var(--font-playfair)', color: '#FAF6EF' }}
        >
          Gérez vos produits avec Sanity Studio
        </h3>
        <p className="text-sm mb-6" style={{ color: '#FAF6EF', opacity: 0.7 }}>
          Interface no-code pour ajouter des produits, variantes, images et descriptions.
        </p>
        <Link
          href="/studio"
          target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold uppercase tracking-widest transition-all duration-200 hover:opacity-90"
          style={{
            background: '#C9A875',
            color: '#1A1410',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.08em',
          }}
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir Sanity Studio
        </Link>
      </div>
    </div>
  )
}
