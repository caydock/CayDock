<template>
  <div class="min-h-screen bg-background p-4 md:p-8" style="margin: 0; padding: 1rem 2rem;">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">音乐封面查询</h1>
        <p class="text-muted-foreground">通过 iTunes Search API 搜索音乐专辑封面</p>
      </div>

      <!-- 搜索表单 -->
      <div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">搜索类型</label>
              <select
                v-model="searchType"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="album">专辑</option>
                <option value="song">歌曲</option>
                <option value="musicVideo">音乐录影带</option>
                <option value="artist">艺人</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">国家/地区</label>
              <select
                v-model="country"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              <label class="block text-sm font-medium mb-2">封面分辨率</label>
              <select
                v-model="coverSize"
                class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            <label class="block text-sm font-medium mb-2">搜索关键词</label>
            <div class="flex gap-2">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="输入专辑名、歌曲名或艺人名..."
                class="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                @keyup.enter="handleSearch"
              />
              <button
                @click="handleSearch"
                :disabled="loading || !searchTerm.trim()"
                class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? '搜索中...' : '搜索' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mb-6">
        {{ error }}
      </div>

      <!-- 结果列表 -->
      <div v-if="results.length > 0" class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <p class="text-muted-foreground">找到 {{ results.length }} 个结果</p>
          <button
            @click="clearResults"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            清空结果
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(item, index) in results"
            :key="item?.trackId || item?.collectionId || index"
            class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div class="aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
              <img
                :src="getCoverUrl(item)"
                :alt="item?.collectionName || item?.trackName || 'Cover'"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <h3 class="font-semibold mb-1 line-clamp-2">{{ item?.collectionName || item?.trackName || 'Unknown' }}</h3>
            <p class="text-sm text-muted-foreground mb-2">{{ item?.artistName || 'Unknown Artist' }}</p>
            <div class="flex flex-wrap gap-2 mb-3">
              <span v-if="item?.primaryGenreName" class="text-xs px-2 py-1 bg-secondary rounded">
                {{ item.primaryGenreName }}
              </span>
              <span v-if="item?.releaseDate" class="text-xs px-2 py-1 bg-secondary rounded">
                {{ formatDate(item.releaseDate) }}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                @click="downloadCover(item)"
                class="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                下载封面
              </button>
              <a
                v-if="item?.collectionViewUrl || item?.trackViewUrl"
                :href="item?.collectionViewUrl || item?.trackViewUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
              >
                查看
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && results.length === 0 && hasSearched" class="text-center py-12">
        <p class="text-muted-foreground">未找到相关结果，请尝试其他关键词</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchItunes, getCoverUrl as getCoverUrlUtil } from './utils/api'

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
    const link = document.createElement('a')
    link.href = url
    link.download = `${item.collectionName || item.trackName || 'cover'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to download cover:', error)
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

