"use client"
import Script from "next/script"

export default function Analytics() {
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
 <Script defer src="https://cloud.umami.is/script.js" data-website-id="c7ffa851-1275-406a-b593-78a51e851f87"></Script>
    </>
  )
}
