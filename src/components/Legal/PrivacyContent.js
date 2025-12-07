"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function PrivacyContent() {
  const t = useTranslations('ui');

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-24 pb-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">{t('privacy.title')}</h1>
        {t('privacy.subtitle') && <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('privacy.subtitle')}</p>}
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.infoTitle')}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.personalTitle')}</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('privacy.emailLabel')}</strong> {t('privacy.emailText')}</li>
            <li><strong>{t('privacy.commentsLabel')}</strong> {t('privacy.commentsText')}</li>
            <li><strong>{t('privacy.usageLabel')}</strong> {t('privacy.usageText')}</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.autoTitle')}</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('privacy.logLabel')}</strong> {t('privacy.logText')}</li>
            <li><strong>{t('privacy.cookiesLabel')}</strong> {t('privacy.cookiesText')}</li>
            <li><strong>{t('privacy.analyticsLabel')}</strong> {t('privacy.analyticsText')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.useTitle')}</h2>
          <p>{t('privacy.useIntro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.use1')}</li>
            <li>{t('privacy.use2')}</li>
            <li>{t('privacy.use3')}</li>
            <li>{t('privacy.use4')}</li>
            <li>{t('privacy.use5')}</li>
            <li>{t('privacy.use6')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.sharingTitle')}</h2>
          <p>{t('privacy.sharingText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('privacy.serviceLabel')}</strong> {t('privacy.serviceText')}</li>
            <li><strong>{t('privacy.legalLabel')}</strong> {t('privacy.legalText')}</li>
            <li><strong>{t('privacy.consentLabel')}</strong> {t('privacy.consentText')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.cookiesTitle')}</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.cookiesTypesTitle')}</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('privacy.essentialLabel')}</strong> {t('privacy.essentialText')}</li>
            <li><strong>{t('privacy.analyticsCookiesLabel')}</strong> {t('privacy.analyticsCookiesText')}</li>
            <li><strong>{t('privacy.advertisingLabel')}</strong> {t('privacy.advertisingText')}</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.managingTitle')}</h3>
          <p>{t('privacy.managingText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.thirdTitle')}</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.googleAnalyticsTitle')}</h3>
          <p>{t('privacy.googleAnalyticsText')}</p>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.googleAdSenseTitle')}</h3>
          <p>{t('privacy.googleAdSenseText')}</p>
          <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.socialTitle')}</h3>
          <p>{t('privacy.socialText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.securityTitle')}</h2>
          <p>{t('privacy.securityText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.retentionTitle')}</h2>
          <p>{t('privacy.retentionText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.rightsTitle')}</h2>
          <p>{t('privacy.rightsIntro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.rights1')}</li>
            <li>{t('privacy.rights2')}</li>
            <li>{t('privacy.rights3')}</li>
            <li>{t('privacy.rights4')}</li>
            <li>{t('privacy.rights5')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.childrenTitle')}</h2>
          <p>{t('privacy.childrenText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.internationalTitle')}</h2>
          <p>{t('privacy.internationalText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.changesTitle')}</h2>
          <p>{t('privacy.changesText')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.contactTitle')}</h2>
          <p>{t('privacy.contactText')}</p>
          <p className="mt-4"><strong>Email: cay.dev@hotmail.com</strong></p>
          
          {t('privacy.lastUpdated') && (
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 italic">
              <em>{t('privacy.lastUpdated')}</em>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
