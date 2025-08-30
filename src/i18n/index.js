// 从JSON文件导入翻译数据
import enTranslations from './translations/en.json';
import zhTranslations from './translations/zh.json';

// 统一的翻译数据结构
const TRANSLATIONS = {
  en: enTranslations,
  zh: zhTranslations
};

// 服务端翻译函数 (用于SEO和元数据)
export function getServerTranslation(lang = "en", type = "meta") {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return translations[type] || translations.meta;
}

// 客户端翻译函数 (用于UI组件)
export function getClientTranslation(lang = "en") {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return translations.ui;
}

// 获取翻译键值
export function getTranslationKey(translations, key) {
  const parts = key.split(".");
  let curr = translations;
  for (const p of parts) {
    if (curr && typeof curr === "object" && p in curr) {
      curr = curr[p];
    } else {
      return key;
    }
  }
  return typeof curr === "string" ? curr : key;
}

// 导出翻译数据供其他模块使用
export { TRANSLATIONS };
