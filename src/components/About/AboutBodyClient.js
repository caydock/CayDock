"use client";
import { useTranslations, useLocale } from 'next-intl';
import SmartLink from '../Elements/SmartLink';

export default function AboutBodyClient() {
  const t = useTranslations('ui');
  const locale = useLocale();
  const language = locale === 'zh-cn' ? 'zh' : 'en';
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-10 mt-10 mb-10 md:mt-14 text-dark dark:text-light leading-relaxed">
      <h2 className="text-2xl md:text-3xl font-semibold">{t('about.aboutTitle')}</h2>
      <p className="mt-4 text-base md:text-lg">{t('about.aboutDesc')}</p>

      <h3 className="mt-8 text-xl md:text-2xl font-semibold">{t('about.domainTitle')}</h3>
      <p className="mt-3 text-base md:text-lg">{t('about.domainDesc')}</p>

      <h3 className="mt-8 text-xl md:text-2xl font-semibold">{t('about.contactTitle')}</h3>
      <p className="mt-3 text-base md:text-lg">
        {t('about.contactEmailPrefix')}
        <a className="underline underline-offset-2 ml-1" href="mailto:cay.dev@hotmail.com">cay.dev@hotmail.com</a>
        。 {t('about.contactSubmitPrefix')}
        <SmartLink href="/submit" locale={locale} className="mx-1 underline underline-offset-2">{t('about.contactSubmitLink')}</SmartLink>
        {t('about.contactSubmitSuffix')}
      </p>

      {language === 'zh' && (
        <>
          <h3 className="mt-8 text-xl md:text-2xl font-semibold">{t('about.wechatTitle')}</h3>
          <p className="mt-3 text-base md:text-lg">{t('about.wechatDesc')}</p>
          {/* <div className="mt-4 flex justify-start">
            <img 
              src="/static/weixin-qrcode.jpg" 
              alt="W3Cay 微信公众号二维码" 
              className="w-full md:max-w-[400px] h-auto rounded-lg shadow-md"
            />
          </div> */}
        </>
      )}

      <p className="mt-8 text-base md:text-lg text-dark/80 dark:text-light/80">{t('about.outro')}</p>
    </section>
  );
}
