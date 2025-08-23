import enTdk from '../i18n/tdk/en.json';
import zhTdk from '../i18n/tdk/zh.json';

/**
 * 获取页面的TDK元数据
 * @param {string} page - 页面名称 (home, about, contact, submit, terms, privacy, disclaimer)
 * @param {string} language - 语言 (en, zh)
 * @returns {object} 包含title, description, keywords的对象
 */
export function getTdk(page, language = 'en') {
  const tdk = language === 'zh' ? zhTdk : enTdk;
  return tdk[page] || tdk.home;
}

/**
 * 生成完整的元数据对象
 * @param {string} page - 页面名称
 * @param {string} language - 语言
 * @returns {object} 完整的元数据对象
 */
export function generateMetadata(page, language = 'en') {
  const tdk = getTdk(page, language);
  const isZh = language === 'zh';
  
  return {
    title: tdk.title,
    description: tdk.description,
    keywords: tdk.keywords,
    openGraph: {
      title: tdk.title,
      description: tdk.description,
      url: `https://w3cay.com/${page === 'home' ? '' : page}`,
      siteName: 'W3Cay',
      images: ['/logo.png'],
      locale: isZh ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tdk.title,
      description: tdk.description,
      site: '@w3cay_com',
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `https://w3cay.com/${page === 'home' ? '' : page}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
