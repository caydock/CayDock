import { getTranslations } from 'next-intl/server';
import AboutCoverSection from '@/src/components/About/AboutCoverSection';
import AboutBodyClient from '@/src/components/About/AboutBodyClient';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('about.title'),
    description: t('about.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/about`,
      languages: {
        'en': `${siteMetadata.siteUrl}/about`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/about`,
        'x-default': `${siteMetadata.siteUrl}/about`,
      },
    },
    openGraph: {
      title: t('about.title'),
      description: t('about.description'),
    },
  };
}

export default async function AboutPage() {
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';

  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient initialLanguage={language} />
    </>
  );
}
