"use client";
import { useTranslations, useLocale } from 'next-intl';
import SmartLink from '../Elements/SmartLink';
import PageTemplate from '../PageTemplate/PageTemplate';
import BreadcrumbClient from '../Blog/BreadcrumbClient';

export default function AboutBodyClient() {
  const t = useTranslations('ui');
  const locale = useLocale();
  const language = locale === 'zh-cn' ? 'zh' : 'en';

  const breadcrumbItems = [
    {
      label: locale === 'zh-cn' ? '关于' : 'About',
      href: "/about"
    }
  ];

  return (
    <PageTemplate
      title={t('about.aboutTitle')}
      subtitle={t('about.subtitle')}
      breadcrumb={<BreadcrumbClient items={breadcrumbItems} homeLabel={locale === 'zh-cn' ? '首页' : 'Home'} locale={locale} />}
      locale={locale}
    >
      <section className="text-dark dark:text-light leading-relaxed">
        <div className="text-sm md:text-base mb-6 space-y-4">
          {t('about.aboutDesc').split('\n\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index}>{paragraph.trim()}</p>
            )
          ))}
        </div>

        <h3 className="mt-8 text-lg md:text-xl font-semibold mb-3">{t('about.domainTitle')}</h3>
        <p className="text-sm md:text-base mb-6">{t('about.domainDesc')}</p>

        {language === 'zh' && (
          <>
            <h3 className="mt-8 text-lg md:text-xl font-semibold mb-3">{t('about.wechatTitle')}</h3>
            <p className="text-sm md:text-base mb-6">{t('about.wechatDesc')}</p>
          </>
        )}

        <p className="mt-8 text-sm md:text-base text-dark/80 dark:text-light/80">{t('about.outro')}</p>
      </section>
    </PageTemplate>
  );
}
