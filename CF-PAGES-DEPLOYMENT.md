# Cloudflare Pages 部署配置

本文档说明如何将CayDock Hugo网站部署到Cloudflare Pages。

## 配置文件说明

### 1. wrangler.toml
Cloudflare Wrangler配置文件，定义了项目的基本信息和构建配置。

### 2. package.json
Node.js项目配置文件，包含构建脚本和依赖项。

### 3. GitHub Actions (.github/workflows/deploy.yml)
自动化部署工作流，支持：
- 主分支推送到生产环境
- PR创建预览环境
- 自动构建和部署

### 4. Hugo配置
- `config/production/hugo.toml`: 生产环境配置
- `config/preview/hugo.toml`: 预览环境配置
- `static/_redirects`: CF Pages重定向规则

## 部署步骤

### 1. 设置Cloudflare Pages项目
1. 登录Cloudflare Dashboard
2. 进入Pages部分
3. 创建新项目，连接到GitHub仓库
4. 配置项目名称：`caydock-hugo`

### 2. 配置环境变量
在Cloudflare Pages项目设置中添加以下环境变量：
- `HUGO_VERSION`: `0.121.0`
- `NODE_VERSION`: `18`

### 3. 配置GitHub Secrets
在GitHub仓库设置中添加以下Secrets：
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

### 4. 构建配置
- **构建命令**: `hugo --minify --gc`
- **构建输出目录**: `public`
- **根目录**: `/` (项目根目录)

### 5. 自定义域名（可选）
如果需要使用自定义域名：
1. 在CF Pages项目设置中添加自定义域名
2. 更新DNS记录指向CF Pages
3. 更新`wrangler.toml`中的域名配置

## 本地开发

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
```

### 构建
```bash
npm run build
```

### 预览构建
```bash
npm run build:preview
```

## 部署命令

### 手动部署到CF Pages
```bash
npm run deploy
```

### 预览部署
```bash
npm run deploy:preview
```

## 重定向规则

`static/_redirects`文件包含了所有必要的URL重定向规则，确保：
- 旧的URL格式正确重定向
- 多语言URL正确处理
- 分页URL正确处理
- 静态资源正确服务

## 性能优化

配置包含了以下优化：
- 启用Hugo的minify功能
- 配置适当的缓存策略
- 优化图片和资源处理
- 启用压缩输出

## 监控和调试

- 使用CF Pages的Analytics监控访问情况
- 通过CF Dashboard查看部署日志
- 使用GitHub Actions查看构建日志

## 故障排除

### 常见问题
1. **构建失败**: 检查Hugo版本和Node.js版本
2. **重定向不工作**: 检查`_redirects`文件语法
3. **资源404**: 检查静态文件路径和`_redirects`规则

### 调试步骤
1. 检查GitHub Actions日志
2. 查看CF Pages构建日志
3. 测试本地构建
4. 验证环境变量配置
