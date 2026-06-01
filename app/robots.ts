import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://ritualglowry.ma'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/studio', '/compte'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
