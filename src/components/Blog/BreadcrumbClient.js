"use client";
import SmartLink from '../Elements/SmartLink';

const BreadcrumbClient = ({ items, homeLabel, locale }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-dark/60 dark:text-light/60">
      <SmartLink 
        href="/" 
        locale={locale}
        className="hover:opacity-50 hover:scale-105 transition-all duration-300"
      >
        {homeLabel}
      </SmartLink>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-dark/40 dark:text-light/40">/</span>
          {index === items.length - 1 ? (
            <span className="text-dark dark:text-light font-medium capitalize">
              {item.label}
            </span>
          ) : (
            <SmartLink 
              href={item.href} 
              locale={locale}
              className="hover:opacity-50 hover:scale-105 transition-all duration-300"
            >
              {item.label}
            </SmartLink>
          )}
        </div>
      ))}
    </nav>
  );
};

export default BreadcrumbClient;


