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

export default function HomePage({ initialLanguage = 'en' }) {
  const { language } = useLanguage()
  const currentLanguage = language || initialLanguage
  const isZh = currentLanguage?.startsWith('zh')
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
    } catch (error) {
      console.error('获取随机网站失败:', error)
      // 如果获取失败，使用默认的paper-planes
      setRandomSiteId('paper-planes')
    } finally {
      setIsLoading(false)
    }
  }

  // 组件加载时获取随机网站ID
  useEffect(() => {
    fetchRandomSiteId()
  }, [])

  // 调试状态变化
  useEffect(() => {
    console.log('状态变化:', { isAnimating, showRecommendedSite, randomSiteId })
  }, [isAnimating, showRecommendedSite, randomSiteId])

  // 处理开始探索按钮点击
  const handleStartExploring = () => {
    console.log('开始探索按钮被点击', { randomSiteId, isAnimating })
    if (randomSiteId && !isAnimating) {
      console.log('开始动画')
      
      // 随机选择360度方向角度
      const randomAngle = Math.random() * 360
      setAnimationAngle(randomAngle)
      
      setIsAnimating(true)
      
      // 找到对应的推荐网站数据
      const site = sites.find(s => s.abbrlink === randomSiteId || s.id === randomSiteId)
      console.log('找到推荐网站:', site)
      setRecommendedSite(site)
      
      // 动画结束后显示推荐网站信息
      setTimeout(() => {
        console.log('显示推荐网站信息')
        setShowRecommendedSite(true)
        
        // 显示推荐网站信息后跳转到真实网站
        setTimeout(() => {
          console.log('跳转到网站:', site?.url)
          setIsOpening(true) // 设置打开中状态
          if (site && site.url) {
            window.open(site.url, '_blank')
          }
          
          // 跳转后恢复初始状态
          setTimeout(() => {
            console.log('恢复初始状态')
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

  return (
    <section className='w-full min-h-[100vh] border-b-2 border-solid border-dark dark:border-light flex flex-col items-center justify-center text-dark dark:text-light relative overflow-hidden'>
      {/* 网格背景移动动画层 */}
      <motion.div 
        className="absolute"
        style={{
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
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
          x: Math.cos(animationAngle * Math.PI / 180) * 300,
          y: Math.sin(animationAngle * Math.PI / 180) * 300
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
            className={`w-48 h-48 xs:w-56 xs:h-56 md:w-64 md:h-64 object-contain object-center transition-all duration-1000 ease-in-out ${isAnimating ? 'animate-float' : ''}`}
            priority
            sizes="(max-width: 768px) 192px,(max-width: 1180px) 224px, 256px"
          />
        </div>
        {/* 推荐标题（纯文字，显示在 logo 正下方） */}
        {showRecommendedSite && recommendedSite && (
          <p className="mt-4 text-xl font-semibold text-center">
            {recommendedSite.title.zh || recommendedSite.title.en}
          </p>
        )}

        <div className='w-full flex flex-col text-center items-center justify-center px-5 xs:p-10 pb-10 lg:px-16'>
          <h2 className='font-bold text-4xl xs:text-5xl sxl:text-6xl text-center transition-all duration-1000 ease-in-out'>
            {isZh ? '探索有趣网站的宝藏小岛' : 'Weird Wonder Web Cay'}
          </h2>
          <p className='font-medium mt-4 text-base max-w-2xl transition-all duration-1000 ease-in-out'>
            {isZh ? zhTdk.description : enTdk.description}
          </p>

          {/* 原推荐网站信息卡片已移除 */}

          {randomSiteId ? (
            <button
              onClick={handleStartExploring}
              disabled={isAnimating || isOpening}
              className={`mt-8 px-12 py-4 font-semibold text-lg rounded-lg transition-all duration-300 inline-block start-btn ${
                isAnimating || isOpening
                  ? 'bg-dark dark:bg-light text-light dark:text-dark opacity-50 cursor-not-allowed' 
                  : 'bg-dark dark:bg-light text-light dark:text-dark hover:bg-opacity-80'
              }`}
            >
              {isOpening 
                ? '打开中...'
                : isAnimating 
                  ? '探索中...'
                  : '开始探索'
              }
            </button>
          ) : (
            <button
              className='mt-8 px-12 py-4 bg-dark dark:bg-light text-light dark:text-dark font-semibold text-lg rounded-lg opacity-50 cursor-not-allowed'
              disabled
            >
              {isLoading ? '加载中...' : '开始探索'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
} 