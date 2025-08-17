"use client";
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'
import Image from "next/image"
import logo from "@/public/about-logo.webp"


export default function HomePage() {
  const router = useRouter()
  const { language, t } = useLanguage()

  const handleStartDiscover = () => {
    router.push('/discover')
  }

  const styles = `
    .img-float { 
      animation: floatY 3.5s ease-in-out infinite; 
      will-change: transform; 
    }
    @keyframes floatY {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .img-float { animation: none; }
    }
  `

  return (
    <>
      <style jsx>{styles}</style>
      <section className='w-full min-h-[100vh] border-b-2 border-solid border-dark dark:border-light flex flex-col items-center justify-center text-dark dark:text-light'>
        <div className='w-full flex justify-center mb-0'> 
          <Image 
            src={logo} 
            alt="W3Cay" 
            className='w-48 h-48 xs:w-56 xs:h-56 md:w-64 md:h-64 object-contain object-center img-float'
            priority
            sizes="(max-width: 768px) 192px,(max-width: 1180px) 224px, 256px"
          />
        </div>

        <div className='w-full flex flex-col text-center items-center justify-center px-5 xs:p-10 pb-10 lg:px-16'>
          <h2 className='font-bold text-4xl xs:text-5xl sxl:text-6xl text-center'>
            {language?.startsWith('zh') ? '探索有趣网站的宝藏小岛' : 'Weird Wonder Web Cay'}
          </h2>
          <p className='font-medium mt-4 text-base max-w-2xl'>
            {language?.startsWith('zh') 
              ? '一个收集有趣网站的宝藏小岛，发现有趣网站，探索未知世界。' 
              : 'Random discovery weird and wonderful websites. Curated links, tools, games and AI experiences.'
            }
          </p>
          
          <button 
            className='mt-8 px-12 py-4 bg-dark dark:bg-light text-light dark:text-dark font-semibold text-lg rounded-lg hover:bg-opacity-80 transition-all duration-300'
            onClick={handleStartDiscover}
          >
            {language?.startsWith('zh') ? '开始探索' : 'Start Discovering'}
          </button>
        </div>
      </section>
    </>
  )
} 