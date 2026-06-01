'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Clock, User, Share2 } from 'lucide-react'
import type { BlogPost } from '@/lib/mockData'

function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr })
}

export function ArticleClient({ post }: { post: BlogPost }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const encodedTitle = encodeURIComponent(post.title)
  const encodedUrl = encodeURIComponent(shareUrl)

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const shareWhatsApp = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-[#FAF6EF]/70 text-sm font-inter">
        <User className="h-4 w-4" />
        <span>{post.author.name}</span>
      </div>
      <span className="text-[#FAF6EF]/30">·</span>
      <div className="flex items-center gap-2 text-[#FAF6EF]/70 text-sm font-inter">
        <span>{formatDate(post.publishedAt)}</span>
      </div>
      <span className="text-[#FAF6EF]/30">·</span>
      <div className="flex items-center gap-2 text-[#FAF6EF]/70 text-sm font-inter">
        <Clock className="h-4 w-4" />
        <span>{post.readTime} min de lecture</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <a
          href={shareTwitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 hover:bg-white/20 transition-colors text-[#FAF6EF] text-xs font-inter font-semibold"
          aria-label="Partager sur Twitter"
        >
          <Share2 className="h-4 w-4" />
        </a>
        <a
          href={shareFacebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 hover:bg-white/20 transition-colors text-[#FAF6EF] text-xs font-inter font-semibold"
          aria-label="Partager sur Facebook"
        >
          FB
        </a>
        <a
          href={shareWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 hover:bg-white/20 transition-colors text-[#FAF6EF] text-xs font-inter font-semibold"
          aria-label="Partager sur WhatsApp"
        >
          WA
        </a>
      </div>
    </div>
  )
}
