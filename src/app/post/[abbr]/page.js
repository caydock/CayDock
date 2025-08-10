"use client";

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SiteCard from '@/src/components/SiteCard'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'

export const runtime = 'edge'

const styles = `
.page { max-width: 1200px; margin: 4rem auto 0; padding: 0 16px; }
.hint { margin-top: 0.75rem; color: #666; font-size: 0.95rem; }
@media (prefers-color-scheme: dark) { .hint { color: #cfcfe1; } }
`;

export default function PostByAbbrPage() {
  const { language } = useLanguage()
  const [site, setSite] = useState(null)
  const router = useRouter()
  const params = useParams()
  const abbr = typeof params?.abbr === 'string' ? params.abbr : Array.isArray(params?.abbr) ? params.abbr[0] : ''

  const fetchByAbbr = useCallback(async () => {
    try {
      const res = await fetch(`/api/site/${abbr}`, { headers: { 'accept': 'application/json' } })
      if (!res.ok) { router.replace('/not-found'); return }
      const data = await res.json()
      if (!data?.url) { router.replace('/not-found'); return }
      setSite(data)
    } catch {
      router.replace('/not-found')
    }
  }, [abbr, router])

  useEffect(() => { fetchByAbbr() }, [fetchByAbbr])

  return (
    <main className="page">
      <style jsx>{styles}</style>
      <div className="rounded-xl md:rounded-2xl p-2 md:p-8 text-center bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl">
        {site ? (
          <SiteCard
            site={site}
            language={language}
            onUnembeddable={() => router.replace('/discover')}
          />
        ) : (
          <div className="site-card">
            <div className="shot-wrap">
              <div className="loading" aria-hidden="true"><div className="spinner" /></div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
