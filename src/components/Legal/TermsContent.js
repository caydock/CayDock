"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function TermsContent() {
  const t = useTranslations('ui');

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-24 pb-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">{t('terms.title')}</h1>
        {t('terms.subtitle') && <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('terms.subtitle')}</p>}
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.acceptanceTitle')}</h2>
          <p>{t('terms.acceptanceText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.licenseTitle')}</h2>
          <p>{t('terms.licenseText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms.license1')}</li>
            <li>{t('terms.license2')}</li>
            <li>{t('terms.license3')}</li>
            <li>{t('terms.license4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.disclaimerTitle')}</h2>
          <p>{t('terms.disclaimerText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.limitationsTitle')}</h2>
          <p>{t('terms.limitationsText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.accuracyTitle')}</h2>
          <p>{t('terms.accuracyText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.linksTitle')}</h2>
          <p>{t('terms.linksText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.modificationsTitle')}</h2>
          <p>{t('terms.modificationsText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.governingTitle')}</h2>
          <p>{t('terms.governingText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.contactTitle')}</h2>
          <p>{t('terms.contactText')}</p>
          <p className="mt-4"><strong>Email: cay.dev@hotmail.com</strong></p>
          
          {t('terms.lastUpdated') && (
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 italic">
              <em>{t('terms.lastUpdated')}</em>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
