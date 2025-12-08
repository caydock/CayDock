"use client";
import { memo, useMemo } from 'react';
import SmartLink from '../Elements/SmartLink';

const Pagination = memo(function Pagination({ 
  currentPage, 
  totalPages, 
  locale,
  basePath = '/posts'
}) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page) => {
    // basePath 应该是 /posts，next-intl 会根据 locale 自动添加语言前缀
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  const pages = useMemo(() => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // 如果总页数少于等于最大可见数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 计算起始和结束页码
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      // 如果结束页码接近总页数，调整起始页码
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      // 添加第一页
      if (start > 1) {
        pageNumbers.push(1);
        if (start > 2) {
          pageNumbers.push('...');
        }
      }
      
      // 添加中间页码
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // 添加最后一页
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <nav className="flex items-center justify-center gap-2 mt-12 mb-8" aria-label="Pagination">
      {/* 上一页 */}
      {currentPage > 1 ? (
        <SmartLink
          href={getPageUrl(currentPage - 1)}
          locale={locale}
          className="px-4 py-2 rounded-md border border-dark/20 dark:border-light/20 bg-light dark:bg-dark text-dark dark:text-light hover:bg-dark/5 dark:hover:bg-light/5 transition-colors"
        >
          {locale === 'zh-cn' ? '上一页' : 'Previous'}
        </SmartLink>
      ) : (
        <span className="px-4 py-2 rounded-md border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 text-dark/50 dark:text-light/50 cursor-not-allowed">
          {locale === 'zh-cn' ? '上一页' : 'Previous'}
        </span>
      )}

      {/* 页码 */}
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-dark/50 dark:text-light/50">
                ...
              </span>
            );
          }
          
          const isActive = page === currentPage;
          
          return (
            <SmartLink
              key={page}
              href={getPageUrl(page)}
              locale={locale}
              className={`px-4 py-2 rounded-md border transition-colors ${
                isActive
                  ? 'border-accent dark:border-accentDark bg-accent dark:bg-accentDark text-light'
                  : 'border-dark/20 dark:border-light/20 bg-light dark:bg-dark text-dark dark:text-light hover:bg-dark/5 dark:hover:bg-light/5'
              }`}
            >
              {page}
            </SmartLink>
          );
        })}
      </div>

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <SmartLink
          href={getPageUrl(currentPage + 1)}
          locale={locale}
          className="px-4 py-2 rounded-md border border-dark/20 dark:border-light/20 bg-light dark:bg-dark text-dark dark:text-light hover:bg-dark/5 dark:hover:bg-light/5 transition-colors"
        >
          {locale === 'zh-cn' ? '下一页' : 'Next'}
        </SmartLink>
      ) : (
        <span className="px-4 py-2 rounded-md border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 text-dark/50 dark:text-light/50 cursor-not-allowed">
          {locale === 'zh-cn' ? '下一页' : 'Next'}
        </span>
      )}
    </nav>
  );
});

export default Pagination;

