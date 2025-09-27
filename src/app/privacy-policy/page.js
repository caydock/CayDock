import PrivacyContent from '@/src/components/Legal/PrivacyContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/privacy-policy', 'privacy');

export default async function PrivacyPage() {
  return <PrivacyContent />;
}
