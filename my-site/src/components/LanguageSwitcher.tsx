import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
    { label: 'Français', value: 'fr' },
    { label: 'Español', value: 'es' },
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
      style={{ width: '120px' }}
      className="language-switcher"
    />
  );
};

export default LanguageSwitcher;
