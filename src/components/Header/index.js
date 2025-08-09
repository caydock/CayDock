"use client"
import Link from "next/link";
import Logo from "./Logo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";
import { cx } from "@/src/utils";

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const { t } = useLanguage();

  return (
    <header className="w-full p-6 px-5 sm:px-10 flex items-center justify-center relative">
      <nav className="w-max py-3 px-6 sm:px-8 border border-solid border-dark rounded-full font-medium capitalize items-center flex fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50">
        <Logo />
        <Link href="/" className="mx-2">{t('nav.home')}</Link>
        <Link href="/blogs" className="mx-2">{t('nav.blogs')}</Link>
        <Link href="/submit" className="mx-2">{t('nav.submit')}</Link>
        <Link href="/about" className="mx-2">{t('nav.about')}</Link>
        <Link href="/contact" className="mx-2 hidden sm:inline">{t('nav.contact')}</Link>
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")} className={cx("w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")} aria-label="theme-switcher">
          {mode === "light" ? <MoonIcon className={"fill-dark"} /> : <SunIcon className={"fill-dark"} />}
        </button>
      </nav>
    </header>
  )
}

export default Header;