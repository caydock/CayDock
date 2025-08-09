"use client";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

const styles = `
.page { max-width: 60rem; margin: 4rem auto 0; padding: 2rem; }
.page h1 { font-size: 2.25rem; font-weight: 800; }
.page h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; }
.page p, .page li { line-height: 1.8; margin-top: 0.75rem; }
.page ul { list-style: disc; padding-left: 1.25rem; }
@media (prefers-color-scheme: dark) {
  .page { color: #e5e7eb; }
}
`;

export default function TermsPage() {
  const { t } = useLanguage()
  return (
    <main className="page">
      <style jsx>{styles}</style>
      <h1>{t('terms.title')}</h1>
      <p>{t('terms.intro')}</p>

      <h2>{t('terms.useTitle')}</h2>
      <ul>
        <li>{t('terms.use1')}</li>
        <li>{t('terms.use2')}</li>
        <li>{t('terms.use3')}</li>
      </ul>

      <h2>{t('terms.ipTitle')}</h2>
      <p>{t('terms.ipText')}</p>

      <h2>{t('terms.linksTitle')}</h2>
      <p>{t('terms.linksText')}</p>

      <h2>{t('terms.liabilityTitle')}</h2>
      <p>{t('terms.liabilityText')}</p>

      <h2>{t('terms.changesTitle')}</h2>
      <p>{t('terms.changesText')}</p>

      <h2>{t('terms.contactTitle')}</h2>
      <p>{t('terms.contactText')} <a className="underline" href="mailto:w3cay@hotmail.com">w3cay@hotmail.com</a>.</p>
    </main>
  )
}
