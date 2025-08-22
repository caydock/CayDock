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

export const runtime = 'edge';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()
  return (
    <main className="page">
      <style jsx>{styles}</style>
      <h1>{t('privacy.title')}</h1>
      <p>{t('privacy.intro')}</p>

      <h2>{t('privacy.infoTitle')}</h2>
      <ul>
        <li>{t('privacy.info1')}</li>
        <li>{t('privacy.info2')}</li>
      </ul>

      <h2>{t('privacy.cookiesTitle')}</h2>
      <p>{t('privacy.cookiesText')}</p>

      <h2>{t('privacy.thirdTitle')}</h2>
      <p>{t('privacy.thirdText')}</p>

      <h2>{t('privacy.securityTitle')}</h2>
      <p>{t('privacy.securityText')}</p>

      <h2>{t('privacy.changesTitle')}</h2>
      <p>{t('privacy.changesText')}</p>

      <h2>{t('privacy.contactTitle')}</h2>
      <p>{t('privacy.contactText')} <a className="underline" href="mailto:w3cay@hotmail.com">w3cay@hotmail.com</a>.</p>
    </main>
  )
}
