import { getTranslations } from 'next-intl/server';
import PrivacyContent from '@/src/components/Legal/PrivacyContent';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
    openGraph: {
      title: t('privacy.title'),
      description: t('privacy.description'),
    },
  };
}

export default async function PrivacyPage({ params }) {
  return <PrivacyContent />;
}
