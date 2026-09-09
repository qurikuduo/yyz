import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchScale, submitAssessment } from '../api/client'
import { useI18n } from '../i18n'
import type { Intake, ScaleDef } from '../types'

export default function Assessment() {
  const { schemeId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, pick, lang } = useI18n()

  const intake = (location.state?.intake ?? {}) as Intake

  const [scale, setScale] = useState<ScaleDef | null>(null)
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
    fetchScale(schemeId)
      .then((s) => alive && setScale(s))
      .catch((e) => alive && setLoadError(e.message))
    return () => {
      alive = false
    }
  }, [schemeId])

  const items = scale?.items ?? []
  const answeredCount = useMemo(
    () => items.filter((it) => answers[it.id] !== undefined).length,
    [items, answers]
  )
  const allAnswered = answeredCount === items.length && items.length > 0

  if (loadError) return <p className="error">{t('common.error')}: {loadError}</p>
  if (!scale) return <p className="muted">{t('common.loading')}</p>

  const choose = (itemId: string, value: number) => {
    setAnswers((a) => ({ ...a, [itemId]: value }))
  }

  const goNext = () => {
    if (current < items.length - 1) setCurrent((c) => c + 1)
    else if (allAnswered) setStage('password')
  }
  const goPrev = () => setCurrent((c) => Math.max(0, c - 1))

  const finishToPassword = () => {
    if (allAnswered) {
      setCurrent(items.length - 1)
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
        scheme: schemeId,
        language: lang,
        intake,
        answers: items.map((it) => ({ itemId: it.id, value: answers[it.id] })),
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

  const item = items[current]
  const pct = items.length ? Math.round((answeredCount / items.length) * 100) : 0

  return (
    <section>
      <div className="assess-head">
        <h1>{pick(scale.name)}</h1>
        <p className="muted">
          {t('assessment.timeframe')}: {pick(scale.timeframe)}
        </p>
      </div>

      <div className="progress-wrap" aria-hidden="false">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-meta">
        <span>{t('assessment.question', { i: current + 1, n: items.length })}</span>
        <span className="muted">
          {t('assessment.answered')} {answeredCount}/{items.length}
        </span>
      </div>

      <div className="question-card">
        <p className="q-text">{pick(item.text)}</p>
        <div className="options">
          {scale.options.map((opt) => {
            const selected = answers[item.id] === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={`option ${selected ? 'selected' : ''}`}
                onClick={() => choose(item.id, opt.value)}
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
        {current < items.length - 1 ? (
          <button type="button" className="btn primary" onClick={goNext} disabled={answers[item.id] === undefined}>
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
