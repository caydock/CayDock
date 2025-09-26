import "./globals.css";
import { cx } from "@/src/utils";
import { Inter, Manrope } from "next/font/google";
import Footer from "../components/Footer";
import Analytics from "@/src/components/Analytics";
import siteMetadata from "../utils/siteMetaData";
import Script from "next/script";
import { shouldEnableAdSense } from "@/src/utils/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-in",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mr",
});

export async function generateMetadata() {
  const base = new URL(siteMetadata.siteUrl);

  return {
    metadataBase: base,
    title: {
      template: '%s | W3Cay',
      default: 'W3Cay - World\'s Weird Websites Cay',
    },
    description: siteMetadata.description,
    openGraph: {
      title: 'W3Cay - World\'s Weird Websites Cay',
      description: siteMetadata.description,
      url: siteMetadata.siteUrl,
      siteName: 'W3Cay',
      images: [siteMetadata.socialBanner],
      type: "website",
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
    twitter: {
      card: "summary",
      title: 'W3Cay - World\'s Weird Websites Cay',
      site: '@w3cay_com',
      images: [siteMetadata.socialBanner],
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const runtime = 'edge';

export default async function RootLayout({ children }) {
  // 使用默认语言，避免水合错误
  // 多语言页面的 lang 属性由多语言布局处理
  const lang = 'en';

  return (
    <html lang={lang}>
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          "font-mr bg-light dark:bg-dark"
        )}
      >
        {children}
        <Analytics />
        
        {/* Google AdSense 脚本（仅在生产环境） */}
        {shouldEnableAdSense && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2011896129037768"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
            id="google-adsense"
          />
        )}
      </body>
    </html>
  );
}
