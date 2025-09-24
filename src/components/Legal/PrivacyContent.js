"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function PrivacyContent() {
  const t = useTranslations('ui');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('privacy.title')}</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg mb-6">{t('privacy.intro')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.infoTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.info1')}</li>
            <li>{t('privacy.info2')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.cookiesTitle')}</h2>
          <p>{t('privacy.cookiesText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.thirdTitle')}</h2>
          <p>{t('privacy.thirdText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.securityTitle')}</h2>
          <p>{t('privacy.securityText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.changesTitle')}</h2>
          <p>{t('privacy.changesText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.contactTitle')}</h2>
          <p>{t('privacy.contactText')}</p>
        </div>
      </div>
    </div>
  );
}
