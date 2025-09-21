import { headers, cookies } from "next/headers";
import { getServerTranslation } from "@/src/i18n";
import HomePage from "@/src/components/Home/HomePage";

export const runtime = 'edge';

export async function generateMetadata({ params, searchParams }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';
  
  // 等待 searchParams
  const params_search = await searchParams;
  
  // 如果有 site 参数，获取网站信息并生成动态标题
  if (params_search?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://w3cay.com' 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(params_search.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        const site = await res.json();
        const siteTitle = language === 'zh' ? site.title?.zh : site.title?.en;
        if (siteTitle) {
          const tdk = getServerTranslation(language, "meta");
          const description = tdk.discover.siteDescription.replace('{title}', siteTitle);
          
          return {
            title: `${siteTitle} - W3Cay`,
            description: description,
            openGraph: {
              title: `${siteTitle} - W3Cay`,
              description: description,
            },
          };
        }
      } else {
        // 网站不存在，返回未找到的标题
        const tdk = getServerTranslation(language, "meta");
        const notFoundTitle = `${tdk.discover.notFound} - W3Cay`;
        const notFoundDescription = tdk.discover.notFoundDesc;
        
        return {
          title: notFoundTitle,
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
  
  // 默认标题
  const tdk = getServerTranslation(language, "meta");
  
  return {
    title: tdk.home.title,
    description: tdk.home.description,
    openGraph: {
      title: tdk.home.title,
      description: tdk.home.description,
    },
  };
}

export default async function LangHome({ params, searchParams }) {
  const { lang } = await params;
  const language = lang === 'zh-cn' ? 'zh' : 'en';

  // 等待 searchParams
  const params_search = await searchParams;

  // 如果有site参数，在服务端获取网站信息
  let initialSite = null;
  if (params_search?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://w3cay.com' 
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
