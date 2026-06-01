import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllBlogSlugs, getBlogPostBySlug, getBlogPosts } from '@/lib/sanity/fetch'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArticleClient } from './ArticleClient'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://ritualglowry.ma'
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name].filter(Boolean),
      url: `${base}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const { posts: allPosts } = await getBlogPosts()
  const related = allPosts.filter((p: any) => p._id !== post._id).slice(0, 3)
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://ritualglowry.ma'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ritual Glowry',
      logo: { '@type': 'ImageObject', url: `${base}/logo.png` },
    },
    url: `${base}/blog/${post.slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: base },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${base}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${base}/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section
        className="relative flex items-end"
        style={{
          minHeight: '55vh',
          background: 'linear-gradient(135deg, #1A1410 0%, #3D2B1F 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(26,20,16,0.95) 0%, rgba(26,20,16,0.4) 60%, transparent 100%)' }}
        />
        <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 pb-12 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-inter text-[#FAF6EF]/50 mb-6">
            <Link href="/" className="hover:text-[#C9A875] transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#C9A875] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#FAF6EF]/80 line-clamp-1">{post.title}</span>
          </nav>

          {/* Category */}
          {post.categories?.[0] && (
            <span className="inline-block bg-[#C9A875]/20 text-[#C9A875] text-[11px] font-inter font-semibold uppercase tracking-[0.12em] px-3 py-1 mb-4">
              {post.categories[0]}
            </span>
          )}

          <h1 className="font-playfair italic text-white text-3xl md:text-4xl lg:text-5xl max-w-3xl leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta + share */}
          <ArticleClient post={post} />
        </div>
      </section>

      {/* Article body + sidebar */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <article className="flex-1 lg:w-[70%] max-w-none">
            <div className="prose-custom">
              {Array.isArray(post.body) && post.body.map((block: any, i: number) => {
                // Support Sanity portable text blocks
                if (block._type === 'block') {
                  const text = block.children?.map((c: any) => c.text).join('') ?? ''
                  if (block.style === 'h2' || block.style === 'h3') {
                    return (
                      <h2
                        key={block._key ?? i}
                        className="font-playfair italic text-[#3D2B1F] text-2xl md:text-3xl mt-10 mb-5"
                      >
                        {text}
                      </h2>
                    )
                  }
                  if (block.style === 'blockquote') {
                    return (
                      <div
                        key={block._key ?? i}
                        className="bg-[#F5EDE0] border-l-4 border-[#C9A875] px-6 py-4 mb-6"
                      >
                        <p className="text-xs font-inter font-semibold uppercase tracking-[0.1em] text-[#C9A875] mb-2">
                          Conseil pro
                        </p>
                        <p className="font-cormorant italic text-[#3D2B1F] text-lg leading-relaxed">
                          {text}
                        </p>
                      </div>
                    )
                  }
                  return (
                    <p
                      key={block._key ?? i}
                      className="font-cormorant text-[#1A1410] text-lg leading-[1.8] mb-6"
                    >
                      {text}
                    </p>
                  )
                }
                // Legacy mock data format support
                if (block.type === 'paragraph') {
                  return (
                    <p key={i} className="font-cormorant text-[#1A1410] text-lg leading-[1.8] mb-6">
                      {block.text}
                    </p>
                  )
                }
                if (block.type === 'heading') {
                  return (
                    <h2 key={i} className="font-playfair italic text-[#3D2B1F] text-2xl md:text-3xl mt-10 mb-5">
                      {block.text}
                    </h2>
                  )
                }
                if (block.type === 'tip') {
                  return (
                    <div key={i} className="bg-[#F5EDE0] border-l-4 border-[#C9A875] px-6 py-4 mb-6">
                      <p className="text-xs font-inter font-semibold uppercase tracking-[0.1em] text-[#C9A875] mb-2">
                        Conseil pro
                      </p>
                      <p className="font-cormorant italic text-[#3D2B1F] text-lg leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[#F5EDE0] flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-[#F5EDE0] text-[#3D2B1F]/70 text-xs font-inter px-3 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[30%] lg:sticky lg:top-28 space-y-8 self-start">
            {/* Related articles */}
            <div>
              <h3 className="font-playfair italic text-[#3D2B1F] text-xl mb-5">
                Articles liés
              </h3>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link
                    key={r._id}
                    href={`/blog/${r.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <div
                      className="flex-shrink-0 w-16 h-16"
                      style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }}
                    />
                    <div className="flex-1">
                      <p className="font-playfair italic text-[#3D2B1F] text-sm leading-snug group-hover:text-[#C9A875] transition-colors line-clamp-2">
                        {r.title}
                      </p>
                      <p className="text-xs font-inter text-[#3D2B1F]/50 mt-1">
                        {formatDate(r.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#F5EDE0] p-6">
              <h3 className="font-playfair italic text-[#3D2B1F] text-lg mb-2">
                Restez inspirée
              </h3>
              <p className="text-sm font-inter text-[#3D2B1F]/70 mb-4">
                Recevez nos conseils beauté en avant-première.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 border border-[#C9A875]/40 bg-white text-sm font-inter text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#C9A875]"
                />
                <button className="w-full bg-[#C9A875] text-[#1A1410] text-xs font-inter font-semibold uppercase tracking-[0.1em] py-2.5 hover:bg-[#B8924B] transition-colors">
                  S&apos;abonner
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sur le même thème */}
      <section className="bg-[#F5EDE0] py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <h2 className="font-playfair italic text-[#3D2B1F] text-3xl mb-10 text-center">
            Sur le même thème
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <article
                key={r._id}
                className="group bg-white border border-[#F5EDE0] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="aspect-video w-full"
                  style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }}
                />
                <div className="p-5">
                  {r.categories?.[0] && (
                    <span className="inline-block bg-[#C9A875]/20 text-[#B8924B] text-[11px] font-inter font-semibold uppercase tracking-[0.1em] px-2 py-1 mb-3">
                      {r.categories[0]}
                    </span>
                  )}
                  <h3 className="font-playfair italic text-[#3D2B1F] text-base leading-snug mb-2 group-hover:text-[#C9A875] transition-colors">
                    <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                  </h3>
                  <p className="text-sm font-inter text-[#3D2B1F]/60 line-clamp-2 mb-4">
                    {r.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-inter text-[#3D2B1F]/50">
                    <span>{r.author?.name}</span>
                    <span>·</span>
                    <span>{formatDate(r.publishedAt)}</span>
                    <span>·</span>
                    <span>{r.readTime} min</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
