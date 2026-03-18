import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import ru from '@/i18n/locales/ru.json'
import uz from '@/i18n/locales/uz.json'
import de from '@/i18n/locales/de.json'


const savedLang = localStorage.getItem('userLanguage')

export const i18n = createI18n({
  legacy: false,
  locale: savedLang || 'ru',
  fallbackLocale: 'ru',
  globalInjection: true,
  messages: {
    ru,
    uz,
    en,
    de
  },
})
