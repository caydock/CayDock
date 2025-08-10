import "./globals.css";
import { cx } from "@/src/utils";
import { Inter, Manrope } from "next/font/google";
import Header from "@/src/components/Header";
import Footer from "../components/Footer";
import siteMetadata from "../utils/siteMetaData";
import enTdk from "@/src/i18n/tdk/en.json";
import zhTdk from "@/src/i18n/tdk/zh.json";
import { headers, cookies } from "next/headers";
import Script from "next/script";
import { LanguageProvider } from "@/src/components/i18n/LanguageProvider";

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
  const tdk = lang === "zh" ? zhTdk : enTdk;
  const base = new URL(siteMetadata.siteUrl);
  return {
    metadataBase: base,
    title: {
      template: `%s | ${tdk.title}`,
      default: tdk.title,
    },
    description: tdk.description || siteMetadata.description,
    keywords: tdk.keywords,
    openGraph: {
      title: tdk.title,
      description: tdk.description || siteMetadata.description,
      url: siteMetadata.siteUrl,
      siteName: tdk.title,
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
      card: "summary_large_image",
      title: tdk.title,
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
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }`}
        </Script>
        <div className="tech-bg" aria-hidden="true" />
        <LanguageProvider initialLanguage={htmlLang.startsWith('zh') ? 'zh' : 'en'}>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
