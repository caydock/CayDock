"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

const STRINGS = {
  en: {
    nav: { home: "Home", blogs: "Blogs", submit: "Submit", about: "About", contact: "Contact" },
    discover: {
      random: "Random",
      open: "Open Site",
      retry: "Retry",
      hint: "It will be marked as visited after clicking \"Open Site\".",
      empty: "Click \"Random\" to get a recommendation.",
    },
  },
  zh: {
    nav: { home: "首页", blogs: "博客", submit: "提交", about: "关于", contact: "联系" },
    discover: {
      random: "随机",
      open: "打开网站",
      retry: "重试",
      hint: "点击“打开网站”后将标记为已访问。",
      empty: "点击“随机”按钮获取一个推荐。",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("lang");
    if (saved === "zh" || saved === "en") {
      setLanguage(saved);
    } else {
      const prefersZh = (navigator.language || navigator.userLanguage || "en").toLowerCase().startsWith("zh");
      setLanguage(prefersZh ? "zh" : "en");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", language);
      document.documentElement.setAttribute("lang", language === "zh" ? "zh-CN" : "en");
    }
  }, [language]);

  const t = useMemo(() => {
    return (key) => {
      const parts = key.split(".");
      let curr = STRINGS[language];
      for (const p of parts) {
        if (curr && typeof curr === "object" && p in curr) {
          curr = curr[p];
        } else {
          return key;
        }
      }
      return typeof curr === "string" ? curr : key;
    };
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
