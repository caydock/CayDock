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
              absolute: `${siteTitle} - CayDock`
            },
            description: description,
            openGraph: {
              title: `${siteTitle} - CayDock`,
              description: description,
              url: `${siteMetadata.siteUrl}/`,
              siteName: siteMetadata.title,
              images: [
                {
                  url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
                  width: 1200,
                  height: 630,
                  alt: `${siteTitle} - CayDock`,
                }
              ],
              locale: locale,
              type: 'website',
            },
            twitter: {
              card: 'summary_large_image',
              title: `${siteTitle} - CayDock`,
              description: description,
              images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
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
        const notFoundTitle = `${t('discover.notFound')} - CayDock`;
        const notFoundDescription = t('discover.notFoundDesc');
        
        return {
          title: {
            absolute: notFoundTitle
          },
          description: notFoundDescription,
          openGraph: {
            title: notFoundTitle,
            description: notFoundDescription,
            url: `${siteMetadata.siteUrl}/`,
            siteName: siteMetadata.title,
            images: [
              {
                url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
                width: 1200,
                height: 630,
                alt: notFoundTitle,
              }
            ],
            locale: locale,
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: notFoundTitle,
            description: notFoundDescription,
            images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
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
    alternates: {
      canonical: `${siteMetadata.siteUrl}/`,
      languages: {
        ...generateLanguageLinks('/'),
      },
    },
  };
}
