import { getTranslations } from 'next-intl/server';
import ContactContent from './ContactContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('contact.title'),
    description: t('contact.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/contact`,
      languages: {
        'en': `${siteMetadata.siteUrl}/en/contact`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/contact`,
        'x-default': `${siteMetadata.siteUrl}/en/contact`,
      },
    },
    openGraph: {
      title: t('contact.title'),
      description: t('contact.description'),
    },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';

  return <ContactContent initialLanguage={language} />;
}
