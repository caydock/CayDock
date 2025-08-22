"use client";
import Link from 'next/link'
import Image from "next/image"
import logo from "@/public/about-logo.webp"
import enTdk from '@/src/i18n/tdk/en.json'
import zhTdk from '@/src/i18n/tdk/zh.json'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'
import { useState, useEffect } from 'react'
import { sites } from '@/src/data/sites'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function HomePage({ initialLanguage = 'en' }) {
  const { language, t } = useLanguage()
  const currentLanguage = language || initialLanguage
  const isZh = currentLanguage?.startsWith('zh')
  const router = useRouter()
  const [randomSiteId, setRandomSiteId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showRecommendedSite, setShowRecommendedSite] = useState(false)
  const [recommendedSite, setRecommendedSite] = useState(null)
  const [animationAngle, setAnimationAngle] = useState(0)
  const [isOpening, setIsOpening] = useState(false)

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
      
      // 找到对应的推荐网站数据（但不显示）
      const site = sites.find(s => s.abbrlink === siteId || s.id === siteId)
      if (site) {
        setRecommendedSite(site)
        // 不设置 setShowRecommendedSite(true)，只在用户点击按钮时显示
      }
      
      // 不再更新URL hash
    } catch (error) {
      console.error('获取随机网站失败:', error)
      // 如果获取失败，使用默认的paper-planes
      setRandomSiteId('paper-planes')
    } finally {
      setIsLoading(false)
    }
  }

  // 组件加载时处理URL和获取随机网站ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const searchParams = new URLSearchParams(window.location.search)
      
      // 处理 /post/xxx 格式的URL
      const postMatch = pathname.match(/^\/post\/(.+)$/)
      if (postMatch) {
        const postId = postMatch[1]
        // 跳转到 /?site=xxx
        router.replace(`/?site=${postId}`)
        return
      }
      
      // 处理 /?site=xxx 格式的URL
      const siteParam = searchParams.get('site')
      if (siteParam) {
        // 查找对应的网站
        const site = sites.find(s => s.abbrlink === siteParam || s.id === siteParam)
        if (site) {
          setRandomSiteId(site.abbrlink || site.id)
          setRecommendedSite(site)
          
          // 自动跳转到对应网站
          setTimeout(() => {
            if (site.url) {
              
              // 发送 Umami 事件统计直接访问
              if (typeof window !== 'undefined' && window.umami) {
                const siteTitle = site.title?.en || site.title?.zh || 'Unknown'
                window.umami.track(`direct_access`)
              }
              
              window.open(site.url, '_blank')
              
              // 跳转后清除查询条件
              router.replace('/')
            }
          }, 1000) // 延迟1秒跳转
          return
        }
      }
    }
    
    // 如果没有特殊URL参数，不调用random接口，保持初始状态
  }, [])

  // 不再需要hash监听器

  // 调试状态变化
  useEffect(() => {
    // 移除调试日志
  }, [isAnimating, showRecommendedSite, randomSiteId, language, currentLanguage])

    // 处理开始探索按钮点击
  const handleStartExploring = async () => {
    if (!isAnimating) {
      // 发送 Umami 事件统计点击次数
      if (typeof window !== 'undefined' && window.umami) {
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
            // 发送 Umami 事件统计网站跳转
            if (typeof window !== 'undefined' && window.umami) {
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
        {showRecommendedSite && recommendedSite && (
          <motion.p 
            className="mt-4 mb-10 text-xl font-semibold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.5, y: 30, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
              damping: 12
            }}
            style={{}}
          >
            {recommendedSite.title.en}
          </motion.p>
        )}

        <div className='w-full flex flex-col text-center items-center justify-center px-5 xs:p-10 pb-10 lg:px-16'>
          <h1 className='font-bold text-4xl xs:text-5xl sxl:text-6xl text-center transition-all duration-1000 ease-in-out'>
            {isZh ? '探索有趣网站的宝藏小岛' : 'Weird Wonder Web Cay'}
          </h1>

          <p className='font-medium mt-4 text-base max-w-2xl text-center  transition-all duration-1000 ease-in-out'>
            {t('subtitle')}
          </p>

          {/* 原推荐网站信息卡片已移除 */}

          <button
            onClick={handleStartExploring}
            disabled={isAnimating || isOpening}
            className={`mt-8 px-12 py-4 font-semibold text-lg rounded-lg transition-all duration-300 inline-block start-btn ${
              isAnimating || isOpening
                ? 'bg-dark dark:bg-light text-light dark:text-dark opacity-50 cursor-not-allowed' 
                : 'bg-dark dark:bg-light text-light dark:text-dark'
            }`}
          >
            {isOpening 
              ? t('discover.opening')
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