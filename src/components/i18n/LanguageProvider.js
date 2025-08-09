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
    footer: {
      title: "Weird Wonder Web Cay",
      description: "W3Cay is a collection of weird and wonderful websites. It is a place to share and discover new and interesting websites.",
      sitemap: "Sitemap",
      allRights: "All rights reserved.",
      madeWithBy: "Made with \u2665 by",
    },
    about: {
      heroTitle: "Stay Curious, Share with Passion, Explore the Interesting Web",
      heroDesc:
        "This is the belief behind my continuous creation. W3Cay focuses on discovering and sharing interesting websites, tools, games and AI experiences, bringing inspiration and joy to everyday life. Keep learning, embrace changes, and deliver value in a simple and beautiful way.",
      aboutTitle: "About This Site",
      aboutDesc:
        "Hi, I'm Cay. W3Cay is a joyful 'island of interests' dedicated to collecting and sharing unique websites, tools, mini games and AI experiences, helping you find a little inspiration and fun in daily life.",
      domainTitle: "Domain Origin",
      domainDesc:
        "\"w3cay\" combines \"w3\" (short for Weird Wonder Web) and \"cay\" (a small island). The internet is like a vast ocean full of interesting 'islands'. W3Cay hopes to connect them and share with explorers like you.",
      contactTitle: "Contact & Submit",
      contactEmailPrefix: "If you have suggestions, feedback or a great website to recommend, feel free to email:",
      contactSubmitPrefix: "Or go to",
      contactSubmitLink: "Submit a site",
      contactSubmitSuffix: "to share your favorites with more people.",
      outro:
        "Whether you're seeking inspiration, relaxing, or just want a laugh, we hope you find your own surprise on W3Cay's 'island of interests' 🏝️.",
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
    footer: {
      title: "奇趣网页湾",
      description: "W3Cay 收集奇特有趣的网站，用于分享与发现新奇站点。",
      sitemap: "站点地图",
      allRights: "保留所有权利。",
      madeWithBy: "用 \u2665 制作，作者",
    },
    about: {
      heroTitle: "保持好奇，热爱分享，探索有趣的网络世界",
      heroDesc:
        "这是我持续创作的信念。W3Cay 专注于发现与分享有趣的网站、工具、游戏与 AI 体验，让灵感与快乐在日常里发生。保持学习、拥抱变化，用简单而美的方式传递价值。",
      aboutTitle: "关于本站",
      aboutDesc:
        "你好，我是 Cay，欢迎来到 W3Cay！这里是一座充满好奇与乐趣的“兴趣小岛”，我们专注于收集并分享独特有趣的网站、工具、小游戏与 AI 相关体验，帮你在繁忙的日常里找到片刻的灵感与快乐。",
      domainTitle: "域名由来",
      domainDesc:
        "“w3cay” 由 “w3”（Weird Wonder Web 的缩写）与 “cay”（小岛）组合而来。互联网像一片广阔海洋，埋藏着无数“有趣的小岛”。W3Cay 希望把它们串联起来，分享给同样热爱探索的你。",
      contactTitle: "联系与投稿",
      contactEmailPrefix: "如果你有建议、反馈或发现了很棒的网站，欢迎随时联系：",
      contactSubmitPrefix: "或者直接前往",
      contactSubmitLink: "提交推荐",
      contactSubmitSuffix: "页面，把你的“心头好”分享给更多人。",
      outro:
        "无论你是寻找灵感、解压放松，还是单纯想笑一笑，都希望你能在 W3Cay 的“兴趣小岛 🏝️”里，找到独属于你的那一处惊喜。",
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
