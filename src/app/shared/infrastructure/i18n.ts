import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import authEn from '../../../assets/i18n/en/auth.json'
import homeEn from '../../../assets/i18n/en/home.json'
import suppliersEn from '../../../assets/i18n/en/suppliers.json'
import authEs from '../../../assets/i18n/es/auth.json'
import homeEs from '../../../assets/i18n/es/home.json'
import suppliersEs from '../../../assets/i18n/es/suppliers.json'

const savedLanguage = localStorage.getItem('ddc.lang')
const initialLanguage = savedLanguage === 'en' || savedLanguage === 'es' ? savedLanguage : 'es'

void i18n.use(initReactI18next).init({
  resources: {
    es: {
      auth: authEs,
      home: homeEs,
      suppliers: suppliersEs,
    },
    en: {
      auth: authEn,
      home: homeEn,
      suppliers: suppliersEn,
    },
  },
  lng: initialLanguage,
  fallbackLng: 'es',
  defaultNS: 'auth',
  ns: ['auth', 'home', 'suppliers'],
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
