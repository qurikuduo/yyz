import { useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { Intake as IntakeData } from '../types'

function Field({
  label,
  optional,
  children
}: {
  label: string
  optional?: string
  children: ReactNode
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label} {optional ? <em className="muted">{optional}</em> : null}
      </span>
      {children}
    </label>
  )
}

export default function Intake() {
  const { schemeId = '' } = useParams()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [data, setData] = useState<IntakeData>({ age: '', gender: '', episodeDuration: '', treatmentHistory: '', education: '', occupation: '' })

  const set = (k: keyof IntakeData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }))

  const go = () => navigate(`/assessment/${schemeId}`, { state: { intake: data } })

  return (
    <section>
      <h1>{t('intake.heading')}</h1>
      <p className="muted intro">{t('intake.intro')}</p>

      <div className="intake-form">
        <Field label={t('intake.age')} optional={t('intake.optional')}>
          <input type="number" min={1} max={120} value={data.age} onChange={set('age')} placeholder="—" />
        </Field>

        <Field label={t('intake.gender')} optional={t('intake.optional')}>
          <select value={data.gender} onChange={set('gender')}>
            <option value="">—</option>
            <option value="male">{t('intake.gender.male')}</option>
            <option value="female">{t('intake.gender.female')}</option>
            <option value="other">{t('intake.gender.other')}</option>
          </select>
        </Field>

        <Field label={t('intake.episodeDuration')} optional={t('intake.optional')}>
          <select value={data.episodeDuration} onChange={set('episodeDuration')}>
            <option value="">—</option>
            <option value="<2w">{t('intake.duration.none')}</option>
            <option value="2w-1m">{t('intake.duration.2w')}</option>
            <option value="1-3m">{t('intake.duration.1-3m')}</option>
            <option value="3-12m">{t('intake.duration.3-12m')}</option>
            <option value=">1y">{t('intake.duration.over1y')}</option>
          </select>
        </Field>

        <Field label={t('intake.treatmentHistory')} optional={t('intake.optional')}>
          <select value={data.treatmentHistory} onChange={set('treatmentHistory')}>
            <option value="">—</option>
            <option value="none">{t('intake.treatment.none')}</option>
            <option value="therapy">{t('intake.treatment.therapy')}</option>
            <option value="meds">{t('intake.treatment.meds')}</option>
            <option value="both">{t('intake.treatment.both')}</option>
            <option value="hospital">{t('intake.treatment.hospital')}</option>
          </select>
        </Field>

        <Field label={t('intake.education')} optional={t('intake.optional')}>
          <select value={data.education} onChange={set('education')}>
            <option value="">—</option>
            <option value="middle">{t('intake.edu.middle')}</option>
            <option value="high">{t('intake.edu.high')}</option>
            <option value="college">{t('intake.edu.college')}</option>
            <option value="postgrad">{t('intake.edu.postgrad')}</option>
          </select>
        </Field>

        <Field label={t('intake.occupation')} optional={t('intake.optional')}>
          <select value={data.occupation} onChange={set('occupation')}>
            <option value="">—</option>
            <option value="student">{t('intake.occ.student')}</option>
            <option value="employed">{t('intake.occ.employed')}</option>
            <option value="freelance">{t('intake.occ.freelance')}</option>
            <option value="retired">{t('intake.occ.retired')}</option>
            <option value="unemployed">{t('intake.occ.unemployed')}</option>
          </select>
        </Field>
      </div>

      <div className="actions">
        <button type="button" className="btn primary" onClick={go}>
          {t('intake.next')}
        </button>
        <button type="button" className="btn ghost" onClick={go}>
          {t('intake.skip')}
        </button>
      </div>
    </section>
  )
}
