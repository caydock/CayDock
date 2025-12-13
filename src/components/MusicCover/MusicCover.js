'use client'

import { memo, useMemo, useState, useCallback } from 'react'
import Image from 'next/image'
import { searchItunes, getCoverUrl } from '@/src/utils/api'
import { useTranslations, useLocale } from 'next-intl'
import { useMemoizedFn } from '@/src/hooks/useMemoizedFn'

const MusicCover = memo(function MusicCover() {
	const t = useTranslations('musicCover')
	const locale = useLocale()
	const [searchTerm, setSearchTerm] = useState('')
	const [searchType, setSearchType] = useState('song')
	const [country, setCountry] = useState(locale === 'zh-cn' ? 'cn' : 'us')
	const [coverSize, setCoverSize] = useState('600')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [results, setResults] = useState([])
	const [hasSearched, setHasSearched] = useState(false)
	const [copySuccess, setCopySuccess] = useState(false)

	// 检测是否为苹果设备
	const isAppleDevice = useMemo(() => {
		if (typeof window === 'undefined') return false
		const userAgent = navigator.userAgent.toLowerCase()
		return /iphone|ipad|ipod/.test(userAgent)
	}, [])

	const handleSearch = useMemoizedFn(async () => {
		if (!searchTerm.trim()) {
			return
		}

		setLoading(true)
		setError('')
		setHasSearched(true)

		try {
			const data = await searchItunes({
				term: searchTerm,
				media: 'music',
				entity: searchType,
				country: country,
				limit: 50
			})

			if (data.results && data.results.length > 0) {
				setResults(data.results)
			} else {
				setResults([])
				setError(t('noResults'))
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : t('searchFailed'))
			setResults([])
		} finally {
			setLoading(false)
		}
	})

	const formatDate = useCallback((dateString) => {
		if (!dateString) return ''
		try {
			const date = new Date(dateString)
			if (isNaN(date.getTime())) return ''
			return date.getFullYear().toString()
		} catch {
			return ''
		}
	}, [])

	const downloadCover = useMemoizedFn(async (item) => {
		if (!item) return
		const url = getCoverUrl(item, coverSize)
		if (!url) return
		
		try {
			const response = await fetch(url)
			const blob = await response.blob()
			
			const blobUrl = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = blobUrl
			
			const fileName = `${item?.collectionName || item?.trackName || 'cover'}.jpg`.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
			link.download = fileName
			
			document.body.appendChild(link)
			link.click()
			
			document.body.removeChild(link)
			URL.revokeObjectURL(blobUrl)
		} catch (error) {
			console.error('Download failed:', error)
			window.open(url, '_blank', 'noopener,noreferrer')
		}
	})

	const copyCoverToClipboard = useMemoizedFn(async (item, event) => {
		if (!item) return
		
		if (event) {
			event.preventDefault()
			event.stopPropagation()
		}
		
		const url = getCoverUrl(item, coverSize)
		if (!url) return
		
		try {
			const response = await fetch(url)
			const blob = await response.blob()
			
			const img = new Image()
			img.crossOrigin = 'anonymous'
			
			await new Promise((resolve, reject) => {
				img.onload = () => resolve()
				img.onerror = reject
				img.src = url
			})
			
			const canvas = document.createElement('canvas')
			canvas.width = img.width
			canvas.height = img.height
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				throw new Error('Failed to create canvas context')
			}
			ctx.drawImage(img, 0, 0)
			
			const pngBlob = await new Promise((resolve) => {
				canvas.toBlob(resolve, 'image/png')
			})
			
			if (!pngBlob) {
				throw new Error('Failed to convert image')
			}
			
			await navigator.clipboard.write([
				new ClipboardItem({
					'image/png': pngBlob
				})
			])
			
			setCopySuccess(true)
			setTimeout(() => {
				setCopySuccess(false)
			}, 2000)
		} catch (err) {
			console.error('Copy failed:', err)
			downloadCover(item)
		}
	})

	const clearResults = useMemoizedFn(() => {
		setResults([])
		setHasSearched(false)
		setSearchTerm('')
	})

	const handleImageError = useMemoizedFn((e) => {
		e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Cover%3C/text%3E%3C/svg%3E'
	})

	const handleKeyPress = useMemoizedFn((e) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	})

	const countryOptions = useMemo(() => {
		return [
			{ value: 'us', label: t('countries.us') },
			{ value: 'cn', label: t('countries.cn') },
			{ value: 'hk', label: t('countries.hk') },
			{ value: 'tw', label: t('countries.tw') },
			{ value: 'jp', label: t('countries.jp') },
			{ value: 'gb', label: t('countries.gb') },
			{ value: 'au', label: t('countries.au') },
			{ value: 'ca', label: t('countries.ca') },
			{ value: 'de', label: t('countries.de') },
			{ value: 'fr', label: t('countries.fr') },
		]
	}, [t])

	return (
		<div className="min-h-screen bg-light dark:bg-dark flex flex-col relative overflow-hidden">
			{/* 音乐唱片风格背景 */}
			<div 
				className="fixed inset-0 pointer-events-none" 
				style={{ 
					zIndex: 0, 
					width: '100vw', 
					height: '100vh', 
					backgroundImage: 'url(/images/photo-1493225457124-a3eb161ffa5f.webp)', 
					backgroundSize: 'cover', 
					backgroundPosition: 'center', 
					backgroundRepeat: 'no-repeat', 
					opacity: 0.2, 
					filter: 'blur(20px) saturate(0.7)' 
				}}
			/>
			
			{/* Main Content */}
			<main className="flex-1 relative w-full pt-20" style={{ margin: 0, zIndex: 1 }}>
				<div className="max-w-7xl mx-auto px-5 sm:px-10 py-4 md:py-8">
					<div className="mb-10">
						<h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-dark to-gray dark:from-light dark:to-gray bg-clip-text text-transparent">
							{t('title')}
						</h1>
						<p className="text-dark/70 dark:text-light/70 text-lg">{t('description')}</p>
					</div>

					{/* 搜索表单 */}
					<div className="bg-light/80 dark:bg-dark/80 backdrop-blur-sm border border-dark/10 dark:border-light/10 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-semibold mb-3 text-dark dark:text-light">{t('searchType')}</label>
									<select
										value={searchType}
										onChange={(e) => setSearchType(e.target.value)}
										className="w-full px-4 py-3 border border-dark/10 dark:border-light/10 rounded-xl bg-light dark:bg-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 text-base"
									>
										<option value="song">{t('song')}</option>
										<option value="album">{t('album')}</option>
										<option value="musicVideo">{t('musicVideo')}</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-semibold mb-3 text-dark dark:text-light">{t('country')}</label>
									<select
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										className="w-full px-4 py-3 border border-dark/10 dark:border-light/10 rounded-xl bg-light dark:bg-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 text-base"
									>
										{countryOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-semibold mb-3 text-dark dark:text-light">{t('coverSize')}</label>
									<select
										value={coverSize}
										onChange={(e) => setCoverSize(e.target.value)}
										className="w-full px-4 py-3 border border-dark/10 dark:border-light/10 rounded-xl bg-light dark:bg-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 text-base"
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
								<label className="block text-sm font-semibold mb-3 text-dark dark:text-light">{t('searchKeyword')}</label>
								<div className="flex gap-3">
									<input
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyPress={handleKeyPress}
										type="text"
										placeholder={t('searchPlaceholder')}
										className="flex-1 px-4 py-3 border border-dark/10 dark:border-light/10 rounded-xl bg-light dark:bg-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 text-base"
									/>
									<button
										onClick={handleSearch}
										disabled={loading || !searchTerm.trim()}
										className="px-8 py-3 bg-dark dark:bg-light text-light dark:text-dark rounded-xl hover:bg-dark/90 dark:hover:bg-light/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
									>
										{loading ? t('searching') : t('search')}
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* 错误提示 */}
					{error && (
						<div className="bg-red-100/80 dark:bg-red-900/20 border border-red-300/30 dark:border-red-700/30 text-red-700 dark:text-red-400 rounded-xl p-5 mb-6 backdrop-blur-sm shadow-lg">
							<div className="flex items-center gap-3">
								<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p className="font-medium">{error}</p>
							</div>
						</div>
					)}

					{/* 复制成功提示 */}
					{copySuccess && (
						<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500/90 dark:bg-green-600/90 text-white rounded-xl px-6 py-3 shadow-lg backdrop-blur-sm animate-fade-in">
							<div className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
								</svg>
								<p className="font-medium">{t('coverCopied')}</p>
							</div>
						</div>
					)}

					{/* 结果列表 */}
					{results.length > 0 && (
						<div className="space-y-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-dark dark:text-light">{t('foundResults', { count: results.length })}</h2>
								<button
									onClick={clearResults}
									className="text-sm font-medium text-dark/60 dark:text-light/60 hover:text-dark dark:hover:text-light transition-colors px-4 py-2 rounded-lg hover:bg-dark/5 dark:hover:bg-light/5"
								>
									{t('clearResults')}
								</button>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{results.map((item, index) => (
									<div
										key={item?.trackId || item?.collectionId || index}
										className="group bg-light/80 dark:bg-dark/80 backdrop-blur-sm border border-dark/10 dark:border-light/10 rounded-2xl p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
									>
										<div 
											className="aspect-square mb-4 bg-gradient-to-br from-gray/20 to-gray/10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 cursor-pointer" 
											onClick={() => copyCoverToClipboard(item)}
										>
											<Image
												src={getCoverUrl(item, coverSize)}
												alt={item?.collectionName || item?.trackName || 'Cover'}
												width={coverSize}
												height={coverSize}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
												onError={handleImageError}
												draggable={false}
												unoptimized
											/>
										</div>
										<h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-dark dark:group-hover:text-light transition-colors text-dark dark:text-light">
											{item?.collectionName || item?.trackName || 'Unknown'}
										</h3>
										<p className="text-sm text-dark/70 dark:text-light/70 mb-3 font-medium">{item?.artistName || 'Unknown Artist'}</p>
										<div className="flex flex-wrap gap-2 mb-4">
											{item?.primaryGenreName && (
												<span className="text-xs px-3 py-1.5 bg-dark/5 dark:bg-light/5 backdrop-blur-sm rounded-full font-medium text-dark dark:text-light">
													{item.primaryGenreName}
												</span>
											)}
											{item?.releaseDate && (
												<span className="text-xs px-3 py-1.5 bg-dark/5 dark:bg-light/5 backdrop-blur-sm rounded-full font-medium text-dark dark:text-light">
													{formatDate(item.releaseDate)}
												</span>
											)}
										</div>
										<div className="flex gap-2">
											<button
												onClick={(e) => {
													e.stopPropagation()
													downloadCover(item)
												}}
												className="flex-1 px-4 py-2.5 text-sm font-semibold bg-dark dark:bg-light text-light dark:text-dark rounded-xl hover:bg-dark/90 dark:hover:bg-light/90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
											>
												{t('downloadCover')}
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation()
													copyCoverToClipboard(item, e)
												}}
												className="px-4 py-2.5 text-sm font-semibold border-2 border-dark/10 dark:border-light/10 rounded-xl hover:bg-dark/5 dark:hover:bg-light/5 hover:border-accent/50 transition-all duration-200 flex items-center justify-center text-dark dark:text-light"
											>
												{t('copyCover')}
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* 空状态 */}
					{!loading && results.length === 0 && hasSearched && (
						<div className="text-center py-20">
							<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark/5 dark:bg-light/5 mb-6">
								<svg className="w-10 h-10 text-dark/40 dark:text-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<p className="text-lg text-dark/70 dark:text-light/70 font-medium">{t('noResults')}</p>
							<p className="text-sm text-dark/50 dark:text-light/50 mt-2">{t('noResultsDesc')}</p>
						</div>
					)}

					{/* 移动端提示（仅苹果设备显示） */}
					{isAppleDevice && (
						<div className="bg-dark/5 dark:bg-light/5 border border-dark/10 dark:border-light/10 rounded-xl p-4 mt-8 backdrop-blur-sm">
							<div className="flex items-start gap-3">
								<svg className="w-4 h-4 flex-shrink-0 text-dark/60 dark:text-light/60 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div className="flex-1">
									<p className="text-xs text-dark/70 dark:text-light/70">
										{t('appleDeviceTip')}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	)
})

export default MusicCover

