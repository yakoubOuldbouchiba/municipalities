import React, { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './navbar.css'
import logo from '../../assets/logo.jpg'

interface NavItem {
  id: number
  label: Record<string, string>
  icon: string
  path: string
  enabled: boolean
}

interface NavConfig {
  items: NavItem[]
}

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language || 'en')
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const isRtl = lang === 'ar'

  const languages = [
    { label: '🇬🇧 English', value: 'en' },
    { label: '🇫🇷 Français', value: 'fr' },
    { label: '🇩🇿 العربية', value: 'ar' }
  ]

  // Fetch navigation configuration from JSON file
  useEffect(() => {
    const fetchNavConfig = async () => {
      try {
        const response = await fetch('/nav-config.json')
        const data: NavConfig = await response.json()
        // Filter only enabled items
        const enabledItems = data.items.filter(item => item.enabled)
        setNavItems(enabledItems)
      } catch (error) {
        console.error('Failed to load navigation config:', error)
        setNavItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchNavConfig()
  }, [])

  const handleNavigation = (path: string) => {
    window.scrollTo(0, 0)
    navigate(path)
    setMenuOpen(false)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  }

  // ensure initial direction matches stored language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  // Convert nav config to menubar items format
  const items = navItems.map(navItem => ({
    label: navItem.label[lang] || navItem.label['en'] || '',
    icon: navItem.icon,
    command: () => handleNavigation(navItem.path)
  }))

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
      {/* Logo and Title Row */}
      <div className="navbar-header-row">
        <div
          className={`navbar-start ${isRtl ? 'navbar-start-rtl' : ''}`}
          onClick={() => handleNavigation('/')}
        >
          <img src={logo} alt="logo" className="navbar-logo" />
          <div className="navbar-titles">
            <h1 className="navbar-title">{t('country_full_name')}</h1>
            <h1 className="navbar-title">{t('department')}</h1>
            <h1 className="navbar-title">{t('municipality')}</h1>
          </div>
        </div>
        
        {/* Hamburger Menu Button */}
        <Button
          icon={menuOpen ? 'pi pi-times' : 'pi pi-bars'}
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        />
      </div>

      {/* Navigation Menu Row */}
      {!loading && (
        <>
          <div className={`navbar-menu-row ${menuOpen ? 'menu-open' : ''}`}>
            <Menubar model={items} className={`navbar-menu ${isRtl ? 'rtl-menu' : ''}`} />
          </div>

          {/* Language Switcher Row */}
          <div className="navbar-lang-row">
            {langSwitcher}
          </div>
        </>
      )}
    </header>
  )
}

export default Navbar
