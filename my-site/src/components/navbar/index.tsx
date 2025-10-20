import React, { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar'
import { Dropdown } from 'primereact/dropdown'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Navbar.css'
import logo from '../../assets/logo.jpg'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language || 'en')
  const isRtl = lang === 'ar'

  const languages = [
    { label: '🇬🇧 English', value: 'en' },
    { label: '🇫🇷 Français', value: 'fr' },
    { label: '🇩🇿 العربية', value: 'ar' }
  ]

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  }

  // ensure initial direction matches stored language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const items = [
    { label: t('home'), icon: 'pi pi-home', command: () => navigate('/') },
    { label: t('potentials'), icon: 'pi pi-chart-line', command: () => navigate('/potentials') },
    { label: t('mayor'), icon: 'pi pi-user', command: () => navigate('/mayor') },
    { label: t('secretaryGeneral'), icon: 'pi pi-users', command: () => navigate('/secretary-general') },
    { label: t('history'), icon: 'pi pi-book', command: () => navigate('/history') },
    { label: t('citizen_papers'), icon: 'pi pi-file', command: () => navigate('/papers') },
    { label: t('contact'), icon: 'pi pi-envelope', command: () => navigate('/contact') }
  ]

  const langSwitcher = (
    <div className="lang-switcher">
      <Dropdown
        value={lang}
        options={languages}
        onChange={(e) => changeLanguage(e.value)}
        optionLabel="label"
        className="lang-dropdown"
        style={{ minWidth: '8rem' }}
      />
    </div>
  )

  return (
    <header
      className={`navbar-container ${isRtl ? 'rtl' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}
    >
      <div
        className={`navbar-start ${isRtl ? 'navbar-start-rtl' : ''}`}
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="logo" className="navbar-logo" />
        <h1 className="navbar-title">{t('title')}</h1>
      </div>
      <Menubar model={items} className={`navbar-menu ${isRtl ? 'rtl-menu' : ''}`} end={langSwitcher} />
    </header>
  )
}

export default Navbar
