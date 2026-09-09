import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchAssessmentMeta, unlockAssessment } from '../api/client'
import { useI18n } from '../i18n'
import ResultView from '../components/ResultView'
import type { UnlockResponse } from '../types'

type Status = 'loading' | 'locked' | 'unlocked' | 'notfound'

export default function SharedResult() {
  const { token = '' } = useParams()
  const { t } = useI18n()
  const [status, setStatus] = useState<Status>('loading')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<UnlockResponse | null>(null)
  const [meta, setMeta] = useState<{ scheme: string; createdAt: string } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    fetchAssessmentMeta(token)
      .then((m) => {
        if (!alive) return
        setMeta({ scheme: m.scheme, createdAt: m.createdAt })
        setStatus('locked')
      })
      .catch(() => alive && setStatus('notfound'))
    return () => {
      alive = false
    }
  }, [token])

  const unlock = async () => {
    setError(null)
    setBusy(true)
    try {
      const resp = await unlockAssessment(token, password)
      setData(resp)
      setStatus('unlocked')
    } catch (e) {
      const err = e as Error & { status?: number }
      setError(err.status === 403 ? t('shared.wrongPassword') : err.message)
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading') return <p className="muted">{t('common.loading')}</p>

  if (status === 'notfound') {
    return (
      <section>
        <h1>{t('shared.heading')}</h1>
        <p className="error">{t('shared.notFound')}</p>
        <Link className="btn primary" to="/">{t('nav.home')}</Link>
      </section>
    )
  }

  if (status === 'unlocked' && data) {
    return (
      <section>
        <h1>{t('shared.heading')}</h1>
        <ResultView result={data.result} createdAt={data.createdAt} />
      </section>
    )
  }

  return (
    <section>
      <h1>{t('shared.heading')}</h1>
      {meta && <p className="muted">{t('shared.createdAt')}: {meta.createdAt}</p>}
      <div className="intake-form">
        <label className="field">
          <span className="field-label">{t('shared.passwordLabel')}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            autoComplete="current-password"
          />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button type="button" className="btn primary" onClick={unlock} disabled={busy || !password}>
          {busy ? t('common.loading') : t('shared.unlock')}
        </button>
      </div>
    </section>
  )
}
