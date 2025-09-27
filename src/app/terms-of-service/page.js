import { getTranslations } from 'next-intl/server';
import TermsContent from '@/src/components/Legal/TermsContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('terms.title'),
    description: t('terms.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/terms-of-service`,
      languages: {
        'en': `${siteMetadata.siteUrl}/terms-of-service`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/terms-of-service`,
        'x-default': `${siteMetadata.siteUrl}/terms-of-service`,
      },
    },
    openGraph: {
      title: t('terms.title'),
      description: t('terms.description'),
    },
  };
}

export default async function TermsPage() {
  return <TermsContent />;
}
