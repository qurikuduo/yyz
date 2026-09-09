import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { AssessmentResult, ComprehensiveReport } from '../types'
import CrisisBanner from './CrisisBanner'
import ResultView from './ResultView'

const bandColor: Record<string, string> = {
  minimal: '#3a7d44',
  mild: '#6a994e',
  moderate: '#c9a227',
  'moderately-severe': '#d97706',
  severe: '#b42318'
}

const concordanceColor: Record<string, string> = {
  high: '#3a7d44',
  moderate: '#c9a227',
  low: '#d97706'
}

export default function ComprehensiveView({
  comprehensive,
  results,
  token,
  createdAt
}: {
  comprehensive: ComprehensiveReport
  results: AssessmentResult[]
  token?: string
  createdAt?: string
}) {
  const { t, pick, pickList } = useI18n()
  const [openScale, setOpenScale] = useState<string | null>(results[0]?.scheme ?? null)
  const [copied, setCopied] = useState(false)

  const color = bandColor[comprehensive.integrated.band] || '#616e7c'
  const pct = comprehensive.integrated.severityPct
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
      {comprehensive.crisis && <CrisisBanner />}

      <div className="result-scorecard" style={{ borderTopColor: color }}>
        <div className="score-big" style={{ color }}>
          {pct}
          <span className="score-max">%</span>
        </div>
        <div className="score-meta">
          <div className="severity-pill" style={{ background: color }}>
            {pick(comprehensive.integrated.bandLabel)}
          </div>
          <div className="muted">{t('comprehensive.integratedSeverity')}</div>
          <div className="muted">
            {t('comprehensive.concordance')}:{' '}
            <span style={{ color: concordanceColor[comprehensive.concordance.level] || '#616e7c' }}>
              {t(`comprehensive.concordance.${comprehensive.concordance.level}`)}
            </span>
          </div>
        </div>
        <div className="gauge">
          <div className="gauge-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      <section className="block">
        <h2>{t('result.summary')}</h2>
        <p>{pick(comprehensive.summary)}</p>
      </section>

      {comprehensive.advice && (
        <section className="block">
          <h2>{t('result.advice')}</h2>
          <p>{pick(comprehensive.advice)}</p>
        </section>
      )}

      <section className="block">
        <h2>{t('comprehensive.perScale')}</h2>
        <div className="scale-grid">
          {comprehensive.included.map((inc) => {
            const c = severityFallback(inc.severity)
            return (
              <div key={inc.id} className="scale-chip" style={{ borderLeftColor: c }}>
                <div className="scale-chip-name">{pick(inc.shortName)}</div>
                <div className="scale-chip-score">
                  {inc.derived
                    ? `${pick(inc.derived.label)} ${inc.derived.value}`
                    : `${inc.total}/${inc.maxTotal}`}
                </div>
                <div className="scale-chip-sev" style={{ color: c }}>
                  {pick(inc.severityLabel)}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {comprehensive.dsm5 && (
        <section className="block determination">
          <h2>{t('comprehensive.dsm5Mapping')}</h2>
          <p className="determination-headline">
            {comprehensive.dsm5.label ? pick(comprehensive.dsm5.label) : ''}
          </p>
          <ul className="determination-meta">
            <li>
              {t('result.symptomCount')}: {comprehensive.dsm5.count}/9{' '}
              <span className="muted">({t('result.threshold')} ≥{comprehensive.dsm5.threshold})</span>
            </li>
            <li>{t('result.coreSymptom')}: {comprehensive.dsm5.coreMet ? t('common.yes') : t('common.no')}</li>
            <li>{t('result.additionalCriteria')}: {comprehensive.dsm5.gatesMet ? t('result.allSatisfied') : t('result.notAllSatisfied')}</li>
          </ul>
        </section>
      )}

      <section className="block">
        <h2>{t('result.basis')}</h2>
        <ul className="basis-list">
          {pickList(comprehensive.basis).map((line, i) => (
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
        <h2>{t('comprehensive.detailedReports')}</h2>
        <p className="muted">{t('comprehensive.detailedHint')}</p>
        <div className="accordion">
          {results.map((r) => {
            const open = openScale === r.scheme
            return (
              <div key={r.scheme} className="accordion-item">
                <button
                  type="button"
                  className="accordion-head"
                  onClick={() => setOpenScale(open ? null : r.scheme)}
                  aria-expanded={open}
                >
                  <span>{pick(r.schemeName)}</span>
                  <span className="accordion-caret">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="accordion-body">
                    <ResultView result={r} embedded />
                  </div>
                )}
              </div>
            )
          })}
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

function severityFallback(severity: string): string {
  const map: Record<string, string> = {
    minimal: '#3a7d44',
    mild: '#6a994e',
    positive: '#c9a227',
    subthreshold: '#6a994e',
    symptomatic: '#b42318',
    moderate: '#c9a227',
    'moderately-severe': '#d97706',
    severe: '#b42318'
  }
  return map[severity] || '#616e7c'
}
