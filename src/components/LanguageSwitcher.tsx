'use client'

import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(newLang)
    
    // تحديث الاتجاه
    const dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = newLang
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group shadow-sm"
      title={currentLang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      <Languages className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
        {currentLang === 'ar' ? 'English' : 'عربي'}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">
        ({currentLang === 'ar' ? 'EN' : 'ع'})
      </span>
    </button>
  )
}
