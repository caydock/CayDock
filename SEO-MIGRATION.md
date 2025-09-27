# SEO 迁移指南

## 🚀 **URL 结构变更**

### **变更前**
- 英文页面：`/`, `/blog`, `/about`, `/contact` 等
- 中文页面：`/zh-cn/`, `/zh-cn/blog`, `/zh-cn/about` 等

### **变更后**
- 英文页面：`/en/`, `/en/blog`, `/en/about`, `/en/contact` 等
- 中文页面：`/zh-cn/`, `/zh-cn/blog`, `/zh-cn/about` 等

## 🔄 **301 永久重定向配置**

所有旧的英文路径都会通过 301 永久重定向到新的 `/en/` 前缀路径：

```javascript
// next.config.js 中的重定向配置
{
  source: '/',
  destination: '/en/',
  permanent: true, // 301 永久重定向
}
```

### **重定向映射表**
| 旧路径 | 新路径 | 状态码 |
|--------|--------|--------|
| `/` | `/en/` | 301 |
| `/blog` | `/en/blog` | 301 |
| `/blog/:slug` | `/en/blog/:slug` | 301 |
| `/categories` | `/en/categories` | 301 |
| `/categories/:slug` | `/en/categories/:slug` | 301 |
| `/about` | `/en/about` | 301 |
| `/contact` | `/en/contact` | 301 |
| `/submit` | `/en/submit` | 301 |
| `/terms-of-service` | `/en/terms-of-service` | 301 |
| `/privacy-policy` | `/en/privacy-policy` | 301 |
| `/disclaimer` | `/en/disclaimer` | 301 |

## 📊 **SEO 影响分析**

### **✅ 正面影响**
1. **清晰的 URL 结构**：所有语言都有明确的前缀
2. **301 重定向**：搜索引擎会正确传递链接权重
3. **多语言 SEO**：更好的 hreflang 支持
4. **一致性**：所有语言版本使用相同的 URL 结构

### **⚠️ 需要注意**
1. **重定向链**：确保没有重定向循环
2. **链接权重传递**：301 重定向会传递 99% 的链接权重
3. **索引更新**：搜索引擎需要时间更新索引

## 🛠️ **技术实现**

### **1. Next.js 配置**
```javascript
// next.config.js
async redirects() {
  return [
    {
      source: '/',
      destination: '/en/',
      permanent: true, // 301 重定向
    },
    // ... 其他重定向规则
  ]
}
```

### **2. next-intl 配置**
```javascript
// src/i18n/routing.js
export const routing = defineRouting({
  locales: ['en', 'zh-cn'],
  defaultLocale: 'en',
  localePrefix: 'always', // 所有语言都显示前缀
})
```

### **3. Sitemap 更新**
- 更新 `sitemap.xml` 包含所有新的 URL 结构
- 英文页面：`/en/*`
- 中文页面：`/zh-cn/*`

### **4. Robots.txt 更新**
```
Allow: /en/
Allow: /zh-cn/
```

## 📈 **搜索引擎优化建议**

### **1. Google Search Console**
- 提交新的 sitemap.xml
- 监控重定向状态
- 检查索引状态

### **2. 监控指标**
- 重定向状态码（确保是 301）
- 页面加载速度
- 索引覆盖率
- 排名变化

### **3. 外部链接更新**
- 联系有外部链接的网站更新链接
- 更新社交媒体链接
- 更新书签和分享链接

## 🔍 **验证步骤**

### **1. 重定向测试**
```bash
curl -I https://w3cay.com/
# 应该返回 301 重定向到 /en/

curl -I https://w3cay.com/blog
# 应该返回 301 重定向到 /en/blog
```

### **2. 页面访问测试**
- 访问 `/` → 应该重定向到 `/en/`
- 访问 `/blog` → 应该重定向到 `/en/blog`
- 访问 `/zh-cn/` → 应该正常显示中文首页

### **3. SEO 工具验证**
- 使用 Google Search Console 验证重定向
- 使用 Screaming Frog 检查重定向链
- 使用 Ahrefs/SEMrush 监控排名变化

## 📅 **迁移时间线**

### **第 1 周**
- [x] 配置 301 重定向
- [x] 更新 sitemap.xml
- [x] 更新 robots.txt
- [x] 部署到生产环境

### **第 2-4 周**
- [ ] 监控重定向状态
- [ ] 检查搜索引擎索引
- [ ] 更新外部链接

### **第 1-3 个月**
- [ ] 监控排名变化
- [ ] 优化页面性能
- [ ] 持续监控 SEO 指标

## 🚨 **注意事项**

1. **不要删除重定向**：即使迁移完成，也要保持重定向规则
2. **监控 404 错误**：确保没有遗漏的重定向规则
3. **更新内部链接**：确保所有内部链接使用新的 URL 结构
4. **测试所有路径**：确保所有页面都能正确重定向

## 📞 **支持**

如果在迁移过程中遇到问题，请检查：
1. 重定向规则是否正确配置
2. 服务器是否正确返回 301 状态码
3. 搜索引擎是否正确识别重定向
