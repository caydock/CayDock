# 路由变更说明

## 变更概述

将网站预览页的路由从 `/?site=xxx` 改为 `/site?id=xxx`，使URL结构更加清晰和RESTful。

## 变更详情

### 1. 主要路由变更

| 旧路由 | 新路由 | 说明 |
|--------|--------|------|
| `/?site=random` | `/site?id=random` | 随机网站预览 |
| `/?site=popcat` | `/site?id=popcat` | 特定网站预览 |
| `/post/example.html` | `/site?id=example` | 旧格式重定向 |

### 2. 修改的文件

#### 核心路由文件
- `src/app/page.js` - 移除searchParams.site处理，只显示首页
- `src/app/site/page.js` - 新增，处理 `/site?id=xxx` 路由

#### 组件文件
- `src/components/Home/HomePage.js` - 修改"开始探索"按钮链接
- `src/components/Site/SitePage.js` - 修改URL更新逻辑
- `src/components/Discover/DiscoverPage.js` - 修改URL更新逻辑

#### 重定向文件
- `src/app/post/[slug]/page.js` - 修改重定向目标
- `next.config.js` - 修改重定向规则

### 3. 功能保持不变

- ✅ 随机网站功能正常
- ✅ 特定网站预览正常
- ✅ 旧URL格式重定向正常
- ✅ 语言切换功能正常
- ✅ 所有交互功能正常

## 技术实现

### 1. 路由结构
```
/site?id=xxx          # 新的网站预览路由
/?site=xxx            # 旧路由（已移除）
/post/xxx.html        # 旧格式（重定向到新格式）
/post/xxx             # 旧格式（重定向到新格式）
```

### 2. 参数处理
- 新路由使用 `searchParams.id` 获取网站ID
- 保持与API路由 `/api/site/${id}` 的一致性
- 支持 `random` 特殊值用于随机网站

### 3. 重定向规则
```javascript
// next.config.js
{
  source: '/post/:slug.html',
  destination: '/site?id=:slug',
  permanent: true,
},
{
  source: '/post/:slug',
  destination: '/site?id=:slug',
  permanent: true,
}
```

## 测试验证

### 1. 新路由测试
- ✅ `http://localhost:3000/site?id=random` - 随机网站
- ✅ `http://localhost:3000/site?id=popcat` - 特定网站
- ✅ `http://localhost:3000/site?id=example` - 示例网站

### 2. 重定向测试
- ✅ `http://localhost:3000/post/example.html` → `/site?id=example`
- ✅ `http://localhost:3000/post/example` → `/site?id=example`

### 3. 功能测试
- ✅ 首页"开始探索"按钮
- ✅ 随机按钮URL更新
- ✅ 语言切换
- ✅ 响应式设计

## 优势

### 1. URL结构更清晰
- `/site` 明确表示网站预览页面
- `id` 参数更符合RESTful规范
- 与API路由结构保持一致

### 2. SEO友好
- 更清晰的URL结构有利于搜索引擎理解
- 重定向保持SEO价值
- 避免查询参数在URL中的使用

### 3. 用户体验
- URL更简洁易读
- 便于分享和书签
- 符合用户对URL结构的预期

## 注意事项

1. **向后兼容**：旧URL格式通过重定向保持兼容
2. **API不变**：API路由 `/api/site/${id}` 保持不变
3. **功能完整**：所有现有功能完全保留
4. **性能影响**：重定向会增加一次跳转，但影响很小

## 部署建议

1. 确保重定向规则在生产环境正确配置
2. 监控重定向的访问日志
3. 考虑在适当时候移除旧的重定向规则
4. 更新相关文档和链接 