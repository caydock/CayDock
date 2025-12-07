import { Link as IntlLink } from '@/src/i18n/routing';

/**
 * 智能链接组件，使用 next-intl 的 Link 组件处理国际化路由
 * next-intl 会根据路由配置自动处理语言前缀（as-needed 模式）
 * 对于默认语言（en），不传递 locale 参数，避免添加 /en/ 前缀
 */
const SmartLink = ({ href, locale, children, ...props }) => {
  // 如果是默认语言（en），不传递 locale 参数，让 next-intl 自动处理
  // 这样默认语言不会添加 /en/ 前缀
  if (locale === 'en') {
    return (
      <IntlLink href={href} {...props}>
        {children}
      </IntlLink>
    );
  }
  
  // 其他语言传递 locale 参数
  return (
    <IntlLink href={href} locale={locale} {...props}>
      {children}
    </IntlLink>
  );
};

export default SmartLink;
