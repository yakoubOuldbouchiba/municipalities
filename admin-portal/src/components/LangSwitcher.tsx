import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LangSwitcher.css';

const LANG_KEY = 'app_lang';

const LangSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Update HTML lang + direction
  const applyDirection = (lang: string) => {
    const isRTL = lang.startsWith('ar');
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  };

  // Load language on mount
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    const browserLang = i18n.language || 'en';
    const initialLang = saved || browserLang;

    if (initialLang !== i18n.language) {
      i18n.changeLanguage(initialLang);
    }

    applyDirection(initialLang);
  }, [i18n]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem(LANG_KEY, newLang);
    applyDirection(newLang);
  };

  return (
    <div className="lang-switcher-container">
      <select
        value={i18n.language}
        onChange={handleChange}
        className="lang-select"
        aria-label="Select language"
      >
        <option value="en">🇺🇸 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="ar">🇩🇿 العربية</option>
      </select>
    </div>
  );
};

export default LangSwitcher;
