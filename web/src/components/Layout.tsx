import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import LanguageToggle from './LanguageToggle'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src="/favicon.svg" alt="" aria-hidden="true" className="brand-logo" />
          <div className="brand-text">
            <Link to="/" className="brand-title">
              {t('app.title')}
            </Link>
            <span className="brand-sub">{t('app.subtitle')}</span>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/knowledge">{t('nav.knowledge')}</Link>
          <LanguageToggle />
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  )
}
