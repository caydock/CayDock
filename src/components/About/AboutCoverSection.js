"use client";
import Image from 'next/image'
import React from 'react'
import profileCharacter from "../../../public/cay.webp"
import { useTranslations } from 'next-intl';

const AboutCoverSection = () => {
  const t = useTranslations('ui');
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
    <section className='w-full md:h-[75vh] border-b-2 border-solid border-dark dark:border-light flex flex-col md:flex-row items-center justify-center text-dark dark:text-light mt-10'>
        <style jsx>{styles}</style>
        <div className='w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center'> 
            <Image src={profileCharacter} alt="W3Cay" 
            className='w-4/5  xs:w-3/4 md:w-full h-full object-contain object-center img-float'
            priority
            sizes="(max-width: 768px) 100vw,(max-width: 1180px) 50vw, 50vw"
            />
        </div>

        <div className='w-full md:w-1/2 flex flex-col text-left items-start justify-center px-5 xs:p-10 pb-10 lg:px-16'>
            <h2 className='font-bold text-4xl xs:text-5xl sxl:text-6xl  text-center lg:text-left'>
            {t('about.heroTitle')}
            </h2>
            <p className='font-medium mt-4 text-base'>
            {t('about.heroDesc')}
            </p>
        </div>
    </section>
  )
}

export default AboutCoverSection