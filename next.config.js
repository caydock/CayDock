const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './src/i18n/request.js'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // othor next config here...
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },
    webpack: config => {
      config.plugins.push(new VeliteWebpackPlugin())
      return config
    },
    async redirects() {
      return [
        // 重定向 /post/xxx.html 格式到 /?site=xxx 格式
        {
          source: '/post/:slug.html',
          destination: '/?site=:slug',
          permanent: true,
        },
        // 重定向 /site?id=xxx 格式到 /?site=xxx 格式
        {
          source: '/site',
          has: [
            {
              type: 'query',
              key: 'id',
            },
          ],
          destination: '/?site=:id',
          permanent: true,
        },
        // 注意：页面路由重定向已移除，由 next-intl 自动处理
      ]
    },
    // rewrites 已移除，由 next-intl 自动处理路由
  }
  
  class VeliteWebpackPlugin {
    static started = false
    apply(/** @type {import('webpack').Compiler} */ compiler) {
      // executed three times in nextjs
      // twice for the server (nodejs / edge runtime) and once for the client
      compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
        if (VeliteWebpackPlugin.started) return
        VeliteWebpackPlugin.started = true
        const dev = compiler.options.mode === 'development'
        const { build } = await import('velite')
        await build({ watch: dev, clean: !dev })
      })
    }
  }

// Injected content via Sentry wizard below
// 临时禁用 Sentry 配置避免构建错误

// const { withSentryConfig } = require("@sentry/nextjs");

// 条件性导出配置 - 临时禁用 Sentry
module.exports = withNextIntl(nextConfig);

// 原 Sentry 配置（已禁用）
/*
module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "cay",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
*/
