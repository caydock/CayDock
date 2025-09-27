"use client"
import Image from "next/image";
import Logo from "./Logo";
import SiteLogo from "./SiteLogo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useTranslations, useLocale } from 'next-intl';
import { useState } from "react";
import { cx } from "@/src/utils";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { Link } from '@/src/i18n/routing';

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const t = useTranslations('ui');
  const locale = useLocale();
  const isZh = locale === 'zh-cn';
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const toggleLanguage = () => {
    const newLocale = isZh ? 'en' : 'zh-cn';
    
    // 获取当前路径并处理语言切换
    const currentPath = window.location.pathname;
    let newPath;
    
    if (newLocale === 'zh-cn') {
      // 切换到中文
      if (currentPath === '/' || currentPath === '/en') {
        newPath = '/zh-cn';
      } else if (currentPath.startsWith('/en')) {
        newPath = currentPath.replace('/en', '/zh-cn');
      } else {
        newPath = `/zh-cn${currentPath}`;
      }
    } else {
      // 切换到英文
      if (currentPath === '/' || currentPath === '/zh-cn') {
        newPath = '/en';
      } else if (currentPath.startsWith('/zh-cn')) {
        newPath = currentPath.replace('/zh-cn', '/en');
      } else {
        newPath = `/en${currentPath}`;
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
        <Logo />
        <Link href="/" locale={locale} className="mx-2">{t('nav.home')}</Link>
        <Link href="/blog" locale={locale} className="mx-2">{t('blog.title')}</Link>
        <Link href="/submit" locale={locale} className="mx-2">{t('nav.submit')}</Link>
        <Link href="/about" locale={locale} className="mx-2">{t('nav.about')}</Link>
        <Link href="/contact" locale={locale} className="mx-2">{t('nav.contact')}</Link>
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
          <Link href="/" locale={locale} onClick={() => setOpen(false)}>{t('nav.home')}</Link>
          <Link href="/blog" locale={locale} onClick={() => setOpen(false)}>{t('blog.title')}</Link>
          <Link href="/submit" locale={locale} onClick={() => setOpen(false)}>{t('nav.submit')}</Link>
          <Link href="/contact" locale={locale} onClick={() => setOpen(false)}>{t('nav.contact')}</Link>
          <Link href="/about" locale={locale} onClick={() => setOpen(false)}>{t('nav.about')}</Link>
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