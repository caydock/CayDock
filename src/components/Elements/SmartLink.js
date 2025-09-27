import { Link as IntlLink, routing } from '@/src/i18n/routing';
import Link from 'next/link';

/**
 * 智能链接组件，自动根据当前语言环境选择合适的 Link 组件
 * 默认语言使用普通 Link（根路径），其他语言使用 IntlLink（带前缀）
 */
const SmartLink = ({ href, locale, children, ...props }) => {
  // 始终优先使用传入的 locale 参数，确保服务端和客户端一致性
  // 如果没有传入 locale，默认使用默认语言，避免水合错误
  const currentLocale = locale && routing.locales.includes(locale) 
    ? locale 
    : routing.defaultLocale;
  
  // 如果是默认语言，使用普通 Link（不带前缀）
  // 如果是其他语言，使用 IntlLink（带前缀）
  const isDefaultLocale = currentLocale === routing.defaultLocale;
  
  return isDefaultLocale ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <IntlLink href={href} locale={currentLocale} {...props}>
      {children}
    </IntlLink>
  );
};

export default SmartLink;
