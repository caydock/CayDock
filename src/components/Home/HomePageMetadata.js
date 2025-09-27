import { getTranslations } from 'next-intl/server';
import { generateLanguageLinks } from '@/src/utils/pageUtils';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateHomePageMetadata({ locale, searchParams }) {
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  // 如果有 site 参数，获取网站信息并生成动态标题
  if (searchParams?.site) {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? siteMetadata.siteUrl 
        : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/site-by-abbr/${encodeURIComponent(searchParams.site)}`, {
        headers: { accept: 'application/json' }
      });
      if (res.ok) {
        const site = await res.json();
        const siteTitle = site.title?.[locale === 'zh-cn' ? 'zh' : 'en'];
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
            alternates: {
              canonical: `${siteMetadata.siteUrl}/`,
              languages: {
                ...generateLanguageLinks('/'),
              },
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
          alternates: {
            canonical: `${siteMetadata.siteUrl}/`,
            languages: {
              ...generateLanguageLinks('/'),
            },
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
    alternates: {
      canonical: `${siteMetadata.siteUrl}/`,
      languages: {
        ...generateLanguageLinks('/'),
      },
    },
  };
}
