import { useI18n } from '../i18n'

export default function CrisisBanner() {
  const { t } = useI18n()
  return (
    <div className="crisis" role="alert">
      <h2 className="crisis-title">{t('crisis.title')}</h2>
      <p>{t('crisis.body')}</p>
      <ul className="crisis-list">
        <li>{t('crisis.cn')}</li>
        <li>{t('crisis.us')}</li>
        <li>{t('crisis.intl')}</li>
      </ul>
      <p className="crisis-emergency">{t('crisis.emergency')}</p>
    </div>
  )
}
