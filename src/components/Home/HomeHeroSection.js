"use client";
import Image from 'next/image';
import React from 'react';
import profileCharacter from "../../../public/cay.webp";
import { useTranslations, useLocale } from 'next-intl';
import siteMetadata from '@/src/utils/siteMetaData';

const HomeHeroSection = () => {
  const t = useTranslations('ui');
  const locale = useLocale();

  return (
    <section className='w-full flex flex-col items-center justify-center py-8 md:py-12 px-5 sm:px-10'>
      {/* Avatar */}
      <div className='w-32 h-32 xs:w-36 xs:h-36 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden'>
        <Image 
          src={profileCharacter} 
          alt="CayDock" 
          className='w-full h-full object-contain object-center'
          priority
          sizes="(max-width: 768px) 128px,(max-width: 1180px) 144px, 160px"
        />
      </div>

      {/* Name */}
      <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl mb-3 text-dark dark:text-light'>
        CayDock
      </h1>

      {/* Social Icons */}
      <div className='flex items-center justify-center gap-4 mb-4'>
        {siteMetadata.github && (
          <a
            href={siteMetadata.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 hover:scale-125 transition-all ease duration-200"
            aria-label="GitHub"
          >
            <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        )}
        {siteMetadata.twitter && (
          <a
            href={siteMetadata.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 hover:scale-125 transition-all ease duration-200"
            aria-label="Twitter"
          >
            <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        )}
        {siteMetadata.email && (
          <a
            href={`mailto:${siteMetadata.email}`}
            className="w-5 h-5 hover:scale-125 transition-all ease duration-200"
            aria-label="Email"
          >
            <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
              <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
            </svg>
          </a>
        )}
      </div>

      {/* Greeting */}
      <h2 className='font-bold text-xl md:text-2xl lg:text-3xl mb-2 text-dark dark:text-light text-center'>
        {t('heroTitle')}
      </h2>

      {/* Profession */}
      <p className='font-semibold text-base md:text-lg lg:text-xl mb-3 text-dark dark:text-light text-center'>
        {t('subtitle')}
      </p>

      {/* Description */}
      <p className='font-medium text-sm md:text-base text-dark/80 dark:text-light/80 text-center max-w-2xl mx-auto'>
        {locale === 'zh-cn' 
          ? '在这里分享我的产品、技术经验和一些思考，也分享一些我读过的书和一些生活琐事'
          : 'My goal is to be a free independent developer, sharing my thoughts, experiences, and growth journey here'
        }
      </p>
    </section>
  );
};

export default HomeHeroSection;

