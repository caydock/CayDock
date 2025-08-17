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
      description: "W3Cay is a fun web cay collecting weird and useless websites. Discover random website and explore endless quirky wonders across the digital world.",
      sitemap: "Sitemap",
      allRights: "All rights reserved.",
      madeWithBy: "Made with \u2665 by",
    },
    legal: {
      terms: "Terms",
      privacy: "Privacy",
      disclaimer: "Disclaimer",
    },
    terms: {
      title: "Terms of Service",
      intro: "Welcome to W3Cay. By accessing or using our website, you agree to be bound by these Terms of Service.",
      useTitle: "Use of the Service",
      use1: "W3Cay curates and shares links to third‑party websites. We do not host or control external content.",
      use2: "You agree not to use W3Cay for any illegal or unauthorized purpose.",
      use3: "We may update or remove content at our discretion without notice.",
      ipTitle: "Intellectual Property",
      ipText: "All trademarks, logos, and images on W3Cay belong to their respective owners. Any third‑party content is used for identification and review purposes.",
      linksTitle: "Links to Third‑Party Sites",
      linksText: "W3Cay may contain links to external sites not provided or maintained by us. We do not guarantee the accuracy or completeness of information on those sites.",
      liabilityTitle: "Limitation of Liability",
      liabilityText: "W3Cay is provided on an 'as is' and 'as available' basis. We disclaim all warranties and are not liable for any damages arising from the use of W3Cay or linked sites.",
      changesTitle: "Changes to Terms",
      changesText: "We may modify these Terms at any time. Continued use of the site constitutes acceptance of the new Terms.",
      contactTitle: "Contact",
      contactText: "For questions about these Terms, contact:",
    },
    privacy: {
      title: "Privacy Policy",
      intro: "We value your privacy. This policy explains what information we collect and how we use it.",
      infoTitle: "Information We Collect",
      info1: "Basic analytics and usage data to improve the site experience.",
      info2: "Information you provide voluntarily (e.g., when submitting a website).",
      cookiesTitle: "Cookies",
      cookiesText: "We may use cookies to remember preferences and analyze traffic. You can control cookies through your browser settings.",
      thirdTitle: "Third‑Party Services",
      thirdText: "External services linked from W3Cay have their own privacy policies. We are not responsible for their practices.",
      securityTitle: "Data Security",
      securityText: "We take reasonable measures to protect data, but no method of transmission or storage is 100% secure.",
      changesTitle: "Changes",
      changesText: "We may update this policy from time to time. Continued use indicates acceptance of any changes.",
      contactTitle: "Contact",
      contactText: "If you have questions about this Privacy Policy, contact:",
    },
    disclaimerPage: {
      title: "Disclaimer",
      intro: "W3Cay is a curated directory of interesting websites. We do not own, control, or endorse the content of external sites linked on W3Cay.",
      thirdTitle: "No Responsibility for Third‑Party Content",
      thirdText: "All external links are provided for convenience and exploration. We do not guarantee the accuracy, legality, or availability of any external site.",
      fairTitle: "Fair Use & Attribution",
      fairText: "Trademarks, logos, and images belong to their respective owners. Any use is for identification, review, or commentary purposes.",
      adviceTitle: "No Professional Advice",
      adviceText: "Content on W3Cay is for informational and entertainment purposes only and should not be considered professional advice.",
      contactTitle: "Contact",
      contactText: "If you believe your rights are infringed or content is inappropriate, please email:",
    },
    submit: {
      title: "Recommend a Website",
      tagline: "Share a cool site. We will review and curate.",
      urlLabel: "Website URL",
      urlPlaceholder: "https://example.com",
      urlInvalid: "Please enter a valid URL",
      siteTitleLabel: "Title (optional)",
      pitchLabel: "Pitch / Why it’s cool (optional)",
      submitBtn: "Submit",
      saved: "Saved",
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
      contactEmailPrefix: "For collaboration, media, or partnership inquiries, email:",
      contactSubmitPrefix: "To recommend a website, go to",
      contactSubmitLink: "Submit",
      contactSubmitSuffix: ". We review regularly and curate the best.",
      outro:
        "Whether you're seeking inspiration, relaxing, or just want a laugh, we hope you find your own surprise on W3Cay's 'island of interests' 🏝️.",
    },
    notFound: {
      title: "Page Not Found",
      backHome: "Go To Home",
    },
    contactPage: {
      title: "Contact Us",
      subtitle: "Get in touch with W3Cay",
      thank: "Thank you for visiting W3Cay! If you have any questions, suggestions, or cooperation intentions, feel free to reach out.",
      emailTitle: "Email",
      emailPrimary: "Primary: ",
      feedbackTitle: "Feedback",
      feedbackBullets1: "Broken links",
      feedbackBullets2: "Incorrect content",
      feedbackBullets3: "Recommend an interesting site",
      feedbackBullets4: "Feature suggestions",
      bizTitle: "Business",
      bizBullets1: "Developers",
      bizBullets2: "Creators",
      bizBullets3: "Advertisers",
      bizBullets4: "Partners",
      slaTitle: "Response Time",
      slaWeekday: "Weekdays: within 24 hours",
      slaWeekend: "Weekends: within 48 hours",
      slaHoliday: "Holidays: responses may be delayed",
      thanksEnd: "Thanks for your support and understanding!",
    },
  },
  zh: {
    nav: { home: "首页", submit: "推荐投稿", about: "关于本站", contact: "联系我们" },
    discover: {
      random: "随机",
      open: "打开网站",
      retry: "重试",
      hint: "点击“打开网站”后将标记为已访问。",
      empty: "点击“随机”按钮获取一个推荐。",
    },
    footer: {
      title: "一个发现有趣新奇网站的小岛",
      description: "W3Cay是一个有趣的网络小岛，收集各种奇怪和无用的网站。发现随机网站，探索数字世界中无尽的奇妙奇观。",
      sitemap: "站点地图",
      allRights: "保留所有权利。",
      madeWithBy: "用 ❤️ 制作，开发者",
    },
    legal: {
      terms: "服务条款",
      privacy: "隐私政策",
      disclaimer: "免责声明",
    },
    terms: {
      title: "服务条款",
      intro: "欢迎使用 W3Cay。访问或使用本网站即表示你同意遵守本服务条款。",
      useTitle: "服务使用",
      use1: "W3Cay 仅整理与分享第三方网站的链接，不托管也不控制外部内容。",
      use2: "你承诺不将 W3Cay 用于任何违法或未授权的目的。",
      use3: "我们可能会在不通知的情况下更新或移除内容。",
      ipTitle: "知识产权",
      ipText: "W3Cay 上的商标、标识与图片归其权利人所有，第三方内容仅用于识别与评论。",
      linksTitle: "第三方链接",
      linksText: "W3Cay 可能包含由第三方提供或维护的外部网站链接，我们不保证其准确性或完整性。",
      liabilityTitle: "责任限制",
      liabilityText: "W3Cay 按“现状”和“可用性”提供，对任何形式的担保与由此产生的损害概不负责。",
      changesTitle: "条款变更",
      changesText: "我们可能随时修改本条款，继续使用即表示接受变更后的条款。",
      contactTitle: "联系",
      contactText: "关于本条款的问题，请联系：",
    },
    privacy: {
      title: "隐私政策",
      intro: "我们重视你的隐私。本政策说明我们收集哪些信息以及如何使用。",
      infoTitle: "我们收集的信息",
      info1: "用于改进站点体验的基础分析与使用数据。",
      info2: "你自愿提供的信息（例如提交网站时）。",
      cookiesTitle: "Cookies",
      cookiesText: "我们可能使用 Cookies 记住偏好并分析流量，你可在浏览器中进行管理。",
      thirdTitle: "第三方服务",
      thirdText: "W3Cay 链接到的外部服务有其各自的隐私政策，我们不对其做法负责。",
      securityTitle: "数据安全",
      securityText: "我们采取合理措施保护数据，但任何传输或存储方式都无法保证 100% 安全。",
      changesTitle: "政策变更",
      changesText: "我们可能不时更新本政策，继续使用即表示接受变更。",
      contactTitle: "联系",
      contactText: "关于本隐私政策的问题，请联系：",
    },
    disclaimerPage: {
      title: "免责声明",
      intro: "W3Cay 是一个精选网站目录。我们不拥有、控制或背书任何外部链接网站的内容。",
      thirdTitle: "第三方内容责任",
      thirdText: "所有外链仅为便利与探索之用，我们不保证其内容的准确性、合法性或可用性。",
      fairTitle: "合理使用与署名",
      fairText: "商标、标识与图片归其权利人所有，任何使用仅用于识别、评论或点评目的。",
      adviceTitle: "非专业建议",
      adviceText: "W3Cay 上的内容仅供信息与娱乐，不构成任何专业建议。",
      contactTitle: "联系我们",
      contactText: "若你认为权利受侵害或内容不当，请发送邮件：",
    },
    submit: {
      title: "推荐一个网站",
      tagline: "分享你觉得很酷的网站，我们会审核后择优收录。",
      urlLabel: "网站链接",
      urlPlaceholder: "https://w3cay.com",
      urlInvalid: "请输入合法的链接",
      siteTitleLabel: "标题（可选）",
      pitchLabel: "推荐语 / 为什么它很酷（可选）",
      submitBtn: "提交",
      saved: "已保存",
    },
    about: {
      heroTitle: "保持好奇，热爱分享，探索有趣的网络世界",
      heroDesc:
        "这是我持续创作的信念。W3Cay 专注于发现与分享有趣的网站、工具、游戏与 AI 体验，让灵感与快乐在日常里发生。保持学习、拥抱变化，用简单而美的方式传递价值。",
      aboutTitle: "关于本站",
      aboutDesc:
        "你好，我是 Cay，欢迎来到 W3Cay(万趣岛)！这里是一座充满好奇与乐趣的“兴趣小岛”，我们专注于收集并分享独特有趣的网站、工具、小游戏与 AI 相关体验，帮你在繁忙的日常里找到片刻的灵感与快乐。",
      domainTitle: "域名由来",
      domainDesc:
        "“w3cay” 由 “w3”（Weird Wonder Web 的缩写）与 “cay”（小岛）组合而来。互联网像一片广阔海洋，埋藏着无数“有趣的小岛”。W3Cay 希望把它们串联起来，分享给同样热爱探索的你。",
      contactTitle: "联系与投稿",
      contactEmailPrefix: "商务合作、媒体报道、友情链接等事宜，请发送邮件至：",
      contactSubmitPrefix: "推荐新网站请前往",
      contactSubmitLink: "提交页面",
      contactSubmitSuffix: "，我们会定期审核与收录。",
      outro:
        "无论你是寻找灵感、解压放松，还是单纯想笑一笑，都希望你能在 W3Cay 的“兴趣小岛 🏝️”里，找到独属于你的那一处惊喜。",
    },
    contactPage: {
      title: "联系我们",
      subtitle: "与 W3Cay 取得联系",
      thank: "感谢你访问 W3Cay！如有任何问题、建议或合作意向，欢迎随时联系。",
      emailTitle: "邮箱",
      emailPrimary: "主要联系方式：",
      feedbackTitle: "反馈建议",
      feedbackBullets1: "网站链接失效",
      feedbackBullets2: "内容有误",
      feedbackBullets3: "推荐有趣的网站",
      feedbackBullets4: "功能建议",
      bizTitle: "商务合作",
      bizBullets1: "网站开发者",
      bizBullets2: "内容创作者",
      bizBullets3: "广告主",
      bizBullets4: "其他合作伙伴",
      slaTitle: "回复时间",
      slaWeekday: "工作日：24 小时内回复",
      slaWeekend: "周末：48 小时内回复",
      slaHoliday: "节假日：可能会延迟",
      thanksEnd: "感谢你的支持与理解！",
    },
    notFound: {
      title: "页面不存在",
      backHome: "返回首页",
    },
  },
};

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
    return STRINGS[language]
  }, [initialStrings, initialLanguage, language])

  const t = useMemo(() => {
    return (key) => {
      const parts = key.split(".");
      let curr = effectiveStrings;
      for (const p of parts) {
        if (curr && typeof curr === "object" && p in curr) {
          curr = curr[p];
        } else {
          return key;
        }
      }
      return typeof curr === "string" ? curr : key;
    };
  }, [effectiveStrings]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
