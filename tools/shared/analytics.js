// 网站统计 SDK - 可复用的统计脚本加载器

import { siteConfig } from './config.js'

/**
 * 初始化 Google Analytics
 */
export function initGoogleAnalytics() {
  if (!siteConfig.googleAnalytics.enabled || !siteConfig.googleAnalytics.id) {
    return
  }

  // 加载 gtag.js
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalytics.id}`
  document.head.appendChild(script1)

  // 初始化 gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', siteConfig.googleAnalytics.id)
}

/**
 * 初始化 Umami Analytics
 */
export function initUmamiAnalytics() {
  if (!siteConfig.umamiAnalytics.enabled || !siteConfig.umamiAnalytics.websiteId) {
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.src = `https://${siteConfig.umamiAnalytics.domain}/${siteConfig.umamiAnalytics.scriptName}`
  script.setAttribute('data-website-id', siteConfig.umamiAnalytics.websiteId)
  
  if (siteConfig.umamiAnalytics.dataDomains) {
    script.setAttribute('data-domains', siteConfig.umamiAnalytics.dataDomains)
  }
  
  document.head.appendChild(script)
}

/**
 * 初始化 Microsoft Clarity
 */
export function initClarityAnalytics() {
  if (!siteConfig.clarityAnalytics.enabled || !siteConfig.clarityAnalytics.projectId) {
    return
  }

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${siteConfig.clarityAnalytics.projectId}");
  `
  document.head.appendChild(script)
}

/**
 * 初始化所有统计工具
 */
export function initAllAnalytics() {
  initGoogleAnalytics()
  initUmamiAnalytics()
  initClarityAnalytics()
}

