import { getTranslations } from 'next-intl/server';
import ContactContent from '@/src/app/[locale]/contact/ContactContent';
import siteMetadata from '@/src/utils/siteMetaData';

export async function generateMetadata() {
  const locale = 'en'; // 根目录默认为英文
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('contact.title'),
    description: t('contact.description'),
    alternates: {
      canonical: `${siteMetadata.siteUrl}/contact`,
      languages: {
        'en': `${siteMetadata.siteUrl}/contact`,
        'zh-cn': `${siteMetadata.siteUrl}/zh-cn/contact`,
        'x-default': `${siteMetadata.siteUrl}/contact`,
      },
    },
    openGraph: {
      title: t('contact.title'),
      description: t('contact.description'),
    },
  };
}

export default async function ContactPage() {
  const locale = 'en'; // 根目录默认为英文
  const language = 'en';

  return <ContactContent initialLanguage={language} />;
}
