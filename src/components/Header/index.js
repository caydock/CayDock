"use client"
import Image from "next/image";
import Logo from "./Logo";
import SiteLogo from "./SiteLogo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useTranslations, useLocale } from 'next-intl';
import { getClientTranslation } from '@/src/i18n';
import { useState } from "react";
import { cx } from "@/src/utils";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import SmartLink from '../Elements/SmartLink';
import { usePathname as useNextPathname } from 'next/navigation';

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const locale = useLocale();
  const isZh = locale === 'zh-cn';
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = useIntlPathname();
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
  
  const toggleLanguage = () => {
    const newLocale = isZh ? 'en' : 'zh-cn';
    
    // 获取当前路径并处理语言切换
    const currentPath = window.location.pathname;
    let newPath;
    
    if (newLocale === 'zh-cn') {
      // 切换到中文 - 添加 /zh-cn 前缀
      if (currentPath === '/') {
        newPath = '/zh-cn';
      } else {
        newPath = `/zh-cn${currentPath}`;
      }
    } else {
      // 切换到英文 - 移除 /zh-cn 前缀
      if (currentPath === '/zh-cn') {
        newPath = '/';
      } else if (currentPath.startsWith('/zh-cn')) {
        newPath = currentPath.replace('/zh-cn', '');
        // 确保路径以 / 开头
        if (!newPath.startsWith('/')) {
          newPath = '/' + newPath;
        }
      } else {
        // 如果当前路径不包含语言前缀，保持不变
        newPath = currentPath;
      }
    }
    
    // 使用 Next.js router 进行导航
    router.push(newPath);
  };

  return (
    <header className="w-full px-5 sm:px-10 flex items-center justify-center relative">
      {/* Mobile top: menu button with logo */}
      <div className="sm:hidden absolute left-4 z-40">
        <button
          onClick={() => setOpen(true)}
          aria-label="open-menu"
          className={cx("w-10 h-10 rounded-full flex items-center justify-center border border-dark/70 bg-light dark:bg-dark overflow-hidden shadow-sm")}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <Image 
              src={logo} 
              alt="w3cay logo" 
              className="w-full h-auto rounded-full" 
              sizes="20vw"
              onError={(e) => {
                // 如果图片加载失败，隐藏图片元素
                e.target.style.display = 'none';
              }}
            />
          </div>
        </button>
      </div>

      {/* Desktop top nav */}
      <nav className="w-max py-3 px-6 sm:px-8 border border-solid border-dark rounded-full font-medium capitalize items-center hidden sm:flex fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50">
        <Logo locale={actualLocale} />
        <SmartLink href="/" locale={actualLocale} className="mx-2">{t('nav.home')}</SmartLink>
        <SmartLink href="/blog" locale={actualLocale} className="mx-2">{t('blog.title')}</SmartLink>
        <SmartLink href="/submit" locale={actualLocale} className="mx-2">{t('nav.submit')}</SmartLink>
        <SmartLink href="/about" locale={actualLocale} className="mx-2">{t('nav.about')}</SmartLink>
        <SmartLink href="/contact" locale={actualLocale} className="mx-2">{t('nav.contact')}</SmartLink>
        <button onClick={toggleLanguage} className={cx("w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1 text-xs font-bold", isZh ? "bg-blue-500 text-white" : "bg-green-500 text-white")} aria-label="language-switcher">
          {isZh ? 'EN' : '中'}
        </button>
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")} className={cx("w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")} aria-label="theme-switcher">
          {mode === "light" ? <MoonIcon className={"fill-dark"} /> : <SunIcon className={"fill-dark"} />}
        </button>
      </nav>

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
          <SiteLogo sizeClass="w-32" />
          <button aria-label="close-menu" onClick={() => setOpen(false)} className="w-9 h-9 rounded-full border border-dark/70 flex items-center justify-center dark:text-light">
            ×
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-3 text-lg dark:text-light">
          <SmartLink href="/" locale={actualLocale} onClick={() => setOpen(false)}>{t('nav.home')}</SmartLink>
          <SmartLink href="/blog" locale={actualLocale} onClick={() => setOpen(false)}>{t('blog.title')}</SmartLink>
          <SmartLink href="/submit" locale={actualLocale} onClick={() => setOpen(false)}>{t('nav.submit')}</SmartLink>
          <SmartLink href="/contact" locale={actualLocale} onClick={() => setOpen(false)}>{t('nav.contact')}</SmartLink>
          <SmartLink href="/about" locale={actualLocale} onClick={() => setOpen(false)}>{t('nav.about')}</SmartLink>
          {/* Contact hidden on mobile per earlier request */}
          <button onClick={toggleLanguage} className={cx("mt-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", isZh ? "bg-blue-500 text-white" : "bg-green-500 text-white")} aria-label="language-switcher">
            {isZh ? 'EN' : '中'}
          </button>
          <button onClick={() => { setMode(mode === "light" ? "dark" : "light"); }} className={cx("mt-2 w-6 h-6 rounded-full flex items-center justify-center border", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")} aria-label="theme-switcher">
            {mode === "light" ? <MoonIcon className={"fill-current"} /> : <SunIcon className={"fill-current"} />}
          </button>
        </nav>
      </aside>
    </header>
  )
}

export default Header;