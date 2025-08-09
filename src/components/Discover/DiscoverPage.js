"use client";
import { useCallback, useEffect, useMemo, useState } from 'react'
import SiteCard from '@/src/components/SiteCard'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'

const styles = `
  :root {
    --bg1: #f0f4ff;
    --bg2: #ffeef6;
    --bg3: #e8fff3;
    --bg4: #f3f0ff;
    --vignette: rgba(0, 0, 0, 0.18);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg1: #0f1226;
      --bg2: #1b1d3a;
      --bg3: #0d1f2e;
      --bg4: #1e1030;
      --vignette: rgba(0, 0, 0, 0.35);
    }
  }

  .main { position: relative;  display: flex; align-items: center; justify-content: center; overflow: hidden;  }

  .islands-bg { 
    position: fixed; inset: 0; z-index: -1; 
    background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3), var(--bg4));
    background-size: 400% 400%;
    animation: bgShift 18s ease-in-out infinite;
  }
  /* 科技感网格 + 霓虹扫光背景层 */
  .tech-bg {
    position: fixed; inset: 0; z-index: -2; pointer-events: none;
    background-image:
      linear-gradient(rgba(99,102,241,0.10) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.10) 1px, transparent 1px),
      radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px),
      radial-gradient(rgba(16,185,129,0.12) 1px, transparent 1px);
    background-size: 48px 48px, 48px 48px, 24px 24px, 24px 24px;
    background-position: 0 0, 0 0, 12px 12px, 0 0;
  }
  .tech-bg::before {
    content: ""; position: absolute; inset: -20%; opacity: 0.9;
    background:
      radial-gradient(600px 400px at 20% 30%, rgba(56,189,248,0.12), transparent 60%),
      radial-gradient(800px 500px at 80% 70%, rgba(167,139,250,0.12), transparent 60%);
    animation: glowMove 16s ease-in-out infinite alternate;
  }
  .tech-bg::after {
    content: ""; position: absolute; inset: -50%; opacity: 0.35;
    background: conic-gradient(from 0deg at 50% 50%, rgba(59,130,246,0.06), transparent 30%, rgba(16,185,129,0.06), transparent 60%, rgba(236,72,153,0.05), transparent 90%);
    animation: spin 40s linear infinite;
  }
  @keyframes glowMove { to { transform: translate(4%, 2%); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-color-scheme: dark) {
    .tech-bg {
      background-image:
        linear-gradient(rgba(139,92,246,0.14) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.14) 1px, transparent 1px),
        radial-gradient(rgba(139,92,246,0.16) 1px, transparent 1px),
        radial-gradient(rgba(14,165,233,0.16) 1px, transparent 1px);
    }
  }
  /* 轻微扫描线效果 */
  .scanlines { position: fixed; inset: 0; z-index: -1; pointer-events: none;
    background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 2px, transparent 2px, transparent 4px );
    animation: slMove 12s linear infinite; mix-blend-mode: overlay; }
  @media (prefers-color-scheme: dark) { .scanlines { background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px ); } }
  @keyframes slMove { from { transform: translateY(0); } to { transform: translateY(4px); } }
  @keyframes bgShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .islands-bg { animation: none; }
  }

  /* 柔和暗角与高光层次 */
  .islands-bg::after { 
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(1200px 800px at 50% 40%, rgba(255,255,255,0.18), transparent 60%),
                radial-gradient(900px 600px at 20% 20%, rgba(255,255,255,0.10), transparent 60%),
                radial-gradient(1200px 900px at 80% 80%, rgba(255,255,255,0.10), transparent 60%),
                radial-gradient(1600px 900px at 50% 120%, var(--vignette), transparent 60%);
    mix-blend-mode: overlay;
  }

  .card-wrap { position: relative; z-index: 10; max-width: 1200px; width: 96%; margin: 4rem auto 0; padding: 0 16px; }

  .site-card { margin-bottom: 2rem; }
  .shot-wrap { position: relative; width: 100%; min-height: 680px; height: 680px; border-radius: 14px; overflow: hidden; margin-bottom: 1rem; background: rgba(245, 245, 245, 0.85); }
  .frame { display:block; width: 100%; height: 100%; border: none; border-radius: 14px; }
  .loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(245, 245, 245, 0.85); }
  .spinner { width: 40px; height: 40px; border: 4px solid #e5e5e5; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  .fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(245,245,245,0.9); }
  .box { text-align: center; padding: 2rem; }
  .meta { text-align: left; }
  .title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; }
  .pitch { color: #666; line-height: 1.6; }

  .hint { margin-top: 0.75rem; color: #666; font-size: 0.95rem; }
  .empty { text-align: center; color: #666; font-size: 1.1rem; }

  @media (prefers-color-scheme: dark) {
    .shot-wrap, .loading, .fallback { background: rgba(34, 34, 38, 0.85); }
    .title { color: #fff; }
    .pitch { color: #cfcfe1; }
  }

  @media (max-width: 640px) {
    .main {  }
    .card-wrap { width: 95%; max-width: 100%; padding: 0; margin-top: 1.5rem; height: 88vh; }
    .shot-wrap { min-height: 480px; height: 60vh; border-radius: 10px; }
    .frame { border-radius: 10px; }
  }
`;

