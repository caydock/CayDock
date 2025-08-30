// 统一的翻译数据结构
const TRANSLATIONS = {
  en: {
    // 元数据翻译 (用于SEO)
    meta: {
      home: {
        title: "W3Cay - Weird Wonder Web Cay",
        description: "W3Cay is a fun web cay collecting weird and useless websites. Discover random website and explore endless quirky wonders across the digital world.",
        keywords: "weird websites, fun websites, bored button, useless website, random website, W3Cay"
      },
      about: {
        title: "About Us",
        description: "W3Cay is an \"island of interests\" dedicated to collecting and sharing interesting websites, tools, games and AI experiences, bringing inspiration and joy to your daily life.",
        keywords: "about us, website introduction, team introduction, website philosophy, W3Cay, island of interests"
      },
      contact: {
        title: "Contact Us",
        description: "Contact the W3Cay team for support, feedback, or collaboration opportunities. We are committed to providing you with the best website discovery experience.",
        keywords: "contact us, website feedback, collaboration, technical support, W3Cay, website discovery"
      },
      submit: {
        title: "Submit Website",
        description: "Submit interesting, weird or useless websites to W3Cay. Share the amazing websites you discovered and let more people explore the interesting corners of the digital world.",
        keywords: "submit website, recommend site, share website, interesting websites, W3Cay, website sharing"
      },
      terms: {
        title: "Terms of Service",
        description: "W3Cay Terms of Service. Learn about your rights and obligations when using our website. We are committed to providing a transparent and fair service experience.",
        keywords: "terms of service, terms of use, website terms, legal terms, W3Cay, website usage"
      },
      privacy: {
        title: "Privacy Policy",
        description: "W3Cay Privacy Policy. Learn how we collect, use, and protect your personal information. We value your privacy rights.",
        keywords: "privacy policy, data protection, personal information, privacy rights, W3Cay, data security"
      },
      disclaimer: {
        title: "Disclaimer",
        description: "W3Cay Disclaimer. Learn about our disclaimers regarding third-party content. We are committed to providing accurate and legal website information.",
        keywords: "disclaimer, legal notice, third-party content, disclaimers, W3Cay, legal information"
      },
      blog: {
        title: "Blog",
        description: "Read blog posts about programming, technology and more topics. Share my thoughts, tutorials and stories.",
        keywords: "blog, tech articles, programming tutorials, development experience, tech sharing, W3Cay blog"
      }
    },
    // UI 翻译 (用于客户端组件)
    ui: {
      nav: { home: "Home", blog: "Blog", submit: "Submit", about: "About", contact: "Contact" },
      blog: {
        title: "Blog",
        description: "Read blog posts about programming, technology and more topics. Share my thoughts, tutorials and stories.",
        featuredPosts: "Featured Posts",
        recentPosts: "Recent Posts",
        viewAll: "view all",
        readMore: "Read More"
      },
      discover: {
        random: "Random",
        loading: "Loading...",
        open: "Open Site",
        retry: "Retry",
        hint: "It will be marked as visited after clicking \"Open Site\".",
        empty: "Click \"Random\" to get a recommendation.",
        opening: "Opening...",
        exploring: "Exploring...",
        startExploring: "Start Exploring",
      },
      footer: {
        title: "Weird Wonder Web Cay",
        description: "W3Cay is a fun web cay collecting weird and useless websites. Discover random website and explore endless quirky wonders across the digital world.",
        sitemap: "Sitemap",
        allRights: "All rights reserved.",
        madeWithBy: "Made with ❤️ by",
      },
      subtitle: "Click the button below to start exploring weird and useless websites",
      legal: {
        terms: "Terms",
        privacy: "Privacy",
        disclaimer: "Disclaimer",
      },
      breadcrumb: {
        blog: "Blog",
        categories: "Categories",
        allCategories: "All Categories"
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
        urlInvalid: "Please enter a valid HTTPS URL",
        siteTitleLabel: "Title (optional)",
        siteTitlePlaceholder: "Website title (English)",
        submitBtn: "Submit",
        saved: "Saved",
        successTitle: "Submission Successful!",
        successMessage: "Thank you for your submission! We will review your website as soon as possible. Once approved, your website will be displayed on W3Cay.",
        submissionInfo: "Submission Info:",
        confirm: "OK",
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
    }
  },
  zh: {
    // 元数据翻译 (用于SEO)
    meta: {
      home: {
        title: "W3Cay - 奇妙网络小岛",
        description: "W3Cay是一个有趣的网络小岛，收集各种奇怪和无用的网站。发现随机网站，探索数字世界中无尽的奇妙之处。",
        keywords: "奇怪网站,有趣网站,无聊按钮,无用网站,随机网站,W3Cay"
      },
      about: {
        title: "关于我们",
        description: "W3Cay是一个\"兴趣小岛\"，致力于收集和分享有趣的网站、工具、游戏和AI体验，为您的日常生活带来灵感和快乐。",
        keywords: "关于我们,网站介绍,团队介绍,网站理念,W3Cay,兴趣小岛"
      },
      contact: {
        title: "联系我们",
        description: "联系W3Cay团队获取支持、反馈或合作机会。我们致力于为您提供最佳的网站发现体验。",
        keywords: "联系我们,网站反馈,合作,技术支持,W3Cay,网站发现"
      },
      submit: {
        title: "提交网站",
        description: "向W3Cay提交有趣、奇怪或无用的网站。分享您发现的精彩网站，让更多人探索数字世界的有趣角落。",
        keywords: "提交网站,推荐网站,分享网站,有趣网站,W3Cay,网站分享"
      },
      terms: {
        title: "服务条款",
        description: "W3Cay服务条款。了解使用我们网站时的权利和义务。我们致力于提供透明和公平的服务体验。",
        keywords: "服务条款,使用条款,网站条款,法律条款,W3Cay,网站使用"
      },
      privacy: {
        title: "隐私政策",
        description: "W3Cay隐私政策。了解我们如何收集、使用和保护您的个人信息。我们重视您的隐私权利。",
        keywords: "隐私政策,数据保护,个人信息,隐私权利,W3Cay,数据安全"
      },
      disclaimer: {
        title: "免责声明",
        description: "W3Cay免责声明。了解我们关于第三方内容的免责声明。我们致力于提供准确和合法的网站信息。",
        keywords: "免责声明,法律声明,第三方内容,免责条款,W3Cay,法律信息"
      },
      blog: {
        title: "博客文章",
        description: "阅读关于编程、技术和更多主题的博客文章。分享我的想法、教程和故事。",
        keywords: "博客,技术文章,编程教程,开发经验,技术分享,W3Cay博客"
      }
    },
    // UI 翻译 (用于客户端组件)
    ui: {
      nav: { home: "首页", blog: "博客", submit: "推荐投稿", about: "关于本站", contact: "联系我们" },
      blog: {
        title: "博客文章",
        description: "阅读关于编程、技术和更多主题的博客文章。分享我的想法、教程和故事。",
        featuredPosts: "精选文章",
        recentPosts: "最新文章",
        viewAll: "查看全部",
        readMore: "阅读更多"
      },
      discover: {
        random: "随机",
        loading: "加载中...",
        open: "打开网站",
        retry: "重试",
        hint: "点击\"打开网站\"后将标记为已访问。",
        empty: "点击\"随机\"按钮获取一个推荐。",
        opening: "打开中...",
        exploring: "探索中...",
        startExploring: "开始探索",
      },
      footer: {
        title: "一个发现有趣新奇网站的小岛",
        description: "W3Cay是一个有趣的网络小岛，收集各种奇怪和无用的网站。发现随机网站，探索数字世界中无尽的奇妙奇观。",
        sitemap: "站点地图",
        allRights: "保留所有权利。",
        madeWithBy: "用 ❤️ 制作，开发者",
      },
      subtitle: "点击下方按钮，开始探索有趣网站",
      legal: {
        terms: "服务条款",
        privacy: "隐私政策",
        disclaimer: "免责声明",
      },
      breadcrumb: {
        blog: "博客",
        categories: "分类",
        allCategories: "全部分类"
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
        liabilityText: "W3Cay 按\"现状\"和\"可用性\"提供，对任何形式的担保与由此产生的损害概不负责。",
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
        urlInvalid: "请输入有效的HTTPS链接",
        siteTitleLabel: "标题（可选）",
        siteTitlePlaceholder: "网站标题（英文）",
        submitBtn: "提交",
        saved: "已保存",
        successTitle: "提交成功！",
        successMessage: "感谢您的提交！我们会尽快审核您的网站。审核通过后，您的网站将会在W3Cay上展示。",
        submissionInfo: "提交信息：",
        confirm: "确定",
      },
      about: {
        heroTitle: "保持好奇，热爱分享，探索有趣的网络世界",
        heroDesc:
          "这是我持续创作的信念。W3Cay 专注于发现与分享有趣的网站、工具、游戏与 AI 体验，让灵感与快乐在日常里发生。保持学习、拥抱变化，用简单而美的方式传递价值。",
        aboutTitle: "关于本站",
        aboutDesc:
          "你好，我是 Cay，欢迎来到 W3Cay(万趣岛)！这里是一座充满好奇与乐趣的\"兴趣小岛\"，我们专注于收集并分享独特有趣的网站、工具、小游戏与 AI 相关体验，帮你在繁忙的日常里找到片刻的灵感与快乐。",
        domainTitle: "域名由来",
        domainDesc:
          "\"w3cay\" 由 \"w3\"（Weird Wonder Web 的缩写）与 \"cay\"（小岛）组合而来。互联网像一片广阔海洋，埋藏着无数\"有趣的小岛\"。W3Cay 希望把它们串联起来，分享给同样热爱探索的你。",
        contactTitle: "联系与投稿",
        contactEmailPrefix: "商务合作、媒体报道、友情链接等事宜，请发送邮件至：",
        contactSubmitPrefix: "推荐新网站请前往",
        contactSubmitLink: "提交页面",
        contactSubmitSuffix: "，我们会定期审核与收录。",
        outro:
          "无论你是寻找灵感、解压放松，还是单纯想笑一笑，都希望你能在 W3Cay 的\"兴趣小岛 🏝️\"里，找到独属于你的那一处惊喜。",
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
    }
  }
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
