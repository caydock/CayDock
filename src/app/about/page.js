import AboutCoverSection from '@/src/components/About/AboutCoverSection';
import AboutBodyClient from '@/src/components/About/AboutBodyClient';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/about', 'about');

export default async function AboutPage() {
  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient />
    </>
  );
}
