import "./globals.css";
import { cx } from "@/src/utils";
import { Inter, Manrope } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Analytics from "@/src/components/Analytics";
import StructuredData from "@/src/components/StructuredData";
import GlobalBackground from "../components/Background/GlobalBackground";
import siteMetadata from "../utils/siteMetaData";
import Script from "next/script";
import { shouldEnableAdSense } from "@/src/utils/env";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
      template: '%s | CayDock',
      default: 'CayDock - Personal Blog & Project Showcase',
    },
    description: siteMetadata.description,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: 'CayDock - Personal Blog & Project Showcase',
      description: siteMetadata.description,
      url: siteMetadata.siteUrl,
      siteName: 'CayDock',
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
          width: 1200,
          height: 630,
          alt: 'CayDock - Personal Blog & Project Showcase',
        }
      ],
      type: "website",
      locale: 'en_US',
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
      title: 'CayDock - Personal Blog & Project Showcase',
      description: siteMetadata.description,
      site: '@caydock',
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
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
  // 根目录默认为英文
  const locale = 'en';
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <StructuredData />
        {/* Google AdSense meta tag */}
        {shouldEnableAdSense && (
          <meta name="google-adsense-account" content="ca-pub-2011896129037768" />
        )}
      </head>
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          "font-mr bg-light dark:bg-dark"
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalBackground />
          <Header />
          <div className="relative z-10">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
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
