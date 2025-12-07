"use client";
import React from "react";
import { useTranslations } from 'next-intl';
import { getClientTranslation } from '@/src/i18n';
import { usePathname as useNextPathname } from 'next/navigation';
import SmartLink from '../Elements/SmartLink';

const Footer = () => {
  const nextPathname = useNextPathname();
  
  // 判断是否为英文站（根目录）- 使用真实的浏览器路径
  const isEnglishSite = !nextPathname.startsWith('/zh-cn');
  const actualLocale = isEnglishSite ? 'en' : 'zh-cn';
  
  // 根据实际语言获取翻译
  const defaultT = useTranslations('ui');
  const translationLang = actualLocale === 'zh-cn' ? 'zh' : 'en';
  const actualTranslations = getClientTranslation(translationLang);
  
  // 创建支持嵌套键的翻译函数
  const t = (key) => {
    if (actualTranslations) {
      const keys = key.split('.');
      let value = actualTranslations;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return defaultT(key);
        }
      }
      if (typeof value === 'string') {
        return value;
      }
    }
    return defaultT(key);
  };

  return (
    <footer className="flex flex-col items-center text-dark dark:text-light relative bg-light dark:bg-dark z-20">
      <div className="w-full max-w-7xl mx-auto relative font-medium border-t border-solid border-dark/10 dark:border-light/10 py-6 px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between">
        <span className="text-center text-base sm:text-base">
          &copy;2025 CayDock. {t('footer.allRights')}
        </span>
        <div className="text-center my-4 md:my-0 flex items-center gap-4 text-base sm:text-base">
          <SmartLink href="/terms-of-service" locale={actualLocale} className="underline">{t('legal.terms')}</SmartLink>
          <SmartLink href="/privacy-policy" locale={actualLocale} className="underline">{t('legal.privacy')}</SmartLink>
          <SmartLink href="/disclaimer" locale={actualLocale} className="underline">{t('legal.disclaimer')}</SmartLink>
          <a href="/sitemap.xml" className="underline">{t('footer.sitemap')}</a>
        </div>
        <div className="text-center flex items-center gap-3 text-base sm:text-base">
          <span>
            {t('footer.madeWithBy')}{" "}
            <a href="https://caydock.com" className="underline" target="_blank">
              CayDock
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
