'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { translateToHebrew } from '@/data/translations'

const STORAGE_KEY = 'exercise-game-language'

export type Language = 'en' | 'he'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null
      if (stored === 'en' || stored === 'he') setLanguageState(stored)
    } catch {}
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}
  }, [])

  const t = useCallback(
    (en: string) => (language === 'he' ? translateToHebrew(en) : en),
    [language]
  )

  const value = { language, setLanguage, t }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (ctx === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
