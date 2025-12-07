# 路由对比报告

## 旧项目（Hugo）vs 新项目（Next.js）路由对比

### ✅ 一致的路由

| 路由 | 旧项目 | 新项目 | 状态 |
|------|--------|--------|------|
| 关于页 | `/about/` | `/about` | ✅ 一致 |
| 订阅页 | `/subscribe/` | `/subscribe` | ✅ 一致 |
| 服务条款 | `/terms-of-service/` | `/terms-of-service` | ✅ 一致 |
| 隐私政策 | `/privacy-policy/` | `/privacy-policy` | ✅ 一致 |
| 免责声明 | `/disclaimer/` | `/disclaimer` | ✅ 一致 |

### ❌ 不一致的路由

| 路由类型 | 旧项目（Hugo） | 新项目（Next.js） | 影响 |
|---------|----------------|-------------------|------|
| **博客列表** | `/posts/` | `/blog` | 🔴 SEO影响 - 旧链接会404 |
| **博客详情** | `/posts/:slug/` | `/blog/[slug]` | 🔴 SEO影响 - 旧链接会404 |
| **标签页** | `/tags/` | `/categories/all` | 🟡 用户体验不一致 |
| **分类页** | `/categories/` | `/categories/[slug]` | 🟡 结构不同但功能类似 |
| **产品页** | 外部链接 `https://apps.caydock.com/` | `/products` | 🟡 功能变更 |

### 📝 新增路由（新项目独有）

| 路由 | 说明 |
|------|------|
| `/contact` | 联系页（旧项目没有） |
| `/submit` | 提交页（旧项目没有） |

## 详细对比

### 1. 博客路由差异

**旧项目（Hugo）：**
```
/posts/                    # 博客列表页
/posts/:slug/             # 博客详情页（带尾部斜杠）
```

**新项目（Next.js）：**
```
/blog                      # 博客列表页
/blog/[slug]              # 博客详情页（无尾部斜杠）
```

**影响：**
- 🔴 **严重**：所有旧的博客链接都会404，影响SEO和用户体验
- 需要设置301重定向从 `/posts/:slug/` 到 `/blog/:slug`

### 2. 标签/分类路由差异

**旧项目（Hugo）：**
```
/tags/                     # 标签列表页（taxonomy）
/tags/:tag/               # 特定标签页
/categories/              # 分类列表页（taxonomy）
/categories/:category/    # 特定分类页
```

**新项目（Next.js）：**
```
/categories/all            # 标签列表页（菜单中显示为"标签"）
/categories/[slug]        # 分类/标签详情页
```

**影响：**
- 🟡 **中等**：URL结构不同，但功能类似
- 用户习惯的 `/tags/` 路径不存在
- 需要设置301重定向从 `/tags/:tag/` 到 `/categories/:tag`

### 3. 产品页差异

**旧项目（Hugo）：**
- 菜单中指向外部链接：`https://apps.caydock.com/`（英文）或 `https://apps.caydock.com/zh-cn`（中文）

**新项目（Next.js）：**
- 内部路由：`/products`

**影响：**
- 🟡 **中等**：功能变更，从外部链接改为内部页面

## 建议的修复方案

### 1. ✅ 添加301重定向（已实施）

已在 `next.config.js` 中添加以下重定向规则：

#### 博客路由重定向
- `/posts` → `/blog`
- `/posts/` → `/blog`
- `/posts/:slug` → `/blog/:slug`
- `/posts/:slug/` → `/blog/:slug`
- `/zh-cn/posts` → `/zh-cn/blog`
- `/zh-cn/posts/` → `/zh-cn/blog`
- `/zh-cn/posts/:slug` → `/zh-cn/blog/:slug`
- `/zh-cn/posts/:slug/` → `/zh-cn/blog/:slug`

#### 标签路由重定向
- `/tags` → `/categories/all`
- `/tags/` → `/categories/all`
- `/tags/:tag` → `/categories/:tag`
- `/tags/:tag/` → `/categories/:tag`
- `/zh-cn/tags` → `/zh-cn/categories/all`
- `/zh-cn/tags/` → `/zh-cn/categories/all`
- `/zh-cn/tags/:tag` → `/zh-cn/categories/:tag`
- `/zh-cn/tags/:tag/` → `/zh-cn/categories/:tag`

**实施状态：** ✅ 已完成

### 2. 考虑恢复旧路由结构（可选）

如果希望保持完全一致，可以考虑：
- 将 `/blog` 改为 `/posts`
- 将 `/categories/all` 改为 `/tags`
- 但这需要大量代码修改

### 3. 更新sitemap

确保新项目的sitemap包含所有新路由，并考虑提交旧路由的301重定向到搜索引擎。

## 总结

**主要问题：**
1. 🔴 博客路由从 `/posts/` 改为 `/blog` - 需要301重定向
2. 🟡 标签路由从 `/tags/` 改为 `/categories/all` - 需要301重定向
3. 🟡 产品页从外部链接改为内部页面 - 功能变更

**建议优先级：**
1. ✅ **高优先级**：添加博客路由的301重定向（SEO关键）- **已完成**
2. ✅ **中优先级**：添加标签路由的301重定向（用户体验）- **已完成**
3. **低优先级**：考虑是否恢复旧路由结构（需要评估工作量）

## 实施状态

### ✅ 已完成的修复

1. **301重定向规则已添加**
   - 所有旧博客路由（`/posts/`）已重定向到新路由（`/blog`）
   - 所有旧标签路由（`/tags/`）已重定向到新路由（`/categories/all` 或 `/categories/:tag`）
   - 支持英文和中文两种语言路径
   - 处理了带尾部斜杠和不带尾部斜杠的情况

2. **重定向规则特点**
   - 使用 `permanent: true`（301永久重定向），有利于SEO
   - 保持语言前缀（`/zh-cn/`）不变
   - 移除尾部斜杠，统一URL格式

### 📋 待验证项

1. **测试重定向是否正常工作**
   - [ ] 测试 `/posts/` → `/blog` 重定向
   - [ ] 测试 `/posts/some-slug/` → `/blog/some-slug` 重定向
   - [ ] 测试 `/zh-cn/posts/` → `/zh-cn/blog` 重定向
   - [ ] 测试 `/tags/` → `/categories/all` 重定向
   - [ ] 测试 `/tags/some-tag/` → `/categories/some-tag` 重定向

2. **SEO优化建议**
   - [ ] 在 Google Search Console 中提交新的 sitemap
   - [ ] 监控旧URL的301重定向状态
   - [ ] 检查是否有其他外部链接指向旧URL

