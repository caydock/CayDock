"use client"
import SiteLogo from "./SiteLogo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useTranslations } from 'next-intl';
import { getClientTranslation } from '@/src/i18n';
import { useState } from "react";
import { cx } from "@/src/utils";
import SmartLink from '../Elements/SmartLink';
import { usePathname as useNextPathname } from 'next/navigation';

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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
    <header className="w-full border-b border-dark/10 dark:border-light/10">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between relative">
        {/* Logo - Left side */}
        <div className="flex items-center">
          <SiteLogo />
        </div>

        {/* Desktop top nav - Center */}
        <nav className="hidden sm:flex items-center gap-6 font-medium">
        <SmartLink href="/blog" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{t('blog.title')}</SmartLink>
        <SmartLink href="/products" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{actualLocale === 'zh-cn' ? '产品' : 'Products'}</SmartLink>
        <SmartLink href="/about" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{t('nav.about')}</SmartLink>
        <SmartLink href="/subscribe" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{actualLocale === 'zh-cn' ? '订阅' : 'Subscribe'}</SmartLink>
        <SmartLink href="/categories/all" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{actualLocale === 'zh-cn' ? '标签' : 'Tags'}</SmartLink>
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
        {/* Search button */}
        <button onClick={() => setShowSearch(!showSearch)} className="w-6 h-6 flex items-center justify-center" aria-label="search">
          <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        
        {/* Language switcher */}
        {isEnglishSite ? (
          <SmartLink
            href={`/zh-cn${nextPathname}`}
            className="px-2 py-1 text-xs font-bold bg-blue-500 text-white"
            aria-label="language-switcher"
          >
            中文
          </SmartLink>
        ) : (
          <SmartLink
            href={nextPathname.replace('/zh-cn', '') || '/'}
            className="px-2 py-1 text-xs font-bold bg-green-500 text-white"
            aria-label="language-switcher"
          >
            EN
          </SmartLink>
        )}
        
        {/* Theme switcher */}
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")} className={cx("w-6 h-6 flex items-center justify-center", mode === "light" ? "text-dark" : "text-light")} aria-label="theme-switcher">
          {mode === "light" ? <MoonIcon className={"fill-dark"} /> : <SunIcon className={"fill-light"} />}
        </button>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(true)}
          aria-label="open-menu"
          className="sm:hidden w-6 h-6 flex items-center justify-center"
        >
          <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        </div>
      </div>

      {/* Mobile side drawer */}
      <div className={cx("sm:hidden fixed inset-0 z-50 transition-opacity", open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
           onClick={() => setOpen(false)}
           aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <aside
        className={cx(
          "sm:hidden fixed top-0 left-0 h-full w-4/5 max-w-[320px] z-50 bg-light dark:bg-dark border-r border-dark/10 dark:border-light/10 shadow-2xl transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-dark/10 dark:border-light/10">
          <SiteLogo />
          <button aria-label="close-menu" onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center dark:text-light">
            ×
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-3 text-lg dark:text-light">
          <SmartLink href="/blog" locale={actualLocale} onClick={() => setOpen(false)}>{t('blog.title')}</SmartLink>
          <SmartLink href="/products" locale={actualLocale} onClick={() => setOpen(false)}>{actualLocale === 'zh-cn' ? '产品' : 'Products'}</SmartLink>
          <SmartLink href="/about" locale={actualLocale} onClick={() => setOpen(false)}>{t('nav.about')}</SmartLink>
          <SmartLink href="/subscribe" locale={actualLocale} onClick={() => setOpen(false)}>{actualLocale === 'zh-cn' ? '订阅' : 'Subscribe'}</SmartLink>
          <SmartLink href="/categories/all" locale={actualLocale} onClick={() => setOpen(false)}>{actualLocale === 'zh-cn' ? '标签' : 'Tags'}</SmartLink>
          <button onClick={() => { setShowSearch(!showSearch); setOpen(false); }} className="mt-2 w-6 h-6 rounded-full flex items-center justify-center" aria-label="search">
            <svg className="w-full h-full fill-dark dark:fill-light" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          {isEnglishSite ? (
            <SmartLink
              href={`/zh-cn${nextPathname}`}
              className="mt-2 px-3 py-1 text-xs font-bold bg-blue-500 text-white"
              onClick={() => setOpen(false)}
              aria-label="language-switcher"
            >
              中文
            </SmartLink>
          ) : (
            <SmartLink
              href={nextPathname.replace('/zh-cn', '') || '/'}
              className="mt-2 px-3 py-1 text-xs font-bold bg-green-500 text-white"
              onClick={() => setOpen(false)}
              aria-label="language-switcher"
            >
              EN
            </SmartLink>
          )}
          <button onClick={() => { setMode(mode === "light" ? "dark" : "light"); }} className={cx("mt-2 w-6 h-6 rounded-full flex items-center justify-center border", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")} aria-label="theme-switcher">
            {mode === "light" ? <MoonIcon className={"fill-current"} /> : <SunIcon className={"fill-current"} />}
          </button>
        </nav>
      </aside>
    </header>
  )
}

export default Header;