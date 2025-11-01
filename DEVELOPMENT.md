# 开发环境配置

## 统计代码禁用

在本地开发环境中，以下统计代码已被自动禁用：

### 1. Google Analytics
- 跟踪ID: `G-GY58MNR1C0`
- 在开发环境中不会加载

### 2. Microsoft Clarity
- 跟踪ID: `soy2grvr91`
- 在开发环境中不会加载

### 3. Umami Analytics
- 网站ID: `c7ffa851-1275-406a-b593-78a51e851f87`
- 在开发环境中不会加载事件追踪

### 4. Google AdSense
- 发布商ID: `ca-pub-2011896129037768`
- 在开发环境中不会加载

## 环境判断逻辑

项目使用 `src/utils/env.js` 统一管理环境配置：

```javascript
// 环境判断
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// 统计代码配置
export const shouldEnableAnalytics = isProduction
export const shouldEnableAdSense = isProduction
```

## 开发环境提示

启动开发服务器时，控制台会显示：

```
🔧 开发环境配置: {
  nodeEnv: 'development',
  isDevelopment: true,
  isProduction: false,
  shouldEnableAnalytics: false,
  shouldEnableAdSense: false
}
📊 开发环境：统计代码已禁用
```

## 手动启用统计代码（仅用于测试）

如果需要测试统计代码，可以临时修改 `src/utils/env.js`：

```javascript
// 临时启用统计代码进行测试
export const shouldEnableAnalytics = true
export const shouldEnableAdSense = true
```

**注意：测试完成后请立即恢复为生产环境配置。**

## 生产环境部署

在生产环境中，所有统计代码会自动启用：

- `NODE_ENV=production` 时自动启用所有统计代码
- 无需额外配置

## 错误日志

生产环境的错误日志会通过以下方式收集：

1. **Cloudflare日志流**: 通过 `console.error` 记录的错误
2. **API错误**: 通过统一的错误处理中间件记录

## 开发建议

1. 在开发时避免修改统计代码配置
2. 使用浏览器开发者工具验证统计代码是否被禁用
3. 定期检查生产环境的统计代码是否正常工作
