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
      breadcrumb={<BreadcrumbClient items={breadcrumbItems} locale={locale} />}
      locale={locale}
      backgroundImage="/images/about-bg.jpg"
    >
      <section className="text-dark dark:text-light leading-relaxed">
        <div className="text-sm md:text-base mb-40 space-y-4">
          {t('about.aboutDesc').split('\n\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index}>{paragraph.trim()}</p>
            )
          ))}
        </div>

      </section>
    </PageTemplate>
  );
}
