import React, { useEffect, useState } from 'react'
import './footer.css'
import logo from '../../assets/logo.jpg'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

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

useEffect(() => {
    const fetchFooterData = async () => {
      setLoading(true); // reset loading each time language changes
      try {
        const [linksRes, numbersRes] = await Promise.all([
          axios.get('http://localhost:8000/api/quick-links', {
            params: { lang: i18n.language },
          }),
          axios.get('http://localhost:8000/api/important-numbers', {
            params: { lang: i18n.language },
          }),
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
        <iframe
          title="Zemmouri Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.5141!2d3.533!3d36.795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fdc6b09d5b6f1%3A0x123456789abcdef!2sZemmouri%2C%20Boumerd%C3%A8s!5e0!3m2!1sen!2sdz!4v0000000000000"
          allowFullScreen
          loading="lazy"
        ></iframe>
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