export default function DiscoverPage() {
  const { language, t } = useLanguage()
  const [current, setCurrent] = useState(null)
  const [openedIds, setOpenedIds] = useState(() => new Set())
  const [reloadKey, setReloadKey] = useState(0)
  const [hideFab, setHideFab] = useState(false)

  const fetchRandom = useCallback(async () => {
    try {
      const res = await fetch('/api/random', { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      if (!data?.url) throw new Error('no url')
      setCurrent({
        id: data.id || data.slug || data.abbrlink || data.url,
        url: data.url || data.link || data.permalink,
        title: {
          en: data.title?.en || data.title_en || data.title || '',
          zh: data.title?.zh || data.title_zh || data.title || '',
        },
        pitch: {
          en: data.pitch?.en || data.desc_en || data.description || '',
          zh: data.pitch?.zh || data.desc_zh || data.description || '',
        },
      })
    } catch {
      setCurrent(null)
    }
  }, [])

  // On mount, fetch one random site once on client
  useEffect(() => {
    fetchRandom()
  }, [fetchRandom])

  // Hide floating actions when footer enters viewport
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

  const markOpened = useCallback(() => { setOpenedIds((prev) => new Set(prev).add(current?.id)) }, [current])
  const isOpened = current ? openedIds.has(current.id) : false

  return (
    <>
      <style jsx>{styles}</style>
      <main className="main">
        <div className="islands-bg" aria-hidden="true" />
        <div className="tech-bg" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="card-wrap">
          {current ? (
            <div className="rounded-xl md:rounded-2xl p-2 md:p-8 text-center bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl">
              <SiteCard site={current} language={language} reloadKey={reloadKey} />
              {isOpened ? null : <div className="hint">{t('discover.hint')}</div>}
            </div>
          ) : (
            <div className="rounded-xl md:rounded-2xl p-2 md:p-8 text-center bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl">
              <div className="site-card">
                <div className="shot-wrap">
                  <div className="loading" aria-hidden="true">
                    <div className="spinner" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-5 z-50 flex items-center gap-4 rounded-full border border-black/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-3 py-2 shadow-xl w-[94vw] max-w-[680px] sm:w-auto sm:max-w-none transition-all duration-200 ${hideFab ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100'}`}
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          <button
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 text-white font-extrabold px-5 py-3 shadow-md hover:brightness-105 active:brightness-95 transition flex-1 sm:flex-none"
            onClick={fetchRandom}
          >
            {t('discover.random')}
          </button>
          {current ? (
            <a
              className="inline-flex items-center justify-center rounded-full border-2 border-violet-600/90 text-violet-700 bg-white/90 dark:bg-zinc-900/80 dark:text-violet-200 px-5 py-3 hover:bg-violet-50/40 active:opacity-95 transition flex-1 sm:flex-none"
              href={current.url}
              target="_blank"
              rel="noreferrer"
              onClick={markOpened}
            >
              {t('discover.open')}
            </a>
          ) : null}
        </div>
      </main>
    </>
  )
}