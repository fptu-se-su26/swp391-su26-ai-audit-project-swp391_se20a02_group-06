import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import vi from './locales/vi.json'

const savedLang = (typeof window !== 'undefined' && localStorage.getItem('netfit_lang')) || 'vi'

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
        },
        lng: savedLang,
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
