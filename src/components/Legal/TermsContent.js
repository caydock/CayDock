"use client";
import React from "react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function TermsContent() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('terms.title')}</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg mb-6">{t('terms.intro')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.useTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms.use1')}</li>
            <li>{t('terms.use2')}</li>
            <li>{t('terms.use3')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.ipTitle')}</h2>
          <p>{t('terms.ipText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.linksTitle')}</h2>
          <p>{t('terms.linksText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.liabilityTitle')}</h2>
          <p>{t('terms.liabilityText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.changesTitle')}</h2>
          <p>{t('terms.changesText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.contactTitle')}</h2>
          <p>{t('terms.contactText')}</p>
        </div>
      </div>
    </div>
  );
}
