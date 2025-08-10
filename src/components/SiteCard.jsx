"use client";
import { memo, useEffect, useMemo, useRef, useState } from 'react'

function SiteCard({ site, language, reloadKey = 0, onUnembeddable }) {
  
  const title = site.title?.[language] || site.title?.en || ''
  const pitch = site.pitch?.[language] || site.pitch?.en || ''
  const [isLoading, setIsLoading] = useState(true)
  const [timedOut, setTimedOut] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(false)
  const containerRef = useRef(null)
  
  useEffect(() => {
    setIsLoading(true)
    setTimedOut(false)
    setLoadError(false)
    let timer = setTimeout(() => {
      setTimedOut(true)
      setIsLoading(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [site?.url, reloadKey])
  
  const src = useMemo(() => {
    if (!site?.url) return ''
    if (!reloadKey) return site.url
    const hasQuery = site.url.includes('?')
    return `${site.url}${hasQuery ? '&' : '?'}__r=${reloadKey}`
  }, [site?.url, reloadKey])

  const isMixedContent = useMemo(() => {
    const target = site?.url || ''
    if (!target) return false
    const isHttpUrl = target.startsWith('http://')
    if (typeof window === 'undefined') return isHttpUrl
    const parentIsHttps = window.location.protocol === 'https:'
    return parentIsHttps && isHttpUrl
  }, [site?.url])
  const notifiedRef = useRef("")
  const screenshotUrl = useMemo(() => {
    if (!site?.url) return ''
    // Prefer our own screenshot proxy or empty when not embeddable; avoid WordPress mShots
    return ''
  }, [site?.url])

  // 移除自动 can-embed 检测，改由人工判定

  // If cannot embed (http or blocked), notify parent to skip
  useEffect(() => {
    const url = site?.url || ''
    if (!url) return
    if (isMixedContent && onUnembeddable && notifiedRef.current !== url) {
      notifiedRef.current = url
      onUnembeddable()
    }
  }, [isMixedContent, onUnembeddable, site?.url])

  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement
      setIsFullscreen(!!fsEl)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    // Detect fullscreen capability
    const el = containerRef.current
    const doc = document
    const enabled = (typeof doc.fullscreenEnabled === 'boolean' ? doc.fullscreenEnabled : true) || doc.webkitFullscreenEnabled
    const elementCapable = !!(el && (el.requestFullscreen || el.webkitRequestFullscreen))
    setCanFullscreen(Boolean(enabled && elementCapable))
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
    }
  }, [])

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    const exit = () => {
      if (document.exitFullscreen) return document.exitFullscreen()
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen()
    }
    const req = () => {
      if (el.requestFullscreen) return el.requestFullscreen()
      if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen()
    }
    if (document.fullscreenElement || document.webkitFullscreenElement) exit()
    else req()
  }

  return (
    <div className="site-card">
      <style jsx>{`
        .site-card { margin-bottom: 2rem; }
        .shot-wrap { position: relative; width: 100%; min-height: 680px; height: 680px; border-radius: 14px; overflow: hidden; margin-bottom: 1rem; background: rgba(245, 245, 245, 0.85); }
        .frame { display:block; width: 100%; height: 100%; border: none; border-radius: 14px; }
        .loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(245, 245, 245, 0.85); }
        .spinner { width: 40px; height: 40px; border: 4px solid #e5e5e5; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(245,245,245,0.9); }
        .box { text-align: center; padding: 2rem; }
        .meta { text-align: left; }
        .title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
        .pitch { line-height: 1.6; }
        @media (prefers-color-scheme: dark) {
          .shot-wrap, .loading, .fallback { background: rgba(34, 34, 38, 0.85); }
          .title { color: #fff; }
          .pitch { color: #cfcfe1; }
        }
        @media (max-width: 640px) {
          .shot-wrap { min-height: 480px; height: 60vh; border-radius: 10px; }
          .frame { border-radius: 10px; }
        }
      `}</style>
      <div className="shot-wrap" ref={containerRef}>
        {isLoading && (
          <div className="loading" aria-hidden="true">
            <div className="spinner" />
          </div>
        )}
        {(isMixedContent || loadError) ? (
          <div className="fallback" role="status" aria-live="polite">
            <div className="box">
              <div className="text-lg font-semibold mb-1 dark:text-light">{language?.startsWith('zh') ? '预览加载失败' : 'Preview failed to load'}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                {language?.startsWith('zh') ? '请点击下方“打开”按钮直接访问该网站。' : 'Please click the Open button below to visit the site directly.'}
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={`${site?.id || site?.url}-${reloadKey}`}
            title={title || site.url}
            className="frame"
            src={src}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            referrerPolicy="no-referrer"
            allowFullScreen
             onLoad={() => setIsLoading(false)}
             onError={(e) => {
               setIsLoading(false);
               // 仅在常见被拒绝嵌入的错误信息时置为失败（部分浏览器会抛出此类跨域错误）
               const msg = (e?.message || '').toString()
               if (msg.includes("X-Frame-Options") || msg.includes('Refused to display')) {
                 setLoadError(true)
               }
             }}
          />
        )}
        {canFullscreen && !isMixedContent ? (
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="absolute bottom-3 right-3 z-20 rounded-full bg-black/60 text-white text-sm px-3 py-2 backdrop-blur hover:bg-black/70 active:opacity-90"
          >
            {isFullscreen ? '✕' : '⛶'}
          </button>
        ) : null}
      </div>
      <div className="meta">
        <h2 className="title dark:text-light">{title}</h2>
        <p className="pitch dark:text-light">{pitch}</p>
      </div>
    </div>
  )
}

export default memo(SiteCard) 