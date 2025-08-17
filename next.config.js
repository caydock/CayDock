/** @type {import('next').NextConfig} */
module.exports = {
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
        // 重定向 /post/xxx.html 格式到新的 ?site=xxx 格式
        {
          source: '/post/:slug.html',
          destination: '/?site=:slug',
          permanent: true,
        },
        // 重定向 /post/xxx 格式到新的 ?site=xxx 格式
        {
          source: '/post/:slug',
          destination: '/?site=:slug',
          permanent: true,
        },
      ]
    }
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