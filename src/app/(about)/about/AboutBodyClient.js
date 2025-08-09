"use client";
import Link from "next/link";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function AboutBodyClient() {
  const { t } = useLanguage();
  return (
    <section className="mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20 mt-10 md:mt-14 text-dark dark:text-light leading-relaxed">
      <h2 className="text-2xl md:text-3xl font-semibold">{t('about.aboutTitle')}</h2>
      <p className="mt-4 text-base md:text-lg">{t('about.aboutDesc')}</p>

      <h3 className="mt-8 text-xl md:text-2xl font-semibold">{t('about.domainTitle')}</h3>
      <p className="mt-3 text-base md:text-lg">{t('about.domainDesc')}</p>

      <h3 className="mt-8 text-xl md:text-2xl font-semibold">{t('about.contactTitle')}</h3>
      <p className="mt-3 text-base md:text-lg">
        {t('about.contactEmailPrefix')}
        <a className="underline underline-offset-2 ml-1" href="mailto:[email protected]">[email protected]</a>
        。 {t('about.contactSubmitPrefix')}
        <Link href="/submit" className="mx-1 underline underline-offset-2">{t('about.contactSubmitLink')}</Link>
        {t('about.contactSubmitSuffix')}
      </p>

      <p className="mt-8 text-base md:text-lg text-dark/80 dark:text-light/80">{t('about.outro')}</p>
    </section>
  );
}