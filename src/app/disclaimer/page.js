import DisclaimerContent from '@/src/components/Legal/DisclaimerContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/disclaimer', 'disclaimer');

export default async function DisclaimerPage() {
  return <DisclaimerContent />;
}
