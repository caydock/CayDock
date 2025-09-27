import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import Footer from "@/src/components/Footer";
import { headers } from 'next/headers';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const baseUrl = 'https://w3cay.com';
  const currentUrl = `${baseUrl}${pathname}`;
  
  // Generate hreflang links for all locales
  const alternateLanguages = {};
  routing.locales.forEach(loc => {
    const localePath = pathname.replace(`/${locale}`, `/${loc}`);
    alternateLanguages[loc] = `${baseUrl}${localePath}`;
  });

  return {
    alternates: {
      canonical: currentUrl,
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
