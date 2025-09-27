import { headers, cookies } from "next/headers";
import SubmitForm from './SubmitForm';
import { getTranslations } from 'next-intl/server';
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('submit.title'),
    description: t('submit.description'),
    keywords: t('submit.keywords'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/submit`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/submit`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/submit`,
        'x-default': `${siteMetadata.siteUrl}/en/submit`,
      },
    },
  };
}

export default async function SubmitPage({ params, searchParams }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';

  // 等待 searchParams
  const params_data = await searchParams;

  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (params_data?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? siteMetadata.siteUrl 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params_data.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        initialSite = await res.json();
      }
    } catch (error) {
      console.error('服务端获取网站信息失败:', error);
    }
  }

  return <SubmitForm initialLanguage={language} searchParams={params_data} initialSite={initialSite} />;
}
