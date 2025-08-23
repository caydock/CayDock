"use client";
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SiteCard from '@/src/components/SiteCard'
import FloatingActionBar from '@/src/components/Discover/FloatingActionBar'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'

export default function SitePage({ siteId, language }) {
  const router = useRouter()
  const [current, setCurrent] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [hideFab, setHideFab] = useState(false)
  const [openedIds, setOpenedIds] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    // 不清空current，保持按钮显示
    
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
        },
      }
      
      setCurrent(siteData)
    } catch {
      setCurrent(null)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // 检查 siteId 参数，如果有则加载指定网站
  useEffect(() => {
    if (siteId && siteId !== 'random') {
      fetchSiteByAbbr(siteId)
    } else {
      fetchRandom()
    }
  }, [siteId, fetchSiteByAbbr, fetchRandom])

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
          {current && (
            <SiteCard
              site={current}
              language={language}
              reloadKey={reloadKey}
              onUnembeddable={() => {
                // 如果网站无法嵌入，重新获取一个
                setReloadKey(prev => prev + 1)
                fetchRandom()
              }}
            />
          )}
        </div>
        
        <FloatingActionBar
          current={current}
          isOpened={isOpened}
          markOpened={markOpened}
          onRefresh={() => {
            setReloadKey(prev => prev + 1)
            fetchRandom()
          }}
          hideFab={hideFab}
        />
      </main>
    </>
  )
} 