import Link from "next/link";

const BreadcrumbServer = ({ items, homeLabel }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6 px-5 sm:px-10 md:px-24 sxl:px-32">
      <Link 
        href="/" 
        className="hover:text-accent dark:hover:text-accentDark transition-colors"
      >
        {homeLabel}
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-gray-400 dark:text-gray-600">/</span>
          {index === items.length - 1 ? (
            <span className="text-dark dark:text-light font-medium capitalize">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-accent dark:hover:text-accentDark transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default BreadcrumbServer;
