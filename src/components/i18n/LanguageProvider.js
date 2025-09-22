"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, getTranslationKey } from "@/src/i18n";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children, initialStrings }) {
  // 初始化时从URL检测语言
  const getInitialLanguage = () => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/zh-cn')) {
        return "zh";
      }
      // 根路径和其他路径都是英文
      return "en";
    }
    return "en"; // 默认英文
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // 从 URL 中检测语言信息
    const updateLanguageFromURL = () => {
      const currentPath = window.location.pathname;
      console.log('LanguageProvider: URL检测', { currentPath, currentLanguage: language });
      if (currentPath.startsWith('/zh-cn')) {
        console.log('LanguageProvider: 设置为中文');
        setLanguage("zh");
      } else {
        console.log('LanguageProvider: 设置为英文');
        setLanguage("en");
      }
    };
    
    // 初始化时从URL检测语言
    updateLanguageFromURL();
    
    // 监听URL变化（通过popstate事件和pushstate/replacestate）
    window.addEventListener('popstate', updateLanguageFromURL);
    
    // 监听pushState和replaceState（用于router.push导航）
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setTimeout(updateLanguageFromURL, 0); // 异步执行，确保URL已更新
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      setTimeout(updateLanguageFromURL, 0); // 异步执行，确保URL已更新
    };
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('popstate', updateLanguageFromURL);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", language);
      document.documentElement.setAttribute("lang", language === "zh" ? "zh-CN" : "en");
    }
  }, [language]);

  const effectiveStrings = useMemo(() => {
    if (initialStrings) return initialStrings
    return TRANSLATIONS[language]?.ui || TRANSLATIONS.en.ui
  }, [initialStrings, language])

  const allTranslations = useMemo(() => {
    return TRANSLATIONS[language] || TRANSLATIONS.en
  }, [language])

  const t = useMemo(() => {
    return (key) => {
      // 如果键以 meta. 开头，使用完整的翻译数据
      if (key.startsWith('meta.')) {
        return getTranslationKey(allTranslations, key);
      }
      // 否则使用UI部分的翻译数据
      return getTranslationKey(effectiveStrings, key);
    };
  }, [effectiveStrings, allTranslations]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
