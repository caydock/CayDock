"use client";
import { memo, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from './ProductCard';
import BreadcrumbClient from '../Blog/BreadcrumbClient';
import PageTemplate from '../PageTemplate/PageTemplate';

const ProductsPageContent = memo(function ProductsPageContent({ locale: propLocale }) {
  const t = useTranslations('ui');
  const hookLocale = useLocale();
  const locale = propLocale || hookLocale;
  
  const breadcrumbItems = useMemo(() => [
    {
      label: t('products.title'),
      href: "/products"
    }
  ], [t]);

  const products = useMemo(() => [
    {
      name: t('products.musicCover.name'),
      description: t('products.musicCover.description'),
      category: t('products.musicCover.category'),
      link: t('products.musicCover.link'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      name: t('products.w3cay.name'),
      description: t('products.w3cay.description'),
      category: t('products.w3cay.category'),
      link: t('products.w3cay.link'),
      icon: t('products.w3cay.icon'),
    },
    {
      name: t('products.qrcay.name'),
      description: t('products.qrcay.description'),
      category: t('products.qrcay.category'),
      link: t('products.qrcay.link'),
      icon: t('products.qrcay.icon'),
    },
    {
      name: t('products.timecay.name'),
      description: t('products.timecay.description'),
      category: t('products.timecay.category'),
      link: t('products.timecay.link'),
      icon: t('products.timecay.icon'),
    },
  ], [t]);

  return (
    <PageTemplate
      title={t('products.title')}
      subtitle={t('products.subtitle')}
      breadcrumb={<BreadcrumbClient items={breadcrumbItems} homeLabel={locale === 'zh-cn' ? '首页' : 'Home'} locale={locale} />}
      locale={locale}
    >
      <section className="text-dark dark:text-light">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.link}-${index}`}
              name={product.name}
              description={product.description}
              category={product.category}
              link={product.link}
              icon={product.icon}
            />
          ))}
        </div>

        {/* Empty State (if no products) */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark/5 dark:bg-light/5 mb-6">
              <svg className="w-10 h-10 text-dark/40 dark:text-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-lg text-dark/60 dark:text-light/60 font-medium">{t('products.empty')}</p>
          </div>
        )}
      </section>
    </PageTemplate>
  );
});

export default ProductsPageContent;

