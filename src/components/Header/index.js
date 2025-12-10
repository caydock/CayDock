"use client"
import SiteLogo from "./SiteLogo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useTranslations } from 'next-intl';
import { getClientTranslation } from '@/src/i18n';
import { useState, useEffect } from "react";
import { cx } from "@/src/utils";
import SmartLink from '../Elements/SmartLink';
import { usePathname as useNextPathname } from 'next/navigation';
import { useMemoizedFn } from '@/src/hooks/useMemoizedFn';

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const [open, setOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const nextPathname = useNextPathname();
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 判断是否为英文站（根目录）- 使用真实的浏览器路径
  const isEnglishSite = !nextPathname.startsWith('/zh-cn');
  const actualLocale = isEnglishSite ? 'en' : 'zh-cn';
  
  // 获取不包含语言前缀的路径
  const cleanPathname = isEnglishSite 
    ? nextPathname 
    : (nextPathname.replace('/zh-cn', '') || '/');
  
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
    <header className={cx(
      "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300",
      isScrolled 
        ? "bg-light/95 dark:bg-dark/95 border-dark/10 dark:border-light/10" 
        : "bg-light/30 dark:bg-dark/30 border-dark/5 dark:border-light/5"
    )}>
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between relative">
        {/* Logo - Left side */}
        <div className="flex items-center">
          <SiteLogo />
        </div>

        {/* Desktop top nav - Center */}
        <nav className="hidden sm:flex items-center gap-6 font-medium">
        <SmartLink href="/posts" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{t('blog.title')}</SmartLink>
        <SmartLink href="/products" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{actualLocale === 'zh-cn' ? '产品' : 'Products'}</SmartLink>
        <SmartLink href="/about" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{t('nav.about')}</SmartLink>
        <SmartLink href="/subscribe" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{actualLocale === 'zh-cn' ? '订阅' : 'Subscribe'}</SmartLink>
        <SmartLink href="/tags" locale={actualLocale} className="text-dark dark:text-light hover:opacity-70 transition-opacity">{actualLocale === 'zh-cn' ? '标签' : 'Tags'}</SmartLink>
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
        {/* Language switcher - Dropdown */}
        <div 
          className="relative group"
          onMouseEnter={() => setShowLangDropdown(true)}
          onMouseLeave={() => setShowLangDropdown(false)}
        >
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-dark dark:text-light hover:opacity-70 transition-opacity"
            aria-label="language-switcher"
            aria-expanded={showLangDropdown}
          >
            {/* Language Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-sm font-medium">{actualLocale === 'zh-cn' ? '中文' : 'EN'}</span>
            {/* Dropdown Arrow */}
            <svg 
              className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showLangDropdown && (
            <div 
              className="absolute left-0 top-full pt-2 w-32 z-50"
              onMouseEnter={() => setShowLangDropdown(true)}
              onMouseLeave={() => setShowLangDropdown(false)}
            >
              <div className="bg-light dark:bg-dark rounded-md shadow-lg overflow-hidden">
                {isEnglishSite ? (
                  <SmartLink
                    href={cleanPathname}
                    locale="zh-cn"
                    className="block px-4 py-2 text-sm text-dark dark:text-light hover:opacity-70 transition-opacity"
                  >
                    中文
                  </SmartLink>
                ) : (
                  <SmartLink
                    href={cleanPathname}
                    locale="en"
                    className="block px-4 py-2 text-sm text-dark dark:text-light hover:opacity-70 transition-opacity"
                  >
                    English
                  </SmartLink>
                )}
              </div>
            </div>
          )}
        </div>
        
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
          <SmartLink href="/posts" locale={actualLocale} onClick={() => setOpen(false)}>{t('blog.title')}</SmartLink>
          <SmartLink href="/products" locale={actualLocale} onClick={() => setOpen(false)}>{actualLocale === 'zh-cn' ? '产品' : 'Products'}</SmartLink>
          <SmartLink href="/about" locale={actualLocale} onClick={() => setOpen(false)}>{t('nav.about')}</SmartLink>
          <SmartLink href="/subscribe" locale={actualLocale} onClick={() => setOpen(false)}>{actualLocale === 'zh-cn' ? '订阅' : 'Subscribe'}</SmartLink>
          <SmartLink href="/tags" locale={actualLocale} onClick={() => setOpen(false)}>{actualLocale === 'zh-cn' ? '标签' : 'Tags'}</SmartLink>
          <div className="mt-2 flex items-center gap-2">
            <svg className="w-5 h-5 fill-dark dark:fill-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {isEnglishSite ? (
              <SmartLink
                href={`/zh-cn${nextPathname}`}
                locale="zh-cn"
                className="text-sm font-medium text-dark dark:text-light hover:opacity-70 transition-opacity"
                onClick={() => setOpen(false)}
                aria-label="language-switcher"
              >
                中文
              </SmartLink>
            ) : (
              <SmartLink
                href={nextPathname.replace('/zh-cn', '') || '/'}
                locale="en"
                className="text-sm font-medium text-dark dark:text-light hover:opacity-70 transition-opacity"
                onClick={() => setOpen(false)}
                aria-label="language-switcher"
              >
                English
              </SmartLink>
            )}
          </div>
          <button onClick={() => { setMode(mode === "light" ? "dark" : "light"); }} className={cx("mt-2 w-6 h-6 rounded-full flex items-center justify-center border", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")} aria-label="theme-switcher">
            {mode === "light" ? <MoonIcon className={"fill-current"} /> : <SunIcon className={"fill-current"} />}
          </button>
        </nav>
      </aside>
    </header>
  )
}

export default Header;