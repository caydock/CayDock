"use client";
import { memo, useEffect, useMemo, useState } from 'react'

function SiteCard({ site, language, reloadKey = 0 }) {
  if (!site) return null
  
  const title = site.title?.[language] || site.title?.en || ''
  const pitch = site.pitch?.[language] || site.pitch?.en || ''
  const [isLoading, setIsLoading] = useState(true)
  const [timedOut, setTimedOut] = useState(false)
  
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

  return (
    <div className="site-card">
      <div className="shot-wrap">
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
      </div>
      <div className="meta">
        <h2 className="title">{title}</h2>
        <p className="pitch">{pitch}</p>
      </div>
    </div>
  )
}

export default memo(SiteCard) 