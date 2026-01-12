import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';

const AdminLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { label: 'English', value: 'en', flag: '🇬🇧' },
    { label: 'العربية', value: 'ar', flag: '🇸🇦' },
    { label: 'Français', value: 'fr', flag: '🇫🇷' },
    { label: 'Español', value: 'es', flag: '🇪🇸' },
  ];

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <div className="language-switcher-admin">
      <Dropdown
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.value)}
        options={languages}
        optionLabel="label"
        optionValue="value"
        style={{ width: '130px' }}
        className="w-full"
      />
    </div>
  );
};

export default AdminLanguageSwitcher;
