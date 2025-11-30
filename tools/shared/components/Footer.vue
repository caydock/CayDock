<template>
  <footer id="site-footer" class="py-10 print:hidden">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
      <!-- Copyright -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3">
        <p class="text-sm text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
          &copy; {{ currentYear }} {{ siteConfig.site.author }}
        </p>
      </div>

      <!-- Footer Menu -->
      <nav v-if="footerMenu.length > 0" class="flex flex-row text-base text-neutral-500 dark:text-neutral-400">
        <ul class="flex list-none flex-row gap-1 sm:gap-0 justify-center sm:justify-end">
          <li
            v-for="(item, index) in footerMenu"
            :key="index"
            class="flex justify-center sm:justify-end mb-0 ltr:mr-2 ltr:sm:mr-2 ltr:sm:last:mr-0 rtl:ml-2 rtl:sm:ml-2 rtl:sm:last:ml-0"
          >
            <a
              :href="item.url"
              class="text-sm decoration-primary-500 hover:underline hover:decoration-2 hover:underline-offset-2 flex items-center justify-center sm:justify-end px-2 py-2 sm:px-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors min-h-[44px] whitespace-nowrap"
              :title="item.name"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { siteConfig } from '../config.js'

const currentYear = new Date().getFullYear()

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

const footerMenu = computed(() => {
  return siteConfig.footerMenu.filter(item => item.lang === currentLang.value)
})
</script>

<style scoped>
/* Footer 样式与主站保持一致 */
#site-footer {
  max-width: 100%;
}

#site-footer > div {
  max-width: 72rem; /* 与内容区域 max-w-6xl 保持一致 (1152px) */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  #site-footer > div {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  #site-footer > div {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
