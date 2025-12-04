import React, { useEffect, useState } from 'react'
import './footer.css'
import logo from '../../assets/logo.jpg'
import { useTranslation } from 'react-i18next'
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
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [mapError, setMapError] = useState(false)

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
  const handleMapTimeout = () => {
    const timeout = setTimeout(() => {
      console.warn('Map iframe failed to load within timeout')
      setMapError(true)
    }, 8000) // 8 second timeout
    return () => clearTimeout(timeout)
  }

useEffect(() => {
    const fetchFooterData = async () => {
      setLoading(true); // reset loading each time language changes
      try {
        const [linksRes, numbersRes] = await Promise.all([
          api.get('/quick-links', { params: { lang: i18n.language } }),
          api.get('/important-numbers', { params: { lang: i18n.language } }),
        ]);

        setQuickLinks(linksRes.data);
        setImportantNumbers(numbersRes.data);
      } catch (error) {
        console.error('❌ Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [i18n.language]);


  if (loading) {
    return (
      <footer className="footer">
        <p>Loading footer...</p>
      </footer>
    )
  }

  return (
    <footer className="footer">
      {/* --- Full-width Map --- */}
      <div className="footer-map">
        {!isOnline || mapError ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 gap-3">
            <div className="text-5xl">🗺️</div>
            <p className="font-medium">{!isOnline ? t('common.offline', 'You are offline') : t('common.loadError', 'Failed to load map')}</p>
          </div>
        ) : (
          <iframe
            title="Zemmouri Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.5141!2d3.533!3d36.795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fdc6b09d5b6f1%3A0x123456789abcdef!2sZemmouri%2C%20Boumerd%C3%A8s!5e0!3m2!1sen!2sdz!4v0000000000000"
            allowFullScreen
            loading="lazy"
            onError={() => setMapError(true)}
            onLoad={handleMapTimeout() as any}
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          ></iframe>
        )}
      </div>

      {/* --- Info section --- */}
      <div className="footer-info">
        {/* Column 1: Logo */}
        <div className="footer-col">
          <img src={logo} alt="logo" className="footer-logo" />
          <h3>{t('footer.cityTitle')}</h3>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Important Numbers */}
        <div className="footer-col">
          <h4>{t('footer.importantNumbers')}</h4>
          <ul>
            {importantNumbers.map((item) => (
              <li key={item.id}>
                {item.label}: {item.value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Bottom bar --- */}
      <div className="footer-bottom">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  )
}

export default Footer
