import { getTranslations } from 'next-intl/server';
import SubmitForm from '@/src/components/Submit/SubmitForm';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('submit.title'),
    description: t('submit.description'),
    openGraph: {
      title: t('submit.title'),
      description: t('submit.description'),
    },
  };
}

export default async function SubmitPage({ params }) {
  const { locale } = await params;
  const language = locale === 'zh-cn' ? 'zh' : 'en';

  return <SubmitForm initialLanguage={language} />;
}
