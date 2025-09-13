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
    if (initialLanguage) return; // SSR provided, skip client detection on first paint
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("lang");
    if (saved === "zh" || saved === "en") {
      setLanguage(saved);
    } else {
      const prefersZh = (navigator.language || navigator.userLanguage || "en").toLowerCase().startsWith("zh");
      setLanguage(prefersZh ? "zh" : "en");
    }
  }, [initialLanguage]);

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
