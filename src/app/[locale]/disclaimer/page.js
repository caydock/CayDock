import DisclaimerContent from '@/src/components/Legal/DisclaimerContent';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/disclaimer', 'disclaimer');

export default async function DisclaimerPage({ params }) {
  return <DisclaimerContent />;
}
