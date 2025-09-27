import { redirect } from 'next/navigation';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  return {
    alternates: {
      canonical: `${siteMetadata.siteUrl}/en/`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/`,
        'x-default': `${siteMetadata.siteUrl}/en/`,
      },
    },
  };
}

export default function RootPage() {
  // 重定向到默认语言页面
  redirect('/en');
}
