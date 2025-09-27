import { Link as IntlLink } from '@/src/i18n/routing';
import Link from 'next/link';

/**
 * 智能链接组件，根据语言选择合适的 Link 组件
 * - 默认语言（en）：使用 next/link，不带前缀，如 /about
 * - 其他语言（zh-cn）：使用 next-intl Link，带前缀，如 /zh-cn/about
 */
const SmartLink = ({ href, locale, children, ...props }) => {
  // 如果是默认语言（英文）或没有指定语言，使用普通 Link
  if (!locale || locale === 'en') {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  
  // 其他语言使用 next-intl 的 Link
  return (
    <IntlLink href={href} locale={locale} {...props}>
      {children}
    </IntlLink>
  );
};

export default SmartLink;
