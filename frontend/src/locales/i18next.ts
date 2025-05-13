import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import uk from './uk.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ['en', 'uk'],
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
    },
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
  });

export default i18n;
