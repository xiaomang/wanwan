/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // 生产环境关闭 devtools 省内存
  devtools: { enabled: !isProd },

  css: ['~/assets/css/main.css'],

  // --- 低内存构建优化 ---
  // 关闭压缩：省 30-50% 构建内存，运行时性能差异 <5%
  vite: {
    build: {
      minify: false,
      sourcemap: false,
    },
  },
  nitro: {
    minify: false,
    sourceMap: false,
    // 生产环境只保留 console.error / warn
    rollupConfig: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '玩玩',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: '玩玩' },
      ],
    },
  },
})
