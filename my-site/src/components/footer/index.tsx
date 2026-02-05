import React, { useEffect, useState } from 'react'
import './footer.css'
import logo from '../../assets/logo.jpg'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import api from '../../lib/api'

interface QuickLink {
  id: number
  label: string
  url: string
}

interface ImportantNumber {
  id: number
  label: string
  value: string
}

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [mapError, setMapError] = useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle iframe load timeout
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      console.warn('Map iframe failed to load within timeout')
      setMapError(true)
    }, 8000)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const fetchFooterData = async () => {
      setLoading(true)
      try {
        const [linksRes, numbersRes] = await Promise.all([
          api.get('/quick-links', { params: { lang: i18n.language } }),
          api.get('/important-numbers', { params: { lang: i18n.language } }),
        ])

        setQuickLinks(linksRes.data)
        setImportantNumbers(numbersRes.data)
      } catch (error) {
        console.error('Error fetching footer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFooterData()
  }, [i18n.language])

  if (loading) {
    return (
      <footer className="footer">
        <div className="footer-loading">
          <span><i className="pi pi-spinner pi-spin" style={{ marginRight: '0.5rem' }}></i>{t('common.loading', 'Loading...')}</span>
        </div>
      </footer>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="footer" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Full-width Map */}
      <motion.div
        className="footer-map-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-map">
          {!isOnline || mapError ? (
            <div className="footer-map-error">
              <div className="footer-map-error-icon"><i className="pi pi-map"></i></div>
              <p className="footer-map-error-text">
                {!isOnline ? t('common.offline', 'You are offline') : t('common.loadError', 'Failed to load map')}
              </p>
            </div>
          ) : (
            <iframe
              title="Zemmouri Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.5141!2d3.533!3d36.795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fdc6b09d5b6f1%3A0x123456789abcdef!2sZemmouri%2C%20Boumerd%C3%A8s!5e0!3m2!1sen!2sdz!4v0000000000000"
              allowFullScreen
              loading="lazy"
              onError={() => setMapError(true)}
              onLoad={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
              className="footer-map-iframe"
            ></iframe>
          )}
        </div>
      </motion.div>

      {/* Info section */}
      <motion.div
        className="footer-info"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Column 1: Logo & Title */}
        <motion.div className="footer-col footer-col-logo" variants={itemVariants}>
          <div className="footer-logo-container">
            <img src={logo} alt="logo" className="footer-logo" />
          </div>
          <h3 className="footer-city-title">{t('footer.cityTitle')}</h3>
          <p className="footer-tagline"><i className="pi pi-flag"></i> Zemmouri, Boumerdès</p>
        </motion.div>

        {/* Column 2: Quick Links */}
        <motion.div className="footer-col" variants={itemVariants}>
          <h4 className="footer-col-title">
            <span className="footer-col-icon"><i className="pi pi-link"></i></span>
            {t('footer.quickLinks')}
          </h4>
          <ul className="footer-links-list">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                  <span className="footer-link-dot"><i className="pi pi-arrow-right"></i></span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Important Numbers */}
        <motion.div className="footer-col" variants={itemVariants}>
          <h4 className="footer-col-title">
            <span className="footer-col-icon"><i className="pi pi-phone"></i></span>
            {t('footer.importantNumbers')}
          </h4>
          <ul className="footer-numbers-list">
            {importantNumbers.map((item) => (
              <li key={item.id} className="footer-number-item">
                <strong className="footer-number-label">{item.label}:</strong>
                <span className="footer-number-value">{item.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="footer-copyright">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
        <div className="footer-divider" />
        <p className="footer-powered">Powered with <i className="pi pi-heart-fill" style={{ color: 'red', fontSize: '0.9rem' }}></i></p>
      </motion.div>
    </footer>
  )
}

export default Footer
