import AboutCoverSection from '@/src/components/About/AboutCoverSection';
import AboutBodyClient from '@/src/components/About/AboutBodyClient';
import { createLocalePageMetadata, getPageLocale } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/about', 'about');

export default async function AboutPage({ params }) {
  const { language } = await getPageLocale(params);

  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient initialLanguage={language} />
    </>
  );
}
