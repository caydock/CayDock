"use client";
import { useMemo, useState } from 'react'
import { useLanguage } from '@/src/components/i18n/LanguageProvider'

// 内联CSS样式
const styles = `
  .page {
    max-width: 800px;
    margin: 4rem auto 0;
    padding: 2rem;
  }

  .page h1 {
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }

  .tagline {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 3rem;
  }

  .form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .field {
    margin-bottom: 1.5rem;
  }

  .field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  .field input,
  .field textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .field input:focus,
  .field textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .grid.two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .secondary {
    padding: 0.75rem 1.5rem;
    border: 2px solid #667eea;
    background: transparent;
    color: #667eea;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .secondary:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }

  .secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .primary:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }

  .hint {
    text-align: center;
    margin-top: 1rem;
    color: #666;
    font-size: 0.9rem;
  }

  .code {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    border: 1px solid #e5e5e5;
  }

  .code code {
    color: #333;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .page h1 {
      color: white;
    }
    
    .tagline {
      color: #ccc;
    }
    
    .form {
      background: rgba(30, 30, 30, 0.95);
    }
    
    .field label {
      color: white;
    }
    
    .field input,
    .field textarea {
      background: #2a2a2a;
      border-color: #444;
      color: white;
    }
    
    .field input:focus,
    .field textarea:focus {
      border-color: #667eea;
    }
    
    .code {
      background: #2a2a2a;
      border-color: #444;
    }
    
    .code code {
      color: #ccc;
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .page {
      padding: 1rem;
      margin-top: 1.5rem;
    }
    
    .page h1 {
      font-size: 2rem;
    }
    
    .grid.two {
      grid-template-columns: 1fr;
    }
    
    .actions {
      flex-direction: column;
      align-items: center;
    }
    
    .secondary,
    .primary {
      width: 100%;
      max-width: 200px;
    }
  }
`;

function isValidUrl(u) {
  try {
    const url = new URL(u)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch { return false }
}

function buildSubmission(url, title, pitch) {
  const idFromUrl = (u) => {
    try { return new URL(u).hostname.replace(/^www\./, '').replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') } catch { return '' }
  }
  const clean = (s) => (s || '').trim()
  const id = idFromUrl(url)
  return {
    id: id || undefined,
    url: clean(url),
    title: clean(title) || undefined,
    description: clean(pitch) || undefined
  }
}

export default function SubmitPage() {
  const { t } = useLanguage()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [pitch, setPitch] = useState('')
  const [savedHint, setSavedHint] = useState('')
  const submission = useMemo(() => buildSubmission(url, title, pitch), [url, title, pitch])
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
      if (!res.ok) throw new Error('bad status')
      await res.json()
      setSavedHint(t('submit.saved'))
      setTimeout(() => setSavedHint(''), 1500)
    } catch (e) {
      saveLocal()
    }
  }

  return (
    <>
      <style jsx>{styles}</style>
      <main className="page">
        <h1 className="dark:text-light">{t('submit.title')}</h1>
        <p className="tagline dark:text-light">{t('submit.tagline')}</p>

        <form className="form dark:bg-dark dark:text-light" onSubmit={(e) => { e.preventDefault(); saveLocal() }}>
          <div className="field">
            <label className="dark:text-light">{t('submit.urlLabel')}</label>
            <input type="url" placeholder={t('submit.urlPlaceholder')} value={url} onChange={(e) => setUrl(e.target.value)} required aria-invalid={!url ? undefined : (!isValidUrl(url) ? 'true' : undefined)} />
            {url && !isValidUrl(url) && <div style={{color:'#c00', marginTop:6, fontSize:'0.9rem'}}>{t('submit.urlInvalid')}</div>}
          </div>
          <div className="field">
            <label className="dark:text-light">{t('submit.siteTitleLabel')}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label className="dark:text-light">{t('submit.pitchLabel')}</label>
            <textarea rows={3} value={pitch} onChange={(e) => setPitch(e.target.value)} />
          </div>

          <div className="actions">
            <button className="secondary dark:text-light" type="submit" onClick={(e)=>{e.preventDefault(); submitApi()}} disabled={requiredMissing}>{t('submit.submitBtn')}</button>
          </div>
          <div className="hint dark:text-light">
            <span>{savedHint}</span>
          </div>
        </form>
      </main>
    </>
  )
} 