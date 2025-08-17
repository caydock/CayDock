"use client";
import { memo } from 'react'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'

const FloatingActionBar = memo(({ 
  current, 
  hideFab, 
  onRandom, 
  onMarkOpened, 
  onFullscreenToggle 
}) => {
  const { t } = useLanguage()

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 bottom-5 z-50 flex items-center gap-4 rounded-full border border-black/10 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-3 py-2 shadow-xl w-[94vw] max-w-[680px] sm:w-auto sm:max-w-none transition-all duration-200 ${hideFab ? 'opacity-0 pointer-events-none' : ''}`}
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
    >
      {current ? (
        <a
          className="inline-flex items-center justify-center rounded-full border-2 border-violet-600/90 text-violet-700 bg-white/90 dark:bg-zinc-900/80 dark:text-violet-200 px-5 py-3 hover:bg-violet-50/40 active:opacity-95 transition flex-1 sm:flex-none"
          href={current.url}
          target="_blank"
          rel="noreferrer"
          onClick={onMarkOpened}
        >
          {t('discover.open')}
        </a>
      ) : null}          
      <button
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 text-white font-extrabold px-6 sm:px-8 py-3 shadow-md hover:brightness-105 active:brightness-95 transition flex-1 sm:flex-none sm:min-w-[160px]"
        onClick={onRandom}
      >
         {t('discover.random')} 
      </button>

      {current && (
        <button
          type="button"
          onClick={onFullscreenToggle}
          aria-label="Toggle fullscreen"
          className="inline-flex items-center justify-center rounded-full bg-black/60 text-white text-sm px-3 py-3 backdrop-blur hover:bg-black/70 active:opacity-90 transition"
        >
          {document.fullscreenElement || document.webkitFullscreenElement ? '✕' : '⛶'}
        </button>
      )}
    </div>
  )
})

FloatingActionBar.displayName = 'FloatingActionBar'

export default FloatingActionBar 