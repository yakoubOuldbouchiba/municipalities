import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import './header.css'

const Header: React.FC = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isRtl = i18n.language === 'ar'

  const getTitleFromPath = () => {
    const path = location.pathname
    const titleMap: { [key: string]: string } = {
      '/': 'homePage.welcome',
      '/blog': 'navigation.news',
      '/contact': 'navigation.contact',
      '/claims': 'navigation.claims',
      '/mayor': 'navigation.mayor',
      '/potentials': 'navigation.potentials',
      '/secretary-general': 'navigation.secretary',
      '/history': 'navigation.history',
      '/papers': 'navigation.papers',
      '/events': 'navigation.events',
      '/persons': 'navigation.persons',
      '/quick-links': 'navigation.quickLinks',
      '/important-numbers': 'navigation.importantNumbers',
    }

    // Find matching route
    for (const [route, key] of Object.entries(titleMap)) {
      if (path.startsWith(route) && route !== '/') {
        return t(key)
      }
    }

    // Special handling for /papers/:id
    if (path.startsWith('/papers/')) {
      return t('navigation.papers')
    }

    return t('homePage.welcome')
  }

  return (
    <>
      <header className={`admin-header ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">{getTitleFromPath()}</h1>
          </div>
        </div>
        <div className="header-accent"></div>
      </header>
    </>
  )
}

export default Header
