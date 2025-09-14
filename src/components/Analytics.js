"use client"
import Script from "next/script"
import { shouldEnableAnalytics } from '@/src/utils/env'

export default function Analytics() {
  // 在开发环境中不加载统计代码
  if (!shouldEnableAnalytics) {
    console.log('📊 开发环境：统计代码已禁用')
    return null
  }

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-GY58MNR1C0" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GY58MNR1C0');
`}</Script>
      <Script id="clarity-script" strategy="afterInteractive">{`
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "soy2grvr91");
 `}</Script>
 <Script defer src="https://umami.caydock.com/script.js" data-website-id="0e516cec-cb7c-42dc-bc80-679b4f00adeb"></Script>
    </>
  )
}
