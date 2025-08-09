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

export default function DisclaimerPage() {
  const { t } = useLanguage()
  return (
    <main className="page">
      <style jsx>{styles}</style>
      <h1>{t('disclaimerPage.title')}</h1>
      <p>{t('disclaimerPage.intro')}</p>

      <h2>{t('disclaimerPage.thirdTitle')}</h2>
      <p>{t('disclaimerPage.thirdText')}</p>

      <h2>{t('disclaimerPage.fairTitle')}</h2>
      <p>{t('disclaimerPage.fairText')}</p>

      <h2>{t('disclaimerPage.adviceTitle')}</h2>
      <p>{t('disclaimerPage.adviceText')}</p>

      <h2>{t('disclaimerPage.contactTitle')}</h2>
      <p>{t('disclaimerPage.contactText')} <a className="underline" href="mailto:w3cay@hotmail.com">w3cay@hotmail.com</a>.</p>
    </main>
  )
}
