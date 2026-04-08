import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import authEn from '../../../assets/i18n/en/auth.json'
import authEs from '../../../assets/i18n/es/auth.json'

const savedLanguage = localStorage.getItem('ddc.lang')
const initialLanguage = savedLanguage === 'en' || savedLanguage === 'es' ? savedLanguage : 'es'

void i18n.use(initReactI18next).init({
  resources: {
    es: {
      auth: authEs,
    },
    en: {
      auth: authEn,
    },
  },
  lng: initialLanguage,
  fallbackLng: 'es',
  defaultNS: 'auth',
  ns: ['auth'],
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
