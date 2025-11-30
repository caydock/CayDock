<template>
  <div class="min-h-screen bg-background flex flex-col relative overflow-hidden">
    <!-- 音乐唱片风格背景 -->
    <div 
      class="fixed inset-0 pointer-events-none" 
      style="z-index: 0; width: 100vw; height: 100vh; background-image: url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2000&h=2000&fit=crop&q=80'); background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0.2; filter: blur(20px) saturate(0.7);"
    ></div>
    
    <!-- Header -->
    <Header />
    
    <!-- Main Content -->
    <main class="flex-1 relative" style="margin: 0; z-index: 1;">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8">
      <div class="mb-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          音乐封面查询
        </h1>
        <p class="text-muted-foreground text-lg">免费音乐封面查询刮削工具，支持搜索专辑、歌曲、音乐录影带封面，可下载高清封面图片（600x600至2000x2000），支持多个国家/地区的 iTunes Store</p>
      </div>

      <!-- 搜索表单 -->
      <div class="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-3 text-foreground">搜索类型</label>
              <select
                v-model="searchType"
                class="w-full px-4 py-3 border border-input/50 rounded-xl bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-base"
              >
                <option value="album">专辑</option>
                <option value="song">歌曲</option>
                <option value="musicVideo">音乐录影带</option>
                <option value="artist">艺人</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-3 text-foreground">国家/地区</label>
              <select
                v-model="country"
                class="w-full px-4 py-3 border border-input/50 rounded-xl bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-base"
              >
                <option value="us">美国</option>
                <option value="cn">中国</option>
                <option value="hk">中国香港</option>
                <option value="tw">中国台湾</option>
                <option value="jp">日本</option>
                <option value="gb">英国</option>
                <option value="au">澳大利亚</option>
                <option value="ca">加拿大</option>
                <option value="de">德国</option>
                <option value="fr">法国</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-3 text-foreground">封面分辨率</label>
              <select
                v-model="coverSize"
                class="w-full px-4 py-3 border border-input/50 rounded-xl bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-base"
              >
                <option value="600">600x600</option>
                <option value="1200">1200x1200</option>
                <option value="1400">1400x1400</option>
                <option value="1500">1500x1500</option>
                <option value="1600">1600x1600</option>
                <option value="1800">1800x1800</option>
                <option value="2000">2000x2000</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-3 text-foreground">搜索关键词</label>
            <div class="flex gap-3">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="输入专辑名、歌曲名或艺人名..."
                class="flex-1 px-4 py-3 border border-input/50 rounded-xl bg-background/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-base"
                @keyup.enter="handleSearch"
              />
              <button
                @click="handleSearch"
                :disabled="loading || !searchTerm.trim()"
                class="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {{ loading ? '搜索中...' : '搜索' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-5 mb-6 backdrop-blur-sm shadow-lg">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- 结果列表 -->
      <div v-if="results.length > 0" class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-foreground">找到 {{ results.length }} 个结果</h2>
          <button
            @click="clearResults"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-accent/50"
          >
            清空结果
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(item, index) in results"
            :key="item?.trackId || item?.collectionId || index"
            class="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <div class="aspect-square mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img
                :src="getCoverUrl(item)"
                :alt="item?.collectionName || item?.trackName || 'Cover'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
            </div>
            <h3 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {{ item?.collectionName || item?.trackName || 'Unknown' }}
            </h3>
            <p class="text-sm text-muted-foreground mb-3 font-medium">{{ item?.artistName || 'Unknown Artist' }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-if="item?.primaryGenreName" class="text-xs px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full font-medium">
                {{ item.primaryGenreName }}
              </span>
              <span v-if="item?.releaseDate" class="text-xs px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full font-medium">
                {{ formatDate(item.releaseDate) }}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                @click.stop="downloadCover(item)"
                class="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                下载封面
              </button>
              <a
                v-if="item?.collectionViewUrl || item?.trackViewUrl"
                :href="item?.collectionViewUrl || item?.trackViewUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2.5 text-sm font-semibold border-2 border-border rounded-xl hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 flex items-center justify-center"
                @click.stop
              >
                查看
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && results.length === 0 && hasSearched" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6">
          <svg class="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-lg text-muted-foreground font-medium">未找到相关结果</p>
        <p class="text-sm text-muted-foreground/70 mt-2">请尝试其他关键词或调整搜索条件</p>
      </div>
      </div>
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchItunes, getCoverUrl as getCoverUrlUtil } from './utils/api'
import Header from '@shared/components/Header.vue'
import Footer from '@shared/components/Footer.vue'

const searchTerm = ref('')
const searchType = ref('album')
const country = ref('cn')
const coverSize = ref('600')
const loading = ref(false)
const error = ref('')
const results = ref([])
const hasSearched = ref(false)

const handleSearch = async () => {
  if (!searchTerm.value.trim()) {
    return
  }

  loading.value = true
  error.value = ''
  hasSearched.value = true

  try {
    const data = await searchItunes({
      term: searchTerm.value,
      media: 'music',
      entity: searchType.value,
      country: country.value,
      limit: 50
    })

    if (data.results && data.results.length > 0) {
      results.value = data.results
    } else {
      results.value = []
      error.value = '未找到相关结果'
    }
  } catch (err) {
    error.value = err.message || '搜索失败，请稍后重试'
    results.value = []
  } finally {
    loading.value = false
  }
}

const getCoverUrl = (item) => {
  if (!item) return ''
  return getCoverUrlUtil(item, coverSize.value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.getFullYear()
  } catch (error) {
    return ''
  }
}

const downloadCover = (item) => {
  if (!item) return
  const url = getCoverUrl(item)
  if (!url) return
  try {
    // 在新标签页中打开封面图片
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch (error) {
    console.error('Failed to open cover:', error)
  }
}

const clearResults = () => {
  results.value = []
  hasSearched.value = false
  searchTerm.value = ''
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E无封面%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

