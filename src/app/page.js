import NewHomePage from "@/src/components/Home/NewHomePage";
import { getTranslations } from 'next-intl/server';
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    title: {
      absolute: t('home.title')
    },
    description: t('home.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/`,
      languages: {
        'en': `${siteMetadata.siteUrl}/`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/`,
        'x-default': `${siteMetadata.siteUrl}/`,
      },
    },
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      url: `${siteMetadata.siteUrl}/`,
      siteName: siteMetadata.title,
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
          width: 1200,
          height: 630,
          alt: t('home.title'),
        }
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.title'),
      description: t('home.description'),
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
  };
}

export default async function RootPage() {
  return <NewHomePage />;
}
