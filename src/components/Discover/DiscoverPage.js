"use client";
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import SiteCard from '@/src/components/SiteCard'
import FloatingActionBar from './FloatingActionBar'
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

  .main { position: relative; display: flex; align-items: flex-start; justify-content: center; overflow: hidden; }

  .islands-bg { 
    position: fixed; inset: 0; z-index: -3; pointer-events: none;
    background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3), var(--bg4));
    background-size: 400% 400%;
    animation: bgShift 18s ease-in-out infinite;
  }
  /* Adapt to Tailwind dark mode toggle (.dark on <html>) */
  :global(html.dark) .islands-bg {
    background: linear-gradient(120deg, #0f1226, #1b1d3a, #0d1f2e, #1e1030);
  }
  .tech-bg::before {
    content: ""; position: absolute; inset: -20%; opacity: 0.9;
    background:
      radial-gradient(600px 400px at 20% 30%, rgba(56,189,248,0.20), transparent 60%),
      radial-gradient(800px 500px at 80% 70%, rgba(167,139,250,0.20), transparent 60%);
    animation: glowMove 16s ease-in-out infinite alternate;
  }
  .tech-bg::after {
    content: ""; position: absolute; inset: -50%; opacity: 0.35;
    background: conic-gradient(from 0deg at 50% 50%, rgba(59,130,246,0.06), transparent 30%, rgba(16,185,129,0.06), transparent 60%, rgba(236,72,153,0.05), transparent 90%);
    animation: spin 40s linear infinite;
  }
  @keyframes glowMove { to { transform: translate(4%, 2%); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes gridDrift {
    0% { background-position: 0 0, 0 0, 12px 12px, 0 0; }
    50% { background-position: 16px 10px, 16px 10px, 20px 18px, 8px 6px; }
    100% { background-position: 24px 16px, 24px 16px, 24px 24px, 12px 8px; }
  }
  @media (prefers-color-scheme: dark) {
    .tech-bg {
      background-image:
        linear-gradient(rgba(139,92,246,0.24) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.24) 1px, transparent 1px),
        radial-gradient(rgba(139,92,246,0.28) 1px, transparent 1px),
        radial-gradient(rgba(14,165,233,0.28) 1px, transparent 1px);
    }
  }
  /* 轻微扫描线效果 */
  .scanlines { position: fixed; inset: 0; z-index: -1; pointer-events: none;
    background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 2px, transparent 2px, transparent 4px );
    animation: slMove 12s linear infinite; mix-blend-mode: overlay; }
  @media (prefers-color-scheme: dark) { .scanlines { background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px ); } }
  :global(html.dark) .scanlines { background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px ); }
  @keyframes slMove { from { transform: translateY(0); } to { transform: translateY(4px); } }
  @keyframes bgShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Force dark theme override at highest precedence */
  :global(html.dark) :global(.islands-bg) {
    background: linear-gradient(120deg, #0f1226, #1b1d3a, #0d1f2e, #1e1030);
  }
  :global(html.dark) :global(.tech-bg) {
    background-image:
      linear-gradient(rgba(139,92,246,0.32) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.32) 1px, transparent 1px),
      radial-gradient(rgba(139,92,246,0.36) 1px, transparent 1px),
      radial-gradient(rgba(14,165,233,0.36) 1px, transparent 1px);
  }
  :global(html.dark) :global(.scanlines) {
    background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px );
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

  .card-wrap { position: relative; z-index: 10; width: 100%; height: 100vh; margin: 0; padding: 0; }

  :global(.site-card) { margin-bottom: 0; height: 100%; }
  :global(.shot-wrap) { position: relative; width: 100%; height: 100vh; border-radius: 0; overflow: hidden; margin-bottom: 0; background: rgba(245, 245, 245, 0.85); }
  :global(.frame) { display:block; width: 100%; height: 100%; border: none; border-radius: 0; }
  :global(.loading) { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(245, 245, 245, 0.85); }
  :global(.spinner) { width: 40px; height: 40px; border: 4px solid #e5e5e5; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  :global(.fallback) { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(245,245,245,0.9); }
  :global(.box) { text-align: center; padding: 2rem; }
  :global(.meta) { text-align: left; }
  :global(.title) { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; }
  :global(.pitch) { color: #666; line-height: 1.6; }

  .hint { margin-top: 0.75rem; color: #666; font-size: 0.95rem; }
  .empty { text-align: center; color: #666; font-size: 1.1rem; }

  @media (prefers-color-scheme: dark) {
    :global(.shot-wrap), :global(.loading), :global(.fallback) { background: rgba(34, 34, 38, 0.85); }
    :global(.title) { color: #fff; }
    :global(.pitch) { color: #cfcfe1; }
  }

  @media (max-width: 640px) {
    .main {  }
    .card-wrap { width: 100%; max-width: 100%; padding: 0; margin-top: 0; height: 100vh; }
    :global(.shot-wrap) { height: 100vh; border-radius: 0; }
    :global(.frame) { border-radius: 0; }
  }
`;

export default function DiscoverPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
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
      
      const siteData = {
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
      }
      
      setCurrent(siteData)
      setReloadKey(prev => prev + 1)
      
      // 更新 URL 到 /site/[abbr] 格式，使用 push 避免闪烁
      const abbr = data.abbrlink || data.slug || data.id
      if (abbr) {
        router.push(`/site/${abbr}`, { scroll: false })
      }
    } catch {
      setCurrent(null)
    }
  }, [])



  // 首页只加载随机网站
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
    }, { root: null, threshold: 0.1, rootMargin: '0px 0px -100px 0px' })
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  const markOpened = useCallback(() => { setOpenedIds((prev) => new Set(prev).add(current?.id)) }, [current])
  const isOpened = current ? openedIds.has(current.id) : false

  const handleFullscreenToggle = useCallback(() => {
    const iframe = document.querySelector('.frame');
    if (iframe) {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else {
        if (iframe.requestFullscreen) iframe.requestFullscreen();
        if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      }
    }
  }, [])

  return (
    <>
      <style jsx>{styles}</style>
              <main className="main preview-page">
          <div className="islands-bg" aria-hidden="true" />
          <div className="scanlines" aria-hidden="true" />
          <div className="card-wrap">
            {current ? (
              <div className="text-center bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl h-full">
              <SiteCard
                key={current.id}
                site={current}
                language={language}
                reloadKey={reloadKey}
                onUnembeddable={fetchRandom}
              />
                          </div>
            ) : (
              <div className="text-center bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl h-full">
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
        <FloatingActionBar
          current={current}
          hideFab={hideFab}
          onRandom={fetchRandom}
          onMarkOpened={markOpened}
          onFullscreenToggle={handleFullscreenToggle}
        />
      </main>
    </>
  )
}