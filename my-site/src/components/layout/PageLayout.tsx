import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../header/Header'
import './page-layout.css'

interface PageLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  className?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  className = '',
}) => {
  const { i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <div className={`page-layout ${isRtl ? 'rtl' : 'ltr'} ${className}`}>
      {showHeader && <Header />}
      <div className="page-wrapper">
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout
