import SubscribeContent from '@/src/components/Subscribe/SubscribeContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/subscribe', 'subscribe');

export default async function SubscribePage() {
  return <SubscribeContent />;
}

