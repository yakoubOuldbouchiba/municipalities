import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import './language-switcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { label: '🇬🇧 English', value: 'en' },
    { label: '🇩🇿 العربية', value: 'ar' },
    { label: '🇫🇷 Français', value: 'fr' },
    { label: '🇪🇸 Español', value: 'es' },
  ];

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <Dropdown
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.value)}
      options={languages}
      optionLabel="label"
      optionValue="value"
      className="language-switcher"
      style={{
        width: '130px',
        borderRadius: '8px',
        fontWeight: '500',
      }}
    />
  );
};

export default LanguageSwitcher;
