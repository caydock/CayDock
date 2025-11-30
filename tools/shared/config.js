// 共享配置文件 - 用于所有工具模块
// 包含网站统计、广告等配置

export const siteConfig = {
  // 网站基本信息
  site: {
    title: 'CayDock',
    url: 'https://caydock.com',
    author: 'Cayden'
  },

  // Google Analytics
  googleAnalytics: {
    id: 'G-R79DZ5MNVW',
    enabled: true
  },

  // Umami Analytics
  umamiAnalytics: {
    websiteId: 'a1726c23-3e9b-4772-bf42-d8c17539c258',
    domain: 'umami.caydock.com',
    dataDomains: 'caydock.com',
    scriptName: 'script.js',
    enabled: true
  },

  // Microsoft Clarity
  clarityAnalytics: {
    projectId: 'sp27h402gc',
    enabled: true
  },

  // Google AdSense
  advertisement: {
    adsense: 'ca-pub-2011896129037768',
    enabled: true
  },

  // Footer 菜单
  footerMenu: [
    { name: '网站地图', url: '/zh-cn/sitemap.xml', lang: 'zh-cn' },
    { name: 'Sitemap', url: '/sitemap.xml', lang: 'en' },
    { name: '服务条款', url: '/zh-cn/服务条款/', lang: 'zh-cn' },
    { name: 'Terms', url: '/terms-of-service/', lang: 'en' },
    { name: '隐私政策', url: '/zh-cn/隐私政策/', lang: 'zh-cn' },
    { name: 'Privacy', url: '/privacy-policy/', lang: 'en' },
    { name: '免责声明', url: '/zh-cn/免责声明/', lang: 'zh-cn' },
    { name: 'Disclaimer', url: '/disclaimer/', lang: 'en' }
  ]
}

