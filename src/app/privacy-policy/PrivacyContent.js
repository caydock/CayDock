"use client";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function PrivacyContent({ initialLanguage }) {
  const { t } = useLanguage()
  return (
    <main className="max-w-4xl mx-auto mt-16 p-8">
      <h1 className="text-4xl font-bold mb-6 text-dark dark:text-light">{t('privacy.title')}</h1>
      <p className="text-lg leading-relaxed mb-8 text-dark dark:text-light">{t('privacy.intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('privacy.infoTitle')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-dark dark:text-light">
        <li>{t('privacy.info1')}</li>
        <li>{t('privacy.info2')}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('privacy.cookiesTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('privacy.cookiesText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('privacy.thirdTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('privacy.thirdText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('privacy.securityTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('privacy.securityText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('privacy.changesTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('privacy.changesText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('privacy.contactTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">
        {t('privacy.contactText')} <a className="underline text-blue-600 dark:text-blue-400" href="mailto:cay.dev@hotmail.com">cay.dev@hotmail.com</a>.
      </p>
    </main>
  )
}
