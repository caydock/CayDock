"use client";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function TermsContent({ initialLanguage }) {
  const { t } = useLanguage()
  return (
    <main className="max-w-4xl mx-auto mt-16 p-8">
      <h1 className="text-4xl font-bold mb-6 text-dark dark:text-light">{t('terms.title')}</h1>
      <p className="text-lg leading-relaxed mb-8 text-dark dark:text-light">{t('terms.intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('terms.useTitle')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-dark dark:text-light">
        <li>{t('terms.use1')}</li>
        <li>{t('terms.use2')}</li>
        <li>{t('terms.use3')}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('terms.ipTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('terms.ipText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('terms.linksTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('terms.linksText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('terms.liabilityTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('terms.liabilityText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('terms.changesTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">{t('terms.changesText')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-dark dark:text-light">{t('terms.contactTitle')}</h2>
      <p className="text-lg leading-relaxed mb-6 text-dark dark:text-light">
        {t('terms.contactText')} <a className="underline text-blue-600 dark:text-blue-400" href="mailto:w3cay@hotmail.com">w3cay@hotmail.com</a>.
      </p>
    </main>
  )
}
