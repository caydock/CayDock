"use client";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function DisclaimerContent({ initialLanguage }) {
  const { t } = useLanguage()
  return (
    <main className="max-w-4xl mx-auto mt-16 p-8">
      <h1 className="text-4xl font-bold mb-6 text-dark dark:text-light">{t('disclaimerPage.title')}</h1>
      <p className="text-lg leading-relaxed mb-8 text-dark dark:text-light">{t('disclaimerPage.intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('disclaimerPage.thirdTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('disclaimerPage.thirdText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('disclaimerPage.fairTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('disclaimerPage.fairText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('disclaimerPage.adviceTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('disclaimerPage.adviceText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('disclaimerPage.contactTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">
        {t('disclaimerPage.contactText')} <a className="underline text-blue-600 dark:text-blue-400" href="mailto:w3cay@hotmail.com">w3cay@hotmail.com</a>.
      </p>
    </main>
  )
}
