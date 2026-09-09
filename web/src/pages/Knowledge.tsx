import { useI18n } from '../i18n'

export default function Knowledge() {
  const { t } = useI18n()
  return (
    <section>
      <h1>{t('knowledge.heading')}</h1>
      <p className="muted">{t('knowledge.soon')}</p>
    </section>
  )
}
