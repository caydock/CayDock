import { getTranslations } from 'next-intl/server';
import siteMetadata from '@/src/utils/siteMetaData';

/**
 * 生成标准的页面元数据
 * @param {Object} options - 配置选项
 * @param {string} options.locale - 语言代码
 * @param {string} options.path - 页面路径（如 '/contact', '/about'）
 * @param {string} options.metaKey - 翻译键前缀（如 'contact', 'about'）
 * @param {boolean} options.isRootPage - 是否为根路径页面
 */
export async function generatePageMetadata({ locale, path, metaKey, isRootPage = false }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  const canonicalUrl = isRootPage 
    ? `${siteMetadata.siteUrl}${path}`
    : `${siteMetadata.siteUrl}/${locale}${path}`;
  
  return {
    title: t(`${metaKey}.title`),
    description: t(`${metaKey}.description`),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${siteMetadata.siteUrl}${path}`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn${path}`,
        'x-default': `${siteMetadata.siteUrl}${path}`,
      },
    },
    openGraph: {
      title: t(`${metaKey}.title`),
      description: t(`${metaKey}.description`),
      url: canonicalUrl,
      siteName: siteMetadata.title,
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
          width: 1200,
          height: 630,
          alt: t(`${metaKey}.title`),
        }
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t(`${metaKey}.title`),
      description: t(`${metaKey}.description`),
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
  };
}

/**
 * 获取标准化的语言参数
 * @param {Object} params - 路由参数
 * @param {boolean} isRootPage - 是否为根路径页面
 */
export async function getPageLocale(params, isRootPage = false) {
  if (isRootPage) {
    return {
      locale: 'en',
      language: 'en'
    };
  }
  
  const { locale } = await params;
  return {
    locale,
    language: locale === 'zh-cn' ? 'zh' : 'en'
  };
}

/**
 * 创建根路径页面的元数据生成函数
 * @param {string} path - 页面路径
 * @param {string} metaKey - 翻译键前缀
 */
export function createRootPageMetadata(path, metaKey) {
  return async function generateMetadata() {
    return generatePageMetadata({
      locale: 'en',
      path,
      metaKey,
      isRootPage: true
    });
  };
}

/**
 * 创建本地化页面的元数据生成函数
 * @param {string} path - 页面路径
 * @param {string} metaKey - 翻译键前缀
 */
export function createLocalePageMetadata(path, metaKey) {
  return async function generateMetadata({ params }) {
    const { locale } = await params;
    return generatePageMetadata({
      locale,
      path,
      metaKey,
      isRootPage: false
    });
  };
}

/**
 * 创建动态路由页面的元数据生成函数
 * @param {Function} customMetadataFn - 自定义元数据生成函数
 */
export function createDynamicPageMetadata(customMetadataFn) {
  return customMetadataFn;
}

/**
 * 生成标准的语言链接对象
 * @param {string} basePath - 基础路径（如 '/categories/all'）
 */
export function generateLanguageLinks(basePath) {
  return {
    'en': `${siteMetadata.siteUrl}${basePath}`,
    'zh-cn': `${siteMetadata.siteUrl}/zh-cn${basePath}`,
    'x-default': `${siteMetadata.siteUrl}${basePath}`,
  };
}
