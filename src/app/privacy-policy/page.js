import { getTranslations } from 'next-intl/server';
import PrivacyContent from '@/src/components/Legal/PrivacyContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/privacy-policy`,
      languages: {
        'en': `${siteMetadata.siteUrl}/privacy-policy`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/privacy-policy`,
        'x-default': `${siteMetadata.siteUrl}/privacy-policy`,
      },
    },
    openGraph: {
      title: t('privacy.title'),
      description: t('privacy.description'),
    },
  };
}

export default async function PrivacyPage() {
  return <PrivacyContent />;
}
