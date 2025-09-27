import ContactContent from '@/src/components/Contact/ContactContent';
import { createLocalePageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/contact', 'contact');

export default async function ContactPage({ params }) {
  return <ContactContent />;
}
