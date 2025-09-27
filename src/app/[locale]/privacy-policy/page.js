import { getTranslations } from 'next-intl/server';
import PrivacyContent from '@/src/components/Legal/PrivacyContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/privacy-policy`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/privacy-policy`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/privacy-policy`,
        'x-default': `${siteMetadata.siteUrl}/en/privacy-policy`,
      },
    },
    openGraph: {
      title: t('privacy.title'),
      description: t('privacy.description'),
    },
  };
}

export default async function PrivacyPage({ params }) {
  return <PrivacyContent />;
}
