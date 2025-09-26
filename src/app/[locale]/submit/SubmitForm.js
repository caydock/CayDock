"use client";
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

function isValidUrl(u) {
  try {
    const url = new URL(u)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch { return false }
}

function buildSubmission(url, title) {
  const idFromUrl = (u) => {
    try { return new URL(u).hostname.replace(/^www\./, '').replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') } catch { return '' }
  }
  const clean = (s) => (s || '').trim()
  const id = idFromUrl(url)
  return {
    id: id || undefined,
    link: clean(url), // 使用link字段而不是url
    title: clean(title) || undefined
  }
}

export default function SubmitForm({ initialLanguage, searchParams, initialSite }) {
  const t = useTranslations('ui')
  const [url, setUrl] = useState(initialSite?.link || '')
  const [title, setTitle] = useState(initialSite?.title || '')
  const [savedHint, setSavedHint] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const submission = useMemo(() => buildSubmission(url, title), [url, title])
  const json = useMemo(() => JSON.stringify(submission, null, 2), [submission])

  const requiredMissing = !url || !isValidUrl(url)

  const saveLocal = () => {
    try {
      const list = JSON.parse(localStorage.getItem('user_submissions') || '[]')
      list.push(submission)
      localStorage.setItem('user_submissions', JSON.stringify(list))
      setSavedHint(t('submit.saved'))
      setTimeout(() => setSavedHint(''), 1500)
    } catch {}
  }

  const submitApi = async () => {
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify(submission)
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || '提交失败')
      }
      const result = await res.json()
      setSubmissionResult(result)
      setShowSuccessModal(true)
      // 清空表单
      setUrl('')
      setTitle('')

    } catch (e) {
      setSavedHint(e.message || '提交失败，已保存到本地')
      setTimeout(() => setSavedHint(''), 3000)
    }
  }

  return (
    <>
      <main className="max-w-4xl mx-auto mt-16 p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-dark dark:text-light">{t('submit.title')}</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg mb-12">{t('submit.tagline')}</p>

        <form className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8" onSubmit={(e) => { e.preventDefault(); saveLocal() }}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-dark dark:text-light">{t('submit.urlLabel')}</label>
            <input 
              type="url" 
              placeholder={t('submit.urlPlaceholder')} 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              aria-invalid={!url ? undefined : (!isValidUrl(url) ? 'true' : undefined)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-base transition-colors focus:outline-none focus:border-violet-500 bg-white dark:bg-zinc-800 text-dark dark:text-light"
            />
            {url && !isValidUrl(url) && <div className="text-red-500 mt-2 text-sm">{t('submit.urlInvalid')}</div>}
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-dark dark:text-light">{t('submit.siteTitleLabel')}</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder={t('submit.siteTitlePlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-base transition-colors focus:outline-none focus:border-violet-500 bg-white dark:bg-zinc-800 text-dark dark:text-light"
            />
          </div>

          <div className="flex justify-center mt-8">
            <button 
              className="px-6 py-3 border-2 border-violet-500 bg-transparent text-violet-500 rounded-full font-semibold cursor-pointer transition-all duration-300 text-base hover:bg-violet-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed dark:text-violet-400 dark:border-violet-400 dark:hover:bg-violet-400 dark:hover:text-white" 
              type="submit" 
              onClick={(e)=>{e.preventDefault(); submitApi()}} 
              disabled={requiredMissing}
            >
              {t('submit.submitBtn')}
            </button>
          </div>
          <div className="text-center mt-4 text-gray-600 dark:text-gray-300 text-sm">
            <span>{savedHint}</span>
          </div>
        </form>

        {/* 成功弹层 */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold mb-4 text-dark dark:text-light">{t('submit.successTitle')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('submit.successMessage')}
              </p>

              <button 
                className="px-8 py-3 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-all duration-300 hover:scale-105"
                onClick={() => setShowSuccessModal(false)}
              >
                {t('submit.confirm')}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
