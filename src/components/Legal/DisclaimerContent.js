"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function DisclaimerContent() {
  const t = useTranslations('ui');

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-24 pb-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">{t('disclaimerPage.title')}</h1>
        {t('disclaimerPage.subtitle') && <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('disclaimerPage.subtitle')}</p>}
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.generalTitle')}</h2>
          <p>{t('disclaimerPage.generalText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.generalList1')}</li>
            <li>{t('disclaimerPage.generalList2')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.contentTitle')}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('disclaimerPage.accuracyTitle')}</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.accuracyText1')}</li>
            <li>{t('disclaimerPage.accuracyText2')}</li>
            <li>{t('disclaimerPage.accuracyText3')}</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('disclaimerPage.technicalTitle')}</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.technicalText1')}</li>
            <li>{t('disclaimerPage.technicalText2')}</li>
            <li>{t('disclaimerPage.technicalText3')}</li>
            <li>{t('disclaimerPage.technicalText4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.externalTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.externalText1')}</li>
            <li>{t('disclaimerPage.externalText2')}</li>
            <li>{t('disclaimerPage.externalText3')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.professionalTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.professionalText1')}</li>
            <li>{t('disclaimerPage.professionalText2')}</li>
            <li>{t('disclaimerPage.professionalText3')}</li>
            <li>{t('disclaimerPage.professionalText4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.investmentTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.investmentText1')}</li>
            <li>{t('disclaimerPage.investmentText2')}</li>
            <li>{t('disclaimerPage.investmentText3')}</li>
            <li>{t('disclaimerPage.investmentText4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.technologyTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.technologyText1')}</li>
            <li>{t('disclaimerPage.technologyText2')}</li>
            <li>{t('disclaimerPage.technologyText3')}</li>
            <li>{t('disclaimerPage.technologyText4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.userTitle')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('disclaimerPage.userText1')}</li>
            <li>{t('disclaimerPage.userText2')}</li>
            <li>{t('disclaimerPage.userText3')}</li>
            <li>{t('disclaimerPage.userText4')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.liabilityTitle')}</h2>
          <p>{t('disclaimerPage.liabilityText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.indemnificationTitle')}</h2>
          <p>{t('disclaimerPage.indemnificationText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.governingTitle')}</h2>
          <p>{t('disclaimerPage.governingText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('disclaimerPage.contactTitle')}</h2>
          <p>{t('disclaimerPage.contactText')}</p>
          <p className="mt-4"><strong>Email: cay.dev@hotmail.com</strong></p>
          
          {t('disclaimerPage.lastUpdated') && (
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 italic">
              <em>{t('disclaimerPage.lastUpdated')}</em>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
