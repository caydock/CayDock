import TermsContent from '@/src/components/Legal/TermsContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/terms-of-service', 'terms');

export default async function TermsPage() {
  return <TermsContent />;
}
