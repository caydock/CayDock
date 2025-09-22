"use client";
import React from "react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function ContactContent({ initialLanguage }) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('contactPage.title')}</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg mb-6">{t('contactPage.subtitle')}</p>
          <p className="text-lg mb-8">{t('contactPage.thank')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('contactPage.emailTitle')}</h2>
          <p className="mb-2">{t('contactPage.emailPrimary')}</p>
          <p className="mb-6">
            <a 
              href="mailto:cay.dev@hotmail.com" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              cay.dev@hotmail.com
            </a>
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('contactPage.feedbackTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('contactPage.feedbackBullets1')}</li>
            <li>{t('contactPage.feedbackBullets2')}</li>
            <li>{t('contactPage.feedbackBullets3')}</li>
            <li>{t('contactPage.feedbackBullets4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('contactPage.bizTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('contactPage.bizBullets1')}</li>
            <li>{t('contactPage.bizBullets2')}</li>
            <li>{t('contactPage.bizBullets3')}</li>
            <li>{t('contactPage.bizBullets4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('contactPage.slaTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('contactPage.slaWeekday')}</li>
            <li>{t('contactPage.slaWeekend')}</li>
            <li>{t('contactPage.slaHoliday')}</li>
          </ul>
          
          <p className="mt-8 text-base md:text-lg text-dark/80 dark:text-light/80">{t('contactPage.thanksEnd')}</p>
        </div>
      </div>
    </div>
  );
}
