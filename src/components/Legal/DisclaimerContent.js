"use client";
import React from "react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function DisclaimerContent() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('disclaimerPage.title')}</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg mb-6">{t('disclaimerPage.intro')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.thirdTitle')}</h2>
          <p>{t('disclaimerPage.thirdText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.fairTitle')}</h2>
          <p>{t('disclaimerPage.fairText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.adviceTitle')}</h2>
          <p>{t('disclaimerPage.adviceText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.contactTitle')}</h2>
          <p>{t('disclaimerPage.contactText')}</p>
        </div>
      </div>
    </div>
  );
}
