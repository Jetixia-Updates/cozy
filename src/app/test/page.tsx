'use client'

import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function TestPage() {
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('nav.features')}
          </h1>
          <LanguageSwitcher />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('hero.title')} {t('hero.titleHighlight')}
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('hero.description')}
          </p>

          <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
            {t('hero.bookNow')}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {t('features.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-bold mb-2 text-gray-800 dark:text-white">
                {t('features.flexibleBooking')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('features.flexibleBookingDesc')}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-bold mb-2 text-gray-800 dark:text-white">
                {t('features.highSpeedInternet')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('features.highSpeedInternetDesc')}
              </p>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mt-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>اللغة الحالية:</strong> {i18n.language === 'ar' ? 'العربية 🇪🇬' : 'English 🇬🇧'}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              <strong>الاتجاه:</strong> {dir === 'rtl' ? 'من اليمين لليسار (RTL)' : 'Left to Right (LTR)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

