import { headers, cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import HomePage from "@/src/components/Home/HomePage";
import siteMetadata from '@/src/utils/siteMetaData';

export const runtime = 'edge';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  // 等待 searchParams
  const params_search = await searchParams;
  
  // 如果有 site 参数，获取网站信息并生成动态标题
  if (params_search?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? siteMetadata.siteUrl 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params_search.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        const site = await res.json();
        const siteTitle = locale === 'zh-cn' ? site.title?.zh : site.title?.en;
        if (siteTitle) {
          const description = t('discover.siteDescription', {title: siteTitle});
          
          return {
            title: {
              absolute: `${siteTitle} - W3Cay`
            },
            description: description,
            openGraph: {
              title: `${siteTitle} - W3Cay`,
              description: description,
            },
          };
        }
      } else {
        // 网站不存在，返回未找到的标题
        const notFoundTitle = `${t('discover.notFound')} - W3Cay`;
        const notFoundDescription = t('discover.notFoundDesc');
        
        return {
          title: {
            absolute: notFoundTitle
          },
          description: notFoundDescription,
          openGraph: {
            title: notFoundTitle,
            description: notFoundDescription,
          },
        };
      }
    } catch (error) {
      console.error('生成动态标题失败:', error);
    }
  }
  
  // 默认标题 - 首页不使用模板，直接返回完整标题
  return {
    title: {
      absolute: t('home.title')
    },
    description: t('home.description'),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
    },
  };
}

export default async function LocaleHome({ params, searchParams }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';

  // 等待 searchParams
  const params_search = await searchParams;

  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (params_search?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? siteMetadata.siteUrl 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params_search.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        initialSite = await res.json();
      }
    } catch (error) {
      console.error('服务端获取网站信息失败:', error);
    }
  }

  return <HomePage initialLanguage={language} searchParams={params_search} initialSite={initialSite} />;
}
