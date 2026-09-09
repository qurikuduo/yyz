import { useI18n } from '../i18n'

export default function Disclaimer({ full = false }: { full?: boolean }) {
  const { t } = useI18n()
  return (
    <p className="disclaimer">
      {full ? t('disclaimer.full') : t('disclaimer.short')}
    </p>
  )
}
