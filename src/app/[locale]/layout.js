import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import Footer from "@/src/components/Footer";
import { headers } from 'next/headers';
import siteMetadata from '@/src/utils/siteMetaData';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  // 简化处理：为所有页面生成基本的 hreflang 配置
  // 具体的页面路径由各个页面的 generateMetadata 处理
  const alternateLanguages = {};
  routing.locales.forEach(loc => {
    alternateLanguages[loc] = `${siteMetadata.siteUrl}/${loc}/`;
  });
  
  // 添加 x-default 指向英文版本
  alternateLanguages['x-default'] = `${siteMetadata.siteUrl}/en/`;

  return {
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/`,
      languages: alternateLanguages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
