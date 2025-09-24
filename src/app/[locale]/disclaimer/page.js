import { getTranslations } from 'next-intl/server';
import DisclaimerContent from '@/src/components/Legal/DisclaimerContent';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('disclaimer.title'),
    description: t('disclaimer.description'),
    openGraph: {
      title: t('disclaimer.title'),
      description: t('disclaimer.description'),
    },
  };
}

export default async function DisclaimerPage({ params }) {
  return <DisclaimerContent />;
}
