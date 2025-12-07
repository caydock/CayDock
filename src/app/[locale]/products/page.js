import ProductsPageContent from '@/src/components/Products/ProductsPageContent';
import { createLocalePageMetadata, getPageLocale } from '@/src/utils/pageUtils';

export const generateMetadata = createLocalePageMetadata('/products', 'products');

export default async function ProductsPage({ params }) {
  const { locale } = await getPageLocale(params);
  return <ProductsPageContent locale={locale} />;
}
