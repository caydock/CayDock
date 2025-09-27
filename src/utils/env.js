/**
 * 环境变量配置
 * 用于统一管理环境判断和配置
 */

// 环境判断
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'

// Cloudflare Pages 环境检测
export const isCloudflarePages = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || 
                                 process.env.CF_PAGES_BRANCH !== undefined

// 统计代码配置
export const shouldEnableAnalytics = isProduction
export const shouldEnableAdSense = isProduction
export const shouldEnableSentry = false // 临时禁用 Sentry 避免构建错误

// 调试配置
export const shouldEnableDebugLogs = isDevelopment

// 环境信息
export const getEnvironmentInfo = () => ({
  nodeEnv: process.env.NODE_ENV,
  isDevelopment,
  isProduction,
  isTest,
  isCloudflarePages,
  cfPagesBranch: process.env.CF_PAGES_BRANCH,
  cfPagesUrl: process.env.CF_PAGES_URL,
  nextPublicVercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV,
  shouldEnableAnalytics,
  shouldEnableAdSense,
  shouldEnableSentry,
  shouldEnableDebugLogs
})

// 开发环境提示
if (isDevelopment) {
  console.log('🔧 开发环境配置:', getEnvironmentInfo())
}

// 生产环境提示（仅在控制台显示）
if (isProduction) {
  console.log('🚀 生产环境配置:', {
    nodeEnv: process.env.NODE_ENV,
    isCloudflarePages,
    shouldEnableAnalytics,
    shouldEnableAdSense
  })
}
