"use client";
import { useTranslations, useLocale } from 'next-intl';
import SmartLink from '../Elements/SmartLink';
import PageTemplate from '../PageTemplate/PageTemplate';
import { useMemo } from 'react';

export default function AboutBodyClient() {
  const t = useTranslations('ui');
  const locale = useLocale();
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  
  // 计算字数
  const wordCount = useMemo(() => {
    const content = [
      t('about.aboutDesc'),
      t('about.domainDesc'),
    ].join('');
    return content.length;
  }, [t]);

  return (
    <PageTemplate
      backgroundImage="/images/about-bg.jpg"
      title={t('about.aboutTitle')}
      breadcrumb="Pages /"
      metadata={{
        date: new Date().toLocaleDateString(locale === 'zh-cn' ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        wordCount,
        readingTime: locale === 'zh-cn' ? '1分钟' : '1 min'
      }}
      heroHeight="h-[40vh] sm:h-[50vh] md:h-[60vh]"
      locale={locale}
    >
      <section className="text-dark dark:text-light leading-relaxed">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t('about.aboutTitle')}</h2>
        <p className="text-base md:text-lg mb-6">{t('about.aboutDesc')}</p>

        <h3 className="mt-8 text-xl md:text-2xl font-semibold mb-3">{t('about.domainTitle')}</h3>
        <p className="text-base md:text-lg mb-6">{t('about.domainDesc')}</p>

        {language === 'zh' && (
          <>
            <h3 className="mt-8 text-xl md:text-2xl font-semibold mb-3">{t('about.wechatTitle')}</h3>
            <p className="text-base md:text-lg mb-6">{t('about.wechatDesc')}</p>
          </>
        )}

        <p className="mt-8 text-base md:text-lg text-dark/80 dark:text-light/80">{t('about.outro')}</p>
      </section>
    </PageTemplate>
  );
}
