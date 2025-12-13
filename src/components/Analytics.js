"use client"
import Script from "next/script"
import { shouldEnableAnalytics } from '@/src/utils/env'
import { useEffect } from 'react'

export default function Analytics() {
  // Umami 事件追踪（与旧项目保持一致）
  useEffect(() => {
    if (!shouldEnableAnalytics) return;

    const handleUmamiLoad = () => {
      const umamiScript = document.querySelector('script[data-id="umami-script"]');
      if (umamiScript && window.umami) {
        const ogType = document.head.querySelector('meta[property="og:type"]')?.getAttribute("content");
        const ogTitle = document.head.querySelector('meta[property="og:title"]')?.getAttribute("content");
        const ogUrl = document.head.querySelector('meta[property="og:url"]')?.getAttribute("content");
        
        if (ogType && ogTitle && ogUrl) {
          window.umami.track(`${ogType}:${ogTitle}`, { url: ogUrl });
        }
      }
    };

    const umamiScript = document.querySelector('script[data-id="umami-script"]');
    if (umamiScript) {
      umamiScript.addEventListener("load", handleUmamiLoad);
      return () => {
        umamiScript.removeEventListener("load", handleUmamiLoad);
      };
    }
  }, []);

  // 在开发环境中不加载统计代码
  if (!shouldEnableAnalytics) {
    console.log('📊 开发环境：统计代码已禁用')
    return null
  }

  return (
    <>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-R79DZ5MNVW" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-R79DZ5MNVW');
`}</Script>
      
      {/* Microsoft Clarity */}
      <Script id="clarity-script" strategy="afterInteractive">{`
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "sp27h402gc");
 `}</Script>
      
      {/* Umami Analytics */}
      <Script 
        data-id="umami-script"
        defer 
        src="https://umami.caydock.com/script.js" 
        data-website-id="a1726c23-3e9b-4772-bf42-d8c17539c258"
        data-domains="caydock.com"
      />
    </>
  )
}
