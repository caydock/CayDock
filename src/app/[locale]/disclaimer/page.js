import { getTranslations } from 'next-intl/server';
import DisclaimerContent from '@/src/components/Legal/DisclaimerContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('disclaimer.title'),
    description: t('disclaimer.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/disclaimer`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/disclaimer`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/disclaimer`,
        'x-default': `${siteMetadata.siteUrl}/en/disclaimer`,
      },
    },
    openGraph: {
      title: t('disclaimer.title'),
      description: t('disclaimer.description'),
    },
  };
}

export default async function DisclaimerPage({ params }) {
  return <DisclaimerContent />;
}
