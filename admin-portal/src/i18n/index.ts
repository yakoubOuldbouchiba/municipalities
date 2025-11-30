import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'
import es from './locales/es.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
      es: { translation: es }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

// Handle RTL direction for Arabic
i18n.on('languageChanged', (lng) => {
  const htmlElement = document.documentElement;
  if (lng === 'ar') {
    htmlElement.dir = 'rtl';
    htmlElement.lang = 'ar';
  } else {
    htmlElement.dir = 'ltr';
    htmlElement.lang = lng;
  }
});

export default i18n
