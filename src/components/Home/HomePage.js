"use client";
import Link from 'next/link'
import Image from "next/image"
import logo from "@/public/about-logo.webp"

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { shouldEnableAnalytics } from '@/src/utils/env'
import { sites } from '@/src/data/sites'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function HomePage({ initialLanguage = 'en', searchParams = {}, initialSite = null }) {
  const t = useTranslations('ui')
  const locale = useLocale()
  const currentLanguage = locale === 'zh-cn' ? 'zh' : 'en'
  const isZh = locale === 'zh-cn'
  const router = useRouter()
  const [randomSiteId, setRandomSiteId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showRecommendedSite, setShowRecommendedSite] = useState(false)
  const [recommendedSite, setRecommendedSite] = useState(null)
  const [animationAngle, setAnimationAngle] = useState(0)
  const [isOpening, setIsOpening] = useState(false)
  const [isDirectAccess, setIsDirectAccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSiteNotFound, setIsSiteNotFound] = useState(false)

  // 获取随机网站ID
  const fetchRandomSiteId = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/random', { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      if (!data?.id) throw new Error('no id')
      
      // 使用abbrlink作为ID，如果没有则使用id
      const siteId = data.abbrlink || data.id
      setRandomSiteId(siteId)
      
      // 直接使用API返回的数据作为推荐网站
      setRecommendedSite(data)
      
      // 不再更新URL hash
    } catch (error) {
      console.error('获取随机网站失败:', error)
      // 如果获取失败，使用默认的paper-planes
      setRandomSiteId('paper-planes')
    } finally {
      setIsLoading(false)
    }
  }

  // 处理URL参数的异步函数
  const handleUrlParams = async () => {
    // 优先使用传入的searchParams（服务端）
    let siteParam = searchParams?.site
    
    // 如果没有传入的searchParams，则从客户端URL获取
    if (!siteParam && typeof window !== 'undefined') {
      const urlSearchParams = new URLSearchParams(window.location.search)
      siteParam = urlSearchParams.get('site')
    }
    
    if (siteParam) {
      // 从数据库查询网站
      try {
        const res = await fetch(`/api/site-by-abbr/${encodeURIComponent(siteParam)}`, { 
          headers: { accept: 'application/json' } 
        })
        if (res.ok) {
          const site = await res.json()
          setRandomSiteId(site.abbrlink || site.id)
          setRecommendedSite(site)
          setShowRecommendedSite(true)
          setIsDirectAccess(true)
          setIsOpening(true)
          setIsSiteNotFound(false) // 重置未找到状态
          
          // 开始倒计时
          let countdownValue = 3
          setCountdown(countdownValue)
          
          const countdownInterval = setInterval(() => {
            countdownValue -= 1
            setCountdown(countdownValue)
            
            if (countdownValue <= 0) {
              clearInterval(countdownInterval)
              
              if (site.url) {
                // 发送 Umami 事件统计直接访问（仅在生产环境）
                if (typeof window !== 'undefined' && window.umami && shouldEnableAnalytics) {
                  const siteTitle = site.title_en || site.title || 'Unknown'
                  window.umami.track(`direct_access`)
                }
                
                window.open(site.url, '_blank')
                
                // 延迟清除状态
                setTimeout(() => {
                  setIsOpening(false)
                  setIsDirectAccess(false)
                  setShowRecommendedSite(false)
                  setCountdown(0)
                  // 跳转后清除查询条件
                  router.replace('/')
                }, 2000) // 延迟2秒清除状态
              }
            }
          }, 1000)
          return
        } else {
          // 网站不存在，显示未找到状态
          console.log('网站不存在，设置未找到状态')
          setIsSiteNotFound(true)
          setShowRecommendedSite(true)
          setIsDirectAccess(true)
          setIsOpening(false)
          setCountdown(0)
        }
      } catch (error) {
        console.error('查询网站失败:', error)
        // 查询失败，也显示未找到状态
        console.log('查询失败，设置未找到状态')
        setIsSiteNotFound(true)
        setShowRecommendedSite(true)
        setIsDirectAccess(true)
        setIsOpening(false)
        setCountdown(0)
      }
    }
    
    // 如果没有特殊URL参数，获取随机网站ID
    fetchRandomSiteId()
  }

  // 初始化时处理服务端传入的网站信息
  useEffect(() => {
    if (initialSite) {
      setRandomSiteId(initialSite.abbrlink || initialSite.id)
      setRecommendedSite(initialSite)
      setShowRecommendedSite(true)
      setIsDirectAccess(true)
      setIsOpening(true)
      
      // 开始倒计时
      let countdownValue = 3
      setCountdown(countdownValue)
      
      const countdownInterval = setInterval(() => {
        countdownValue -= 1
        setCountdown(countdownValue)
        
        if (countdownValue <= 0) {
          clearInterval(countdownInterval)
          
          if (initialSite.url) {
            // 发送 Umami 事件统计直接访问（仅在生产环境）
            if (typeof window !== 'undefined' && window.umami && shouldEnableAnalytics) {
              const siteTitle = initialSite.title_en || initialSite.title || 'Unknown'
              window.umami.track(`direct_access`)
            }
            
            window.open(initialSite.url, '_blank')
            
            // 延迟清除状态
            setTimeout(() => {
              setIsOpening(false)
              setIsDirectAccess(false)
              setShowRecommendedSite(false)
              setCountdown(0)
              // 跳转后清除查询条件
              router.replace('/')
            }, 2000) // 延迟2秒清除状态
          }
        }
      }, 1000)
    } else {
      // 如果没有服务端传入的网站信息，处理URL参数
      handleUrlParams()
    }
  }, [initialSite])

  // 服务端渲染时也处理URL参数
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const siteParam = searchParams.get('site')
      if (siteParam && !recommendedSite && !initialSite) {
        // 立即设置状态，避免闪烁
        setIsDirectAccess(true)
        setIsOpening(true)
      }
    }
  }, [recommendedSite, initialSite])

  // 不再需要hash监听器

  // 调试状态变化
  useEffect(() => {
    // 移除调试日志
  }, [isAnimating, showRecommendedSite, randomSiteId, language, currentLanguage])

    // 处理开始探索按钮点击
  const handleStartExploring = async () => {
    if (!isAnimating) {
      // 如果当前是未找到状态，先清除状态
      if (isSiteNotFound) {
        setIsSiteNotFound(false)
        setShowRecommendedSite(false)
        setIsDirectAccess(false)
        // 清除URL参数
        router.replace('/')
        // 开始随机探索
        fetchRandomSiteId()
        return
      }
      
      // 发送 Umami 事件统计点击次数（仅在生产环境）
      if (typeof window !== 'undefined' && window.umami && shouldEnableAnalytics) {
        window.umami.track('start_exploring_click')
      }
      
      // 随机选择360度方向角度
      const randomAngle = Math.random() * 360
      setAnimationAngle(randomAngle)
      
      setIsAnimating(true)
      
      // 获取新的随机网站
      let newSite = null
      try {
        const res = await fetch('/api/random', { headers: { accept: 'application/json' } })
        if (res.ok) {
          const data = await res.json()
          if (data?.id) {
            const siteId = data.abbrlink || data.id
            setRandomSiteId(siteId)
            
            // 直接使用API返回的数据
            newSite = {
              id: data.id,
              url: data.url,
              title: data.title,
  
              abbrlink: data.abbrlink,
              slug: data.slug
            }
            
            setRecommendedSite(newSite)
            // 不立即显示，等背景动画完成后再显示
            
            // 不再更新URL hash
          }
        }
      } catch (error) {
        // 如果获取失败，使用默认的paper-planes
        setRandomSiteId('paper-planes')
        newSite = sites.find(s => s.abbrlink === 'paper-planes' || s.id === 'paper-planes')
        if (newSite) {
          setRecommendedSite(newSite)
          // 不立即显示，等背景动画完成后再显示
        }
      }
      
      // 背景动画完成后显示推荐网站信息
      setTimeout(() => {
        setShowRecommendedSite(true) // 在背景动画完成后显示推荐信息
        setIsOpening(true) // 设置打开中状态
        
        // 显示推荐网站信息后跳转到真实网站
        setTimeout(() => {
          if (newSite && newSite.url) {
            // 发送 Umami 事件统计网站跳转（仅在生产环境）
            if (typeof window !== 'undefined' && window.umami && shouldEnableAnalytics) {
              const siteTitle = newSite.title?.en || newSite.title?.zh || 'Unknown'
              window.umami.track('website_redirect')
            }
            window.open(newSite.url, '_blank')
          }
          
          // 跳转后恢复初始状态
          setTimeout(() => {
            setIsAnimating(false)
            setShowRecommendedSite(false)
            setRecommendedSite(null)
            setAnimationAngle(0)
            setIsOpening(false) // 恢复打开中状态
          }, 500) // 跳转后0.5秒恢复状态
        }, 2000) // 显示2秒后跳转
      }, 1000) // 背景动画1秒后显示推荐信息
    }
  }

  // 重新获取随机网站
  const handleRefreshRecommendation = () => {
    setShowRecommendedSite(false)
    setRecommendedSite(null)
    fetchRandomSiteId()
  }

  return (
    <section className='w-full min-h-[100vh] border-b-2 border-solid border-dark dark:border-light flex flex-col items-center justify-center text-dark dark:text-light relative overflow-hidden'>
      {/* 网格背景移动动画层 */}
      <motion.div 
        className="absolute"
        style={{
          top: '-100%',
          left: '-100%',
          width: '300%',
          height: '300%',
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.22) 1px, transparent 1px),
            radial-gradient(rgba(99, 102, 241, 0.26) 1px, transparent 1px),
            radial-gradient(rgba(16, 185, 129, 0.26) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px, 36px 36px, 18px 18px, 18px 18px',
          backgroundPosition: '0 0, 0 0, 12px 12px, 0 0',
          zIndex: 0
        }}
        animate={isAnimating ? {
          x: Math.cos(animationAngle * Math.PI / 180) * 200,
          y: Math.sin(animationAngle * Math.PI / 180) * 200
        } : {
          x: 0,
          y: 0
        }}
        transition={{
          duration: 1.0,
          ease: "easeInOut"
        }}
        aria-hidden="true"
      />
      
      {/* 主要内容 */}
      <div className="relative z-10">
        <div className='w-full flex justify-center mb-0'>
          <Image
            src={logo}
            alt="W3Cay"
            className={`w-48 h-48 xs:w-56 xs:h-56 md:w-64 md:h-64 object-contain object-center transition-all duration-1000 ease-in-out animate-float`}
            priority
            sizes="(max-width: 768px) 192px,(max-width: 1180px) 224px, 256px"
          />
        </div>
        {/* 推荐标题（纯文字，显示在 logo 正下方） */}
        {(showRecommendedSite || isDirectAccess || initialSite) && (
          <motion.div 
            className="mt-4 mb-10 md:mb-1 text-center"
            initial={{ opacity: 0, scale: 0.5, y: 30, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
              damping: 12
            }}
          >
            {isSiteNotFound ? (
              <>
                <p className="text-xl font-semibold text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  {t('meta.discover.notFound')}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {t('meta.discover.notFoundDesc')}
                </p>
              </>
            ) : (recommendedSite || initialSite) && (
              <p className="text-xl font-semibold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {(recommendedSite || initialSite)?.title?.en || (recommendedSite || initialSite)?.title}
              </p>
            )}
          </motion.div>
        )}

        <div className='w-full flex flex-col text-center items-center justify-center px-5 sm:px-10 md:px-10 pb-10 pt-10'>
          <h1 className='font-bold text-4xl xs:text-5xl sxl:text-6xl text-center transition-all duration-1000 ease-in-out'>
            {t('heroTitle')}
          </h1>

          <p className='font-medium mt-4 text-base max-w-2xl text-center  transition-all duration-1000 ease-in-out'>
            {t('subtitle')}
          </p>

          {/* 原推荐网站信息卡片已移除 */}

          <button
            onClick={handleStartExploring}
            disabled={isAnimating || (isOpening && !isSiteNotFound) || (initialSite && !isSiteNotFound)}
            className={`mt-8 px-16 py-4 font-semibold text-lg rounded-lg transition-all duration-300 inline-block start-btn ${
              isAnimating || (isOpening && !isSiteNotFound) || (initialSite && !isSiteNotFound)
                ? 'bg-dark dark:bg-light text-light dark:text-dark opacity-50 cursor-not-allowed' 
                : 'bg-dark dark:bg-light text-light dark:text-dark'
            }`}
          >
            {isSiteNotFound
              ? t('discover.startExploring')
              : isOpening || initialSite
                ? countdown > 0 
                  ? `${t('discover.opening')} (${countdown}s)`
                  : t('discover.opening')
                : isAnimating 
                  ? t('discover.exploring')
                  : t('discover.startExploring')
            }
          </button>
        </div>
      </div>
    </section>
  )
}