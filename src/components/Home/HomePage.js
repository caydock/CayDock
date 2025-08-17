"use client";
import Link from 'next/link'
import Image from "next/image"
import logo from "@/public/about-logo.webp"
import enTdk from '@/src/i18n/tdk/en.json'
import zhTdk from '@/src/i18n/tdk/zh.json'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'
import { useState, useEffect } from 'react'

export default function HomePage({ initialLanguage = 'en' }) {
  const { language } = useLanguage()
  const currentLanguage = language || initialLanguage
  const isZh = currentLanguage?.startsWith('zh')
  const [randomSiteId, setRandomSiteId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <section className='w-full min-h-[100vh] border-b-2 border-solid border-dark dark:border-light flex flex-col items-center justify-center text-dark dark:text-light'>
      <div className='w-full flex justify-center mb-0'>
        <Image
          src={logo}
          alt="W3Cay"
          className='w-48 h-48 xs:w-56 xs:h-56 md:w-64 md:h-64 object-contain object-center animate-float'
          priority
          sizes="(max-width: 768px) 192px,(max-width: 1180px) 224px, 256px"
        />
      </div>

      <div className='w-full flex flex-col text-center items-center justify-center px-5 xs:p-10 pb-10 lg:px-16'>
        <h2 className='font-bold text-4xl xs:text-5xl sxl:text-6xl text-center'>
          {isZh ? '探索有趣网站的宝藏小岛' : 'Weird Wonder Web Cay'}
        </h2>
        <p className='font-medium mt-4 text-base max-w-2xl'>
          {isZh ? zhTdk.description : enTdk.description}
        </p>

        {randomSiteId ? (
          <Link
            href={`/site?id=${randomSiteId}`}
            className='mt-8 px-12 py-4 bg-dark dark:bg-light text-light dark:text-dark font-semibold text-lg rounded-lg hover:bg-opacity-80 transition-all duration-300 inline-block start-btn'
          >
            {isZh ? '开始探索' : 'Start Discovering'}
          </Link>
        ) : (
          <button
            className='mt-8 px-12 py-4 bg-dark dark:bg-light text-light dark:text-dark font-semibold text-lg rounded-lg opacity-50 cursor-not-allowed'
            disabled
          >
            {isLoading ? (isZh ? '加载中...' : 'Loading...') : (isZh ? '开始探索' : 'Start Discovering')}
          </button>
        )}
      </div>
    </section>
  )
} 