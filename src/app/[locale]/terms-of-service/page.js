import TermsContent from '@/src/components/Legal/TermsContent';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/terms-of-service', 'terms');

export default async function TermsPage({ params }) {
  return <TermsContent />;
}
