import { getTranslations } from 'next-intl/server';
import DisclaimerContent from '@/src/components/Legal/DisclaimerContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('disclaimer.title'),
    description: t('disclaimer.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/disclaimer`,
      languages: {
        'en': `${siteMetadata.siteUrl}/disclaimer`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/disclaimer`,
        'x-default': `${siteMetadata.siteUrl}/disclaimer`,
      },
    },
    openGraph: {
      title: t('disclaimer.title'),
      description: t('disclaimer.description'),
    },
  };
}

export default async function DisclaimerPage() {
  return <DisclaimerContent />;
}
