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
  const { language, t } = useLanguage()
  const [site, setSite] = useState(null)
  const router = useRouter()
  const params = useParams()
  const abbrRaw = typeof params?.abbr === 'string' ? params.abbr : Array.isArray(params?.abbr) ? params.abbr[0] : ''
  const abbr = abbrRaw.replace(/\.html$/i, '')
  const [hideFab, setHideFab] = useState(false)

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

  // 当 footer 进入视口时隐藏底部悬浮栏
  useEffect(() => {
    if (typeof window === 'undefined') return
    const footer = document.querySelector('footer')
    if (!footer) return
    const io = new IntersectionObserver((entries) => {
      const visible = entries.some(e => e.isIntersecting)
      setHideFab(visible)
    }, { root: null, threshold: 0 })
    io.observe(footer)
    return () => io.disconnect()
  }, [])

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
      {/* 底部悬浮操作栏：随机、打开 */}
      {site ? (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-5 z-50 flex items-center gap-4 rounded-full border border-black/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-3 py-2 shadow-xl w-[94vw] max-w-[680px] sm:w-auto sm:max-w-none transition-all duration-200 ${hideFab ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100'}`}
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          <button
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 text-white font-extrabold px-6 sm:px-8 py-3 shadow-md hover:brightness-105 active:brightness-95 transition flex-1 sm:flex-none sm:min-w-[160px]"
            onClick={() => router.push('/discover')}
          >
            {`🎲 ${t('discover.random')}`}
          </button>
          <a
            className="inline-flex items-center justify-center rounded-full border-2 border-violet-600/90 text-violet-700 bg-white/90 dark:bg-zinc-900/80 dark:text-violet-200 px-5 py-3 hover:bg-violet-50/40 active:opacity-95 transition flex-1 sm:flex-none"
            href={site?.url}
            target="_blank"
            rel="noreferrer"
          >
            {t('discover.open')}
          </a>
        </div>
      ) : null}
    </main>
  )
}
