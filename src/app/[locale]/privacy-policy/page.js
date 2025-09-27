import PrivacyContent from '@/src/components/Legal/PrivacyContent';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/privacy-policy', 'privacy');

export default async function PrivacyPage({ params }) {
  return <PrivacyContent />;
}
