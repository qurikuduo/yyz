import { useEffect, useMemo, useState } from 'react'
import { fetchKnowledge, knowledgeDownloadUrl } from '../api/client'
import { useI18n } from '../i18n'
import type { KnowledgeIndex } from '../types'

export default function Knowledge() {
  const { t, pick } = useI18n()
  const [data, setData] = useState<KnowledgeIndex | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchKnowledge()
      .then((r) => alive && setData(r))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])

  const grouped = useMemo(() => {
    if (!data) return []
    return data.categories.map((cat) => ({
      category: cat,
      resources: data.resources.filter((r) => r.category === cat.id)
    })).filter((g) => g.resources.length > 0)
  }, [data])

  if (error) return <section><h1>{t('knowledge.heading')}</h1><p className="error">{t('common.error')}: {error}</p></section>
  if (!data) return <section><h1>{t('knowledge.heading')}</h1><p className="muted">{t('common.loading')}</p></section>

  return (
    <section>
      <h1>{t('knowledge.heading')}</h1>
      <p className="muted intro">{t('knowledge.intro')}</p>

      {grouped.map(({ category, resources }) => (
        <div key={category.id} className="knowledge-group">
          <h2 className="knowledge-cat">{pick(category.name)}</h2>
          <div className="card-grid">
            {resources.map((r) => (
              <div key={r.slug} className="knowledge-card">
                <div className="knowledge-card-head">
                  <span className="scale-name">{pick(r.title)}</span>
                  {r.downloadable
                    ? <span className="badge">Markdown</span>
                    : <span className="badge soon">{t('knowledge.open')}</span>}
                </div>
                <p className="scale-desc">{pick(r.summary)}</p>
                <div className="knowledge-card-actions">
                  {r.downloadable ? (
                    <a className="btn primary sm" href={knowledgeDownloadUrl(r.slug)} download>
                      {t('knowledge.download')} ↓
                    </a>
                  ) : null}
                  {r.externalUrl ? (
                    <a className="btn ghost sm" href={r.externalUrl} target="_blank" rel="noopener noreferrer">
                      {t('knowledge.open')} ↗
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="muted page-note">{t('knowledge.disclaimer')}</p>
    </section>
  )
}
