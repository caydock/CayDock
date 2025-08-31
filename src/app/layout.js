import "./globals.css";
import { cx } from "@/src/utils";
import { Inter, Manrope } from "next/font/google";
import Footer from "../components/Footer";
import Analytics from "@/src/components/Analytics";
import siteMetadata from "../utils/siteMetaData";
import { getServerTranslation } from "@/src/i18n";
import { headers, cookies } from "next/headers";
import Script from "next/script";
import { LanguageProvider } from "@/src/components/i18n/LanguageProvider";
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
  const cookieStore = await cookies();
  const headerStore = await headers();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const lang = isZh ? "zh" : "en";
  const tdk = getServerTranslation(lang, "meta");
  const base = new URL(siteMetadata.siteUrl);

  return {
    metadataBase: base,
    title: {
      template: '%s | W3Cay',
      default: tdk.home.title,
    },
    description: tdk.home.description || siteMetadata.description,
    keywords: tdk.home.keywords,
    openGraph: {
      title: tdk.home.title,
      description: tdk.home.description || siteMetadata.description,
      url: siteMetadata.siteUrl,
      siteName: 'W3Cay',
      images: [siteMetadata.socialBanner],
      locale: lang === "zh" ? "zh_CN" : "en_US",
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
      title: tdk.home.title,
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
  const headerStore = await headers();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value || "";
  const acceptLang = headerStore.get("accept-language") || "";
  const isZh = (langCookie || acceptLang).toLowerCase().startsWith("zh");
  const htmlLang = isZh ? "zh-CN" : "en";
  return (
    <html lang={htmlLang}>
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          "font-mr bg-light dark:bg-dark"
        )}
      >

        <LanguageProvider initialLanguage={htmlLang.startsWith('zh') ? 'zh' : 'en'}>
          {children}
          <Footer />
        </LanguageProvider>
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
