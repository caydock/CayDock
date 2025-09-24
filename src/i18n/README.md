# Next.js 国际化 (next-intl) 配置

本项目使用 [next-intl](https://next-intl-docs.vercel.app/) 进行国际化支持。

## 文件结构

```
src/i18n/
├── request.js              # next-intl 请求配置
├── routing.js              # 路由配置
├── messages/               # 翻译消息文件
│   ├── en.json            # 英文翻译
│   └── zh-cn.json         # 中文翻译
└── README.md              # 本说明文档
```

## 支持的语言

- `en` - 英文 (默认)
- `zh-cn` - 中文

## 使用方法

### 服务端组件

```javascript
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({locale: locale, namespace: 'meta'});
  
  return {
    title: t('home.title'),
    description: t('home.description'),
  };
}
```

### 客户端组件

```javascript
import { useTranslations, useLocale } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('ui');
  const locale = useLocale();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>当前语言: {locale}</p>
    </div>
  );
}
```

### 导航链接

```javascript
import { Link } from '@/src/i18n/routing';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">首页</Link>
      <Link href="/about">关于</Link>
    </nav>
  );
}
```

## 翻译文件结构

翻译文件分为两个主要命名空间：

### `meta` - 元数据翻译
用于 SEO 和页面元数据：
```json
{
  "meta": {
    "home": {
      "title": "W3Cay - World's Weird Websites Cay",
      "description": "W3Cay is a cay that collects the world's weird websites...",
      "keywords": "weird websites, fun websites, bored button..."
    }
  }
}
```

### `ui` - 用户界面翻译
用于页面内容和用户界面：
```json
{
  "ui": {
    "nav": {
      "home": "Home",
      "about": "About",
      "contact": "Contact"
    },
    "discover": {
      "random": "Random",
      "loading": "Loading..."
    }
  }
}
```

## 添加新翻译

1. 在 `src/i18n/messages/en.json` 中添加英文翻译
2. 在 `src/i18n/messages/zh-cn.json` 中添加中文翻译
3. 确保两个文件的结构一致

### 示例

**英文翻译 (en.json):**
```json
{
  "ui": {
    "newSection": {
      "title": "New Section",
      "description": "This is a new section"
    }
  }
}
```

**中文翻译 (zh-cn.json):**
```json
{
  "ui": {
    "newSection": {
      "title": "新章节",
      "description": "这是一个新章节"
    }
  }
}
```

**使用方式：**
```javascript
const t = useTranslations('ui');
t('newSection.title'); // "新章节" 或 "New Section"
```

## 路由配置

项目使用基于路径的国际化：
- `/` → 重定向到 `/en`
- `/en` → 英文版本
- `/zh-cn` → 中文版本

所有页面都位于 `src/app/[locale]/` 目录下。

## 中间件

`middleware.js` 文件处理语言检测和路由重写：
- 自动检测用户语言偏好
- 重写 URL 以包含语言前缀
- 处理语言切换

## 最佳实践

1. **保持结构一致**: 确保所有语言的翻译文件具有相同的结构
2. **使用嵌套对象**: 将相关翻译组织在嵌套对象中，便于管理
3. **避免硬编码**: 不要在代码中硬编码文本，始终使用翻译系统
4. **测试翻译**: 在添加新翻译后，测试所有语言版本
5. **JSON语法**: 确保JSON文件语法正确

## 故障排除

### 常见问题

1. **翻译不显示**: 检查翻译键是否正确，确保JSON文件语法正确
2. **页面报错**: 验证JSON文件格式，确保没有语法错误
3. **翻译缺失**: 确保所有语言文件都包含相同的翻译键

### 调试技巧

```javascript
// 检查当前语言
const locale = useLocale();
console.log('Current locale:', locale);

// 检查翻译键
const t = useTranslations('ui');
console.log('Translation result:', t('nav.home'));
```

## 相关文档

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [Next.js 国际化指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
