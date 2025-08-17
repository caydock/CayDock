"use client";
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import SiteCard from '@/src/components/SiteCard'
import FloatingActionBar from '@/src/components/Discover/FloatingActionBar'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'

export default function SiteByAbbrPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [current, setCurrent] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [hideFab, setHideFab] = useState(false)
  const [openedIds, setOpenedIds] = useState(new Set())

  // 加载指定网站的函数
  const fetchSiteByAbbr = useCallback(async (abbr) => {
    try {
      const res = await fetch(`/api/site/${abbr}`, { headers: { accept: 'application/json' } })
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
    } catch {
      // 如果加载失败，回退到首页
      router.replace('/')
    }
  }, [router])

  // 随机加载网站的函数
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
      // 更新 URL 到 /site/[abbr] 格式
      const abbr = data.abbrlink || data.slug || data.id
      if (abbr) {
        router.replace(`/site/${abbr}`, { scroll: false })
      }
    } catch {
      setCurrent(null)
    }
  }, [router])

  // 检查 URL 参数，如果有 abbr 参数则加载指定网站
  useEffect(() => {
    const abbr = params?.abbr
    if (abbr) {
      fetchSiteByAbbr(abbr)
    } else {
      fetchRandom()
    }
  }, [params?.abbr, fetchSiteByAbbr, fetchRandom])

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

  return (
    <>
      <style jsx>{`
        .main { display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; padding: 0; margin: 0; }
        .card-wrap { width: 100%; height: 100vh; margin: 0; padding: 0; }
        :global(.site-card) { margin-bottom: 0; height: 100%; }
        :global(.shot-wrap) { height: 100vh; border-radius: 0; overflow: hidden; margin-bottom: 0; }
        :global(.frame) { border-radius: 0; }
        @media (max-width: 640px) {
          .card-wrap { width: 100%; height: 100vh; margin: 0; padding: 0; }
          :global(.site-card) { margin-bottom: 0; height: 100%; }
          :global(.shot-wrap) { height: 100vh; border-radius: 0; overflow: hidden; margin-bottom: 0; }
          :global(.frame) { border-radius: 0; }
        }
      `}</style>
      <main className="main preview-page">
        <div className="islands-bg" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="card-wrap">
          {current ? (
            <div className="text-center bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl h-full">
              <SiteCard
                key={`${current.id}-${reloadKey}`}
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
          onRandom={() => {
            setReloadKey(prev => prev + 1)
            fetchRandom()
          }}
          onMarkOpened={markOpened}
          onFullscreenToggle={() => {
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
          }}
        />
      </main>
    </>
  )
} 