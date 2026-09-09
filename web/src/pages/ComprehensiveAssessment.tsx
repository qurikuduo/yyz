import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchComprehensiveBattery, submitAssessment } from '../api/client'
import { useI18n } from '../i18n'
import type { Intake, ScaleDef, ScaleItem } from '../types'

interface FlatItem {
  scale: ScaleDef
  item: ScaleItem
  order: number
}

export default function ComprehensiveAssessment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, pick, lang } = useI18n()

  const intake = (location.state?.intake ?? {}) as Intake

  const [battery, setBattery] = useState<ScaleDef[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [current, setCurrent] = useState(0)
  const [stage, setStage] = useState<'questions' | 'password'>('questions')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwError, setPwError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    fetchComprehensiveBattery()
      .then((r) => alive && setBattery(r.scales))
      .catch((e) => alive && setLoadError(e.message))
    return () => {
      alive = false
    }
  }, [])

  const flat: FlatItem[] = useMemo(() => {
    if (!battery) return []
    const out: FlatItem[] = []
    for (const scale of battery) {
      for (const item of scale.items) out.push({ scale, item, order: out.length })
    }
    return out
  }, [battery])

  const answeredCount = useMemo(
    () => flat.filter((f) => answers[f.item.id] !== undefined).length,
    [flat, answers]
  )
  const allAnswered = answeredCount === flat.length && flat.length > 0

  if (loadError) return <p className="error">{t('common.error')}: {loadError}</p>
  if (!battery) return <p className="muted">{t('common.loading')}</p>

  const choose = (itemId: string, value: number) =>
    setAnswers((a) => ({ ...a, [itemId]: value }))
  const goNext = () => {
    if (current < flat.length - 1) setCurrent((c) => c + 1)
    else if (allAnswered) setStage('password')
  }
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1))
  const finishToPassword = () => {
    if (allAnswered) {
      setCurrent(flat.length - 1)
      setStage('password')
    }
  }

  const onSubmit = async () => {
    setPwError(null)
    if (password.length < 6) return setPwError(t('password.tooShort'))
    if (password !== confirm) return setPwError(t('password.mismatch'))
    setSubmitting(true)
    try {
      const resp = await submitAssessment({
        scheme: 'comprehensive',
        language: lang,
        intake,
        answers: flat.map((f) => ({ itemId: f.item.id, value: answers[f.item.id] })),
        password
      })
      navigate('/result', { state: { response: resp } })
    } catch (e) {
      setPwError((e as Error).message)
      setSubmitting(false)
    }
  }

  if (stage === 'password') {
    return (
      <section>
        <h1>{t('password.heading')}</h1>
        <p className="muted intro">{t('password.intro')}</p>
        <div className="intake-form">
          <label className="field">
            <span className="field-label">{t('password.label')}</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </label>
          <label className="field">
            <span className="field-label">{t('password.confirm')}</span>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </label>
        </div>
        {pwError && <p className="error">{pwError}</p>}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={() => setStage('questions')} disabled={submitting}>
            {t('assessment.prev')}
          </button>
          <button type="button" className="btn primary" onClick={onSubmit} disabled={submitting}>
            {submitting ? t('common.loading') : t('password.submit')}
          </button>
        </div>
      </section>
    )
  }

  const cur = flat[current]
  const pct = flat.length ? Math.round((answeredCount / flat.length) * 100) : 0
  const itemOptions = cur.item.options ?? cur.scale.options ?? []
  const isNewSection = current === 0 || flat[current - 1].scale.id !== cur.scale.id

  return (
    <section>
      <div className="assess-head">
        <h1>{t('comprehensive.title')}</h1>
        <p className="muted">{t('comprehensive.progressNote')}</p>
      </div>

      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-meta">
        <span>{t('assessment.question', { i: current + 1, n: flat.length })}</span>
        <span className="muted">
          {t('assessment.answered')} {answeredCount}/{flat.length}
        </span>
      </div>

      {isNewSection && (
        <div className="section-banner">
          <span className="section-name">{pick(cur.scale.shortName)}</span>
          <span className="muted">{pick(cur.scale.timeframe)}</span>
        </div>
      )}

      <div className="question-card">
        <p className="q-text">{pick(cur.item.text)}</p>
        {cur.item.domain && <p className="q-domain">{pick(cur.item.domain)}</p>}
        <div className="options">
          {itemOptions.map((opt) => {
            const selected = answers[cur.item.id] === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={`option ${selected ? 'selected' : ''}`}
                onClick={() => choose(cur.item.id, opt.value)}
                aria-pressed={selected}
              >
                <span className="option-radio" aria-hidden="true" />
                <span className="option-label">{pick(opt.label)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn ghost" onClick={goPrev} disabled={current === 0}>
          {t('assessment.prev')}
        </button>
        {current < flat.length - 1 ? (
          <button type="button" className="btn primary" onClick={goNext} disabled={answers[cur.item.id] === undefined}>
            {t('assessment.next')}
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={finishToPassword} disabled={!allAnswered}>
            {t('assessment.finish')}
          </button>
        )}
      </div>
    </section>
  )
}
