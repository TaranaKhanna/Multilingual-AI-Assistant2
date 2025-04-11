import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslation from './translations/en.json';
import esTranslation from './translations/es.json';
import frTranslation from './translations/fr.json';
import deTranslation from './translations/de.json';
import zhTranslation from './translations/zh.json';
import jaTranslation from './translations/ja.json';
import koTranslation from './translations/ko.json';
import arTranslation from './translations/ar.json';
import hiTranslation from './translations/hi.json';
import ruTranslation from './translations/ru.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      zh: { translation: zhTranslation },
      ja: { translation: jaTranslation },
      ko: { translation: koTranslation },
      ar: { translation: arTranslation },
      hi: { translation: hiTranslation },
      ru: { translation: ruTranslation },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
