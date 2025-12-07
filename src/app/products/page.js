import ProductsPageContent from '@/src/components/Products/ProductsPageContent';
import { createRootPageMetadata } from '@/src/utils/pageUtils';

export const generateMetadata = createRootPageMetadata('/products', 'products');

export default async function ProductsPage() {
  return <ProductsPageContent locale="en" />;
}

