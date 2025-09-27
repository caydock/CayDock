import AboutCoverSection from '@/src/components/About/AboutCoverSection';
import AboutBodyClient from '@/src/components/About/AboutBodyClient';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/about', 'about');

export default async function AboutPage({ params }) {
  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient />
    </>
  );
}
