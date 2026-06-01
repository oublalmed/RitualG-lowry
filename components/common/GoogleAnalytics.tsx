'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

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

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    const consent = loadConsent()
    if (consent?.analytics) {
      setAnalyticsAllowed(true)
    }

    // Listen for consent updates via storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cookie-consent' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue) as CookieConsent
          setAnalyticsAllowed(updated.analytics)
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (!gaId || !analyticsAllowed) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
