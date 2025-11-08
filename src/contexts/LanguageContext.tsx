'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import enTranslations from '@/locales/en.json'
import arTranslations from '@/locales/ar.json'

type Locale = 'en' | 'ar'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: enTranslations,
  ar: arTranslations
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
      setLocaleState(savedLocale)
    }
    
    // Update document direction
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

