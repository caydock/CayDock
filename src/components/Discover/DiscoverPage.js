"use client";
import { useCallback, useEffect, useMemo, useState } from 'react'
import { sites } from '@/src/data/sites'
import SiteCard from '@/src/components/SiteCard'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'
import { useThemeSwitch } from '@/src/components/Hooks/useThemeSwitch'
import { MoonIcon, SunIcon } from '@/src/components/Icons'

const styles = `

  @media (prefers-color-scheme: dark) {
    :root {
      --bg1: #0f1226;
      --bg2: #1b1d3a;
      --bg3: #0d1f2e;
      --bg4: #1e1030;
      --vignette: rgba(0, 0, 0, 0.35);
    }
  }

  .main { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }

  .islands-bg { 
    position: fixed; inset: 0; z-index: -1; 
    background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3), var(--bg4));
    background-size: 400% 400%;
    animation: bgShift 18s ease-in-out infinite;
  }
  :global(.dark) .islands-bg {
    background: linear-gradient(120deg, #0f1226, #1b1d3a, #0d1f2e, #1e1030);
  }
  /* 碎花图案背景层（置于渐变之上、内容之下） */
  .pattern-bg {
    position: fixed; inset: 0; z-index: -1; pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='60' height='60' fill='none'/><g opacity='0.28'><g transform='translate(12 12)'><g fill='%23f59e0b'><circle cx='0' cy='3' r='2'/><circle cx='3' cy='0' r='2'/><circle cx='-3' cy='0' r='2'/><circle cx='0' cy='-3' r='2'/></g><circle cx='0' cy='0' r='1.2' fill='%23f97316'/></g><g transform='translate(36 18)'><g fill='%2393c5fd'><circle cx='0' cy='3' r='2'/><circle cx='3' cy='0' r='2'/><circle cx='-3' cy='0' r='2'/><circle cx='0' cy='-3' r='2'/></g><circle cx='0' cy='0' r='1.2' fill='%2360a5fa'/></g><g transform='translate(45 45)'><g fill='%23a7f3d0'><circle cx='0' cy='3' r='2'/><circle cx='3' cy='0' r='2'/><circle cx='-3' cy='0' r='2'/><circle cx='0' cy='-3' r='2'/></g><circle cx='0' cy='0' r='1.2' fill='%234ad2b8'/></g><g fill='%239ca3af' opacity='0.45'><circle cx='8' cy='40' r='1.2'/><circle cx='28' cy='6' r='1'/><circle cx='52' cy='26' r='1.2'/></g></g></svg>");
    background-repeat: repeat;
    background-size: 60px 60px;
  }
  @media (prefers-color-scheme: dark) {
    .pattern-bg { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='60' height='60' fill='none'/><g opacity='0.24'><g transform='translate(12 12)'><g fill='%238b5cf6'><circle cx='0' cy='3' r='2'/><circle cx='3' cy='0' r='2'/><circle cx='-3' cy='0' r='2'/><circle cx='0' cy='-3' r='2'/></g><circle cx='0' cy='0' r='1.2' fill='%237c3aed'/></g><g transform='translate(36 18)'><g fill='%234f46e5'><circle cx='0' cy='3' r='2'/><circle cx='3' cy='0' r='2'/><circle cx='-3' cy='0' r='2'/><circle cx='0' cy='-3' r='2'/></g><circle cx='0' cy='0' r='1.2' fill='%233256ed'/></g><g transform='translate(45 45)'><g fill='%230ea5e9'><circle cx='0' cy='3' r='2'/><circle cx='3' cy='0' r='2'/><circle cx='-3' cy='0' r='2'/><circle cx='0' cy='-3' r='2'/></g><circle cx='0' cy='0' r='1.2' fill='%230ea5e9'/></g><g fill='%236b7280' opacity='0.5'><circle cx='8' cy='40' r='1.2'/><circle cx='28' cy='6' r='1'/><circle cx='52' cy='26' r='1.2'/></g></g></svg>"); }
  }
  :global(.dark) .pattern-bg { filter: none; }
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

  .card-wrap { position: relative; z-index: 10; max-width: 1200px; width: 96%; margin: 0 auto; padding: 0 16px; }
  .card { background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); text-align: center; }

  @media (prefers-color-scheme: dark) { .card { background: rgba(22, 22, 28, 0.78); box-shadow: 0 20px 50px rgba(0,0,0,0.35); } }
  :global(.dark) .card { background: rgba(22, 22, 28, 0.78); box-shadow: 0 20px 50px rgba(0,0,0,0.35); }

  .site-card { margin-bottom: 2rem; }
  .shot-wrap { position: relative; width: 100%; height: clamp(480px, 70vh, 860px); border-radius: 14px; overflow: hidden; margin-bottom: 1rem; background: rgba(245, 245, 245, 0.85); }
  .frame { width: 100%; height: 100%; border: none; border-radius: 14px; }
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

  @media (prefers-color-scheme: dark) { .shot-wrap, .loading, .fallback { background: rgba(34, 34, 38, 0.85); } .title { color: #fff; } .pitch { color: #cfcfe1; } }
  :global(.dark) .shot-wrap, :global(.dark) .loading, :global(.dark) .fallback { background: rgba(34, 34, 38, 0.85); }
  :global(.dark) .title { color: #fff; }
  :global(.dark) .pitch { color: #cfcfe1; }

  @media (max-width: 640px) {
    .shot-wrap { height: 60vh; }
  }

  /* 悬浮操作条：底部中间绝对居中 */
  .floating-actions {
    position: fixed; left: 50%; bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
    transform: translateX(-50%);
    z-index: 60;
    display: flex; gap: 12px; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.88);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 999px;
    padding: 10px 14px;
    box-shadow: 0 12px 34px rgba(0,0,0,0.14);
    backdrop-filter: blur(10px);
    width: fit-content; max-width: min(92vw, 520px);
  }
  @media (prefers-color-scheme: dark) { .floating-actions { background: rgba(22,22,28,0.78); border-color: rgba(255,255,255,0.06); } }
  :global(.dark) .floating-actions { background: rgba(22,22,28,0.78); border-color: rgba(255,255,255,0.06); }
  @media (max-width: 480px) {
    .floating-actions { padding: 8px 10px; gap: 10px; }
  }
  .floating-actions .secondary, .floating-actions .primary { margin: 0; }

  /* 更显眼的操作按钮样式 */
  .floating-actions .primary {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px;
    padding: 12px 18px;
    border-radius: 999px;
    background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
    color: #fff;
    font-weight: 800;
    letter-spacing: 0.2px;
    border: none;
    text-decoration: none;
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4), 0 4px 12px rgba(37, 99, 235, 0.25);
    transform: translateZ(0);
    transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }
  .floating-actions .primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(124,58,237,0.50), 0 6px 16px rgba(37,99,235,0.28);
    filter: brightness(1.02);
  }
  .floating-actions .primary:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }
  .floating-actions .primary::after {
    content: "↗";
    font-size: 14px;
    line-height: 1;
  }

  .floating-actions .secondary {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 6px;
    padding: 12px 16px;
    border-radius: 999px;
    border: 2px solid rgba(124, 58, 237, 0.85);
    color: rgb(124,58,237);
    background: rgba(255,255,255,0.9);
    font-weight: 700;
    letter-spacing: 0.2px;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease, border-color 0.2s ease;
  }
  .floating-actions .secondary:hover {
    background: rgba(124, 58, 237, 0.08);
    transform: translateY(-1px);
  }
  .floating-actions .secondary:active {
    transform: translateY(0);
  }
  .floating-actions .secondary.random::before { content: "🎲"; font-size: 16px; line-height: 1; }
  .floating-actions .secondary.retry::before { content: "⟳"; font-size: 16px; line-height: 1; }

  @media (prefers-color-scheme: dark) { .floating-actions .secondary { background: rgba(22,22,28,0.84); border-color: rgba(167, 139, 250, 0.9); color: rgb(196,181,253); } .floating-actions .secondary:hover { background: rgba(167,139,250,0.12); } .floating-actions .primary { box-shadow: 0 10px 24px rgba(0,0,0,0.5), 0 10px 24px rgba(139,92,246,0.35); } }
  :global(.dark) .floating-actions .secondary { background: rgba(22,22,28,0.84); border-color: rgba(167, 139, 250, 0.9); color: rgb(196,181,253); }
  :global(.dark) .floating-actions .secondary:hover { background: rgba(167,139,250,0.12); }
  :global(.dark) .floating-actions .primary { box-shadow: 0 10px 24px rgba(0,0,0,0.5), 0 10px 24px rgba(139,92,246,0.35); }

  @media (max-width: 480px) {
    .floating-actions .primary { padding: 12px 16px; font-size: 0.98rem; }
    .floating-actions .secondary { padding: 10px 14px; font-size: 0.96rem; }
  }

  /* 首页浮动暗夜模式切换按钮 */
  .theme-fab {
    position: fixed; top: 16px; right: 16px; z-index: 70;
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 999px;
    background: rgba(255,255,255,0.9);
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    backdrop-filter: blur(10px);
    transition: transform 0.15s ease, box-shadow 0.2s ease;
  }
  .theme-fab:hover { transform: translateY(-1px); box-shadow: 0 12px 26px rgba(0,0,0,0.16); }
  @media (prefers-color-scheme: dark) { .theme-fab { background: rgba(22,22,28,0.78); border-color: rgba(255,255,255,0.06); } }
  :global(.dark) .theme-fab { background: rgba(22,22,28,0.78); border-color: rgba(255,255,255,0.06); }
`;

