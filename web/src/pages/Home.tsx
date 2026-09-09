import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchScales } from '../api/client'
import { useI18n } from '../i18n'
import type { ScaleSummary } from '../types'

export default function Home() {
  const { t, pick } = useI18n()
  const navigate = useNavigate()
  const [scales, setScales] = useState<ScaleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchScales()
      .then((r) => alive && setScales(r.scales))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  if (loading) return <p className="muted">{t('common.loading')}</p>
  if (error) return <p className="error">{t('common.error')}: {error}</p>

  return (
    <section>
      <h1>{t('home.heading')}</h1>
      <p className="muted intro">{t('home.intro')}</p>

      <div className="card-grid">
        {scales.map((s) => (
          <button
            key={s.id}
            type="button"
            className="scale-card"
            onClick={() => navigate(`/intake/${s.id}`)}
          >
            <div className="scale-card-head">
              <span className="scale-name">{pick(s.name)}</span>
              <span className="badge">{s.itemCount} {t('home.items')}</span>
            </div>
            <p className="scale-desc">{pick(s.description)}</p>
            <span className="scale-start">{t('home.start')} →</span>
          </button>
        ))}

        <div className="scale-card disabled" aria-disabled="true">
          <div className="scale-card-head">
            <span className="scale-name">{t('home.comprehensive')}</span>
            <span className="badge soon">{t('home.comSoon')}</span>
          </div>
          <p className="scale-desc">{t('home.comSoon')}</p>
        </div>
      </div>
    </section>
  )
}
