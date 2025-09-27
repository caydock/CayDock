import ContactContent from '@/src/components/Contact/ContactContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/contact', 'contact');

export default async function ContactPage() {
  return <ContactContent initialLanguage="en" />;
}
