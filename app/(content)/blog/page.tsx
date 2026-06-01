import type { Metadata } from 'next'
import { BlogClientPage } from './BlogClientPage'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Conseils, tendances et inspiration beauté pour vos cheveux. Guides extensions, entretien et tendances 2026.',
}

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight: '40vh',
          background: 'linear-gradient(135deg, #3D2B1F 0%, #1A1410 100%)',
        }}
      >
        <div className="text-center px-4 py-16">
          <h1 className="font-playfair italic text-[#FAF6EF] text-5xl md:text-6xl mb-4">
            Journal Glowry
          </h1>
          <p className="font-cormorant italic text-[#FAF6EF]/70 text-xl md:text-2xl">
            Conseils, tendances &amp; inspiration beauté
          </p>
        </div>
      </section>

      {/* Client interactive section */}
      <BlogClientPage />
    </>
  )
}
