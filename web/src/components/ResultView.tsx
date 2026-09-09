import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { AssessmentResult } from '../types'
import CrisisBanner from './CrisisBanner'

const severityColor: Record<string, string> = {
  minimal: '#3a7d44',
  mild: '#6a994e',
  positive: '#c9a227',
  subthreshold: '#6a994e',
  symptomatic: '#b42318',
  moderate: '#c9a227',
  'moderately-severe': '#d97706',
  severe: '#b42318',
  unknown: '#616e7c'
}

export default function ResultView({
  result,
  token,
  createdAt,
  embedded = false
}: {
  result: AssessmentResult
  token?: string
  createdAt?: string
  embedded?: boolean
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
      {result.crisis && !embedded && <CrisisBanner />}

      <div className="result-scorecard" style={{ borderTopColor: color }}>
        <div className="score-big" style={{ color }}>
          {result.derived ? result.derived.value : result.total}
          <span className="score-max">/ {result.derived ? result.derived.range[1] : result.maxTotal}</span>
        </div>
        <div className="score-meta">
          <div className="severity-pill" style={{ background: color }}>
            {pick(result.severityLabel)}
          </div>
          {result.derived ? (
            <div className="muted">
              {t('result.rawScore')} {result.total}/{result.maxTotal} · {pick(result.derived.label)}{' '}
              {result.derived.value}
            </div>
          ) : (
            <div className="muted">{t('result.severityPct', { pct })}</div>
          )}
          {result.clinicalCutoff != null && (
            <div className="muted">
              {t('result.cutoff')} {result.clinicalCutoff}
              {result.derived ? ` (${pick(result.derived.label)})` : ''} ·{' '}
              {result.aboveCutoff ? t('result.above') : t('result.below')}
            </div>
          )}
        </div>
        <div className="gauge">
          <div className="gauge-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      {result.determination && (
        <section className="block determination">
          <h2>{t('result.determination')}</h2>
          <p className="determination-headline" style={{ color }}>
            {result.determination.label ? pick(result.determination.label) : ''}
          </p>
          <ul className="determination-meta">
            <li>
              {t('result.symptomCount')}: {result.determination.count}/{result.determination.threshold === 5 ? 9 : result.maxTotal}{' '}
              <span className="muted">({t('result.threshold')} ≥{result.determination.threshold})</span>
            </li>
            <li>
              {t('result.coreSymptom')}: {result.determination.coreMet ? t('common.yes') : t('common.no')}
            </li>
            <li>
              {t('result.additionalCriteria')}: {result.determination.gatesMet ? t('result.allSatisfied') : t('result.notAllSatisfied')}
            </li>
          </ul>
          {result.determination.gates.length > 0 && (
            <ul className="gate-list">
              {result.determination.gates.map((g) => (
                <li key={g.itemId} className={g.satisfied ? 'gate-ok' : 'gate-no'}>
                  <span className="gate-mark">{g.satisfied ? '✓' : '✕'}</span>
                  {pick(g.text)}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

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
            <article key={item.itemId} className={`item-card ${item.notable ? 'notable' : ''} ${item.crisisEndorsed ? 'crisis-item' : ''} ${item.kind === 'gate' ? 'gate-item' : ''}`}>
              <header className="item-head">
                <span className="item-index">{item.index}</span>
                <span className="item-text">{pick(item.text)}</span>
              </header>
              <div className="item-tags">
                <span className="tag">{t('result.whatItMeasures')}: {pick(item.domain)}</span>
                {item.dsm5 && <span className="tag">DSM-5 {item.dsm5}</span>}
                {item.reverse && <span className="tag">{t('result.reverseScored')}</span>}
                {item.kind === 'gate' && (
                  <span className={`tag ${item.gateSatisfied ? 'ok' : 'warn'}`}>
                    {item.gateSatisfied ? t('result.gateSatisfied') : t('result.gateNotSatisfied')}
                  </span>
                )}
                {item.notable && <span className="tag warn">{t('result.notable')}</span>}
                {item.crisisEndorsed && <span className="tag danger">!</span>}
              </div>
              <div className="item-answer">
                <strong>{t('result.yourAnswer')}:</strong>{' '}
                {item.selectedLabel ? pick(item.selectedLabel) : '—'}
                {item.kind !== 'gate' && (
                  <>
                    {' '}
                    <span className="muted">
                      ({t('result.scoreContrib')} {item.scoreContribution}
                      {item.reverse ? `, ${t('result.afterReverse')}` : ''})
                    </span>
                  </>
                )}
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

      {!embedded && (
        <div className="actions">
          <Link className="btn primary" to="/">
            {t('result.retake')}
          </Link>
          <Link className="btn ghost" to="/knowledge">
            {t('result.knowledge')}
          </Link>
        </div>
      )}
    </div>
  )
}
