import { getTranslations } from 'next-intl/server';
import TermsContent from '@/src/components/Legal/TermsContent';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('terms.title'),
    description: t('terms.description'),
    openGraph: {
      title: t('terms.title'),
      description: t('terms.description'),
    },
  };
}

export default async function TermsPage({ params }) {
  return <TermsContent />;
}
