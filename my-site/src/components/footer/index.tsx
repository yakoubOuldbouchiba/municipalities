import React from 'react'
import './footer.css'
import logo from '../../assets/logo.jpg'
import { useTranslation } from 'react-i18next'

const Footer: React.FC = () => {
  const { t } = useTranslation()

  const quickLinks = [
    {
      label: t('footer.interior'),
      url: 'https://www.interieur.gov.dz/index.php/fr/',
    },
    {
      label: t('footer.defense'),
      url: 'https://www.mdn.dz/site_principal/accueil_fr.php',
    },
    {
      label: t('footer.police'),
      url: 'https://www.algeriepolice.dz/',
    },
    {
      label: t('footer.civilProtection'),
      url: 'https://dgpc.dz/',
    },
  ]

  const importantNumbers = [
    { label: t('footer.policeNumber'), value: '1548' },
    { label: t('footer.firefightersNumber'), value: '14' },
    { label: t('footer.hospitalNumber'), value: '+213 24 79 00 00' },
    { label: t('footer.municipalityNumber'), value: '+213 24 79 12 34' },
  ]

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
            {quickLinks.map((link, index) => (
              <li key={index}>
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
            {importantNumbers.map((item, index) => (
              <li key={index}>
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
