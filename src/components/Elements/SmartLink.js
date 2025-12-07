import { Link as IntlLink } from '@/src/i18n/routing';

/**
 * 智能链接组件，使用 next-intl 的 Link 组件处理国际化路由
 * next-intl 会根据路由配置自动处理语言前缀（as-needed 模式）
 */
const SmartLink = ({ href, locale, children, ...props }) => {
  // 始终使用 next-intl 的 Link，它会根据路由配置自动处理语言前缀
  return (
    <IntlLink href={href} locale={locale} {...props}>
      {children}
    </IntlLink>
  );
};

export default SmartLink;
