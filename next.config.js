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

module.exports = withNextIntl(nextConfig);
