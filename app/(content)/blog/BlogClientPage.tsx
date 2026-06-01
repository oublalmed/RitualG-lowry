'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { mockBlogPosts, BlogPost } from '@/lib/mockData'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const CATEGORIES = ['Tous', 'Conseils', 'Tendances', 'Guides', 'Entretien', 'Inspiration']
const PER_PAGE = 6

function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr })
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col bg-white border border-[#F5EDE0] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {/* Image placeholder */}
      <div
        className="aspect-video w-full"
        style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }}
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <span className="inline-block bg-[#C9A875]/20 text-[#B8924B] text-[11px] font-inter font-semibold uppercase tracking-[0.1em] px-2 py-1 mb-3 self-start">
          {post.categories[0]}
        </span>

        {/* Title */}
        <h2 className="font-playfair italic text-[#3D2B1F] text-lg leading-snug mb-2 group-hover:text-[#C9A875] transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm font-inter text-[#3D2B1F]/60 leading-relaxed line-clamp-2 flex-1 mb-4">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs font-inter text-[#3D2B1F]/50 border-t border-[#F5EDE0] pt-3 mt-auto">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readTime} min de lecture</span>
        </div>
      </div>
    </motion.article>
  )
}

export function BlogClientPage() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [page, setPage] = useState(1)

  const filtered = activeCategory === 'Tous'
    ? mockBlogPosts
    : mockBlogPosts.filter((p) =>
        p.categories.some((c) => c.toLowerCase() === activeCategory.toLowerCase())
      )

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleCategory(cat: string) {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <>
      {/* Filter pills */}
      <section className="bg-[#FAF6EF] border-b border-[#F5EDE0]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-1.5 text-sm font-inter font-semibold rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#C9A875] text-[#1A1410]'
                    : 'bg-[#F5EDE0] text-[#3D2B1F] hover:bg-[#C9A875]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
        {paginated.length === 0 ? (
          <p className="text-center text-[#3D2B1F]/60 font-inter py-20">
            Aucun article dans cette catégorie.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-inter font-semibold text-[#3D2B1F] border border-[#F5EDE0] hover:border-[#C9A875] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 text-sm font-inter font-semibold transition-colors ${
                  page === n
                    ? 'bg-[#C9A875] text-[#1A1410]'
                    : 'border border-[#F5EDE0] text-[#3D2B1F] hover:border-[#C9A875]'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-inter font-semibold text-[#3D2B1F] border border-[#F5EDE0] hover:border-[#C9A875] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </section>
    </>
  )
}