export default function DiscoverPage() {
  const { language, t } = useLanguage()
  const [mode, setMode] = useThemeSwitch()
  // Avoid SSR/CSR mismatch: deterministic initial index
  const [index, setIndex] = useState(0)
  const [serverSite, setServerSite] = useState(null)
  const [openedIds, setOpenedIds] = useState(() => new Set())
  const [reloadKey, setReloadKey] = useState(0)

  const current = useMemo(() => serverSite || sites[index], [serverSite, index])

  const fetchRandom = useCallback(async () => {
    try {
      const res = await fetch(`/api/random`, { headers: { 'accept': 'application/json' } })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      setServerSite(data)
    } catch {
      setServerSite(null)
      if (sites.length === 0) return
      let next = Math.floor(Math.random() * sites.length)
      if (sites.length > 1) { while (next === index) next = Math.floor(Math.random() * sites.length) }
      setIndex(next)
    }
  }, [index])

  // On mount, pick a random index once on client to avoid SSR mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!serverSite && sites.length > 0 && index === 0) {
      const firstRandom = Math.floor(Math.random() * sites.length)
      setIndex(firstRandom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markOpened = useCallback(() => { setOpenedIds((prev) => new Set(prev).add(current?.id)) }, [current])
  const isOpened = current ? openedIds.has(current.id) : false

  return (
    <>
      <style jsx>{styles}</style>
      <main className="main">
        <div className="islands-bg" aria-hidden="true" />
        <div className="pattern-bg" aria-hidden="true" />
        <div className="card-wrap">
          {current ? (
            <div className="card">
              <SiteCard site={current} language={language} reloadKey={reloadKey} />
              {isOpened ? null : <div className="hint">{t('discover.hint')}</div>}
            </div>
          ) : (
            <div className="empty">{t('discover.empty')}</div>
          )}
        </div>
        <div className="floating-actions">
          <button className="secondary random" onClick={fetchRandom}>{t('discover.random')}</button>
          {current ? (
            <button className="secondary retry" onClick={() => setReloadKey(Date.now())}>{t('discover.retry')}</button>
          ) : null}
          {current ? (
            <a className="primary" href={current.url} target="_blank" rel="noreferrer" onClick={markOpened}>{t('discover.open')}</a>
          ) : null}
        </div>
      </main>
    </>
  )
}