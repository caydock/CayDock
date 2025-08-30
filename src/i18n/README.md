# 多语言翻译系统

## 概述

本项目使用统一的多语言翻译系统，支持服务端渲染（SEO）和客户端渲染（UI），所有翻译数据存储在JSON文件中，便于管理和维护。

## 文件结构

```
src/i18n/
├── index.js                    # 翻译系统核心文件
├── translations/               # 翻译数据目录
│   ├── en.json                # 英文翻译
│   └── zh.json                # 中文翻译
└── README.md                  # 本说明文档
```

## 翻译数据结构

每个语言的翻译文件包含两个主要部分：

### 1. `meta` - 元数据翻译（用于SEO）
- 页面标题、描述、关键词
- 用于服务端渲染和搜索引擎优化
- 通过 `getServerTranslation(lang, "meta")` 获取

### 2. `ui` - 用户界面翻译（用于客户端）
- 导航、按钮、表单等UI元素
- 用于客户端组件渲染
- 通过 `getClientTranslation(lang)` 获取

## 使用方法

### 服务端组件（SEO/元数据）

```javascript
import { getServerTranslation } from "@/src/i18n";

// 在 generateMetadata 函数中
export async function generateMetadata() {
  const tdk = getServerTranslation(lang, "meta");
  
  return {
    title: tdk.home.title,
    description: tdk.home.description,
  };
}
```

### 客户端组件（UI）

```javascript
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <button>{t('discover.random')}</button>
    </div>
  );
}
```

### 直接获取翻译数据

```javascript
import { getClientTranslation } from "@/src/i18n";

const translations = getClientTranslation('zh');
console.log(translations.nav.home); // "首页"
```

## 添加新翻译

1. 在 `src/i18n/translations/en.json` 中添加英文翻译
2. 在 `src/i18n/translations/zh.json` 中添加中文翻译
3. 确保两个文件的结构一致

### 示例：添加新的翻译键

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

**中文翻译 (zh.json):**
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
// 客户端组件
const { t } = useLanguage();
t('newSection.title'); // "新章节" 或 "New Section"

// 服务端组件
const tdk = getServerTranslation(lang, "ui");
tdk.newSection.title; // 直接访问
```

## 最佳实践

1. **保持结构一致**: 确保所有语言的翻译文件具有相同的结构
2. **使用嵌套对象**: 将相关翻译组织在嵌套对象中，便于管理
3. **避免硬编码**: 不要在代码中硬编码文本，始终使用翻译系统
4. **测试翻译**: 在添加新翻译后，测试所有语言版本
5. **JSON语法**: 确保JSON文件语法正确，可以使用 `node -c` 验证

## 工具函数

### `getServerTranslation(lang, type)`
- `lang`: 语言代码 ('en' | 'zh')
- `type`: 翻译类型 ('meta' | 'ui')
- 返回指定语言和类型的翻译对象

### `getClientTranslation(lang)`
- `lang`: 语言代码 ('en' | 'zh')
- 返回指定语言的UI翻译对象

### `getTranslationKey(translations, key)`
- `translations`: 翻译对象
- `key`: 翻译键（支持点号分隔的嵌套键）
- 返回翻译值，如果不存在则返回键名

## 故障排除

### 常见问题

1. **翻译不显示**: 检查翻译键是否正确，确保JSON文件语法正确
2. **页面报错**: 验证JSON文件格式，确保没有语法错误
3. **翻译缺失**: 确保所有语言文件都包含相同的翻译键

### 调试技巧

```javascript
// 检查翻译数据
import { TRANSLATIONS } from "@/src/i18n";
console.log(TRANSLATIONS.zh.ui.nav);

// 验证翻译键
import { getTranslationKey } from "@/src/i18n";
const result = getTranslationKey(translations, 'nav.home');
console.log(result);
```
