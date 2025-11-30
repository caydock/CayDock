// 广告 SDK - 可复用的广告脚本加载器

import { siteConfig } from './config.js'

/**
 * 初始化 Google AdSense
 */
export function initAdSense() {
  if (!siteConfig.advertisement.enabled || !siteConfig.advertisement.adsense) {
    return
  }

  // 添加 AdSense meta 标签
  const meta = document.createElement('meta')
  meta.name = 'google-adsense-account'
  meta.content = siteConfig.advertisement.adsense
  document.head.appendChild(meta)

  // 加载 AdSense 脚本
  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.advertisement.adsense}`
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

/**
 * 初始化广告位（用于动态插入广告）
 */
export function initAdSlot(adSlotId, adFormat = 'auto') {
  if (!siteConfig.advertisement.enabled) {
    return
  }

  const adContainer = document.getElementById(adSlotId)
  if (!adContainer) {
    return
  }

  const ins = document.createElement('ins')
  ins.className = 'adsbygoogle'
  ins.style.display = 'block'
  ins.setAttribute('data-ad-client', siteConfig.advertisement.adsense)
  ins.setAttribute('data-ad-slot', adSlotId)
  ins.setAttribute('data-ad-format', adFormat)
  ins.setAttribute('data-full-width-responsive', 'true')

  adContainer.appendChild(ins)

  // 推送广告
  if (window.adsbygoogle && window.adsbygoogle.loaded) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }
}

