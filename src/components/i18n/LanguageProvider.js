"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, getTranslationKey } from "@/src/i18n";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children, initialLanguage, initialStrings }) {
  const [language, setLanguage] = useState(initialLanguage || "en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // 只从 URL 中检测语言信息
    const updateLanguageFromURL = () => {
      const currentPath = window.location.pathname;
      console.log('LanguageProvider: URL检测', { currentPath, initialLanguage });
      if (currentPath.startsWith('/zh-cn')) {
        console.log('LanguageProvider: 设置为中文');
        setLanguage("zh");
      } else {
        console.log('LanguageProvider: 设置为英文');
        setLanguage("en");
      }
    };
    
    // 总是从URL检测语言，忽略initialLanguage
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
      try {
        const sixMonths = 60 * 60 * 24 * 180
        document.cookie = `lang=${language}; path=/; max-age=${sixMonths}`
      } catch {}
    }
  }, [language]);

  const effectiveStrings = useMemo(() => {
    if (initialStrings && (initialLanguage === language)) return initialStrings
    return TRANSLATIONS[language]?.ui || TRANSLATIONS.en.ui
  }, [initialStrings, initialLanguage, language])

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
