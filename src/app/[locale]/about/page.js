import { getTranslations } from 'next-intl/server';
import AboutCoverSection from '@/src/components/About/AboutCoverSection';
import AboutBodyClient from '@/src/components/About/AboutBodyClient';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('about.title'),
    description: t('about.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/about`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/about`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/about`,
        'x-default': `${siteMetadata.siteUrl}/en/about`,
      },
    },
    openGraph: {
      title: t('about.title'),
      description: t('about.description'),
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';

  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient initialLanguage={language} />
    </>
  );
}
