import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { AssessmentResult } from '../types'
import CrisisBanner from './CrisisBanner'

const severityColor: Record<string, string> = {
  minimal: '#3a7d44',
  mild: '#6a994e',
  moderate: '#c9a227',
  'moderately-severe': '#d97706',
  severe: '#b42318',
  unknown: '#616e7c'
}

export default function ResultView({
  result,
  token,
  createdAt
}: {
  result: AssessmentResult
  token?: string
  createdAt?: string
}) {
  const { t, pick, pickList } = useI18n()
  const [copied, setCopied] = useState(false)

  const pct = Math.round(result.normalized * 100)
  const color = severityColor[result.severity] || severityColor.unknown
  const shareUrl = token ? `${window.location.origin}/r/${token}` : null

  const copy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="result">
      {result.crisis && <CrisisBanner />}

      <div className="result-scorecard" style={{ borderTopColor: color }}>
        <div className="score-big" style={{ color }}>
          {result.total}
          <span className="score-max">/ {result.maxTotal}</span>
        </div>
        <div className="score-meta">
          <div className="severity-pill" style={{ background: color }}>
            {pick(result.severityLabel)}
          </div>
          <div className="muted">{t('result.severityPct', { pct })}</div>
          {result.clinicalCutoff != null && (
            <div className="muted">
              {t('result.cutoff')} {result.clinicalCutoff} ·{' '}
              {result.aboveCutoff ? t('result.above') : t('result.below')}
            </div>
          )}
        </div>
        <div className="gauge">
          <div className="gauge-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      <section className="block">
        <h2>{t('result.summary')}</h2>
        <p>{pick(result.summary)}</p>
      </section>

      {result.advice && (
        <section className="block">
          <h2>{t('result.advice')}</h2>
          <p>{pick(result.advice)}</p>
        </section>
      )}

      <section className="block">
        <h2>{t('result.basis')}</h2>
        <ul className="basis-list">
          {pickList(result.basis).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {shareUrl && (
        <section className="block share">
          <h2>{t('result.shareTitle')}</h2>
          <p className="muted">{t('result.shareHint')}</p>
          <div className="share-row">
            <code className="share-url">{shareUrl}</code>
            <button type="button" className="btn ghost" onClick={copy}>
              {copied ? t('result.copied') : t('result.copy')}
            </button>
          </div>
          {createdAt && <p className="muted">{t('shared.createdAt')}: {createdAt}</p>}
        </section>
      )}

      <section className="block">
        <h2>{t('result.itemReview')}</h2>
        <div className="item-list">
          {result.items.map((item) => (
            <article key={item.itemId} className={`item-card ${item.notable ? 'notable' : ''} ${item.crisisEndorsed ? 'crisis-item' : ''}`}>
              <header className="item-head">
                <span className="item-index">{item.index}</span>
                <span className="item-text">{pick(item.text)}</span>
              </header>
              <div className="item-tags">
                <span className="tag">{t('result.whatItMeasures')}: {pick(item.domain)}</span>
                {item.dsm5 && <span className="tag">DSM-5 {item.dsm5}</span>}
                {item.notable && <span className="tag warn">{t('result.notable')}</span>}
                {item.crisisEndorsed && <span className="tag danger">!</span>}
              </div>
              <div className="item-answer">
                <strong>{t('result.yourAnswer')}:</strong>{' '}
                {item.selectedLabel ? pick(item.selectedLabel) : '—'}{' '}
                <span className="muted">({t('result.scoreContrib')} {item.scoreContribution})</span>
              </div>
              <div className="item-explain">
                <strong>{t('result.whyItMatters')}:</strong> {pick(item.explanation)}
              </div>
              {item.selectedMeaning && (
                <div className="item-meaning">
                  <strong>{t('result.answerMeaning')}:</strong> {pick(item.selectedMeaning)}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="actions">
        <Link className="btn primary" to="/">
          {t('result.retake')}
        </Link>
        <Link className="btn ghost" to="/knowledge">
          {t('result.knowledge')}
        </Link>
      </div>
    </div>
  )
}
