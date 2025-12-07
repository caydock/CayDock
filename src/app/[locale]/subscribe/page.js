import SubscribeContent from '@/src/components/Subscribe/SubscribeContent';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/subscribe', 'subscribe');

export default async function SubscribePage({ params }) {
  return <SubscribeContent />;
}

