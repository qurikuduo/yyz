import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import Disclaimer from './Disclaimer'

const REPO_URL = 'https://github.com/qurikuduo/yyz'
const LOCAL_VERSION = __APP_VERSION__

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0)
    if (d !== 0) return d
  }
  return 0
}

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch('https://api.github.com/repos/qurikuduo/yyz/tags', {
      signal: ctrl.signal,
      headers: { Accept: 'application/vnd.github+json' }
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const tags = (await res.json()) as { name?: string }[]
    const versions = tags
      .map((t) => (t.name ?? '').replace(/^v/i, ''))
      .filter((v) => /^\d+(\.\d+){0,2}$/.test(v))
    if (versions.length === 0) return null
    return versions.sort(compareVersions)[versions.length - 1]
  } catch {
    return null
  }
}

export default function Footer() {
  const { t } = useI18n()
  const [latest, setLatest] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchLatestVersion().then((v) => alive && setLatest(v))
    return () => {
      alive = false
    }
  }, [])

  const hasNewer = latest !== null && compareVersions(latest, LOCAL_VERSION) > 0

  return (
    <footer className="app-footer">
      <Disclaimer />
      <div className="footer-meta">
        <a
          className="gh-link"
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={REPO_URL}
          aria-label="GitHub qurikuduo/yyz"
        >
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>qurikuduo/yyz</span>
        </a>
        <span className="ver-chip">
          v{LOCAL_VERSION}
          {hasNewer ? <em> · {t('footer.newer', { v: latest })}</em> : null}
        </span>
      </div>
    </footer>
  )
}
