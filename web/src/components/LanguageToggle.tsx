import { useI18n } from '../i18n'

export default function LanguageToggle() {
  const { t, toggle } = useI18n()
  return (
    <button type="button" className="lang-toggle" onClick={toggle} aria-label={t('common.language')}>
      {t('lang.toggle')}
    </button>
  )
}
