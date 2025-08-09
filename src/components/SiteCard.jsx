"use client";
import { memo, useEffect, useMemo, useRef, useState } from 'react'

function SiteCard({ site, language, reloadKey = 0 }) {
  if (!site) return null
  
  const title = site.title?.[language] || site.title?.en || ''
  const pitch = site.pitch?.[language] || site.pitch?.en || ''
  const [isLoading, setIsLoading] = useState(true)
  const [timedOut, setTimedOut] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  
  useEffect(() => {
    setIsLoading(true)
    setTimedOut(false)
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

  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement
      setIsFullscreen(!!fsEl)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
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
      <div className="shot-wrap" ref={containerRef}>
        {isLoading && (
          <div className="loading" aria-hidden="true">
            <div className="spinner" />
          </div>
        )}
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
        />
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="absolute bottom-3 right-3 z-20 rounded-full bg-black/60 text-white text-sm px-3 py-2 backdrop-blur hover:bg-black/70 active:opacity-90"
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>
      <div className="meta">
        <h2 className="title">{title}</h2>
        <p className="pitch">{pitch}</p>
      </div>
    </div>
  )
}

export default memo(SiteCard) 