"use client";
import { useTranslations } from 'next-intl';
import siteMetadata from "@/src/utils/siteMetaData";

export default function ContactContent({ initialLanguage }) {
  const t = useTranslations('ui');
  
  return (
    <main className="mb-10 mt-10 md:mt-28 text-dark dark:text-light leading-relaxed max-w-4xl mx-auto text-center px-5 xs:px-10 sm:px-12 md:px-16 lg:px-20">
      <h1 className="text-3xl md:text-4xl font-bold">{t('contactPage.title')}</h1>
      <p className="mt-2 text-base md:text-lg text-dark/80 dark:text-light/80">{t('contactPage.subtitle')}</p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm p-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold">{t('contactPage.emailTitle')}</h2>
          <p className="mt-3 text-base md:text-lg">
            {t('contactPage.emailPrimary')}
            <a className="underline" href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>
          </p>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm p-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold">{t('contactPage.feedbackTitle')}</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-base md:text-lg inline-block text-left mx-auto">
            <li>{t('contactPage.feedbackBullets1')}</li>
            <li>{t('contactPage.feedbackBullets2')}</li>
            <li>{t('contactPage.feedbackBullets3')}</li>
            <li>{t('contactPage.feedbackBullets4')}</li>
          </ul>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm p-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold">{t('contactPage.bizTitle')}</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-base md:text-lg inline-block text-left mx-auto">
            <li>{t('contactPage.bizBullets1')}</li>
            <li>{t('contactPage.bizBullets2')}</li>
            <li>{t('contactPage.bizBullets3')}</li>
            <li>{t('contactPage.bizBullets4')}</li>
          </ul>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm p-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold">{t('contactPage.slaTitle')}</h2>
          <ul className="list-disc pl-6 mt-3 space-y-1 text-base md:text-lg inline-block text-left mx-auto">
            <li>{t('contactPage.slaWeekday')}</li>
            <li>{t('contactPage.slaWeekend')}</li>
            <li>{t('contactPage.slaHoliday')}</li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-base md:text-lg text-dark/80 dark:text-light/80">{t('contactPage.thanksEnd')}</p>
    </main>
  );
}
