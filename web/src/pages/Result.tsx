import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import ResultView from '../components/ResultView'
import ComprehensiveView from '../components/ComprehensiveView'
import type { SubmitResponse } from '../types'

export default function Result() {
  const { t } = useI18n()
  const location = useLocation()
  const response = location.state?.response as SubmitResponse | undefined

  if (!response) {
    return (
      <section>
        <h1>{t('result.heading')}</h1>
        <p className="muted">{t('shared.notFound')}</p>
        <Link className="btn primary" to="/">
          {t('nav.home')}
        </Link>
      </section>
    )
  }

  if (response.comprehensive && response.results) {
    return (
      <section>
        <h1>{t('result.heading')}</h1>
        <ComprehensiveView
          comprehensive={response.comprehensive}
          results={response.results}
          token={response.token}
        />
      </section>
    )
  }

  return (
    <section>
      <h1>{t('result.heading')}</h1>
      {response.result && <ResultView result={response.result} token={response.token} />}
    </section>
  )
}
