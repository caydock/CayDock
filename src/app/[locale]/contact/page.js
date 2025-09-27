import ContactContent from '@/src/components/Contact/ContactContent';
import { createLocalePageMetadata, getPageLocale } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/contact', 'contact');

export default async function ContactPage({ params }) {
  const { language } = await getPageLocale(params);
  return <ContactContent initialLanguage={language} />;
}
