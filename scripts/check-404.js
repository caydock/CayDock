#!/usr/bin/env node
/*
 * Simple script to check list of URLs and report which return 404.
 * Usage: node scripts/check-404.js
 */

const urls = [
  'https://caydock.com/zh-cn/tags/基础知识/',
  'https://caydock.com/zh-cn/tags/年度规划/',
  'https://caydock.com/zh-cn/tags/promise/',
  'https://caydock.com/posts/why-i-still-build-websites-in-2025/',
  'https://caydock.com/',
  'https://caydock.com/zh-cn/tags/ai/',
  'https://caydock.com/zh-cn/posts/react可配置中国城市列表选择组件/',
  'https://caydock.com/posts/2021-year-end-review-and-reflection/',
  'https://caydock.com/privacy-policy/',
  'https://caydock.com/posts/react-event-callback-function-bindthis-analysis/',
  'https://caydock.com/zh-cn/posts/how-i-passed-google-adsense-review/',
  'https://caydock.com/zh-cn/',
  'https://caydock.com/zh-cn/tags/this/',
  'https://caydock.com/posts/async/await-advantages-and-disadvantages-translation/',
  'https://caydock.com/series/_index.zh/',
  'https://caydock.com/zh-cn/tags/被动收入/',
  'https://caydock.com/tags/passive-income/',
  'https://caydock.com/posts/how-i-passed-google-adsense-review/',
  'https://caydock.com/zh-cn/posts/学好摄影的灵魂三问/',
  'https://caydock.com/zh-cn/tags/vue/',
  'https://caydock.com/zh-cn/categories/_index.zh/',
  'https://caydock.com/zh-cn/posts/react禁止页面滚动踩坑实践与方案梳理/',
  'https://caydock.com/tags/seo/',
  'https://caydock.com/tags/',
  'https://caydock.com/zh-cn/tags/独立开发/',
  'https://caydock.com/zh-cn/posts/和团队谈个人成长-克军-转载/',
  'https://caydock.com/zh-cn/tags/函数调用/',
  'https://caydock.com/zh-cn/隐私政策/',
  'https://caydock.com/tags/website-operations/',
  'https://caydock.com/zh-cn/tags/年度总结/',
  'https://caydock.com/categories/personal-growth/',
  'https://caydock.com/zh-cn/posts/async/await的优势与缺憾/',
  'https://caydock.com/zh-cn/tags/技术总结/',
  'https://caydock.com/zh-cn/tags/异步编程/',
  'https://caydock.com/zh-cn/tags/typescript/',
  'https://caydock.com/about/',
  'https://caydock.com/zh-cn/tags/w3cay/',
  'https://caydock.com/zh-cn/tags/app开发/',
  'https://caydock.com/zh-cn/series/',
  'https://caydock.com/posts/web-frontend-testing-and-monitoring-exploration-and-practice/',
  'https://caydock.com/pages/',
  'https://caydock.com/tags/qr-code/',
  'https://caydock.com/posts/app-technology-selection-wechat-mini-program/',
  'https://caydock.com/posts/web-rendering-and-performance-optimization/',
  'https://caydock.com/posts/page/2/',
  'https://caydock.com/tags/loading-speed/',
  'https://caydock.com/tags/w3cay/',
  'https://caydock.com/zh-cn/authors/',
  'https://caydock.com/zh-cn/posts/page/3/',
  'https://caydock.com/terms-of-service/',
  'https://caydock.com/zh-cn/tags/web开发/',
  'https://caydock.com/tags/css3/',
  'https://caydock.com/tags/css/',
  'https://caydock.com/posts/',
  'https://caydock.com/zh-cn/posts/个人技术知识管理方案/',
  'https://caydock.com/zh-cn/tags/职业发展/',
  'https://caydock.com/posts/rss-subscription-experience-sharing/',
  'https://caydock.com/posts/hackers-and-painters-excerpts/',
  'https://caydock.com/posts/vibe-coding-qr-code-generator-tool/',
  'https://caydock.com/posts/react-configurable-chinese-city-selector-component/',
  'https://caydock.com/posts/talking-with-team-about-personal-growth-kejun-repost/',
  'https://caydock.com/tags/qr-code-tool/',
  'https://caydock.com/zh-cn/tags/项目搭建/',
  'https://caydock.com/zh-cn/posts/react事件回调函数bindthis解析/',
  'https://caydock.com/posts/personal-technical-knowledge-management-solution/',
  'https://caydock.com/authors/_index.zh/',
  'https://caydock.com/zh-cn/tags/二维码工具/',
  'https://caydock.com/zh-cn/tags/二维码/',
  'https://caydock.com/zh-cn/tags/摄影/',
  'https://caydock.com/zh-cn/tags/react/',
  'https://caydock.com/zh-cn/about/',
  'https://caydock.com/zh-cn/tags/express/',
  'https://caydock.com/zh-cn/tags/webpack/',
  'https://caydock.com/zh-cn/posts/rss订阅使用心得分享/',
  'https://caydock.com/zh-cn/posts/浮动页面布局的那些事儿/',
  'https://caydock.com/zh-cn/posts/成为一名优秀的前端工程师/',
  'https://caydock.com/zh-cn/posts/见识文摘/',
  'https://caydock.com/tags/_index.zh/',
  'https://caydock.com/zh-cn/tags/个人兴趣/',
  'https://caydock.com/zh-cn/posts/web前端测试和监控的探索和实践/',
  'https://caydock.com/zh-cn/tags/前端技术/',
  'https://caydock.com/posts/css-cascade-rules/',
  'https://caydock.com/posts/javascript-this-binding-problem/',
  'https://caydock.com/posts/javascript-timers-interval-and-timeout/',
  'https://caydock.com/tags/技术管理/',
  'https://caydock.com/zh-cn/categories/',
  'https://caydock.com/zh-cn/tags/城市选择/',
  'https://caydock.com/zh-cn/tags/程序员副业/',
  'https://caydock.com/zh-cn/posts/常用http状态码趣曲解/',
  'https://caydock.com/zh-cn/tags/作用域/',
  'https://caydock.com/posts/insight-book-summary/',
  'https://caydock.com/zh-cn/tags/技术管理/',
  'https://caydock.com/zh-cn/tags/个人反思/',
  'https://caydock.com/zh-cn/posts/黑客与画家文摘/',
  'https://caydock.com/zh-cn/posts/web渲染及性能优化/',
  'https://caydock.com/zh-cn/tags/状态码/',
  'https://caydock.com/zh-cn/posts/app技术选型之微信小程序/',
  'https://caydock.com/zh-cn/tags/rss/',
  'https://caydock.com/zh-cn/tags/微信小程序/',
  'https://caydock.com/zh-cn/tags/聊天室/',
  'https://caydock.com/zh-cn/posts/2021年回顾与思考/',
  'https://caydock.com/zh-cn/tags/http/',
  'https://caydock.com/zh-cn/pages/',
  'https://caydock.com/zh-cn/posts/程序员如何构建自己的被动收入/',
  'https://caydock.com/zh-cn/tags/学习/',
  'https://caydock.com/posts/web-loading-speed-optimization-checklist/',
  'https://caydock.com/zh-cn/订阅/',
  'https://caydock.com/tags/读书笔记/',
  'https://caydock.com/zh-cn/posts/',
  'https://caydock.com/zh-cn/tags/',
  'https://caydock.com/zh-cn/tags/加载速度/',
  'https://caydock.com/zh-cn/tags/读书笔记/',
  'https://caydock.com/zh-cn/posts/基于express-vue-webpack的聊天室项目搭建/',
  'https://caydock.com/zh-cn/tags/set/',
  'https://caydock.com/posts/css3-selector-checklist/',
  'https://caydock.com/tags/个人成长/',
  'https://caydock.com/zh-cn/tags/黑客文化/',
  'https://caydock.com/zh-cn/tags/技术选型/',
  'https://caydock.com/zh-cn/tags/map/',
  'https://caydock.com/zh-cn/tags/async/await/',
  'https://caydock.com/zh-cn/服务条款/',
  'https://caydock.com/zh-cn/posts/web加载速度优化清单/',
  'https://caydock.com/zh-cn/posts/新年开篇技术阶段性总结与思考/',
  'https://caydock.com/zh-cn/tags/移动开发/',
  'https://caydock.com/tags/learning-methods/',
  'https://caydock.com/zh-cn/tags/flow/',
  'https://caydock.com/tags/前端工程师/',
  'https://caydock.com/tags/书单/',
  'https://caydock.com/tags/学习/',
  'https://caydock.com/zh-cn/tags/技巧/',
  'https://caydock.com/zh-cn/tags/静态类型检查/',
  'https://caydock.com/zh-cn/posts/2018我的个人书单/',
  'https://caydock.com/posts/becoming-an-excellent-frontend-engineer/',
  'https://caydock.com/tags/职业发展/',
  'https://caydock.com/zh-cn/tags/二维码生成/',
  'https://caydock.com/disclaimer/',
  'https://caydock.com/zh-cn/tags/回顾思考/',
  'https://caydock.com/zh-cn/posts/vibe-coding-一个二维码生成工具/',
  'https://caydock.com/tags/performance-optimization/',
  'https://caydock.com/tags/city-selection/',
  'https://caydock.com/tags/technical-growth/',
  'https://caydock.com/zh-cn/tags/网站开发/',
  'https://caydock.com/zh-cn/posts/我的2017年前端技术总结与规划/',
  'https://caydock.com/tags/weird-website/',
  'https://caydock.com/zh-cn/tags/书单/',
  'https://caydock.com/posts/w3cay-a-funny-website-for-workers/',
  'https://caydock.com/zh-cn/posts/精进如何成为一个很厉害的人文摘/',
  'https://caydock.com/zh-cn/posts/this的指向问题/',
  'https://caydock.com/categories/',
  'https://caydock.com/posts/react-prevent-page-scroll-practice-and-solutions/',
  'https://caydock.com/tags/funny-website/',
  'https://caydock.com/tags/web-optimization/',
  'https://caydock.com/tags/knowledge-management/',
  'https://caydock.com/tags/tool-recommendations/',
  'https://caydock.com/zh-cn/posts/javascript-静态类型检查方案/',
  'https://caydock.com/zh-cn/posts/set集合与map集合比较/',
  'https://caydock.com/posts/my-2018-personal-book-list/',
  'https://caydock.com/zh-cn/tags/见识/',
  'https://caydock.com/zh-cn/免责声明/',
  'https://caydock.com/zh-cn/subscribe/',
  'https://caydock.com/subscribe/',
  'https://caydock.com/tags/developer-side-projects/',
  'https://caydock.com/tags/indie-development/',
  'https://caydock.com/tags/web-development/',
  'https://caydock.com/categories/frontend-development/',
  'https://caydock.com/tags/ai/',
  'https://caydock.com/tags/selectors/',
  'https://caydock.com/tags/random-website/',
  'https://caydock.com/tags/programmers/',
  'https://caydock.com/tags/component/',
  'https://caydock.com/posts/how-programmers-can-build-passive-income/',
  'https://caydock.com/zh-cn/sitemap.xml',
  'https://caydock.com/posts/javascript-static-type-checking-solutions/',
  'https://caydock.com/tags/financial-freedom/',
  'https://caydock.com/tags/react/',
  'https://caydock.com/authors/',
  'https://caydock.com/tags/frontend/',
  'https://caydock.com/tags/git/',
  'https://caydock.com/series/',
  'https://caydock.com/tags/',
];

// If using Node 18+, fetch is available. Otherwise, this will fail.
if (typeof fetch === 'undefined') {
  console.error('This script requires Node 18+ (global fetch).');
  process.exit(1);
}

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return { url, status: res.status };
  } catch (err) {
    return { url, status: 'ERROR', error: String(err) };
  }
}

async function main() {
  console.log('Checking URLs for 404...');
  const results = await Promise.all(urls.map((u) => checkUrl(u)));
  const notFound = results.filter((r) => r.status === 404);
  const errors = results.filter((r) => r.status === 'ERROR');

  console.log('\n+========= 404 RESULTS =========');
  if (notFound.length === 0) console.log('No 404s detected.');
  else notFound.forEach((r) => console.log(r.url));

  console.log('\n+========= ERRORS =========');
  if (errors.length === 0) console.log('No request errors.');
  else errors.forEach((r) => console.log(r.url + ' -> ' + r.error));

  console.log('\n+========= ALL STATUS CODES =========');
  results.forEach((r) => {
    console.log(`${r.status}\t${r.url}`);
  });
}

main();
