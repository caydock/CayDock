<template>
  <div class="main-menu flex items-center justify-between px-4 py-6 sm:px-6 gap-x-3 pt-[2px] pr-0 pb-[3px] pl-0" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
    <!-- Logo/Title - 靠左 -->
    <div class="flex items-center" style="flex-shrink: 0;">
      <a :href="siteConfig.site.url" class="flex items-center">
        <span class="text-lg font-bold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white no-underline transition-colors duration-200">
          {{ siteConfig.site.title }}
        </span>
      </a>
    </div>

    <!-- Desktop Navigation - 靠右 -->
    <div class="flex items-center" style="flex-shrink: 0;">
      <!-- Desktop Menu -->
      <nav class="desktop-nav hidden md:flex items-center gap-x-5 h-12">
        <a
          v-for="(item, index) in mainMenu"
          :key="index"
          :href="item.url"
          class="flex items-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <p class="text-base font-medium" :title="item.name">
            {{ item.name }}
          </p>
        </a>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="flex md:hidden items-center h-12">
        <button
          @click="toggleMobileMenu"
          class="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-30 w-screen h-screen m-0 overflow-auto cursor-default bg-neutral-100/50 backdrop-blur-sm dark:bg-neutral-900/50 pt-[5px]"
      @click="toggleMobileMenu"
    >
      <ul class="flex space-y-2 mt-3 flex-col items-end w-full px-6 py-6 mx-auto overflow-visible list-none ltr:text-right rtl:text-left max-w-7xl">
        <li>
          <button
            @click="toggleMobileMenu"
            class="cursor-pointer inline-block align-text-bottom hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="Close menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </li>
        <li
          v-for="(item, index) in mainMenu"
          :key="index"
          class="mb-1"
        >
          <a
            :href="item.url"
            class="flex items-center"
            @click="mobileMenuOpen = false"
          >
            <p class="text-sm font-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" :title="item.name">
              {{ item.name }}
            </p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { siteConfig } from '../config.js'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 根据当前语言过滤菜单
const currentLang = computed(() => {
  if (typeof window === 'undefined') return 'en'
  const path = window.location.pathname
  const lang = document.documentElement.lang || 'zh-CN'
  // 检查路径或 HTML lang 属性
  if (path.startsWith('/zh-cn') || lang.toLowerCase().includes('zh')) {
    return 'zh-cn'
  }
  return 'en'
})

const mainMenu = computed(() => {
  const menus = {
    'zh-cn': [
      { name: '博客', url: '/zh-cn/posts/' },
      { name: '关于', url: '/zh-cn/about/' },
      { name: '订阅', url: '/zh-cn/subscribe/' },
      { name: '标签', url: '/zh-cn/tags/' }
    ],
    'en': [
      { name: 'Blog', url: '/posts/' },
      { name: 'About', url: '/about/' },
      { name: 'Subscribe', url: '/subscribe/' },
      { name: 'Tags', url: '/tags/' }
    ]
  }
  const lang = currentLang.value
  return menus[lang] || menus['en']
})
</script>

<style scoped>
/* 与主站样式保持一致 */
.main-menu {
  max-width: 100%;
  display: flex !important;
  align-items: center;
  justify-content: space-between !important;
  width: 100%;
}

@media (min-width: 768px) {
  .main-menu {
    max-width: 72rem; /* 与内容区域 max-w-6xl 保持一致 (1152px) */
    margin-left: auto;
    margin-right: auto;
  }
}

/* 确保桌面导航栏显示 */
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex !important;
    align-items: center;
    gap: 1.25rem;
    height: 3rem;
  }
  
  .desktop-nav a {
    display: flex;
    align-items: center;
    color: rgb(107, 114, 128);
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .desktop-nav a:hover {
    color: rgb(37, 99, 235);
  }
  
  .dark .desktop-nav a {
    color: rgb(163, 163, 163);
  }
  
  .dark .desktop-nav a:hover {
    color: rgb(96, 165, 250);
  }
  
  .desktop-nav a p {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }
}
</style>
