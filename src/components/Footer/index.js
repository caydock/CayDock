"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { DribbbleIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "../Icons";
import Link from "next/link";
import siteMetadata from "@/src/utils/siteMetaData";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";
import Logo from "@/src/components/Header/SiteLogoBlack";

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-dark flex flex-col items-center text-light relative">

      <div className="mt-10 w-full flex flex-col items-center justify-center gap-4 px-4">
        <Logo sizeClass="w-40" />

        
        {/* 导航菜单 */}
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-6 text-lg sm:text-xl">
          <Link href="/" className="hover:underline transition-colors">{t('nav.home')}</Link>
          <Link href="/submit" className="hover:underline transition-colors">{t('nav.submit')}</Link>
          <Link href="/about" className="hover:underline transition-colors">{t('nav.about')}</Link>
          <Link href="/contact" className="hover:underline transition-colors">{t('nav.contact')}</Link>
        </nav>
      </div>


    
      {/* <div className="flex items-center mt-8">
        <a
          href={siteMetadata.linkedin}
          className="inline-block w-6 h-6 mr-4"
          aria-label="Reach out to me via LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon className="hover:scale-125 transition-all ease duration-200" />
        </a>
        <a
          href={siteMetadata.twitter}
          className="inline-block w-6 h-6 mr-4"
          aria-label="Reach out to me via Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon className="hover:scale-125 transition-all ease duration-200" />
        </a>
        <a
          href={siteMetadata.github}
          className="inline-block w-6 h-6 mr-4 fill-light"
          aria-label="Check my profile on Github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="fill-light dark:fill-dark  hover:scale-125 transition-all ease duration-200" />
        </a>
        <a
          href={siteMetadata.dribbble}
          className="inline-block w-6 h-6 mr-4"
          aria-label="Check my profile on Dribbble"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DribbbleIcon className="hover:scale-125 transition-all ease duration-200" />
        </a>
      </div> */}

      <div className="w-full  mt-10 md:mt-10 relative font-medium border-t border-solid border-light py-6 px-8 flex  flex-col md:flex-row items-center justify-between">
        <span className="text-center text-base sm:text-base">
          &copy;2025 W3Cay. {t('footer.allRights')}
        </span>
        <div className="text-center my-4 md:my-0 flex items-center gap-4 text-base sm:text-base">
          <Link href="/terms-of-service" className="underline">{t('legal.terms')}</Link>
          <Link href="/privacy-policy" className="underline">{t('legal.privacy')}</Link>
          <Link href="/disclaimer" className="underline">{t('legal.disclaimer')}</Link>
          <Link href="/sitemap.xml" className="underline">{t('footer.sitemap')}</Link>
        </div>
        <div className="text-center flex items-center gap-3 text-base sm:text-base">
          <span>
            {t('footer.madeWithBy')}{" "}
            <a href="https://blog.w3cay.com" className="underline" target="_blank">
              Cay
            </a>
          </span>
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="ml-2 px-3 py-1 rounded-full border border-solid border-light/60  text-sm bg-transparent"
            aria-label="language-switcher-footer"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
