"use client"
import Link from "next/link";
import Logo from "./Logo";
import SiteLogo from "./SiteLogo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";
import { useState } from "react";
import { cx } from "@/src/utils";

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full p-4 sm:p-6 px-5 sm:px-10 flex items-center justify-center relative">
      {/* Mobile top: centered Logo and hamburger */}
      <div className="sm:hidden absolute left-4">
        <button
          onClick={() => setOpen(true)}
          aria-label="open-menu"
          className={cx("w-9 h-9 rounded-full flex items-center justify-center border border-dark/70 bg-light text-dark dark:bg-dark dark:text-light")}
        >
          <span className="block w-4 h-0.5 bg-current relative">
            <span className="absolute -top-2 left-0 w-4 h-0.5 bg-current" />
            <span className="absolute top-2 left-0 w-4 h-0.5 bg-current" />
          </span>
        </button>
      </div>
      <div className="sm:hidden">
        <SiteLogo sizeClass="w-32" />
      </div>

      {/* Desktop top nav */}
      <nav className="w-max py-3 px-6 sm:px-8 border border-solid border-dark rounded-full font-medium capitalize items-center hidden sm:flex fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50">
        <Logo />
        <Link href="/" className="mx-2">{t('nav.home')}</Link>
        <Link href="/submit" className="mx-2">{t('nav.submit')}</Link>
        <Link href="/about" className="mx-2">{t('nav.about')}</Link>
        <Link href="/contact" className="mx-2">{t('nav.contact')}</Link>
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
          <Link href="/" onClick={() => setOpen(false)}>{t('nav.home')}</Link>
          <Link href="/submit" onClick={() => setOpen(false)}>{t('nav.submit')}</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>{t('nav.contact')}</Link>
          <Link href="/about" onClick={() => setOpen(false)}>{t('nav.about')}</Link>
          {/* Contact hidden on mobile per earlier request */}
          <button onClick={() => { setMode(mode === "light" ? "dark" : "light"); }} className={cx("mt-2 w-6 h-6 rounded-full flex items-center justify-center border", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")} aria-label="theme-switcher">
            {mode === "light" ? <MoonIcon className={"fill-current"} /> : <SunIcon className={"fill-current"} />}
          </button>
        </nav>
      </aside>
    </header>
  )
}

export default Header;