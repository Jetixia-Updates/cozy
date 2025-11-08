'use client'

import { useEffect, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/config'

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // تحديث اتجاه الصفحة عند تغيير اللغة
    const updateDirection = () => {
      const currentLang = i18n.language
      const dir = currentLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.dir = dir
      document.documentElement.lang = currentLang
    }

    updateDirection()
    i18n.on('languageChanged', updateDirection)

    return () => {
      i18n.off('languageChanged', updateDirection)
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

